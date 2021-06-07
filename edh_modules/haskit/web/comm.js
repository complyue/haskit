
export function onViewFocusChange(vfName, onViewFocusChanged,) {
  const ch = new BroadcastChannel(vfName)
  ch.onmessage = function (me) {
    const [effFocusName, effFocusTitle] = me.data
    onViewFocusChanged(effFocusName, effFocusTitle)
  }
}

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


export function announceFocus(figView, vfName, focusName, focusTitle,) {
  const effFocusName = focusName || figView.model.name
  const effFocusTitle = focusTitle || figView.model.title
  const evtElem = figView.canvas_view.events_el
  const ch = new BroadcastChannel(vfName)
  evtElem.addEventListener('mouseenter', _me => {
    ch.postMessage([effFocusName, effFocusTitle])
  })
}

export function announceRange(rng, vrName,) {
  const ch = new BroadcastChannel(vrName)
  rng.on_change([rng.properties.start, rng.properties.end], () => {
    const rd = [rng.start, rng.end]
    ch.postMessage(rd)
  })
}

export function announceAxisCursor(figView, scaleGetter, acName,) {
  const evtElem = figView.canvas_view.events_el
  const [xscale, yscale] = scaleGetter(figView.frame)
  const ch = new BroadcastChannel(acName)
  evtElem.addEventListener('mousemove', me => {
    const { left, top } = me.target.getBoundingClientRect()
    const sx = me.clientX - left, dx = xscale.invert(sx)
    const sy = me.clientY - top, dy = yscale.invert(sy)
    ch.postMessage([dx, dy])
  })
}


export function defaultScale(frame) {
  return [frame.xscales.default, frame.yscales.default]
}


export function findViewByModelName(name) {
  return function findNamedView(view) {
    if (view.model && view.model.name == name) return view
    for (const child of view.child_views || []) {
      const v = findNamedView(child)
      if (v !== null) return v
    }
    return null
  }
}


/**
 * Synchronize the specified Boken range with the rest of all such ranges,
 * those associated with the same global view-range by name.
 *
 * @param rng a Boken range object
 * @param vrName global name of the shared view-range
 */
export function syncRange(rng, vrName,) {
  const chName = window.parent
    ? parent.name + '/' + vrName // don't sync iframes across plot windows
    : vrName // or assume its a top level plot frame, sync globally
  const ch = new BroadcastChannel(chName)
  let announceTimer = null
  ch.onmessage = function (me) {
    const rd = me.data
    if (null !== announceTimer) {
      return // local updates on the way
    }
    if (rd[0] === rng.start && rd[1] === rng.end) {
      return // well synced, don't propagate
    }
    rng.setv({ start: rd[0], end: rd[1], })
  }
  rng.on_change([rng.properties.start, rng.properties.end], () => {
    if (null !== announceTimer) {
      return // already scheduled
    }
    announceTimer = setTimeout(() => {
      announceTimer = null // clear for next schedule
      const rd = [rng.start, rng.end]
      ch.postMessage(rd)
    }, 1000) // announce at most 1Hz
  })
}
