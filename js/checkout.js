// ============================================================
// Razorpay checkout flow (primary payment gateway)
// 1. Buy click → POST /api/create-order  (server creates Razorpay Order
//    using server-side prices — client never controls the amount)
// 2. Razorpay Checkout modal opens (UPI / cards / netbanking / wallets)
// 3. On success → POST /api/verify-payment (server verifies signature)
// 4. Redirect to success.html which shows download links on-page;
//    delivery email is also sent (both channels).
// ============================================================
(function () {
  let rzpScriptPromise = null;

  function loadRazorpayScript() {
    if (window.Razorpay) return Promise.resolve();
    if (rzpScriptPromise) return rzpScriptPromise;
    rzpScriptPromise = new Promise(function (resolve, reject) {
      const s = document.createElement('script');
      s.src = 'https://checkout.razorpay.com/v1/checkout.js';
      s.onload = resolve;
      s.onerror = function () { reject(new Error('Could not load payment library')); };
      document.head.appendChild(s);
    });
    return rzpScriptPromise;
  }

  function setBtnState(btn, text, disabled) {
    btn.dataset.originalText = btn.dataset.originalText || btn.textContent;
    btn.textContent = text || btn.dataset.originalText;
    btn.disabled = !!disabled;
    btn.style.opacity = disabled ? '.7' : '';
  }

  // Lightweight email-capture modal shown before Razorpay opens.
  // We need the email server-side so the download link can ALSO be emailed.
  function askEmail(productName) {
    return new Promise(function (resolve) {
      const overlay = document.createElement('div');
      overlay.id = 'fos-email-modal';
      overlay.innerHTML =
        '<div class="fos-email-box">' +
        '  <h3>Where should we send your download?</h3>' +
        '  <p>' + productName + ' — the download link appears on-screen after payment <em>and</em> lands in your inbox.</p>' +
        '  <form id="fos-email-form">' +
        '    <input type="email" id="fos-email-input" placeholder="you@example.com" required autocomplete="email">' +
        '    <button type="submit">Continue to secure payment →</button>' +
        '  </form>' +
        '  <button type="button" class="fos-email-cancel" id="fos-email-cancel">Cancel</button>' +
        '</div>';
      document.body.appendChild(overlay);
      const input = overlay.querySelector('#fos-email-input');
      setTimeout(function () { input.focus(); }, 50);

      function close(val) {
        overlay.remove();
        resolve(val);
      }
      overlay.querySelector('#fos-email-form').addEventListener('submit', function (ev) {
        ev.preventDefault();
        const v = input.value.trim();
        if (v && v.indexOf('@') > 0) close(v);
      });
      overlay.querySelector('#fos-email-cancel').addEventListener('click', function () { close(null); });
      overlay.addEventListener('click', function (ev) { if (ev.target === overlay) close(null); });
    });
  }

  async function startCheckout(btn, slug) {
    const cfg = window.APP_CONFIG || {};
    const product = cfg.products && cfg.products[slug];
    if (!product) return;

    const email = await askEmail(product.name);
    if (!email) return; // user cancelled

    setBtnState(btn, 'Opening secure checkout…', true);

    try {
      // Load Razorpay SDK + create the order in parallel
      const results = await Promise.all([
        loadRazorpayScript(),
        fetch('/api/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ slug: slug })
        })
      ]);
      const orderRes = results[1];
      const order = await orderRes.json();
      if (!orderRes.ok || !order.orderId) {
        throw new Error(order.error || 'Checkout unavailable right now.');
      }

      // GA4: begin_checkout
      if (window.gtag) {
        window.gtag('event', 'begin_checkout', {
          currency: 'INR',
          value: order.amount / 100,
          items: [{ item_id: slug, item_name: order.name, price: order.amount / 100, quantity: 1 }]
        });
      }

      const rzp = new window.Razorpay({
        key: order.keyId,
        order_id: order.orderId,
        amount: order.amount,
        currency: 'INR',
        name: cfg.siteName || 'Freelancer OS',
        description: order.name,
        notes: { slug: slug },
        prefill: { email: email },
        theme: { color: '#6d5dfc' },
        modal: {
          ondismiss: function () { setBtnState(btn, null, false); }
        },
        handler: function (response) {
          verifyAndDeliver(btn, slug, email, response);
        }
      });

      rzp.on('payment.failed', function (resp) {
        setBtnState(btn, null, false);
        const reason = (resp && resp.error && resp.error.description) || 'Payment failed';
        alert(reason + '\n\nNo money was deducted if the payment failed. You can try again.');
      });

      rzp.open();
      setBtnState(btn, null, false);
    } catch (err) {
      setBtnState(btn, null, false);
      alert((err && err.message) || 'Something went wrong. Please try again or email ' + ((window.APP_CONFIG || {}).contactEmail || 'support'));
    }
  }

  async function verifyAndDeliver(btn, slug, email, rzpResponse) {
    setBtnState(btn, 'Verifying payment…', true);

    // verify-payment covers on-page delivery; the webhook covers email
    // delivery using the email entered in the Razorpay checkout form.
    let result = null;
    try {
      const res = await fetch('/api/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          razorpay_order_id: rzpResponse.razorpay_order_id,
          razorpay_payment_id: rzpResponse.razorpay_payment_id,
          razorpay_signature: rzpResponse.razorpay_signature,
          slug: slug,
          email: email
        })
      });
      result = await res.json();
    } catch (_) { /* network hiccup — webhook still delivers via email */ }

    // GA4: purchase
    if (window.gtag && result && result.ok) {
      const cfg = window.APP_CONFIG || {};
      const p = cfg.products && cfg.products[slug];
      window.gtag('event', 'purchase', {
        transaction_id: result.paymentId,
        currency: 'INR',
        value: p ? p.price : 0,
        items: [{ item_id: slug, item_name: result.product, price: p ? p.price : 0, quantity: 1 }]
      });
    }

    // Stash delivery payload for the success page, then redirect
    try {
      sessionStorage.setItem('fos_delivery', JSON.stringify({
        slug: slug,
        email: email,
        result: result || { ok: false },
        paymentId: rzpResponse.razorpay_payment_id,
        ts: Date.now()
      }));
    } catch (_) {}

    const base = location.pathname.indexOf('/products/') !== -1 ? '../' : '';
    location.href = base + 'success.html?pid=' + encodeURIComponent(rzpResponse.razorpay_payment_id);
  }

  document.addEventListener('click', function (e) {
    const btn = e.target.closest('.buy-btn[data-slug]');
    if (!btn) return;
    e.preventDefault();
    startCheckout(btn, btn.getAttribute('data-slug'));
  });
})();
