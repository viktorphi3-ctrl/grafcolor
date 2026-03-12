const initCookieBanner = () => {
  const banner = document.getElementById('cookie-banner');
  const btnAccept = document.getElementById('cookie-accept');
  const btnReject = document.getElementById('cookie-reject');
  
  if (!banner) return;
  
  // Verifica se já existe preferência salva
  const cookieConsent = localStorage.getItem('grafcolor_cookie_consent');
  
  if (!cookieConsent) {
    // Exibe o banner após um pequeno atraso
    setTimeout(() => {
      banner.classList.remove('hidden');
      // Força reflow para garantir a animação de entrada
      requestAnimationFrame(() => {
        banner.classList.remove('translate-y-full');
      });
    }, 1000);
  }

  const hideBanner = (consent) => {
    localStorage.setItem('grafcolor_cookie_consent', consent);
    
    if (consent === 'accepted') {
      window.dispatchEvent(new Event('cookie_consent_accepted'));
    }

    banner.classList.add('translate-y-full');
    setTimeout(() => {
      banner.classList.add('hidden');
    }, 500); // tempo igual ao duration-500
  };

  if (btnAccept) {
    btnAccept.addEventListener('click', () => hideBanner('accepted'));
  }

  if (btnReject) {
    btnReject.addEventListener('click', () => hideBanner('rejected'));
  }
};

// Quando carregado de forma assíncrona ("defer")
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCookieBanner);
} else {
  initCookieBanner();
}

// Lida com navegação do cliente (View Transitions), se ativado no futuro
document.addEventListener('astro:page-load', initCookieBanner);
