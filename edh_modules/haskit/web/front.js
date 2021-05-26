/**
 * main module of HaskIt root page
 */

import { Lander, } from "nedh"

import { HaskItConn, uiLog, clearLog, } from "haskit"


class FrontLander extends Lander {
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


// The page wide haskit connection to server
class FrontConn extends HaskItConn {
  async createLander() {
    return new FrontLander()
  }
}
const hskiPageConn = new FrontConn('') // connect to root path


// page UI reactions

$("button[name=clear-log]").on("click", () => {
  clearLog()
})

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
