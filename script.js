
let revealed = false;
const audio = new Audio("shake-sound.wav");

function playSound() {
    try { audio.currentTime = 0; audio.play(); } catch(e){}
}

document.addEventListener("DOMContentLoaded", () => {
  const intro = document.getElementById("intro");
  const cv = document.getElementById("cv");
  const fallback = document.getElementById("fallback");
  const activate = document.getElementById("activate");

  function revealCV() {
    if (revealed) return;
    revealed = true;
    playSound();
    intro.classList.add("hidden");
    cv.classList.remove("hidden");
    if (navigator.vibrate) navigator.vibrate([60,40,60]);
  }

  async function requestPermission() {
    if (typeof DeviceMotionEvent !== "undefined" &&
        typeof DeviceMotionEvent.requestPermission === "function") {
      try {
        const res = await DeviceMotionEvent.requestPermission();
        if (res === "granted") initShake();
      } catch(e){}
    } else {
      initShake();
    }
  }

  function initShake() {
    let lastX=0, lastY=0, lastZ=0;
    let threshold = 15;

    window.addEventListener("devicemotion", e => {
      let acc = e.accelerationIncludingGravity;
      let delta = Math.abs(acc.x-lastX) + Math.abs(acc.y-lastY) + Math.abs(acc.z-lastZ);
      if (delta > threshold) revealCV();
      lastX = acc.x; lastY = acc.y; lastZ = acc.z;
    });
  }

  activate.addEventListener("click", requestPermission);
  fallback.addEventListener("click", () => { requestPermission(); revealCV(); });
});
