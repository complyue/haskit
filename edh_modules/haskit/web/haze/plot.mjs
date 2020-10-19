/**
 * main script of a window rendering Bokeh plots
 */

import { Lander, McClient } from "nedh";

/**
 * Synchronize the specified Boken range with the rest of all such ranges,
 * those associated with the same global axis name.
 *
 * @param rng a Boken range object
 * @param axisName global name of the shared axis
 */
export function syncRange(rng, axisName) {
  let ch = new BroadcastChannel(axisName);
  let announceTimer = null;
  ch.onmessage = function (me) {
    let rd = me.data;
    if (null !== announceTimer) {
      return; // local updates on the way
    }
    if (rd[0] === rng.start && rd[1] === rng.end) {
      return; // well synced, don't propagate
    }
    rng.setv({
      start: rd[0],
      end: rd[1],
    });
  };
  rng.on_change([rng.properties.start, rng.properties.end], () => {
    if (null !== announceTimer) {
      return; // already scheduled
    }
    announceTimer = setTimeout(() => {
      announceTimer = null; // clear for next schedule
      const rd = [rng.start, rng.end];
      ch.postMessage(rd);
    }, 1000); // announce at most 1Hz
  });
}

/**
 * Map dtype to js typed array constructor
 *
 * @param dt dtype identifier
 */
export function dtype2ArrayCtor(dt) {
  switch (dt) {
    case "int32":
      return Int32Array;
    case "float32":
      return Float32Array;
    case "float64":
      return Float64Array;
  }
  throw new Error(`Unsupported dtype: [${dt}] !`);
}

// lander with this module scope as environment
class HazeLander extends Lander {
  async landingThread() {
    // XXX a subclass of Lander normally overrides this method, with even
    //     verbatim copy of the method code here, it's already very useful,
    //     in that the subclass' lexical context becomes the landing
    //     environment.
    //
    //     And as this function's scope is the local scope within which the
    //     source of incoming packets are eval'ed, other forms of (maybe ugly
    //     and nasty) hacks can be put right here, but god forbid it.

    if (null === this.nxt) {
      throw Error("Passed end-of-stream for packets");
    }
    while (true) {
      const [_outlet, _resolve, _reject, _intake, _inject] = this.nxt;
      const [_src, _nxt] = await _intake;
      this.nxt = _nxt;
      if (null === _src) {
        if (null !== _nxt) {
          throw Error("bug: inconsistent eos signal");
        }
        return; // reached end-of-stream, terminate this thread
      }
      if (null === _nxt) {
        throw Error("bug: null nxt for non-eos-packet");
      }

      // land one packet
      try {
        _resolve(await eval(_src));
      } catch (exc) {
        _reject(exc);
      }
    }
  }
}

// passed as query string of the page url
export const plotChannel = window.location.search.substr(1);

// source of incoming commands may reference this as well as other scripts can
// import it
export const mcc2Root = new McClient(
  // should have been opened directly by the root window, it listens for our
  // connection
  window.opener,
  // name of the service to connect
  "plot",
  // land incoming commands with this module as environment
  new HazeLander(),
  // extra info for the connection
  {
    plotChannel: plotChannel,
  }
);

// Bokeh stuffs should be injected by page html
const bkh = window.Bokeh,
  plt = bkh.Plotting;

// central store for intermediate data of this plot window
const plotData = {};

/*
// current figure during the run.
// js being strict-eval'ed can't create vars survive between eval invocations,
// define vars to be persisted here beforehand.
let fig = null;
*/

function receiveDataSource(dsName, colNames, colDtypes) {
  // arm a fresh new sink to receive the stream of column data
  const dataSink = mcc2Root.peer.armChannel("data");

  // don't continue landing following commands until dataSink gets looped,
  // or there's race condition for some column data to be missed.
  return new Promise(async (resolve, _reject) => {
    const cdsData = {};
    let colCntr = 0;

    for await (const colData of dataSink.runProducer(async () => {
      resolve(undefined);
    })) {
      cdsData[colNames[colCntr]] = new (dtype2ArrayCtor(colDtypes[colCntr]))(
        colData
      );
      if (++colCntr >= colNames.length) {
        break;
      }
    }

    plotData[dsName] = new bkh.ColumnDataSource({
      data: cdsData,
    });
  });
}
