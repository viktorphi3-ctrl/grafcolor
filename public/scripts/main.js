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

const initContactForm = () => {
  const form = document.getElementById("contact-form");
  const success = document.getElementById("form-success");
  if (!form || !success || form.dataset.initialized === "true") return;

  form.dataset.initialized = "true";
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const nome = formData.get("nome");
    const whatsapp = formData.get("whatsapp");
    const assunto = formData.get("assunto") || "Orcamento";
    const mensagem = formData.get("mensagem") || "";

    const waMsg = `Ola! Sou ${nome}.\n\nAssunto: ${assunto}\nTelefone: ${whatsapp}\n\n${mensagem}`.trim();
    const waUrl = `https://wa.me/5527997276504?text=${encodeURIComponent(waMsg)}`;

    form.classList.add("hidden");
    success.classList.remove("hidden");

    window.setTimeout(() => {
      window.open(waUrl, "_blank");
    }, 1000);
  });
};

const scheduleNonCriticalUI = () => {
  runWhenIdle(initScrollReveal);
  runWhenIdle(initMobileMenu);
  runWhenIdle(initContactForm, 3000);
};

let gtmScheduled = false;

const scheduleGTM = () => {
  if (gtmScheduled) return;
  gtmScheduled = true;
  runWhenIdle(initGTM, 6000);
};

initHeaderScroll();

["pointerdown", "touchstart", "scroll"].forEach((eventName) => {
  window.addEventListener(eventName, scheduleGTM, { once: true, passive: true });
});

if (document.readyState === "complete") {
  window.setTimeout(scheduleGTM, 1500);
} else {
  window.addEventListener(
    "load",
    () => {
      window.setTimeout(scheduleGTM, 1500);
    },
    { once: true },
  );
}

if (document.readyState === "complete") {
  scheduleNonCriticalUI();
} else {
  window.addEventListener("load", scheduleNonCriticalUI, { once: true });
}
