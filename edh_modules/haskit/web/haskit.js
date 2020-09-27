import { uiLog, clearLog } from "/log.js";

import WSC from "/wsc.js";

$("button[name=clear-log]").on("click", () => {
  clearLog();
});

const plotData = {};

// reply plot data to a haze plot window, after it reported-in
window.onmessage = function (me) {
  let hazeWin = me.source;

  if ("haze-win-report-in" !== me.data.type) {
    console.error("unexpected window message.");
    debugger;
    return;
  }

  let pd = plotData[hazeWin.name];
  if (pd === undefined) {
    // manually refresh a Haze plot window can lead into here
    uiLog("Don't do that!", "err-msg", "Did you refresh a plot window?");
    return; // we don't have the data anymore, no more to do
  }

  // unreference from main window for sure, to avoid leakage
  delete plotData[hazeWin.name];

  // reply the data
  hazeWin.postMessage(
    Object.assign(
      {
        type: "haze-plot-data",
      },
      pd
    ),
    "*",
    pd.bins // transfer the typed-arrays for zero-copy performance
  );
};

export class HaskItWSC extends WSC {
  async plotWin(pgid, pwid, tmpl, cnl, plotCode) {
    // take the binary chunks, temporarily store the data,
    // open a plot window which will come retrive the data.
    let bins = Array.from(this.bins);
    this.bins.length = 0;

    let winName = "plot@" + pgid + "%" + pwid;
    plotData[winName] = {
      bins,
      pgid,
      pwid,
      cnl,
      plotCode,
    };
    window.open(tmpl, winName);
  }
}

export const hskiWSC = new HaskItWSC();

export async function withHaskIt(hskiAct) {
  let ws = await hskiWSC.dial();
  hskiAct(ws);
}

$(async function () {
  try {
    uiLog("Dialing HaskIt backend ...");
    await hskiWSC.dial();
    uiLog("Connected with HaskIt backend.");
  } catch (err) {
    let details = err ? err.stack : err;
    uiLog("Failed connecting to HaskIt backend via ws.", "err-msg", details);
  }
});

export default hskiWSC;
