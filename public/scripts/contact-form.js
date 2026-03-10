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

if ("requestIdleCallback" in window) {
  window.requestIdleCallback(initContactForm, { timeout: 3000 });
} else if (document.readyState === "complete") {
  window.setTimeout(initContactForm, 200);
} else {
  window.addEventListener(
    "load",
    () => {
      window.setTimeout(initContactForm, 200);
    },
    { once: true },
  );
}
