/**
 * relay plot traffic from HaskIt server to respective plot windows
 *
 * plot windows are only opened from the window importing this module, per
 * request from HaskIt server, this module should only be imported from a
 * HaskIt web client's root window.
 */

import { Lander, McServer } from "nedh";

export function setupPlotRelay(hskiCurrPeer) {
  class PlotRelayLander extends Lander {
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
          _resolve(await eval(_src));
        } catch (exc) {
          _reject(exc);
        }
      }
    }
  }

  // listen for incoming MessageChannel connections from plot windows to this
  // root window
  new McServer(
    window,
    "plot",
    () => new PlotRelayLander(),
    ({ plotChannel }, mcPeer) => {
      const chIncoming = hskiCurrPeer().armChannel(plotChannel);
      const chOutgoing = mcPeer.armChannel(plotChannel);

      // spawn the [ hskiServer => plotWin ] cmd pump
      (async () => {
        let chLctr = null;
        for await (const cmdPayload of chIncoming.stream()) {
          const dir = chLctr;
          chLctr = null;
          if (null !== dir) {
            mcPeer.p2c(dir, cmdPayload);
            continue;
          }

          if (null === cmdPayload) {
            debugger;
            throw Error("bad usage: hski server posted null packet");
          }
          const { nextDir, plotCmd } = cmdPayload;
          if (undefined !== nextDir) {
            chLctr = nextDir;
          }
          if (undefined !== plotCmd) {
            mcPeer.postCommand(plotCmd);
          }
        }
      })().catch(console.error);

      // spawn the [ plotWin => hskiServer ] cmd pump
      (async () => {
        for await (const cmdPayload of chOutgoing.stream()) {
          const cmdOut =
            "string" === typeof cmdPayload
              ? JSON.stringify(cmdPayload)
              : cmdPayload;
          hskiCurrPeer().p2c(plotChannel, cmdOut);
        }
      })().catch(console.error);

      // act to server the window is open now
      hskiCurrPeer().p2c(plotChannel, '"plot-win-open"');
    }
  );

  return function openPlotWindow(pgid, pwid, plotChannel) {
    const winName = "plot#" + pgid + "/" + pwid + "@" + plotChannel;
    window.open("/haze/plot.html?" + plotChannel, winName);
    return winName;
  };
}
