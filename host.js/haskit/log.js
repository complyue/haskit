/**
 * logging functions directing messages to some box in UI
 */

import { NaiveDate } from "./ts.js"



let logBox = null, logArea = null,
  logAnimTask = null, lastAnimTime = 0

if (globalThis.window === globalThis) { // in browser
  logBox = $(".LogBox")
  logArea = logBox.closest(".LogArea")
}


export function hasLogBox() {
  return logBox && logBox.length > 0
}


export function uiLog(msg, type = "msg", details = undefined) {
  if (!hasLogBox()) {
    console.log("HeadlessLog:", type, msg, details)
    return
  }

  let logRecord = $("<div/>", { class: type })
  let dt = new Date()
  logRecord.append(
    $("<span/>", {
      class: "ts",
      text:
        "[" +
        new NaiveDate(dt.getTime() - 60000 * dt.getTimezoneOffset()).isoFull() +
        "]",
    })
  )

  msg = "" + msg
  if (msg.includes("\n")) {
    logRecord.append($("<pre/>", { html: msg }))
  } else {
    logRecord.append($("<span/>", { text: msg }))
  }
  if (details) {
    logRecord.append($("<pre/>", { html: "" + details }))
  }
  logBox.append(logRecord)

  // scroll new log with throttled animation, never trigger animation more frequent than 1Hz
  function animNewLog() {
    logArea.stop().animate({ scrollTop: logArea[0].scrollHeight }, 300)
    lastAnimTime = dt.getTime()
    logAnimTask = null
  }

  if (null !== logAnimTask) {
    // animation scheduled
    return
  }
  let remainDelay = 1000 - (dt.getTime() - lastAnimTime)
  if (remainDelay <= 0) {
    logAnimTask = null
    animNewLog()
  } else {
    logAnimTask = setTimeout(animNewLog, remainDelay)
  }
}


export function clearLog() {
  if (hasLogBox) logBox.empty()
}


export function uiInitPage() {

  $("button[name=clear-log]").on("click", () => {
    clearLog()
  })

}
