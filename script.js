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

// ── CONTACT FORM: send via EmailJS ──
// SETUP INSTRUCTIONS (free, 5 min):
// 1. Go to https://www.emailjs.com and create a free account
// 2. Add an Email Service (Gmail) → copy the Service ID
// 3. Create an Email Template with these variables:
//    {{from_name}}, {{from_contact}}, {{service}}, {{preferred_date}}, {{hair_info}}
//    Set "To email" = timurcecel@gmail.com
// 4. Copy your Template ID and Public Key
// 5. Replace the three placeholders below with your actual values

const EMAILJS_PUBLIC_KEY  = 'YOUR_PUBLIC_KEY';   // e.g. 'abc123XYZ'
const EMAILJS_SERVICE_ID  = 'YOUR_SERVICE_ID';   // e.g. 'service_xxxxxx'
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';  // e.g. 'template_xxxxxx'

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
