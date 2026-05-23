(function () {
  "use strict";

  var GA_MEASUREMENT_ID = "G-KDJXESC3DF";
  var CONSENT_KEY = "pirrotta_cookie_consent";
  var CONSENT_VERSION = "2026-05-20-ga4";
  var analyticsLoaded = false;
  var preferencesPanel = null;
  var banner = null;
  var lastActiveElement = null;

  function hasGlobalPrivacyControl() {
    return navigator.globalPrivacyControl === true;
  }

  function getConsent() {
    try {
      var stored = localStorage.getItem(CONSENT_KEY);
      if (!stored) return null;
      var parsed = JSON.parse(stored);
      if (parsed.version !== CONSENT_VERSION) return null;
      return parsed;
    } catch (error) {
      return null;
    }
  }

  function saveConsent(analyticsEnabled) {
    var consent = {
      version: CONSENT_VERSION,
      updatedAt: new Date().toISOString(),
      categories: {
        essential: true,
        analytics: Boolean(analyticsEnabled)
      }
    };

    localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));

    if (analyticsEnabled) {
      enableAnalytics();
    } else {
      disableAnalytics();
    }

    hideBanner();
    closePreferences();
  }

  function deleteCookie(name) {
    var domains = [
      window.location.hostname,
      "." + window.location.hostname,
      ".pirrottaconsulting.com",
      "pirrottaconsulting.com"
    ];
    var paths = ["/"];

    domains.forEach(function (domain) {
      paths.forEach(function (path) {
        document.cookie = name + "=; Max-Age=0; path=" + path + "; domain=" + domain + "; SameSite=Lax";
        document.cookie = name + "=; Max-Age=0; path=" + path + "; domain=" + domain + "; SameSite=Lax; Secure";
      });
    });

    document.cookie = name + "=; Max-Age=0; path=/; SameSite=Lax";
    document.cookie = name + "=; Max-Age=0; path=/; SameSite=Lax; Secure";
  }

  function clearAnalyticsCookies() {
    [
      "_ga",
      "_ga_KDJXESC3DF",
      "_gid",
      "_gat",
      "_gat_gtag_G_KDJXESC3DF"
    ].forEach(deleteCookie);
  }

  function disableAnalytics() {
    window["ga-disable-" + GA_MEASUREMENT_ID] = true;

    if (typeof window.gtag === "function") {
      window.gtag("consent", "update", {
        analytics_storage: "denied",
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied"
      });
    }

    clearAnalyticsCookies();
  }

  function enableAnalytics() {
    if (analyticsLoaded) {
      window["ga-disable-" + GA_MEASUREMENT_ID] = false;
      if (typeof window.gtag === "function") {
        window.gtag("consent", "update", {
          analytics_storage: "granted",
          ad_storage: "denied",
          ad_user_data: "denied",
          ad_personalization: "denied"
        });
      }
      return;
    }

    window["ga-disable-" + GA_MEASUREMENT_ID] = false;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
      window.dataLayer.push(arguments);
    };

    window.gtag("consent", "default", {
      analytics_storage: "granted",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      functionality_storage: "granted",
      security_storage: "granted"
    });
    window.gtag("js", new Date());
    window.gtag("config", GA_MEASUREMENT_ID, {
      anonymize_ip: true,
      send_page_view: true
    });

    var script = document.createElement("script");
    script.async = true;
    script.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(GA_MEASUREMENT_ID);
    script.dataset.analyticsScript = "ga4";
    document.head.appendChild(script);
    analyticsLoaded = true;
  }

  function makeButton(text, className, action) {
    var button = document.createElement("button");
    button.type = "button";
    button.className = className;
    button.textContent = text;
    button.addEventListener("click", action);
    return button;
  }

  function hideBanner() {
    if (banner) {
      banner.hidden = true;
    }
  }

  function showBanner() {
    if (banner) {
      banner.hidden = false;
      return;
    }

    banner = document.createElement("section");
    banner.className = "cookie-consent";
    banner.setAttribute("aria-labelledby", "cookie-consent-title");
    banner.setAttribute("aria-describedby", "cookie-consent-description");

    var card = document.createElement("div");
    card.className = "cookie-card";

    var title = document.createElement("h2");
    title.id = "cookie-consent-title";
    title.textContent = "Cookie preferences";

    var description = document.createElement("p");
    description.id = "cookie-consent-description";
    description.textContent = "We use essential site functions. With your permission, we also use Google Analytics to understand site traffic and improve the experience.";

    if (hasGlobalPrivacyControl()) {
      var gpc = document.createElement("p");
      gpc.className = "cookie-note";
      gpc.textContent = "Your browser privacy signal is on, so analytics stays off unless you choose to enable it.";
      card.appendChild(title);
      card.appendChild(description);
      card.appendChild(gpc);
    } else {
      card.appendChild(title);
      card.appendChild(description);
    }

    var actions = document.createElement("div");
    actions.className = "cookie-actions";
    actions.appendChild(makeButton("Reject analytics", "cookie-button cookie-button--secondary", function () {
      saveConsent(false);
    }));
    actions.appendChild(makeButton("Customize", "cookie-button cookie-button--quiet", openPreferences));
    actions.appendChild(makeButton("Accept analytics", "cookie-button cookie-button--primary", function () {
      saveConsent(true);
    }));

    card.appendChild(actions);
    banner.appendChild(card);
    document.body.appendChild(banner);
  }

  function buildPreferences() {
    preferencesPanel = document.createElement("div");
    preferencesPanel.className = "cookie-preferences";
    preferencesPanel.hidden = true;
    preferencesPanel.setAttribute("role", "dialog");
    preferencesPanel.setAttribute("aria-modal", "true");
    preferencesPanel.setAttribute("aria-labelledby", "cookie-preferences-title");

    var consent = getConsent();
    var analyticsEnabled = consent ? Boolean(consent.categories.analytics) : false;

    var panel = document.createElement("div");
    panel.className = "cookie-modal";

    var title = document.createElement("h2");
    title.id = "cookie-preferences-title";
    title.textContent = "Cookie preferences";

    var intro = document.createElement("p");
    intro.textContent = "Manage how Pirrotta Consulting uses optional analytics on this website.";

    var essential = document.createElement("div");
    essential.className = "cookie-choice";
    essential.innerHTML = "<div><strong>Essential</strong><span>Required for core site behavior, security, forms, and accessibility.</span></div><span class=\"cookie-required\">Always on</span>";

    var analyticsLabel = document.createElement("label");
    analyticsLabel.className = "cookie-choice cookie-choice--toggle";

    var analyticsText = document.createElement("span");
    analyticsText.innerHTML = "<strong>Google Analytics</strong><span>Helps understand page visits and site engagement. Loaded only when enabled.</span>";

    var analyticsToggle = document.createElement("input");
    analyticsToggle.type = "checkbox";
    analyticsToggle.checked = analyticsEnabled;
    analyticsToggle.setAttribute("data-cookie-analytics-toggle", "");

    analyticsLabel.appendChild(analyticsText);
    analyticsLabel.appendChild(analyticsToggle);

    var actions = document.createElement("div");
    actions.className = "cookie-actions cookie-actions--modal";
    actions.appendChild(makeButton("Reject analytics", "cookie-button cookie-button--secondary", function () {
      saveConsent(false);
    }));
    actions.appendChild(makeButton("Save choices", "cookie-button cookie-button--primary", function () {
      saveConsent(analyticsToggle.checked);
    }));
    actions.appendChild(makeButton("Accept analytics", "cookie-button cookie-button--quiet", function () {
      analyticsToggle.checked = true;
      saveConsent(true);
    }));

    panel.appendChild(title);
    panel.appendChild(intro);
    panel.appendChild(essential);
    panel.appendChild(analyticsLabel);
    panel.appendChild(actions);
    preferencesPanel.appendChild(panel);

    preferencesPanel.addEventListener("click", function (event) {
      if (event.target === preferencesPanel) {
        closePreferences();
      }
    });

    document.body.appendChild(preferencesPanel);
  }

  function openPreferences(event) {
    if (event && typeof event.preventDefault === "function") {
      event.preventDefault();
    }

    if (!preferencesPanel) {
      buildPreferences();
    }

    var consent = getConsent();
    var toggle = preferencesPanel.querySelector("[data-cookie-analytics-toggle]");
    if (toggle && consent) {
      toggle.checked = Boolean(consent.categories.analytics);
    }

    lastActiveElement = document.activeElement;
    preferencesPanel.hidden = false;
    document.body.classList.add("dialog-open");

    var firstButton = preferencesPanel.querySelector("button");
    if (firstButton) {
      firstButton.focus();
    }
  }

  function closePreferences() {
    if (!preferencesPanel || preferencesPanel.hidden) return;

    preferencesPanel.hidden = true;
    document.body.classList.remove("dialog-open");

    if (lastActiveElement && typeof lastActiveElement.focus === "function") {
      lastActiveElement.focus();
    }
  }

  function bindPreferenceLinks() {
    document.querySelectorAll("[data-cookie-preferences]").forEach(function (button) {
      button.addEventListener("click", openPreferences);
    });
  }

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closePreferences();
    }
  });

  function initConsent() {
    bindPreferenceLinks();

    var consent = getConsent();
    if (consent) {
      if (consent.categories.analytics) {
        enableAnalytics();
      } else {
        disableAnalytics();
      }
      return;
    }

    disableAnalytics();
    showBanner();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initConsent);
  } else {
    initConsent();
  }
})();
