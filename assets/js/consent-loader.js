(function () {
  "use strict";

  var CONSENT_PROVIDER = "secretandsafe";
  var LEGACY_CONSENT_SRC = "/assets/js/consent.js?v=20260523-1";
  var SECRET_AND_SAFE_SRC = "https://cdn.secretandsafe.com/consent.js";
  var SECRET_AND_SAFE_SITE_ID = "pirrottaconsulting";

  function hideLegacyPreferenceControls() {
    document.querySelectorAll("[data-cookie-preferences]").forEach(function (control) {
      control.hidden = true;
    });
  }

  function loadScript(src, attributes) {
    var script = document.createElement("script");
    script.src = src;

    Object.keys(attributes || {}).forEach(function (key) {
      var value = attributes[key];
      if (value === true) {
        script.setAttribute(key, "");
      } else {
        script.setAttribute(key, value);
      }
    });

    document.head.appendChild(script);
  }

  if (CONSENT_PROVIDER === "legacy") {
    loadScript(LEGACY_CONSENT_SRC, { defer: true });
    return;
  }

  hideLegacyPreferenceControls();

  if (CONSENT_PROVIDER === "secretandsafe") {
    loadScript(SECRET_AND_SAFE_SRC, {
      "data-site-id": SECRET_AND_SAFE_SITE_ID,
      async: true
    });
  }
})();
