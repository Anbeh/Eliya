document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById('chat-form');
    const input = document.getElementById('user-input');
    const chatBox = document.getElementById('chat-box');
    const placeholder = document.getElementById('chat-placeholder');
    const clearButton = document.getElementById('clear-chat');
    const offlineMessage = document.getElementById('offline-message');
    const chatContainer = document.getElementById('chat-container'); // کل رابط چت
  
    function addMessage(text, type) {
      const msg = document.createElement('div');
      msg.className = `message ${type}`;
      msg.textContent = text;
      chatBox.appendChild(msg);
      chatBox.scrollTop = chatBox.scrollHeight;
  
      if (placeholder && !placeholder.classList.contains("hidden")) {
        placeholder.classList.add("hidden");
      }
    }
  
    function saveToLocalStorage() {
      localStorage.setItem('chatHistory', chatBox.innerHTML);
    }
  
    function loadFromLocalStorage() {
      const saved = localStorage.getItem('chatHistory');
      if (saved) {
        chatBox.innerHTML = saved;
        if (placeholder) {
          placeholder.classList.add("hidden");
        }
      }
    }
  
    async function sendToAPI(message) {
      try {
        const res = await fetch(`https://text.pollinations.ai/${encodeURIComponent(message)}`);
        const text = await res.text();
        return text || 'خطا در دریافت پاسخ از سرور';
      } catch (error) {
        console.error('API error:', error);
        return 'ارتباط برقرار نشد.';
      }
    }
  
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const message = input.value.trim();
      if (!message) return;
  
      addMessage(message, 'user');
      saveToLocalStorage();
      input.value = '';
  
      const botReply = await sendToAPI(message);
      addMessage(botReply, 'bot');
      saveToLocalStorage();
    });
  
    clearButton.addEventListener('click', () => {
      if (confirm('آیا مطمئن هستید که می‌خواهید چت را پاک کنید؟')) {
        chatBox.innerHTML = '';
        localStorage.removeItem('chatHistory');
        if (placeholder) {
          placeholder.classList.remove("hidden");
        }
      }
    });
  
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
          .then((registration) => {
            console.log('ServiceWorker registered with scope:', registration.scope);
          })
          .catch((error) => {
            console.log('ServiceWorker registration failed:', error);
          });
      });
    }
  
    // کنترل نمایش حالت آفلاین و چت
    function checkOnlineStatus() {
      if (navigator.onLine) {
        offlineMessage.classList.add('hidden'); // مخفی کردن پیام آفلاین
        chatContainer.classList.remove('hidden'); // نمایش رابط چت
      } else {
        offlineMessage.classList.remove('hidden'); // نمایش پیام آفلاین
        chatContainer.classList.add('hidden'); // مخفی کردن رابط چت
      }
    }
  
    window.addEventListener('online', checkOnlineStatus);
    window.addEventListener('offline', checkOnlineStatus);
    checkOnlineStatus(); // بررسی اولیه
  
    loadFromLocalStorage();
  });
