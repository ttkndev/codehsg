(() => {
  const form = document.getElementById('newsletterForm');
  const input = document.getElementById('newsletterEmail');
  const msg = document.getElementById('newsletterMsg');
  if (!form || !input || !msg) return;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = input.value.trim();
    if (!emailRegex.test(email)) {
      msg.className = 'text-warning';
      msg.textContent = 'Email chưa đúng định dạng.';
      input.focus();
      return;
    }

    msg.className = 'text-info';
    msg.textContent = 'Hợp lệ. Có thể append vào file text trên GitHub bằng GitHub API (PUT /contents).';

    // Demo local list only
    const list = JSON.parse(localStorage.getItem('newsletter_emails') || '[]');
    if (!list.includes(email)) {
      list.push(email);
      localStorage.setItem('newsletter_emails', JSON.stringify(list));
    }
  });
})();
