/**
 * main module of HaskIt root page
 */

import { Lander, WsPeer } from "nedh";

import { hasLogBox, uiLog, clearLog } from "/log.mjs";

$("button[name=clear-log]").on("click", () => {
  clearLog();
});

async function getWsUrl() {
  let wsPort = await $.get("/:");
  // todo use wss:// when appropriate
  return "ws://" + location.hostname + ":" + wsPort;
}

class HaskItLander extends Lander {
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

class HaskItPeer extends WsPeer {
  async handleError(err, errDetails) {
    console.error("Unexpected WS error: ", err, errDetails);
    debugger;
    if (hasLogBox()) uiLog(err, "err-msg", errDetails);
  }
  cleanup() {
    super.cleanup();
    uiLog("Lost connection with HaskIt backend.");
  }
}

let _livePeer = null;

export default async function livePeer() {
  switch (_livePeer ? _livePeer.ws.readyState : WebSocket.CLOSED) {
    case WebSocket.OPEN:
      return _livePeer; // already established
    case WebSocket.CONNECTING:
      break; // connecting inprogress
    default:
      // to establish new WebSocket connection with Nedh semantics
      _livePeer = new HaskItPeer(await getWsUrl(), new HaskItLander());
  }
  // wait until really connected, as well as get connection error if any
  await _livePeer.opened;
  // certainly it's connected for the time being
  return _livePeer;
}

$(async function () {
  try {
    uiLog("Dialing HaskIt backend ...");
    await livePeer();
    uiLog("Connected with HaskIt backend.");
  } catch (err) {
    let details = err ? err.stack : err;
    uiLog("Failed connecting to HaskIt backend via ws.", "err-msg", details);
  }
});
