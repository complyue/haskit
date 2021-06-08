/**
 * HaskIt WebSocket connection
 */

import { WsPeer, Lander, } from "nedh"

import { hasLogBox, uiLog, } from "./log.js"


export async function getWsBaseUrl() {
  const wsPort = await $.get("/:")
  // todo use wss:// when appropriate
  return "ws://" + location.hostname + ":" + wsPort
}


export class HaskItPeer extends WsPeer {
  async handleError(err, errDetails) {
    console.error("Unexpected WS error: ", err, errDetails)
    debugger
    if (hasLogBox()) uiLog(err, "err-msg", errDetails)
  }
  cleanup() {
    super.cleanup()
    uiLog("Page " + window.name + "@" + location.pathname
      + " disconnected with HaskIt backend.")
  }
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


export class HaskItConn {
  constructor(path = null, params = null,) {
    if (typeof path !== 'string') {
      this.path = ''
    } else if (path.startsWith('/')) {
      this.path = path
    } else {
      this.path = '/' + path
    }
    this.params = null === params ? null : new URLSearchParams(params)
    this.url = null
    this.peer = null
  }

  async getUrl() {
    if (this.url === null) {
      const wsBaseUrl = await getWsBaseUrl()
      this.url = wsBaseUrl + this.path
      if (null !== this.params) {
        this.url += '?' + this.params
      }
    }
    return this.url
  }

  async livePeer() {
    const url = await this.getUrl()
    switch (this.peer ? this.peer.ws.readyState : WebSocket.CLOSED) {
      case WebSocket.OPEN:
        return this.peer // already established
      case WebSocket.CONNECTING:
        break // connecting inprogress
      default:
        const lander = await this.createLander()
        // to establish new WebSocket connection with Nedh semantics
        this.peer = new HaskItPeer(url, lander)
    }
    // wait until really connected, as well as get connection error if any
    await this.peer.opened
    // certainly it's connected for the time being
    return this.peer
  }

  ifAlive(act) {
    const peer = this.peer
    switch (peer ? peer.ws.readyState : WebSocket.CLOSED) {
      case WebSocket.OPEN:
        return act(peer)
      default:
    }
    console.warn('HaskIt connection already dead.')
  }

  async createLander() {
    return new HaskItLander()
  }

}
