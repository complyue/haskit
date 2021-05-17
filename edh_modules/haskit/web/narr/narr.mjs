/**
 * main script of a window showing the narrator
 */

import { Lander, McClient } from "nedh"

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

// passed as query string of the page url
export const narrChannel = window.location.search.substr(1)

// source of incoming commands may reference this as well as other scripts can
// import it
export const mcc2Root = new McClient(
  // should have been opened directly by the root window, it listens for our
  // connection
  window.opener,
  // name of the service to connect
  "narr",
  // land incoming commands with this module as environment
  new NarrLander(),
  // extra info for the connection
  {
    narrChannel: narrChannel,
  }
)

export class Narrator {
  constructor() {
    this.div = $(document.body).find(".Narrator")
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
    for (const i = 0; i < featureKeys.length; i++) {
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
    // move this storyline to the top
    this.div.parent().prepend(this.div)
    // todo, hide or fade other storylines?
  }

  updateNarremes(narremeTexts) {
    for (const [featKey, featVal] of Object.entries(narremeTexts)) {
      // assuming narreme already in html
      this.featureNarremes[featKey].html(featVal)
    }
  }
}

export const narrator = new Narrator()
