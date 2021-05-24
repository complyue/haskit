/**
 * HaskIt WebSocket connection
 */

import { WsPeer, } from "nedh"

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
    uiLog("Lost connection with HaskIt backend.")
  }
}


export class HaskItConn {
  constructor(path = '', params = null,) {
    this.path = (path.startsWith('/') ? '' : '/') + path
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

  async createLander() {
    throw Error('Subclass not implemented `createLander()` !')
  }
}
