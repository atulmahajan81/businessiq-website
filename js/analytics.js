/**
 * BusinessIQ.co.in — Analytics & cookie consent
 * © 2026 BusinessIQ.co.in. All Rights Reserved.
 *
 * Cloudflare Web Analytics is cookieless, so it loads for everyone.
 * GA4 sets cookies, so it loads only after the visitor opts in.
 */

// ── Fill these in to activate ──
const ANALYTICS = {
  cloudflareToken: '',   // Cloudflare dashboard → Web Analytics → JS snippet token
  ga4MeasurementId: '',  // Google Analytics → Admin → Data Streams → G-XXXXXXXXXX
};

const CONSENT_KEY = 'biq_consent';

function readConsent() {
  try {
    const v = localStorage.getItem(CONSENT_KEY);
    if (v === 'granted' || v === 'denied') return v;
    // Visitors who accepted under the previous banner keep that choice.
    if (localStorage.getItem('biq_cookie_accepted') === '1') return 'granted';
  } catch (e) {}
  return null;
}

function saveConsent(value) {
  try { localStorage.setItem(CONSENT_KEY, value); } catch (e) {}
}

function loadCloudflare() {
  if (!ANALYTICS.cloudflareToken) return;
  const s = document.createElement('script');
  s.defer = true;
  s.src = 'https://static.cloudflareinsights.com/beacon.min.js';
  s.setAttribute('data-cf-beacon', JSON.stringify({ token: ANALYTICS.cloudflareToken }));
  document.head.appendChild(s);
}

let ga4Loaded = false;
function loadGA4() {
  if (ga4Loaded || !ANALYTICS.ga4MeasurementId) return;
  ga4Loaded = true;

  const s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + ANALYTICS.ga4MeasurementId;
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', ANALYTICS.ga4MeasurementId, { anonymize_ip: true });
}

function buildBanner() {
  const bar = document.createElement('div');
  bar.className = 'cookie-banner';
  bar.id = 'cookieBanner';
  bar.setAttribute('role', 'dialog');
  bar.setAttribute('aria-label', 'Cookie consent');
  bar.innerHTML =
    '<p>We use cookies to understand how visitors use the site. Analytics cookies are optional ' +
    '— the site works either way. See our <a href="privacy.html">Privacy Policy</a>.</p>' +
    '<div class="cookie-actions">' +
    '<button class="cookie-btn cookie-btn-ghost" id="declineCookies">Decline</button>' +
    '<button class="cookie-btn" id="acceptCookies">Accept</button>' +
    '</div>';
  document.body.appendChild(bar);

  const close = (choice) => {
    saveConsent(choice);
    bar.classList.add('hidden');
    if (choice === 'granted') loadGA4();
  };
  bar.querySelector('#acceptCookies').addEventListener('click', () => close('granted'));
  bar.querySelector('#declineCookies').addEventListener('click', () => close('denied'));
}

loadCloudflare();

const consent = readConsent();
if (consent === 'granted') {
  loadGA4();
} else if (consent === null) {
  buildBanner();
}
