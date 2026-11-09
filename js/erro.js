/* erro.js — botão "Detalhes" e relógio da barra de tarefas da página 404 */
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var b = document.querySelector('.erro-mais'), det = document.getElementById('erro-det');
    function rotulo() {
      var aberto = !det.hidden, en = window.JULES_IDIOMA === 'en';
      b.textContent = aberto ? (en ? '<< Details' : '<< Detalhes') : (en ? 'Details >>' : 'Detalhes >>');
      b.setAttribute('aria-expanded', aberto ? 'true' : 'false');
    }
    b.addEventListener('click', function () { det.hidden = !det.hidden; rotulo(); });
    document.addEventListener('idioma', rotulo);
    var hora = document.querySelector('.hora');
    function relogio() { var d = new Date(); hora.textContent = String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0'); }
    relogio(); setInterval(relogio, 30000);
  });
})();
