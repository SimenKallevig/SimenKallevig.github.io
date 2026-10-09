(function () {
  var body = document.body;
  var menu = document.getElementById("mobileMenu");
  var button = document.querySelector(".menu-button");
  var themeStorageKey = "kalltech-theme";
  var isWarmPage = body.classList.contains("warm-theme-page");
  var currentTheme = isWarmPage ? "warm" : "cool";
  var previousTheme = sessionStorage.getItem(themeStorageKey);
  var themeDuration = getComputedStyle(document.documentElement).getPropertyValue("--theme-transition-duration").trim() || "2200ms";
  var themeDurationMs = parseTimeToMs(themeDuration);
  var pageFadeDuration = getComputedStyle(document.documentElement).getPropertyValue("--page-fade-duration").trim() || "850ms";
  var pageFadeDurationMs = parseTimeToMs(pageFadeDuration);
  var headlinrGooglePlayUrl = "https://play.google.com/store/apps/details?id=no.kalltech.headlinr";
  var headlinrGooglePlayIntentUrl = "intent://details?id=no.kalltech.headlinr#Intent;scheme=market;package=com.android.vending;S.browser_fallback_url=https%3A%2F%2Fplay.google.com%2Fstore%2Fapps%2Fdetails%3Fid%3Dno.kalltech.headlinr;end";

  function parseTimeToMs(value) {
    if (!value) return 2200;
    if (value.endsWith("ms")) return parseFloat(value);
    if (value.endsWith("s")) return parseFloat(value) * 1000;
    return parseFloat(value) || 2200;
  }

  function isHeadlinrLandingPage() {
    var path = window.location.pathname.replace(/\/+$/, "") || "/";
    return path === "/headlinr" || path === "/headlinr/index.html";
  }

  if (isHeadlinrLandingPage() && /Android/i.test(navigator.userAgent || "")) {
    document.querySelectorAll('a[href="' + headlinrGooglePlayUrl + '"]').forEach(function (link) {
      link.href = headlinrGooglePlayIntentUrl;
    });
  }

  if (menu && button) {
    window.toggleMenu = function toggleMenu() {
      menu.classList.toggle("open");
    };

    document.addEventListener("click", function (event) {
      if (!menu.contains(event.target) && !button.contains(event.target)) {
        menu.classList.remove("open");
      }
    });
  }

  if (isWarmPage) {
    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(function () {
        body.classList.add("warm-theme-active");
      });
    });
  } else {
    body.classList.add("page-pre-enter");
    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(function () {
        body.classList.add("page-transition-enter");
        body.classList.remove("page-pre-enter");
      });
    });
  }

  sessionStorage.setItem(themeStorageKey, currentTheme);

  document.querySelectorAll('a[href$=".html"]').forEach(function (link) {
    link.addEventListener("click", function (event) {
      var href = link.getAttribute("href");

      if (!href || link.target === "_blank" || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      event.preventDefault();

      if (isWarmPage) {
        body.classList.add("warm-theme-exit");
        body.classList.remove("warm-theme-active");
      }

      body.classList.add("page-is-leaving");
      body.classList.add("page-transition-exit");

      window.setTimeout(function () {
        window.location.href = href;
      }, isWarmPage ? themeDurationMs : pageFadeDurationMs);
    });
  });
})();
