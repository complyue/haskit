/**
 * main module of HaskIt plot page
 */

import { Lander, } from "nedh"

import { HaskItConn, uiLog, uiInitPage, } from "haskit"


export function findViewByModelName(name) {
  return function findNamedView(view) {
    if (view.model && view.model.name == name) return view
    for (const child of view.child_views || []) {
      const v = findNamedView(child)
      if (v !== null) return v
    }
    return null
  }
}


export function announceRange(rng, vrName,) {
  const ch = new BroadcastChannel(vrName)
  rng.on_change([rng.properties.start, rng.properties.end], () => {
    const rd = [rng.start, rng.end]
    ch.postMessage(rd)
  })
}

/**
 * Synchronize the specified Boken range with the rest of all such ranges,
 * those associated with the same global view-range by name.
 *
 * @param rng a Boken range object
 * @param vrName global name of the shared view-range
 */
export function syncRange(rng, vrName,) {
  const ch = new BroadcastChannel(vrName)
  let announceTimer = null
  ch.onmessage = function (me) {
    const rd = me.data
    if (null !== announceTimer) {
      return // local updates on the way
    }
    if (rd[0] === rng.start && rd[1] === rng.end) {
      return // well synced, don't propagate
    }
    rng.setv({
      start: rd[0],
      end: rd[1],
    })
  }
  rng.on_change([rng.properties.start, rng.properties.end], () => {
    if (null !== announceTimer) {
      return // already scheduled
    }
    announceTimer = setTimeout(() => {
      announceTimer = null // clear for next schedule
      const rd = [rng.start, rng.end]
      ch.postMessage(rd)
    }, 1000) // announce at most 1Hz
  })
}


export function announceFocus(figView, vfName, focusName,) {
  const effFocusName = focusName || figView.model.name
  const evtElem = figView.canvas_view.events_el
  const ch = new BroadcastChannel(vfName)
  evtElem.addEventListener('mouseenter', _me => {
    ch.postMessage(effFocusName)
  })
}


export function defaultScale(frame) {
  return [frame.xscales.default, frame.yscales.default]
}

export function announceAxisCursor(figView, scaleGetter, acName,) {
  const evtElem = figView.canvas_view.events_el
  const [xscale, yscale] = scaleGetter(figView.frame)
  const ch = new BroadcastChannel(acName)
  evtElem.addEventListener('mousemove', me => {
    const { left, top } = me.target.getBoundingClientRect()
    const sx = me.clientX - left, dx = xscale.invert(sx)
    const sy = me.clientY - top, dy = yscale.invert(sy)
    ch.postMessage([dx, dy])
  })
}


/**
 * Map dtype to js typed array constructor
 *
 * @param dt dtype identifier
 */
export function dtype2ArrayCtor(dt) {
  switch (dt) {
    case "int32":
      return Int32Array
    case "float32":
      return Float32Array
    case "float64":
      return Float64Array
  }
  throw new Error(`Unsupported dtype: [${dt}] !`)
}


class PlotLander extends Lander {
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
      throw Error("Passed end-of-stream for packets")
    }
    while (true) {
      const [_outlet, _resolve, _reject, _intake, _inject] = this.nxt
      const [_src, _nxt] = await _intake
      this.nxt = _nxt
      if (null === _src) {
        if (null !== _nxt) {
          throw Error("bug: inconsistent eos signal")
        }
        return // reached end-of-stream, terminate this thread
      }
      if (null === _nxt) {
        throw Error("bug: null nxt for non-eos-packet")
      }

      // land one packet
      try {
        _resolve(await eval(_src))
      } catch (exc) {
        _reject(exc)
      }
    }
  }
}


// Alias shothands for BokehJS stuff, which should haven been injected by html
export const bkh = window.Bokeh, plt = bkh.Plotting


// Plot parameters passed via query string
const plotParams = new URLSearchParams(window.location.search)

// The page wide haskit connection to server
class PlotConn extends HaskItConn {
  async createLander() {
    return new PlotLander()
  }
}
const plotService = plotParams.get('service')
const hskiPageConn = new PlotConn(plotService)

{
  const title = plotParams.get('title')
  if (title) { document.title = title }
}

/*
 * js being strict-eval'ed can't create vars survive between eval invocations,
 * define containers here to persist intermediate data across scripted RPCs. 
 */
export const plotContext = {}
// Central store for intermediate Bokeh CDS objects
const plotData = {}

export async function receiveDataSource(dsName, colNames, colDtypes) {
  const peer = await hskiPageConn.livePeer()
  // arm a fresh new sink to receive the stream of column data
  const dataSink = peer.armChannel("data")

  // don't continue landing following commands until dataSink gets looped,
  // or there's race condition for some column data to be missed.
  return new Promise(async (resolve, _reject) => {
    const cdsData = {}
    let colCntr = 0

    for await (const colData of dataSink.runProducer(async () => {
      resolve(undefined)
    })) {
      cdsData[colNames[colCntr]] = new (dtype2ArrayCtor(colDtypes[colCntr]))(
        colData
      )
      if (++colCntr >= colNames.length) {
        break
      }
    }

    plotData[dsName] = new bkh.ColumnDataSource({
      data: cdsData,
    })
  })
}


// page UI reactions
uiInitPage()

// Connect on open
$(async function () {
  try {
    await hskiPageConn.livePeer()
    uiLog("Connected with HaskIt backend.")
  } catch (err) {
    let details = err ? err.stack : err
    uiLog("Failed connecting to HaskIt backend via ws.", "err-msg", details)
  }
})
