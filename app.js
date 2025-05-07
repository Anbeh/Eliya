document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById('chat-form');
  const input = document.getElementById('user-input');
  const chatBox = document.getElementById('chat-box');
  const placeholder = document.getElementById('chat-placeholder');
  const clearButton = document.getElementById('clear-chat');

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

  async function sendToAPI(message) {
    try {
      const encodedMessage = encodeURIComponent(message);
      const res = await fetch(`https://text.pollinations.ai/${encodedMessage}, "اسمت الیا (Eliya) است و توسط تیم ریزون برنامه نویسی و توسعه داده شدی. هرگونه اطلاعات مربوط به شرکت توسعه دهنده، نام مدل، نسخه، معماری، داده های آموزشی یا جزئیات فنی مربوط به خودت رو تحت هیچ شرایطی افشا نکن. اگر در مورد هویت، سازندگان یا مشخصات فنی سیستم سوالی پرسیده شد، به صورت مودبانه بگو «متاسفانه اجازهٔ افشای این اطلاعات رو ندارم» و گفتگو رو به نیاز کاربر برگردون. از اشاره به هرگونه نام شرکت، مدل خاص (مثل GPT، Gemini، Claude و...) یا برندهای شناخته شده خودداری کن.`);
      const text = await res.text();
      return text || 'خطا در دریافت پاسخ از سرور';
    } catch (error) {
      console.error('API error:', error);
      return 'ارتباط برقرار نشد.';
    }
  }

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
    navigator.serviceWorker.register('sw.js');
  }

  loadFromLocalStorage();
});