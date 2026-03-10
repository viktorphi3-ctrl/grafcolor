const runWhenIdle = (callback, timeout = 2000) => {
  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(callback, { timeout });
    return;
  }
  window.setTimeout(callback, 200);
};

const initGTM = () => {
  if (window.__gtmLoaded) return;

  const gtmId = document.body?.dataset?.gtmId;
  if (!gtmId) return;

  window.__gtmLoaded = true;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });

  const gtmScript = document.createElement("script");
  gtmScript.async = true;
  gtmScript.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(gtmId)}`;
  document.head.appendChild(gtmScript);
};

const initScrollReveal = () => {
  const revealElements = document.querySelectorAll(".reveal");
  if (!revealElements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("visible");
        observer.unobserve(entry.target);

        entry.target.addEventListener(
          "transitionend",
          () => {
            entry.target.style.willChange = "auto";
            entry.target.style.contain = "none";
          },
          { once: true },
        );
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -50px 0px" },
  );

  revealElements.forEach((el) => observer.observe(el));
};

const initHeaderScroll = () => {
  const header = document.getElementById("main-header");
  if (!header) return;

  let ticking = false;
  let isScrolled = false;

  window.addEventListener(
    "scroll",
    () => {
      if (ticking) return;

      const currentScrollY = window.scrollY;
      window.requestAnimationFrame(() => {
        const shouldBeScrolled = currentScrollY > 50;
        if (shouldBeScrolled !== isScrolled) {
          header.classList.toggle("scrolled", shouldBeScrolled);
          isScrolled = shouldBeScrolled;
        }
        ticking = false;
      });

      ticking = true;
    },
    { passive: true },
  );
};

const initMobileMenu = () => {
  const menuBtn = document.getElementById("menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");
  if (!menuBtn || !mobileMenu) return;

  menuBtn.addEventListener("click", () => {
    mobileMenu.classList.toggle("active");
    menuBtn.classList.toggle("active");
  });

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("active");
      menuBtn.classList.remove("active");
    });
  });
};

const scheduleNonCriticalUI = () => {
  runWhenIdle(initScrollReveal);
  runWhenIdle(initMobileMenu);
};

initHeaderScroll();

["pointerdown", "keydown", "touchstart"].forEach((eventName) => {
  window.addEventListener(eventName, initGTM, { once: true, passive: true });
});

if (document.readyState === "complete") {
  scheduleNonCriticalUI();
} else {
  window.addEventListener("load", scheduleNonCriticalUI, { once: true });
}
