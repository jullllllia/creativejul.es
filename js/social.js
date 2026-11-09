/* =====================================================================
   social.js — vitrine de social media
   ---------------------------------------------------------------------
   Os dados de cada perfil (nome, usuário, segmento, legenda e posts)
   ficam no <script id="social-dados"> da página, em PT e EN.
   - Clicar num "story" abre aquele perfil.
   - As setas do post passam pelas imagens do perfil (carrossel).
   - "Anterior" / "Próximo perfil" percorrem a lista em círculo.
   ===================================================================== */
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var dados = document.getElementById('social-dados');
    if (!dados) return;
    var P = JSON.parse(dados.textContent);
    var c = 0, f = 0;
    var $ = function (s) { return document.querySelector(s); };
    var $$ = function (s) { return document.querySelectorAll(s); };
    var stories = $$('.sm-story');
    var img = $('.sm-img');
    var foto = $('.sm-foto');
    var pontos = $('.sm-pontos');
    var setaAnt = $('.sm-seta.ant'), setaProx = $('.sm-seta.prox');

    function en() { return window.JULES_IDIOMA === 'en'; }

    function desenharFoto(animar) {
      var p = P[c], n = p.posts.length;
      img.src = p.posts[f];
      img.alt = en() ? 'Post ' + (f + 1) + ' of ' + n + ' made for ' + p.nome : 'Post ' + (f + 1) + ' de ' + n + ' feito para ' + p.nome;
      $('.sm-cont').textContent = (f + 1) + '/' + n;
      setaAnt.hidden = f === 0;
      setaProx.hidden = f === n - 1;
      pontos.innerHTML = p.posts.map(function (_, i) { return '<span' + (i === f ? ' class="on"' : '') + '></span>'; }).join('');
      if (animar) { img.classList.remove('troca'); void img.offsetWidth; img.classList.add('troca'); }
    }

    function desenhar(animar) {
      var p = P[c];
      var seg = en() ? p.seg_en : p.seg, leg = en() ? p.leg_en : p.leg;
      $('.sm-i').textContent = String(c + 1).padStart(2, '0');
      $('.sm-seg').textContent = seg.toUpperCase();
      $('.sm-nome .bl').textContent = p.nome;
      $('.sm-leg').textContent = leg;
      $('.sm-leg2').textContent = leg;
      $('.sm-useg').textContent = seg;
      $$('.sm-user').forEach(function (u) { u.textContent = p.usuario; });
      $('.sm-avatar').src = p.capa;
      foto.style.aspectRatio = '1 / ' + p.prop;
      stories.forEach(function (s, i) {
        if (i === c) { s.setAttribute('aria-current', 'true'); s.scrollIntoView({ block: 'nearest', inline: 'nearest' }); }
        else s.removeAttribute('aria-current');
      });
      desenharFoto(false);
      if (animar) {
        [$('.sm-texto'), $('.sm-post')].forEach(function (el) { el.classList.remove('entra'); void el.offsetWidth; el.classList.add('entra'); });
      }
    }

    function perfil(n) {
      c = (n % P.length + P.length) % P.length;
      f = 0;
      desenhar(true);
    }

    stories.forEach(function (s) { s.addEventListener('click', function () { perfil(Number(s.getAttribute('data-n'))); }); });
    $('.sm-pant').addEventListener('click', function () { perfil(c - 1); });
    $('.sm-pprox').addEventListener('click', function () { perfil(c + 1); });
    setaAnt.addEventListener('click', function () { if (f > 0) { f--; desenharFoto(true); } });
    setaProx.addEventListener('click', function () { if (f < P[c].posts.length - 1) { f++; desenharFoto(true); } });
    // deslizar o dedo sobre o post troca a imagem
    var x0 = null;
    foto.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    foto.addEventListener('touchend', function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0;
      if (dx < -40) setaProx.click();
      if (dx > 40) setaAnt.click();
      x0 = null;
    });
    document.addEventListener('idioma', function () { desenhar(false); });
    desenhar(false);
  });
})();
