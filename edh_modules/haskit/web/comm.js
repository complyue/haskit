
export function onViewRangeChange(vrName, onViewRangeChanged,) {
  const ch = new BroadcastChannel(vrName)
  ch.onmessage = function (me) {
    const [start, end] = me.data
    onViewRangeChanged(start, end)
  }
}

export function onAxisCursorChange(acName, onAxisCursorChanged,) {
  const ch = new BroadcastChannel(acName)
  ch.onmessage = function (me) {
    const [x, y] = me.data
    onAxisCursorChanged(x, y)
  }
}

export function onViewFocusChange(vfName, onViewFocusChanged,) {
  const ch = new BroadcastChannel(vfName)
  ch.onmessage = function (me) {
    const [effFocusName, effFocusTitle] = me.data
    onViewFocusChanged(effFocusName, effFocusTitle)
  }
}


export function announceRange(rng, vrName,) {
  const ch = new BroadcastChannel(vrName)
  rng.on_change([rng.properties.start, rng.properties.end], () => {
    const rd = [rng.start, rng.end]
    ch.postMessage(rd)
  })
}

export function announceFocus(figView, vfName, focusName, focusTitle,) {
  const effFocusName = focusName || figView.model.name
  const effFocusTitle = focusTitle || figView.model.title
  const evtElem = figView.canvas_view.events_el
  const ch = new BroadcastChannel(vfName)
  evtElem.addEventListener('mouseenter', _me => {
    ch.postMessage([effFocusName, effFocusTitle])
  })
}
