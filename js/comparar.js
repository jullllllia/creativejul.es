/* =====================================================================
   comparar.js — o "antes e depois" da BBG
   ---------------------------------------------------------------------
   - Duas imagens empilhadas: a de 2026 embaixo, a de 2024 por cima.
   - A de cima é "recortada" (clip-path) até a posição da divisória,
     guardada na variável CSS --pos (ex.: 28%).
   - Um <input type="range"> invisível cobre a imagem: arrastar ou usar
     as setas do teclado muda o valor, e o script atualiza --pos.
   - Os botões Logo / Tipografia / Paleta trocam o par de imagens.
   ===================================================================== */
(function () {
  function en() { return window.JULES_IDIOMA === 'en'; }

  document.addEventListener('DOMContentLoaded', function () {
    var area = document.querySelector('.comp-area');
    if (!area) return;
    var range = area.querySelector('.comp-range');
    var antes = area.querySelector('.comp-antes');
    var depois = area.querySelector('.comp-depois');
    var nome = document.querySelector('.comp-nome');
    var pct = document.querySelector('.comp-pct');
    var abas = document.querySelectorAll('.comp-abas button');
    var atual = abas[0];

    function rotulo(b) { return en() ? b.getAttribute('data-en') : b.getAttribute('data-pt'); }

    function textos() {
      var v = Number(range.value);
      pct.textContent = en() ? v + '% BEFORE · ' + (100 - v) + '% AFTER' : v + '% ANTES · ' + (100 - v) + '% DEPOIS';
      nome.textContent = rotulo(atual);
      antes.alt = (en() ? 'Before, 2024 version: ' : 'Antes, versão 2024: ') + rotulo(atual);
      depois.alt = (en() ? 'After, 2026 version: ' : 'Depois, versão 2026: ') + rotulo(atual);
    }

    function mover() {
      area.style.setProperty('--pos', range.value + '%');
      textos();
    }

    range.addEventListener('input', mover);
    abas.forEach(function (b) {
      b.addEventListener('click', function () {
        atual = b;
        abas.forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
        antes.src = b.getAttribute('data-antes');
        depois.src = b.getAttribute('data-depois');
        textos();
      });
    });
    document.addEventListener('idioma', textos);
    textos();
  });
})();
