/**
 * extra module of the narrator page
 */

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

window.narrator = new Narrator($(".Narrator"))
