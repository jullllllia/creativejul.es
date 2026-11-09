/* =====================================================================
   abertura.js — fecha a tela de abertura da home
   ---------------------------------------------------------------------
   - Fecha com clique/toque em qualquer lugar, Enter, Espaço ou Esc.
   - Guarda no sessionStorage que a pessoa já viu a abertura: ela não
     aparece de novo até a pessoa fechar a aba/navegador e voltar.
   ===================================================================== */
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var raiz = document.documentElement;
    var tela = document.getElementById('abertura');
    if (!tela || !raiz.classList.contains('ab-mostrar')) return;
    var botao = tela.querySelector('.ab-entrar');
    var fechada = false;
    botao.focus({ preventScroll: true });

    function fechar() {
      if (fechada) return;
      fechada = true;
      try { sessionStorage.setItem('jules-abertura', '1'); } catch (e) {}
      tela.classList.add('saindo');
      setTimeout(function () {
        raiz.classList.remove('ab-mostrar');
        document.removeEventListener('keydown', tecla);
      }, 450);
    }
    function tecla(e) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') { e.preventDefault(); fechar(); }
    }
    tela.addEventListener('click', function (e) {
      // os botões PT/EN não ficam na abertura, então qualquer clique entra no site
      fechar();
    });
    document.addEventListener('keydown', tecla);
  });
})();
