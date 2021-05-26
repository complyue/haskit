/**
 * main module of the narrator page
 */

import { Lander, } from "nedh"

import { HaskItConn, uiLog, uiInitPage, } from "haskit"

import { cdsReceive, } from './cds.js'


export function onViewRangeChange(vrName, onViewRangeChanged,) {
  const ch = new BroadcastChannel(vrName)
  ch.onmessage = function (me) {
    const [start, end] = me.data
    onViewRangeChanged(start, end)
  }
}


export function onAxisCursorChange(acName, onAxisCursorChanged,) {
  const ch = new BroadcastChannel(acName)
  ch.onmessage = function (me) {
    const [x, y] = me.data
    onAxisCursorChanged(x, y)
  }
}


export function onViewFocusChange(vfName, onViewFocusChanged,) {
  const ch = new BroadcastChannel(vfName)
  ch.onmessage = function (me) {
    onViewFocusChanged(me.data)
  }
}


// lander with this module scope as environment
class NarrLander extends Lander {
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


// Narrator parameters passed via query string
const narrParams = new URLSearchParams(window.location.search)

// The page wide haskit connection to server
class NarrConn extends HaskItConn {
  async createLander() {
    return new NarrLander()
  }
}
const narrService = narrParams.get('service')
const hskiPageConn = new NarrConn(narrService)

{
  const title = narrParams.get('title')
  if (title) { document.title = title }
}


/*
 * js being strict-eval'ed can't create vars survive between eval invocations,
 * define containers here to persist intermediate data across scripted RPCs. 
 */
export const narrContext = {}

export async function receiveDataSource(
  dsName, colNames, colDtypes,
) {
  await cdsReceive(
    await hskiPageConn.livePeer(), narrContext, bkh.ColumnDataSource,
    dsName, colNames, colDtypes,
  )
}
export function cds(name) {
  return narrContext[name]
}


export class Narrator {
  constructor(div) {
    this.div = div
    this.stories = {}
  }

  addStoryLine(name, title, featureKeys, featureNames,) {
    const storyline = new Storyline(name, title, featureKeys, featureNames,)
    this.stories[name] = storyline
    return storyline
  }

  focusStoryline(name) {
    const storyline = this.stories[name]
    if (!storyline) return
    storyline.div.parent().prepend(storyline.div)
    // todo, hide or fade other storylines?
  }
}

export class Storyline {
  constructor(name, title, featureKeys, featureNames,) {
    // convert to displayable html
    const htmlName = $("<div/>").text(name).html()
    const htmlTitle = $("<div/>").text(title).html()
    // also attribute value needs extra quoting of the double-quotes
    this.div = $(`
<div class="NarrationStory" data-name="${htmlName.replace('"', "&quot;")}">
  <div class="NarratorTitleBar">
    <div class="NarrationTitle">${htmlTitle}</div>
  </div>
</div>
`)
    const divContent =
      $("<div/>", { class: "NarrationContent", }).appendTo(this.div)
    this.featureNarremes = {}
    for (let i = 0; i < featureKeys.length; i++) {
      const featKey = featureKeys[i], featName = featureNames[i]
      const divFeat = $("<div/>", { class: "FeatNarreme" })
      $("<div/>", { class: "FeatName" }).text(featName).appendTo(divFeat)
      const featNarreme = $("<div/>", { class: "Narreme" }).appendTo(divFeat)
      divFeat.appendTo(divContent)
      this.featureNarremes[featKey] = featNarreme
    }
    this.div.appendTo(narrator.div)
  }

  focus() {
    this.div.parent().children().removeClass('Focus')
    this.div.addClass('Focus')
    this.div.each(function () { this.scrollIntoView() })
  }

  updateNarremes(narremeTexts) {
    for (const [featKey, featVal] of Object.entries(narremeTexts)) {
      // assuming narreme already in html
      this.featureNarremes[featKey].html(featVal)
    }
  }
}

export const narrator = new Narrator($("#narrator"))


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
