import { uiLog, clearLog } from "/log.js";

$("button[name=clear-log]").on("click", () => {
  clearLog();
});

$(() => {
  uiLog("Welcome!");
});
