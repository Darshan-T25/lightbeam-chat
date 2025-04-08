const sendBtn = document.getElementById('sendBtn');
const msgInput = document.getElementById('messageInput');
const chatBox = document.getElementById('chat');
const modeToggle = document.getElementById('modeToggle');
const transmissionMode = document.getElementById('transmissionMode');
const flashAlert = document.getElementById('flashAlert');

let isDark = false;
let currentMode = 'screen';

modeToggle.onclick = () => {
  isDark = !isDark;
  document.body.className = isDark ? 'dark-mode' : 'light-mode';
};

transmissionMode.onchange = () => {
  currentMode = transmissionMode.value;
  if (currentMode === 'flashlight') {
    checkFlashPermission();
  } else {
    flashAlert.classList.add('hidden');
  }
};

flashAlert.onclick = () => {
  requestFlashPermission();
};

sendBtn.onclick = () => {
  const msg = msgInput.value.trim();
  if (!msg) return;
  appendMessage(`📤 You: ${msg}`);
  transmit(msg, currentMode);
  msgInput.value = '';
};

function appendMessage(text) {
  const div = document.createElement('div');
  div.textContent = text;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Flashlight permission check
let track;

function checkFlashPermission() {
  navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
    .then(stream => {
      track = stream.getVideoTracks()[0];
      const capabilities = track.getCapabilities();
      if (capabilities.torch) {
        flashAlert.classList.add('hidden');
      } else {
        flashAlert.classList.remove('hidden');
      }
    })
    .catch(() => {
      flashAlert.classList.remove('hidden');
    });
}

function requestFlashPermission() {
  checkFlashPermission();
}
