/* =====================================================================
   revista.js — leitor da revista Emília, com a página virando de verdade
   ---------------------------------------------------------------------
   As páginas ficam numa lista (JSON) dentro da própria página, no
   <script id="emilia-dados">. Cada item é uma "vista": a capa (só a
   página da direita), as páginas duplas e a contracapa (só a esquerda).

   Como a virada funciona (avançando):
   1. Embaixo, já aparece a vista nova (página esquerda + direita).
   2. Por cima da metade esquerda, fica a página esquerda ANTIGA ("resto"),
      para a pessoa não ver a página nova antes da hora.
   3. Uma "folha" com frente e verso gira 180° pela lombada (o meio):
      frente = página direita antiga, verso = página esquerda nova.
   4. Quando a folha termina de cair, o "resto" e a folha somem.
   Voltando, é o mesmo movimento espelhado.
   ===================================================================== */
(function () {
  var DURACAO = 900; // milissegundos da virada (igual ao CSS)

  document.addEventListener('DOMContentLoaded', function () {
    var dados = document.getElementById('emilia-dados');
    if (!dados) return;
    var V = JSON.parse(dados.textContent);
    var mesa = document.querySelector('.ed-mesa');
    var vista = document.querySelector('.ed-vista');
    var range = document.querySelector('.ed-range');
    var rotulos = document.querySelectorAll('.ed-rot');
    var minis = document.querySelectorAll('.ed-mini');
    var ant = document.querySelector('.ed-ant');
    var prox = document.querySelector('.ed-prox');
    var semMovimento = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    var v = 0, timer = null;

    function en() { return window.JULES_IDIOMA === 'en'; }
    function nomeVista(n) { return en() ? V[n].en : V[n].rot; }
    function alt(n) {
      if (n === 0) return en() ? 'Cover of Emília magazine' : 'Capa da revista Emília';
      if (n === V.length - 1) return en() ? 'Back cover of Emília magazine' : 'Contracapa da revista Emília';
      return (en() ? 'Emília magazine, ' : 'Revista Emília, ') + nomeVista(n).toLowerCase();
    }

    // monta uma metade (lado 'l' = esquerda, 'r' = direita) da vista n dentro do elemento "caixa"
    function preencher(caixa, n, lado, comAlt) {
      caixa.innerHTML = '';
      var x = V[n];
      var temPagina = x.dupla || (lado === 'l' ? x.lado === 'esq' : x.lado === 'dir');
      caixa.classList.toggle('cheia', temPagina);
      if (!temPagina) return;
      var img = document.createElement('img');
      img.src = x.arq;
      img.alt = comAlt ? alt(n) : '';
      img.draggable = false;
      // páginas duplas: a imagem tem as duas páginas, então mostramos só a metade certa
      if (x.dupla) img.className = lado === 'l' ? 'meia esq' : 'meia dir';
      caixa.appendChild(img);
    }

    // estrutura fixa: duas metades de baixo
    vista.innerHTML = '<div class="ed-pag esq"></div><div class="ed-pag dir"></div>';
    var pagE = vista.querySelector('.ed-pag.esq'), pagD = vista.querySelector('.ed-pag.dir');

    function limparVirada() {
      clearTimeout(timer);
      vista.querySelectorAll('.ed-resto, .ed-folha').forEach(function (el) { el.remove(); });
      pagE.classList.remove('espera'); pagD.classList.remove('espera');
    }

    function base(n) {
      preencher(pagE, n, 'l', true);
      // a página direita só leva alt se a esquerda não tiver (evita ler duas vezes)
      preencher(pagD, n, 'r', !(V[n].dupla || V[n].lado === 'esq'));
      vista.classList.toggle('aberta', V[n].dupla);
    }

    function virar(de, para) {
      limparVirada();
      base(para);
      if (semMovimento || de === null) return;
      var frente = para > de; // avançando?
      // "resto": a metade antiga que ainda não foi coberta pela folha
      var resto = document.createElement('div');
      resto.className = 'ed-resto ' + (frente ? 'esq' : 'dir');
      preencher(resto, de, frente ? 'l' : 'r', false);
      // a folha que gira
      var folha = document.createElement('div');
      folha.className = 'ed-folha ' + (frente ? 'dir avanca' : 'esq volta');
      folha.innerHTML = '<div class="ed-face frente"></div><div class="ed-face verso"></div>';
      preencher(folha.children[0], de, frente ? 'r' : 'l', false);
      preencher(folha.children[1], para, frente ? 'l' : 'r', false);
      // a página onde a folha vai "cair" só aparece quando a virada termina
      // (sem isso, na capa e na contracapa a página nova aparecia antes da animação)
      (frente ? pagE : pagD).classList.add('espera');
      vista.appendChild(resto);
      vista.appendChild(folha);
      timer = setTimeout(limparVirada, DURACAO + 30);
    }

    function textos() {
      rotulos.forEach(function (r) { r.textContent = nomeVista(v); });
      range.value = v;
      ant.disabled = v === 0;
      prox.disabled = v === V.length - 1;
      minis.forEach(function (m, i) {
        if (i === v) { m.setAttribute('aria-current', 'true'); m.scrollIntoView({ block: 'nearest', inline: 'nearest' }); }
        else m.removeAttribute('aria-current');
      });
    }

    function ir(n) {
      n = Math.max(0, Math.min(V.length - 1, n));
      if (n === v) return;
      var de = v;
      v = n;
      virar(de, v);
      textos();
      // já baixa as próximas páginas para a virada ficar instantânea
      [v + 1, v - 1].forEach(function (k) { if (V[k]) { var pre = new Image(); pre.src = V[k].arq; } });
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
    document.addEventListener('idioma', function () { base(v); textos(); });
    base(0); textos();
    if (V[1]) { var pre = new Image(); pre.src = V[1].arq; }
  });
})();
