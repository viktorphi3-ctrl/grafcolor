const runWhenIdle = (callback, timeout = 2000) => {
  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(callback, { timeout });
    return;
  }
  window.setTimeout(callback, 200);
};

const pushDataLayerEvent = (eventName, params = {}) => {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: eventName, ...params });
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

    if (typeof window.__loadGTM === "function") {
      window.__loadGTM("contact_form_submit");
    }

    pushDataLayerEvent("whatsapp_click", {
      event_category: "lead",
      event_label: "contact_form",
      link_text: "form_submit",
      link_url: waUrl,
      page_path: window.location.pathname,
    });

    window.setTimeout(() => {
      window.open(waUrl, "_blank");
    }, 1000);
  });
};

const initWhatsAppTracking = () => {
  if (document.body.dataset.whatsappTrackingInitialized === "true") return;
  document.body.dataset.whatsappTrackingInitialized = "true";

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const link = target.closest("a[href*='wa.me/']");
    if (!link) return;

    if (typeof window.__loadGTM === "function") {
      window.__loadGTM("whatsapp_click");
    }

    const source = link.getAttribute("data-wa-source") || "unknown";
    const label = (
      link.getAttribute("aria-label") ||
      link.textContent ||
      "whatsapp"
    ).trim();

    pushDataLayerEvent("whatsapp_click", {
      event_category: "engagement",
      event_label: source,
      link_text: label.slice(0, 80),
      link_url: link.href,
      page_path: window.location.pathname,
    });
  });
};

const scheduleNonCriticalUI = () => {
  runWhenIdle(initScrollReveal);
  runWhenIdle(initMobileMenu);
  runWhenIdle(initContactForm, 3000);
};

initHeaderScroll();
initWhatsAppTracking();

if (document.readyState === "complete") {
  scheduleNonCriticalUI();
} else {
  window.addEventListener("load", scheduleNonCriticalUI, { once: true });
}
