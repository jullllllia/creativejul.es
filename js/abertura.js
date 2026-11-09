/* =====================================================================
   abertura.js — tela de abertura da home ("ligando o computador")
   ---------------------------------------------------------------------
   1. O conteúdo da tela (logo + barra) é desenhado em 640 × 486 px e
      aumentado/diminuído para caber exatamente no vidro do monitor.
   2. O logo se forma símbolo por símbolo.
   3. Ao entrar (clique, toque, Enter, Espaço ou Esc), o computador
      "voa" até o lugar onde ele fica na home e a tela vira a área de
      trabalho. Se o computador da home não estiver visível (celular),
      a abertura só some.
   4. Guarda no sessionStorage que a pessoa já viu: ela só aparece de
      novo quando a pessoa fechar o navegador e voltar.
   ===================================================================== */
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var raiz = document.documentElement;
    var tela = document.getElementById('abertura');
    if (!tela || !raiz.classList.contains('ab-mostrar')) return;
    var botao = tela.querySelector('.ab-entrar');
    var pc = tela.querySelector('.ab-pc');
    var vidro = tela.querySelector('.ab-tela');
    var conteudo = tela.querySelector('.ab-tela-conteudo');
    var semMovimento = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    var fechada = false;

    // 1. encaixa o conteúdo no vidro do monitor
    function encaixar() {
      var escala = vidro.clientWidth / conteudo.offsetWidth; // 640px no computador, 500px no celular
      conteudo.style.transform = 'scale(' + escala + ')';
    }
    encaixar();
    window.addEventListener('resize', encaixar);

    // 2. logo se formando: cada caractere (que não é espaço) vira um <i class="ab-c">
    // com um atraso sorteado entre 0,3s e 3,8s (o tempo da barra de carregamento).
    var glifo = tela.querySelector('.ab-glifo');
    if (glifo) {
      var linha = 0, coluna = 0, nos = [];
      var andar = document.createTreeWalker(glifo, NodeFilter.SHOW_TEXT);
      while (andar.nextNode()) nos.push(andar.currentNode);
      nos.forEach(function (no) {
        var frag = document.createDocumentFragment();
        Array.prototype.forEach.call(no.textContent, function (ch) {
          if (ch === '\n') { linha++; coluna = 0; frag.appendChild(document.createTextNode(ch)); return; }
          coluna++;
          if (ch === ' ') { frag.appendChild(document.createTextNode(ch)); return; }
          var i = document.createElement('i');
          i.className = 'ab-c';
          i.textContent = ch;
          var ordem = (coluna / 70) * 0.55 + (linha / 18) * 0.25 + Math.random() * 0.2; // 0 a 1
          i.style.setProperty('--d', (0.3 + ordem * 3.5).toFixed(2) + 's');
          frag.appendChild(i);
        });
        no.parentNode.replaceChild(frag, no);
      });
      glifo.classList.add('pronta');
    }

    botao.focus({ preventScroll: true });

    function terminar() {
      raiz.classList.remove('ab-mostrar');
      document.removeEventListener('keydown', tecla);
      window.removeEventListener('resize', encaixar);
    }

    // 3. entrar no site
    function fechar() {
      if (fechada) return;
      fechada = true;
      try { sessionStorage.setItem('jules-abertura', '1'); } catch (e) {}
      window.scrollTo(0, 0);
      var alvoImg = document.querySelector('.computador img');
      var alvo = alvoImg && alvoImg.getBoundingClientRect();
      var visivel = alvo && alvo.width > 0 && alvo.top >= 0 && alvo.bottom <= window.innerHeight + 40;

      if (semMovimento || !visivel) {
        // sem animação de voo: só esmaece
        tela.classList.add('sumindo');
        setTimeout(terminar, 450);
        return;
      }
      // FLIP: calcula quanto o computador precisa andar e encolher
      var origem = pc.getBoundingClientRect();
      var escala = alvo.width / origem.width;
      var dx = alvo.left - origem.left, dy = alvo.top - origem.top;
      // esconde o computador da home enquanto o da abertura voa até ele (evita aparecer dobrado)
      var compHome = document.querySelector('.computador');
      compHome.style.visibility = 'hidden';
      tela.classList.add('saindo');
      requestAnimationFrame(function () {
        pc.style.transform = 'translate(' + dx + 'px, ' + dy + 'px) scale(' + escala + ')';
      });
      setTimeout(function () { compHome.style.visibility = ''; terminar(); }, 950);
    }

    function tecla(e) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') { e.preventDefault(); fechar(); }
    }
    tela.addEventListener('click', fechar);
    document.addEventListener('keydown', tecla);
  });
})();
