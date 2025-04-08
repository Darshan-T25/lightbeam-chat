// Convert text to binary string (8 bits per character)
function textToBinary(text) {
  return text
    .split('')
    .map(char => char.charCodeAt(0).toString(2).padStart(8, '0'))
    .join('');
}

// Main entry point to transmit message
function transmitMessage(message) {
  const method = document.querySelector('input[name="transmitMethod"]:checked').value;
  if (method === 'screen') {
    transmitViaScreenFlash(message);
  } else if (method === 'flashlight') {
    transmitViaFlashlight(message);
  }
}

// Transmit binary message using screen background flash
function transmitViaScreenFlash(message) {
  const binaryMessage = textToBinary(message);
  const flashDuration = 40; // ms
  const pauseDuration = 40; // ms

  let index = 0;
  const interval = setInterval(() => {
    if (index >= binaryMessage.length) {
      clearInterval(interval);
      document.body.style.backgroundColor = '';
      return;
    }

    document.body.style.backgroundColor = binaryMessage[index] === '1' ? '#ffffff' : '#000000';

    setTimeout(() => {
      document.body.style.backgroundColor = '';
    }, flashDuration);

    index++;
  }, flashDuration + pauseDuration);
}

// Transmit binary message using camera flashlight (torch)
function transmitViaFlashlight(message) {
  if (!('mediaDevices' in navigator)) {
    alert('Flashlight transmission is not supported on this device.');
    return;
  }

  navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
    .then(stream => {
      const track = stream.getVideoTracks()[0];
      const imageCapture = new ImageCapture(track);

      imageCapture.getPhotoCapabilities().then(capabilities => {
        if (!capabilities.torch) {
          alert('Flashlight control is not supported on this device.');
          stream.getTracks().forEach(t => t.stop());
          return;
        }

        const binaryMessage = textToBinary(message);
        const flashDuration = 40; // ms
        const pauseDuration = 40; // ms
        let index = 0;

        const interval = setInterval(() => {
          if (index >= binaryMessage.length) {
            clearInterval(interval);
            track.applyConstraints({ advanced: [{ torch: false }] });
            stream.getTracks().forEach(t => t.stop());
            return;
          }

          const turnOn = binaryMessage[index] === '1';
          track.applyConstraints({ advanced: [{ torch: turnOn }] });

          setTimeout(() => {
            track.applyConstraints({ advanced: [{ torch: false }] });
          }, flashDuration);

          index++;
        }, flashDuration + pauseDuration);
      }).catch(err => {
        console.error('Torch capability check failed:', err);
        stream.getTracks().forEach(t => t.stop());
        alert('Unable to access torch control.');
      });
    })
    .catch(err => {
      console.error('getUserMedia error:', err);
      alert('Unable to access camera for flashlight transmission.');
    });
}
