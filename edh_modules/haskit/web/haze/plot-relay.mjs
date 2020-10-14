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
          _resolve(eval(_src));
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
        for await (const { plotDir, plotCmd } of chIncoming.stream()) {
          mcPeer.postCommand(plotCmd, plotDir);
        }
      })().catch(console.error);

      // spawn the [ plotWin => hskiServer ] cmd pump
      (async () => {
        for await (const { plotDir, plotCmd } of chOutgoing.stream()) {
          mcPeer.postCommand(plotCmd, plotDir);
        }
      })().catch(console.error);

      // notify server the window is open now
      hskiCurrPeer().p2c(plotChannel, '"open"');
    }
  );

  return function openPlotWindow(pgid, pwid, plotChannel) {
    const winName = "plot#" + pgid + "/" + pwid + "@" + plotChannel;
    window.open("/haze/plot.html?" + plotChannel, winName);
    return winName;
  };
}
