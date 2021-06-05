/**
 * main module of HaskIt plot page
 */

import { Lander, } from "nedh"

import { HaskItConn, uiLog, } from "haskit"

import { cdsServiceSuite } from './cds.js'

import {
  onViewRangeChange, onAxisCursorChange, onViewFocusChange,
  announceRange, announceFocus,
} from './comm.js'



export function newPlotDiv(name = 'plot', classes = 'Plot') {
  const div = $("<div/>", { class: classes, 'data-name': name, })
  div.appendTo($('#plot-root'))
  return div
}

export function plotDiv(name) {
  const div = $(`#plot-root div[data-name=${name}]`)
  return div.length > 0 ? div : newPlotDiv(name)
}


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
const hskiPageConn = plotService ? new PlotConn(plotService) : null

{
  const title = plotParams.get('title')
  if (title) { document.title = title }
}

/*
 * js being strict-eval'ed can't create vars survive between eval invocations,
 * define containers here to persist intermediate data across scripted RPCs. 
 */
export const plotContext = {}

export const {
  receiveDataSource, updateDataSource, cds,
} = cdsServiceSuite(hskiPageConn, plotContext, bkh)


// Connect on open
if (hskiPageConn) {
  $(async function () {
    try {
      await hskiPageConn.livePeer()
      uiLog("Connected with HaskIt backend.")
    } catch (err) {
      let details = err ? err.stack : err
      uiLog("Failed connecting to HaskIt backend via ws.", "err-msg", details)
    }
  })
} else {
  uiLog('Not connected to a service.')
}
