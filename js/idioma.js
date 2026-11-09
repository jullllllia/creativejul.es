/* =====================================================================
   idioma.js — troca o site entre português (PT) e inglês (EN)
   ---------------------------------------------------------------------
   Como funciona:
   - O texto em português fica escrito normalmente no HTML.
   - A versão em inglês fica num atributo "data-en" do mesmo elemento:
       <p data-en="Hello!">Olá!</p>
   - Ao clicar em EN, este script guarda o português em "data-pt" e
     coloca o inglês no lugar. Ao clicar em PT, faz o caminho inverso.
   - Textos que não aparecem na tela também traduzem:
       data-en-label  → atributo aria-label (lido por leitores de tela)
       data-en-alt    → atributo alt das imagens
   - A escolha fica salva no navegador (localStorage), então a pessoa
     continua em inglês ao trocar de página.
   ===================================================================== */
(function () {
  var CHAVE = 'jules-idioma';

  function lerEscolha() {
    try {
      var salvo = localStorage.getItem(CHAVE);
      if (salvo === 'pt' || salvo === 'en') return salvo;
    } catch (e) { /* navegador sem acesso ao armazenamento: segue sem salvar */ }
    // primeira visita: usa o idioma do navegador (português → PT, resto → EN)
    var nav = (navigator.language || 'pt').toLowerCase();
    return nav.indexOf('pt') === 0 ? 'pt' : 'en';
  }

  function salvar(lang) {
    try { localStorage.setItem(CHAVE, lang); } catch (e) {}
  }

  function trocarAtributo(el, attr, lang) {
    var en = el.getAttribute('data-en-' + attr);
    if (en === null) return;
    var nomeReal = attr === 'label' ? 'aria-label' : attr;
    if (!el.hasAttribute('data-pt-' + attr)) el.setAttribute('data-pt-' + attr, el.getAttribute(nomeReal) || '');
    el.setAttribute(nomeReal, lang === 'en' ? en : el.getAttribute('data-pt-' + attr));
  }

  function aplicar(lang) {
    document.querySelectorAll('[data-en]').forEach(function (el) {
      if (!el.hasAttribute('data-pt')) el.setAttribute('data-pt', el.innerHTML);
      el.innerHTML = lang === 'en' ? el.getAttribute('data-en') : el.getAttribute('data-pt');
    });
    document.querySelectorAll('[data-en-label]').forEach(function (el) { trocarAtributo(el, 'label', lang); });
    document.querySelectorAll('[data-en-alt]').forEach(function (el) { trocarAtributo(el, 'alt', lang); });
    document.documentElement.lang = lang === 'en' ? 'en' : 'pt-BR';
    document.querySelectorAll('.idioma button').forEach(function (b) {
      b.setAttribute('aria-pressed', b.getAttribute('data-lang') === lang ? 'true' : 'false');
    });
    window.JULES_IDIOMA = lang;
    // avisa outras partes da página (ex.: o explorador de pastas) que o idioma mudou
    document.dispatchEvent(new CustomEvent('idioma', { detail: lang }));
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.idioma button').forEach(function (b) {
      b.addEventListener('click', function () {
        var lang = b.getAttribute('data-lang');
        salvar(lang);
        aplicar(lang);
      });
    });
    aplicar(lerEscolha());
  });
})();
