/**
 * FOSSEE Workshop Booking — UI Enhancement Script
 * Vanilla JavaScript — no dependencies
 * Handles: nav drawer, toasts, floating labels, form validation,
 *          scroll behaviors, tabs, password toggle, dropdowns
 */

(function () {
  'use strict';

  /* -------------------------------------------------------
     1. MOBILE NAV DRAWER
     ------------------------------------------------------- */
  function initMobileDrawer() {
    const hamburger = document.getElementById('hamburger');
    const drawer = document.getElementById('mobileDrawer');
    const closeBtn = document.getElementById('drawerClose');
    if (!hamburger || !drawer) return;

    let focusableEls, firstFocusable, lastFocusable;

    function openDrawer() {
      drawer.classList.add('open');
      hamburger.classList.add('active');
      hamburger.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';

      // Focus trap
      focusableEls = drawer.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])');
      firstFocusable = focusableEls[0];
      lastFocusable = focusableEls[focusableEls.length - 1];
      if (closeBtn) closeBtn.focus();
    }

    function closeDrawer() {
      drawer.classList.remove('open');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      hamburger.focus();
    }

    hamburger.addEventListener('click', function () {
      if (drawer.classList.contains('open')) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', closeDrawer);
    }

    // ESC key closes drawer
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && drawer.classList.contains('open')) {
        closeDrawer();
      }

      // Tab trap inside drawer
      if (e.key === 'Tab' && drawer.classList.contains('open')) {
        if (e.shiftKey) {
          if (document.activeElement === firstFocusable) {
            e.preventDefault();
            lastFocusable.focus();
          }
        } else {
          if (document.activeElement === lastFocusable) {
            e.preventDefault();
            firstFocusable.focus();
          }
        }
      }
    });

    // Close drawer on link click
    drawer.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeDrawer);
    });
  }


  /* -------------------------------------------------------
     2. STICKY NAV SHADOW
     ------------------------------------------------------- */
  function initNavScroll() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    function onScroll() {
      if (window.scrollY > 40) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // Initial check
  }


  /* -------------------------------------------------------
     3. USER DROPDOWN
     ------------------------------------------------------- */
  function initUserDropdown() {
    const dropdown = document.querySelector('.user-dropdown');
    if (!dropdown) return;
    const trigger = dropdown.querySelector('.user-dropdown-trigger');

    trigger.addEventListener('click', function (e) {
      e.stopPropagation();
      dropdown.classList.toggle('open');
    });

    document.addEventListener('click', function (e) {
      if (!dropdown.contains(e.target)) {
        dropdown.classList.remove('open');
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        dropdown.classList.remove('open');
      }
    });
  }


  /* -------------------------------------------------------
     4. TOAST NOTIFICATIONS
     ------------------------------------------------------- */
  window.FosseeToast = {
    show: function (message, type) {
      type = type || 'info';
      var container = document.getElementById('toastContainer');
      if (!container) return;

      var icons = {
        success: '<svg class="toast-icon" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="10" fill="rgba(29,185,84,0.12)"/><path d="M6 10l3 3 5-6" stroke="#1DB954" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
        error: '<svg class="toast-icon" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="10" fill="rgba(217,48,37,0.1)"/><path d="M7 7l6 6M13 7l-6 6" stroke="#D93025" stroke-width="2" stroke-linecap="round"/></svg>',
        warning: '<svg class="toast-icon" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="10" fill="rgba(229,161,0,0.12)"/><path d="M10 6v5M10 13v1" stroke="#E5A100" stroke-width="2" stroke-linecap="round"/></svg>',
        info: '<svg class="toast-icon" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="10" fill="rgba(26,115,232,0.1)"/><path d="M10 9v5M10 6v1" stroke="#1A73E8" stroke-width="2" stroke-linecap="round"/></svg>'
      };

      var toast = document.createElement('div');
      toast.className = 'toast toast-' + type;
      toast.setAttribute('role', 'alert');
      toast.setAttribute('aria-live', 'polite');
      toast.innerHTML =
        (icons[type] || icons.info) +
        '<span class="toast-content">' + message + '</span>' +
        '<button class="toast-close" aria-label="Dismiss notification">&times;</button>';

      container.appendChild(toast);

      var closeBtn = toast.querySelector('.toast-close');
      closeBtn.addEventListener('click', function () {
        dismissToast(toast);
      });

      // Auto dismiss after 5 seconds
      setTimeout(function () {
        dismissToast(toast);
      }, 5000);
    }
  };

  function dismissToast(toast) {
    if (!toast || toast.classList.contains('dismissing')) return;
    toast.classList.add('dismissing');
    setTimeout(function () {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 200);
  }


  /* -------------------------------------------------------
     5. FLOATING LABELS
     ------------------------------------------------------- */
  function initFloatingLabels() {
    document.querySelectorAll('.floating-label-group').forEach(function (group) {
      var input = group.querySelector('.fossee-input, .fossee-select, .fossee-textarea');
      var label = group.querySelector('.floating-label');
      if (!input || !label) return;

      function checkValue() {
        if (input.value && input.value !== '') {
          input.classList.add('has-value');
        } else {
          input.classList.remove('has-value');
        }
      }

      input.addEventListener('focus', checkValue);
      input.addEventListener('blur', checkValue);
      input.addEventListener('change', checkValue);
      input.addEventListener('input', checkValue);

      // Initial check
      checkValue();
    });
  }


  /* -------------------------------------------------------
     6. FORM VALIDATION (Inline, on blur)
     ------------------------------------------------------- */
  function initFormValidation() {
    document.querySelectorAll('[data-validate]').forEach(function (input) {
      input.addEventListener('blur', function () {
        validateField(input);
      });
    });

    // On form submit, validate all
    document.querySelectorAll('form[data-validate-form]').forEach(function (form) {
      form.addEventListener('submit', function (e) {
        var isValid = true;
        form.querySelectorAll('[data-validate]').forEach(function (input) {
          if (!validateField(input)) {
            isValid = false;
          }
        });
        if (!isValid) {
          e.preventDefault();
          // Shake the form
          form.classList.add('shake');
          setTimeout(function () {
            form.classList.remove('shake');
          }, 400);
        }
      });
    });
  }

  function validateField(input) {
    var type = input.getAttribute('data-validate');
    var value = input.value.trim();
    var errorEl = document.getElementById(input.id + '_error');
    var isValid = true;
    var message = '';

    switch (type) {
      case 'required':
        if (!value) {
          isValid = false;
          message = 'This field is required';
        }
        break;
      case 'email':
        if (!value) {
          isValid = false;
          message = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          isValid = false;
          message = 'Enter a valid email address';
        }
        break;
      case 'phone':
        if (!value) {
          isValid = false;
          message = 'Phone number is required';
        } else if (!/^\d{10}$/.test(value)) {
          isValid = false;
          message = 'Phone number must be exactly 10 digits';
        }
        break;
      case 'password':
        if (!value) {
          isValid = false;
          message = 'Password is required';
        } else if (value.length < 4) {
          isValid = false;
          message = 'Password must be at least 4 characters';
        }
        break;
      case 'confirm-password':
        var passwordInput = document.getElementById(input.getAttribute('data-match'));
        if (passwordInput && value !== passwordInput.value) {
          isValid = false;
          message = 'Passwords do not match';
        }
        break;
    }

    // Update UI
    if (errorEl) {
      if (isValid) {
        errorEl.classList.remove('visible');
        errorEl.textContent = '';
        input.classList.remove('error');
        if (value) input.classList.add('success');
      } else {
        errorEl.classList.add('visible');
        errorEl.textContent = message;
        input.classList.add('error');
        input.classList.remove('success');
      }
    }

    return isValid;
  }


  /* -------------------------------------------------------
     7. PASSWORD TOGGLE
     ------------------------------------------------------- */
  function initPasswordToggles() {
    document.querySelectorAll('.password-toggle').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var input = btn.parentElement.querySelector('input');
        if (!input) return;

        if (input.type === 'password') {
          input.type = 'text';
          btn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>';
          btn.setAttribute('aria-label', 'Hide password');
        } else {
          input.type = 'password';
          btn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>';
          btn.setAttribute('aria-label', 'Show password');
        }
      });
    });
  }


  /* -------------------------------------------------------
     8. PASSWORD STRENGTH INDICATOR
     ------------------------------------------------------- */
  function initPasswordStrength() {
    var pwInput = document.getElementById('id_password');
    var strengthEl = document.querySelector('.password-strength');
    if (!pwInput || !strengthEl) return;

    pwInput.addEventListener('input', function () {
      var val = pwInput.value;
      var score = 0;

      if (val.length >= 6) score++;
      if (val.length >= 10) score++;
      if (/[A-Z]/.test(val) && /[a-z]/.test(val)) score++;
      if (/\d/.test(val)) score++;
      if (/[^A-Za-z0-9]/.test(val)) score++;

      strengthEl.classList.remove('weak', 'medium', 'strong');
      if (val.length === 0) return;
      if (score <= 2) strengthEl.classList.add('weak');
      else if (score <= 3) strengthEl.classList.add('medium');
      else strengthEl.classList.add('strong');
    });
  }


  /* -------------------------------------------------------
     9. TABS
     ------------------------------------------------------- */
  function initTabs() {
    document.querySelectorAll('.tabs').forEach(function (tabBar) {
      var tabs = tabBar.querySelectorAll('.tab');
      var container = tabBar.parentElement;

      tabs.forEach(function (tab) {
        tab.addEventListener('click', function () {
          // Deactivate all
          tabs.forEach(function (t) { t.classList.remove('active'); });
          container.querySelectorAll('.tab-panel').forEach(function (p) {
            p.classList.remove('active');
          });

          // Activate clicked
          tab.classList.add('active');
          var target = container.querySelector('#' + tab.getAttribute('data-tab'));
          if (target) target.classList.add('active');
        });
      });
    });
  }


  /* -------------------------------------------------------
     10. MODAL HANDLING
     ------------------------------------------------------- */
  function initModals() {
    document.querySelectorAll('[data-modal-open]').forEach(function (trigger) {
      trigger.addEventListener('click', function (e) {
        e.preventDefault();
        var modalId = trigger.getAttribute('data-modal-open');
        var overlay = document.getElementById(modalId);
        if (overlay) {
          overlay.classList.add('open');
          document.body.style.overflow = 'hidden';
          // Focus first focusable element
          var first = overlay.querySelector('button, input, a, [tabindex]:not([tabindex="-1"])');
          if (first) first.focus();
        }
      });
    });

    document.querySelectorAll('.modal-overlay').forEach(function (overlay) {
      // Close on backdrop click
      overlay.addEventListener('click', function (e) {
        if (e.target === overlay) {
          closeModal(overlay);
        }
      });

      // Close button
      overlay.querySelectorAll('.modal-close').forEach(function (btn) {
        btn.addEventListener('click', function () {
          closeModal(overlay);
        });
      });
    });

    // ESC closes modals
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.open').forEach(function (overlay) {
          closeModal(overlay);
        });
      }
    });
  }

  function closeModal(overlay) {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }


  /* -------------------------------------------------------
     11. ALERT DISMISS
     ------------------------------------------------------- */
  function initAlertDismiss() {
    document.querySelectorAll('.alert-close').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var alert = btn.closest('.alert');
        if (alert) {
          alert.style.opacity = '0';
          alert.style.transform = 'translateY(-8px)';
          setTimeout(function () {
            alert.remove();
          }, 200);
        }
      });
    });
  }


  /* -------------------------------------------------------
     12. AUTOFOCUS
     ------------------------------------------------------- */
  function initAutofocus() {
    var el = document.querySelector('[data-autofocus]');
    if (el) {
      setTimeout(function () { el.focus(); }, 100);
    }
  }


  /* -------------------------------------------------------
     13. DATE INPUT ENHANCEMENT
     ------------------------------------------------------- */
  function initDateInputs() {
    // Set min date to 3 days from now for workshop proposal date
    var dateInputs = document.querySelectorAll('input[type="date"][data-min-future]');
    dateInputs.forEach(function (input) {
      var days = parseInt(input.getAttribute('data-min-future')) || 3;
      var min = new Date();
      min.setDate(min.getDate() + days);
      input.min = min.toISOString().split('T')[0];

      var maxDays = parseInt(input.getAttribute('data-max-future')) || 365;
      var max = new Date();
      max.setDate(max.getDate() + maxDays);
      input.max = max.toISOString().split('T')[0];
    });
  }


  /* -------------------------------------------------------
     INITIALIZE ALL
     ------------------------------------------------------- */
  function init() {
    initMobileDrawer();
    initNavScroll();
    initUserDropdown();
    initFloatingLabels();
    initFormValidation();
    initPasswordToggles();
    initPasswordStrength();
    initTabs();
    initModals();
    initAlertDismiss();
    initAutofocus();
    initDateInputs();
  }

  // Run on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
