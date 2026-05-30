// ── NAVBAR: shrink on scroll ──
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

// ── SCROLL REVEAL ──
const reveals = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
reveals.forEach(el => revealObserver.observe(el));


const EMAILJS_PUBLIC_KEY  = 'YOUR_PUBLIC_KEY';    
const EMAILJS_SERVICE_ID  = 'YOUR_SERVICE_ID';   
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';  

const submitBtn = document.querySelector('.submit-btn');
const formMsg   = document.querySelector('.form-msg');

function showMsg(type, text) {
  formMsg.className = 'form-msg ' + type;
  formMsg.textContent = text;
  setTimeout(() => { formMsg.className = 'form-msg'; }, 5000);
}

submitBtn.addEventListener('click', async function () {
  // Gather field values
  const inputs    = document.querySelectorAll('.contact-form input, .contact-form select, .contact-form textarea');
  const name      = inputs[0].value.trim();
  const contact   = inputs[1].value.trim();
  const service   = inputs[2].value;
  const date      = inputs[3].value.trim();
  const hairInfo  = inputs[4].value.trim();

  // Basic validation
  if (!name || !contact) {
    showMsg('error', 'Please fill in your name and phone / email.');
    return;
  }

  // Check EmailJS is configured
  if (EMAILJS_PUBLIC_KEY === 'YOUR_PUBLIC_KEY') {
    showMsg('error', 'EmailJS is not configured yet. See the script.js setup instructions.');
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending…';

  try {
    await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      {
        from_name:      name,
        from_contact:   contact,
        service:        service,
        preferred_date: date || 'Not specified',
        hair_info:      hairInfo || 'Not specified',
      }
    );

    submitBtn.textContent = 'Sent! ✦';
    showMsg('success', 'Your request has been sent! Ulyana will get back to you within 24 hours.');
    // Clear the form
    inputs.forEach(el => { el.value = ''; });

  } catch (err) {
    console.error('EmailJS error:', err);
    showMsg('error', 'Something went wrong. Please try again or contact directly.');
    submitBtn.textContent = 'Send request →';
  } finally {
    submitBtn.disabled = false;
    setTimeout(() => { submitBtn.textContent = 'Send request →'; }, 4000);
  }
});
