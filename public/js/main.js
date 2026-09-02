/* ══════════════════════════════════════
   PeakNest — main.js
══════════════════════════════════════ */

// ── NAVBAR SCROLL ──
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ── MOBILE HAMBURGER ──
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
  document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
});

// Close mobile menu on link click
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// ── ROOM TABS ──
const tabs = document.querySelectorAll('.room-tab');
const roomCards = document.querySelectorAll('.room-card[data-type]');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const type = tab.dataset.type;

    roomCards.forEach((card, i) => {
      const show = type === 'all' || card.dataset.type === type;
      card.style.display = show ? '' : 'none';
      if (show) {
        card.style.opacity = '0';
        card.style.transform = 'translateY(16px)';
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, i * 60);
      }
    });
  });
});

// ── BOOKING MODAL ──
const modalOverlay  = document.getElementById('bookingModal');
const modalForm     = document.getElementById('modalForm');
const modalSuccess  = document.getElementById('modalSuccess');
const modalRoomName = document.getElementById('modalRoomName');
const modalRoomInfo = document.getElementById('modalRoomInfo');

function openBooking(roomName, price) {
  modalRoomName.textContent = 'Reserve Your Room';
  modalRoomInfo.textContent = roomName ? `${roomName}${price ? ' · ' + price + '/night' : ''}` : '';

  // Pre-fill room type select if provided
  const roomSelect = document.getElementById('roomTypeSelect');
  if (roomName && roomSelect) {
    for (let opt of roomSelect.options) {
      if (opt.value.toLowerCase().includes(roomName.toLowerCase().split(' ')[0])) {
        roomSelect.value = opt.value;
        break;
      }
    }
  }

  // Always show form, hide success
  modalForm.style.display = 'block';
  modalSuccess.classList.remove('show');

  modalOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeBooking() {
  modalOverlay.classList.remove('active');
  document.body.style.overflow = '';
}

// Close on backdrop click
modalOverlay.addEventListener('click', e => {
  if (e.target === modalOverlay) closeBooking();
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeBooking();
});

// ── FORM VALIDATION & SUBMISSION ──
function validateForm() {
  const required = ['guestName','guestEmail','checkinDate','checkoutDate'];
  let valid = true;

  required.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.remove('error-field');
    if (!el.value.trim()) {
      el.classList.add('error-field');
      valid = false;
    }
  });

  // Email format
  const emailEl = document.getElementById('guestEmail');
  if (emailEl && emailEl.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value)) {
    emailEl.classList.add('error-field');
    valid = false;
  }

  // Dates: check-out must be after check-in
  const checkin  = document.getElementById('checkinDate');
  const checkout = document.getElementById('checkoutDate');
  if (checkin && checkout && checkin.value && checkout.value) {
    if (new Date(checkout.value) <= new Date(checkin.value)) {
      checkout.classList.add('error-field');
      valid = false;
    }
  }

  return valid;
}

document.getElementById('confirmBookingBtn').addEventListener('click', () => {
  if (!validateForm()) {
    showToast('Please fill in all required fields correctly.', true);
    return;
  }

  const name  = document.getElementById('guestName').value.trim();
  const email = document.getElementById('guestEmail').value.trim();
  const room  = document.getElementById('roomTypeSelect')?.value || 'your room';

  // Show success view
  modalForm.style.display = 'none';
  document.getElementById('successGuestName').textContent = name;
  document.getElementById('successRoomName').textContent  = room;
  document.getElementById('successEmail').textContent     = email;
  modalSuccess.classList.add('show');

  showToast(`✓ Booking confirmed! We'll send details to ${email}`);
});

// ── CLEAR & CLOSE (Done button) ──
document.getElementById('doneBtn').addEventListener('click', () => {
  clearForm();
  closeBooking();
});

function clearForm() {
  // Reset all inputs
  const fields = modalForm.querySelectorAll('input, select, textarea');
  fields.forEach(f => {
    f.value = '';
    f.classList.remove('error-field');
  });
  // Restore form, hide success
  modalForm.style.display = 'block';
  modalSuccess.classList.remove('show');
}

// ── TOAST ──
const toastEl = document.getElementById('toast');
let toastTimer;

function showToast(msg, isError = false) {
  toastEl.textContent = msg;
  toastEl.style.borderLeftColor = isError ? '#c0392b' : 'var(--gold)';
  toastEl.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('show'), 4000);
}

// ── SEARCH ──
document.getElementById('searchBtn').addEventListener('click', () => {
  const dest = document.getElementById('searchDest').value.trim();
  if (!dest) {
    document.getElementById('searchDest').focus();
    return;
  }
  document.getElementById('hotels').scrollIntoView({ behavior: 'smooth' });
  setTimeout(() => showToast(`Showing hotels in ${dest} ✓`), 600);
});

// ── SCROLL REVEAL ──
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ── SET MIN DATE FOR DATE INPUTS ──
window.addEventListener('DOMContentLoaded', () => {
  const today = new Date().toISOString().split('T')[0];
  ['checkinDate','checkoutDate'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.min = today;
  });
  // Also set search date inputs
  ['searchCheckin','searchCheckout'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.min = today;
  });

  // Auto set checkout to checkin + 1 when checkin changes
  const cin  = document.getElementById('checkinDate');
  const cout = document.getElementById('checkoutDate');
  if (cin && cout) {
    cin.addEventListener('change', () => {
      if (cin.value) {
        const next = new Date(cin.value);
        next.setDate(next.getDate() + 1);
        cout.min = next.toISOString().split('T')[0];
        if (!cout.value || cout.value <= cin.value) {
          cout.value = next.toISOString().split('T')[0];
        }
      }
    });
  }
});

// ── SMOOTH SCROLL FOR NAV LINKS ──
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});
