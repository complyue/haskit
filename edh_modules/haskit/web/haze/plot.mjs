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
  rng.callback = () => {
    if (null !== announceTimer) {
      return; // already scheduled
    }
    announceTimer = setTimeout(() => {
      announceTimer = null; // clear for next schedule
      const rd = [rng.start, rng.end];
      ch.postMessage(rd);
    }, 1000); // announce at most 1Hz
  };
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
        _resolve(eval(_src));
      } catch (exc) {
        _reject(exc);
      }
    }
  }
}

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
    plotChannel: window.location.search.substr(1),
  }
);
