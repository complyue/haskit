/**
 * main module of HaskIt page
 */

import { Lander, } from "nedh"
import { HaskItConn, } from "haskit"


// Import these to make them available to RPC script
import {
  NaiveDate, hasLogBox, uiLog, clearLog,
} from "haskit"
import {
  onViewFocusChange, onViewRangeChange, onAxisCursorChange,
  announceFocus, announceRange, announceAxisCursor,
  defaultScale, findViewByModelName, syncRange,
} from './comm.js'


// Create a plot frame by name
export function addPlot(name = 'plot', frameAttrs = {},
  page = './iplot.html',
) {
  const elem = $("<iframe/>", Object.assign({
    src: page, name: name, class: 'Plot',
  }, frameAttrs))
  elem.appendTo($('#plot-chunk'))
  return elem
}
// Ensure a plot frame by name
export function plot(name) {
  if (typeof name !== 'string' || name.length <= 0) {
    throw new Error('Bad plot name: ' + name)
  }
  const elem = $(`#plot-chunk iframe[name=${name}]`)
  return elem.length > 0 ? elem : addPlot(name)
}


// RPC script lander
class PageLander extends Lander {
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
        debugger
        _reject(exc)
      }
    }
  }
}
// Connection class with page local lander
class PageConn extends HaskItConn {
  async createLander() {
    return new PageLander()
  }
}


// Page parameters passed via query string of the top page
// todo support deeper nested iframes?
const pageParams = new URLSearchParams(window.parent
  ? parent.location.search
  : window.location.search
)


// The page wide haskit connection to server
const pageService = pageParams.get('service')
const hskiPageConn = new PageConn(pageService, {
  page: location.pathname,
  name: window.name,
})


/*
 * RPC js being strict-eval'ed, can't create vars surviving multiple eval
 * invocations, define containers here to persist intermediate data across
 * such scripting RPCs. 
 */
export const pageContext = {}
// Expose BokehJS ColumnDataSource sync'ing API with persistent containers
import { cdsServiceSuite } from './cds.js'
export const {
  receiveDataSource, updateDataSource, cds,
} = cdsServiceSuite(hskiPageConn, pageContext)


// One-shot page initialization
{
  // Apply page title if specified
  const title = pageParams.get('title')
  if (title) { document.title = title }
}


// Attempt the connection on page open
$(async function () {
  try {
    await hskiPageConn.livePeer()
    uiLog("Page " + window.name + "@" + location.pathname
      + " connected with HaskIt backend at: " + hskiPageConn.url)
  } catch (err) {
    let details = err ? err.stack : err
    uiLog("Page " + window.name + "@" + location.pathname
      + " failed connecting to HaskIt backend via ws.", "err-msg", details)
  }
})
