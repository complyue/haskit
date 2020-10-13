/**
 * main script of a window rendering Bokeh plots
 */

function syncRange(rng, axisName) {
  let ch = new BroadcastChannel(axisName);
  let announceTimer = null;
  ch.onmessage = function (me) {
    let rd = me.data;
    if (null !== announceTimer) {
      return; // local updates on the way
    }
    if (rd[0] === rng.start && rd[1] === rng.end) {
      return; // well synced, don't propagate
    }
    rng.setv({
      start: rd[0],
      end: rd[1],
    });
  };
  rng.callback = () => {
    if (null !== announceTimer) {
      return; // already scheduled
    }
    announceTimer = setTimeout(() => {
      announceTimer = null; // clear for next schedule
      const rd = [rng.start, rng.end];
      ch.postMessage(rd);
    }, 1000); // announce at most 1Hz
  };
}

window.onmessage = (me) =>
  setTimeout(function () {
    // if (window.opener !== me.source) {
    //   console.error("window msg from other than opener ?!", me.source);
    //   debugger;
    //   return;
    // }
    console.log("xxx", me);
    debugger;
    // strange enough, msg posted but neither log nor stop at bps
    me.source.postMessage("777");
  }, 0);
