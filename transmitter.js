let flashBox;

function transmit(message, mode) {
  const binary = toBinary(message);
  if (mode === 'screen') {
    pulseScreen(binary);
  } else {
    pulseFlash(binary);
  }
}

function toBinary(text) {
  return text.split('')
    .map(char => char.charCodeAt(0).toString(2).padStart(8, '0'))
    .join('');
}

// Pulse screen (very fast)
function pulseScreen(binary) {
  if (!flashBox) {
    flashBox = document.createElement('div');
    flashBox.className = 'flash-box';
    document.body.appendChild(flashBox);
  }

  let i = 0;
  const interval = setInterval(() => {
    if (i >= binary.length) {
      flashBox.style.background = 'transparent';
      clearInterval(interval);
      return;
    }
    flashBox.style.background = binary[i] === '1' ? 'white' : 'black';
    i++;
  }, 50); // fast pulse
}

// Pulse camera flashlight
async function pulseFlash(binary) {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
    const track = stream.getVideoTracks()[0];
    const imageCapture = new ImageCapture(track);
    const capabilities = track.getCapabilities();

    if (!capabilities.torch) {
      alert('Torch not supported on this device');
      return;
    }

    const applyTorch = state => track.applyConstraints({ advanced: [{ torch: state }] });

    let i = 0;
    const interval = setInterval(() => {
      if (i >= binary.length) {
        applyTorch(false);
        track.stop();
        clearInterval(interval);
        return;
      }
      applyTorch(binary[i] === '1');
      i++;
    }, 100); // flashlight is slower
  } catch (err) {
    console.error('Flash error', err);
  }
}
