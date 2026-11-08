/* ========================================
   Cookie consent + Google Analytics (shared by every page)
   GA is NOT loaded until the visitor clicks "Accept".
   The choice is stored in localStorage; any element with
   [data-cookie-settings] reopens the banner so it can be changed.
   ======================================== */
(function () {
  'use strict';

  var GA_ID = 'G-WGZ10V9GVH';
  var KEY = 'analyticsConsent'; // 'granted' | 'denied'
  var LEGACY_KEY = 'cookieConsent'; // old notice-only banner, not valid opt-in consent

  // resolve privacy.html next to this script, so it works from 404 pages and file://
  var here = document.currentScript && document.currentScript.src;
  var PRIVACY_URL = here ? new URL('privacy.html', here).href : '/privacy.html';

  function getChoice() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }

  function setChoice(value) {
    try {
      localStorage.setItem(KEY, value);
      localStorage.removeItem(LEGACY_KEY);
    } catch (e) {}
  }

  function loadAnalytics() {
    window['ga-disable-' + GA_ID] = false;
    if (window.__gaLoaded) return;
    window.__gaLoaded = true;

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', GA_ID);

    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
  }

  function stopAnalytics() {
    window['ga-disable-' + GA_ID] = true;
    // delete any _ga cookies already set on this host
    var host = location.hostname;
    document.cookie.split(';').forEach(function (c) {
      var name = c.split('=')[0].trim();
      if (!/^_ga/.test(name)) return;
      ['', host, '.' + host].forEach(function (domain) {
        document.cookie = name + '=; Max-Age=0; path=/' + (domain ? '; domain=' + domain : '');
      });
    });
  }

  function hideBanner() {
    var el = document.getElementById('cookieConsent');
    if (el) el.hidden = true;
  }

  function choose(value) {
    setChoice(value);
    hideBanner();
    if (value === 'granted') loadAnalytics(); else stopAnalytics();
    document.dispatchEvent(new CustomEvent('consentchange', { detail: value }));
  }

  function showBanner(focus) {
    var el = document.getElementById('cookieConsent');
    if (!el) {
      el = document.createElement('div');
      el.id = 'cookieConsent';
      el.className = 'cookie-consent';
      el.setAttribute('role', 'region');
      el.setAttribute('aria-label', 'Cookie consent');
      el.innerHTML =
        '<div class="cookie-content">' +
          '<p>I use Google Analytics cookies to see which projects get viewed — only if you allow it. ' +
          '<a href="' + PRIVACY_URL + '">Privacy policy</a></p>' +
          '<div class="cookie-actions">' +
            '<button type="button" class="btn btn-secondary" data-consent="denied">Decline</button>' +
            '<button type="button" class="btn btn-primary" data-consent="granted">Accept</button>' +
          '</div>' +
        '</div>';
      el.addEventListener('click', function (e) {
        var btn = e.target.closest('[data-consent]');
        if (btn) choose(btn.getAttribute('data-consent'));
      });
      document.body.appendChild(el);
    }
    el.hidden = false;
    if (focus) {
      var first = el.querySelector('[data-consent="granted"]');
      if (first) first.focus();
    }
  }

  // public API (used by privacy.html to show the current choice)
  window.cookieConsent = { get: getChoice, open: showBanner };

  function init() {
    var choice = getChoice();
    if (choice === 'granted') loadAnalytics();
    else if (choice !== 'denied') showBanner(false);

    document.addEventListener('click', function (e) {
      var opener = e.target.closest('[data-cookie-settings]');
      if (!opener) return;
      e.preventDefault();
      showBanner(true);
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
