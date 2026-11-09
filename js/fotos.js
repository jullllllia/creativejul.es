/* =====================================================================
   fotos.js — abre a foto grande ao clicar (páginas de fotografia)
   Qualquer botão com data-grande="caminho/da/foto.webp" abre a janela.
   ===================================================================== */
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var lupa = document.getElementById('lupa');
    if (!lupa || !lupa.showModal) return;
    var img = lupa.querySelector('img'), leg = lupa.querySelector('p');
    document.addEventListener('click', function (e) {
      var b = e.target.closest && e.target.closest('[data-grande]');
      if (b) {
        img.src = b.getAttribute('data-grande');
        img.alt = b.querySelector('img') ? b.querySelector('img').alt : '';
        leg.textContent = b.getAttribute('data-legenda') || '';
        lupa.showModal();
        return;
      }
      // fecha ao clicar no botão × ou fora da foto
      if (e.target.closest && e.target.closest('.fechar') || e.target === lupa) lupa.close();
    });
  });
})();
