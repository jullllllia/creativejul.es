/* =====================================================================
   revista.js — leitor da revista Emília
   ---------------------------------------------------------------------
   As páginas ficam numa lista (JSON) dentro da própria página, no
   <script id="emilia-dados">. Cada item é uma "vista": a capa (só a
   página da direita), as páginas duplas e a contracapa (só a esquerda).
   O leitor mostra uma vista por vez; avançar/voltar troca a imagem com
   uma pequena animação de "virar a página".
   ===================================================================== */
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var dados = document.getElementById('emilia-dados');
    if (!dados) return;
    var V = JSON.parse(dados.textContent);
    var mesa = document.querySelector('.ed-mesa');
    var vista = document.querySelector('.ed-vista');
    var img = document.querySelector('.ed-img');
    var range = document.querySelector('.ed-range');
    var rotulos = document.querySelectorAll('.ed-rot');
    var minis = document.querySelectorAll('.ed-mini');
    var ant = document.querySelector('.ed-ant');
    var prox = document.querySelector('.ed-prox');
    var v = 0;

    function en() { return window.JULES_IDIOMA === 'en'; }
    function nomeVista(n) { return en() ? V[n].en : V[n].rot; }
    function alt(n) {
      if (n === 0) return en() ? 'Cover of Emília magazine' : 'Capa da revista Emília';
      if (n === V.length - 1) return en() ? 'Back cover of Emília magazine' : 'Contracapa da revista Emília';
      return (en() ? 'Emília magazine, ' : 'Revista Emília, ') + nomeVista(n).toLowerCase();
    }

    function mostrar(n, direcao) {
      var x = V[n];
      img.className = 'ed-img' + (x.dupla ? '' : (x.lado === 'esq' ? ' so-esq' : ' so-dir'));
      img.src = x.arq;
      img.alt = alt(n);
      vista.classList.toggle('aberta', x.dupla);
      if (direcao) {
        void img.offsetWidth; // reinicia a animação
        img.classList.add(direcao > 0 ? 'vira-frente' : 'vira-tras');
      }
      rotulos.forEach(function (r) { r.textContent = nomeVista(n); });
      range.value = n;
      ant.disabled = n === 0;
      prox.disabled = n === V.length - 1;
      minis.forEach(function (m, i) {
        if (i === n) { m.setAttribute('aria-current', 'true'); m.scrollIntoView({ block: 'nearest', inline: 'nearest' }); }
        else m.removeAttribute('aria-current');
      });
      // já baixa a próxima página para a virada ficar instantânea
      if (V[n + 1]) { var pre = new Image(); pre.src = V[n + 1].arq; }
    }

    function ir(n) {
      n = Math.max(0, Math.min(V.length - 1, n));
      if (n === v) return;
      var dir = n > v ? 1 : -1;
      v = n;
      mostrar(v, dir);
    }

    ant.addEventListener('click', function () { ir(v - 1); });
    prox.addEventListener('click', function () { ir(v + 1); });
    document.querySelector('.ed-toque.esq').addEventListener('click', function () { ir(v - 1); });
    document.querySelector('.ed-toque.dir').addEventListener('click', function () { ir(v + 1); });
    range.addEventListener('input', function () { ir(Number(range.value)); });
    minis.forEach(function (m) { m.addEventListener('click', function () { ir(Number(m.getAttribute('data-n'))); }); });
    mesa.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); ir(v + 1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); ir(v - 1); }
    });
    // deslizar o dedo no celular
    var x0 = null;
    mesa.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    mesa.addEventListener('touchend', function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 40) ir(v + (dx < 0 ? 1 : -1));
      x0 = null;
    });
    document.addEventListener('idioma', function () { mostrar(v, 0); });
    mostrar(0, 0);
  });
})();
