// Loads GA4 + Microsoft Clarity only when real IDs are configured in js/config.js
(function () {
  const cfg = (window.APP_CONFIG || {}).analytics || {};

  // GA4
  if (cfg.ga4Id && cfg.ga4Id !== 'G-XXXXXXX') {
    const s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + cfg.ga4Id;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function(){ window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', cfg.ga4Id);
  }

  // Microsoft Clarity
  if (cfg.clarityId && cfg.clarityId !== 'xxxxxxxxxx') {
    (function(c,l,a,r,i,t,y){
      c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
      t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
      y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", cfg.clarityId);
  }
})();
