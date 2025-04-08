document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.getElementById('themeToggle');
  const sendButton = document.getElementById('sendButton');
  const messageInput = document.getElementById('messageInput');
  const chatHistory = document.getElementById('chatHistory');

  // Load theme preference from localStorage
  const currentTheme = localStorage.getItem('theme') || 'light-mode';
  document.body.className = currentTheme;

  // Toggle light/dark mode
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    document.body.classList.toggle('dark-mode');
    const newTheme = document.body.className;
    localStorage.setItem('theme', newTheme);
  });

  // Send message
  sendButton.addEventListener('click', () => {
    const message = messageInput.value.trim();
    if (message) {
      appendMessage('You', message);
      transmitMessage(message);
      messageInput.value = '';
    }
  });

  // Append message to chat history
  function appendMessage(sender, message) {
    const messageElement = document.createElement('div');
    messageElement.textContent = `${sender}: ${message}`;
    chatHistory.appendChild(messageElement);
    chatHistory.scrollTop = chatHistory.scrollHeight;
  }
});
