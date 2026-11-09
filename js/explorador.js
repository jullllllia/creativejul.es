/* =====================================================================
   explorador.js — o "Meu computador" da home
   ---------------------------------------------------------------------
   A janela tem três partes:
   1. a lista de unidades e pastas à esquerda (C:, D:, P: ...)
   2. o painel com o nome e a descrição da pasta aberta
   3. a lista de arquivos daquela pasta
   Os dados ficam todos no array UNIDADES abaixo. Para adicionar um
   projeto, basta incluir um item em "itens" com nome, tipo, ano e link.
   Cada texto tem a versão pt e en.
   ===================================================================== */
(function () {
  var UNIDADES = [
    // raiz: é onde o explorador abre por padrão. As unidades aparecem como arquivos clicáveis.
    { caminho: 'MC', nivel: -1, rotulo: { pt: 'Meu computador', en: 'My Computer' }, titulo: { pt: 'Meu computador', en: 'My Computer' },
      desc: { pt: 'Três unidades: code, design e play. Abra uma delas para ver as pastas e os projetos.',
              en: 'Three drives: code, design and play. Open one to see its folders and projects.' },
      itens: [
        { nome: 'CODE (C:)', tipo: { pt: 'Disco local', en: 'Local disk' }, ano: '—', pasta: 'C:', disco: true },
        { nome: 'DESIGN (D:)', tipo: { pt: 'Disco local', en: 'Local disk' }, ano: '—', pasta: 'D:', disco: true },
        { nome: 'PLAY (P:)', tipo: { pt: 'Disco local', en: 'Local disk' }, ano: '—', pasta: 'P:', disco: true } ] },
    // área de trabalho: o lado direito vira uma tela de computador (ver area-de-trabalho.js)
    { caminho: 'DESK', nivel: -1, rotulo: { pt: 'Área de trabalho', en: 'Desktop' }, titulo: { pt: 'Área de trabalho', en: 'Desktop' }, desc: { pt: '', en: '' }, itens: [] },
    { caminho: 'C:', nivel: 0, rotulo: { pt: 'CODE (C:)', en: 'CODE (C:)' }, titulo: { pt: 'Code', en: 'Code' },
      desc: { pt: 'Programação, desenvolvimento web, interfaces, automações, ferramentas digitais, estudos técnicos e projetos de software.',
              en: 'Programming, web development, interfaces, automation, digital tools, technical studies and software projects.' },
      itens: [
        // este próprio site, com estrelinha e o aviso [você está aqui]
        { nome: 'creativejul.es', tipo: { pt: 'Site', en: 'Website' }, ano: '2026', link: 'processo-criativo.html', estrela: true, aqui: { pt: '[vc está aqui]', en: '[you are here]' } },
        { nome: 'site_wyoming.html', tipo: { pt: 'Site', en: 'Website' }, ano: '2026', link: 'projetos/wyoming.html' } ] },
    { caminho: 'D:', nivel: 0, rotulo: { pt: 'DESIGN (D:)', en: 'DESIGN (D:)' }, titulo: { pt: 'Design', en: 'Design' },
      desc: { pt: 'Identidade visual, branding, direção de arte, comunicação, projetos editoriais e experiências gráficas.',
              en: 'Visual identity, branding, art direction, communication, editorial projects and graphic experiences.' },
      itens: [
        { nome: 'identidade-e-marca', tipo: { pt: 'Pasta de arquivos', en: 'File folder' }, ano: '—', pasta: 'D:\\identidade-e-marca' },
        { nome: 'editorial', tipo: { pt: 'Pasta de arquivos', en: 'File folder' }, ano: '—', pasta: 'D:\\editorial' },
        { nome: 'social-media', tipo: { pt: 'Pasta de arquivos', en: 'File folder' }, ano: '—', pasta: 'D:\\social-media' } ] },
    { caminho: 'D:\\identidade-e-marca', nivel: 1, titulo: { pt: 'Identidade e marca', en: 'Identity & brand' },
      desc: { pt: 'Logos, identidades visuais e streampacks: da marca de uma agência de tradução ao cenário inteiro de uma live.',
              en: 'Logos, visual identities and streampacks: from a translation agency’s brand to an entire live-stream set.' },
      itens: [
        { nome: 'medicinas-do-tempo.case', tipo: { pt: 'Branding', en: 'Branding' }, ano: '2026', link: 'projetos/medicinas-do-tempo.html' },
        { nome: 'bbg_language-solutions.case', tipo: { pt: 'Identidade visual', en: 'Visual identity' }, ano: '2024 · 2026', link: 'projetos/bbg.html' },
        { nome: 'thaism_o.case', tipo: { pt: 'ID visual · streampack', en: 'Visual ID · streampack' }, ano: '2026', link: 'projetos/thaism_o.html' },
        { nome: 'paantv_.case', tipo: { pt: 'Ilustração · streampack', en: 'Illustration · streampack' }, ano: '2025', link: 'projetos/paantv.html' },
        { nome: 'sratpm.case', tipo: { pt: 'ID visual · streampack', en: 'Visual ID · streampack' }, ano: '2023', link: 'projetos/sratpm.html' },
        { nome: 'souneite.case', tipo: { pt: 'ID visual · streampack', en: 'Visual ID · streampack' }, ano: '2023', link: 'projetos/souneite.html' },
        { nome: 'awti-city.case', tipo: { pt: 'Logo · GTA RP', en: 'Logo · GTA RP' }, ano: '2023', link: 'projetos/awti-city.html' } ] },
    { caminho: 'D:\\editorial', nivel: 1, titulo: { pt: 'Editorial', en: 'Editorial' },
      desc: { pt: 'Revistas e publicações diagramadas página a página.', en: 'Magazines and publications laid out page by page.' },
      itens: [ { nome: 'revista-emilia_destaques-19-20.indd', tipo: { pt: 'Revista', en: 'Magazine' }, ano: '2022', link: 'projetos/emilia.html' } ] },
    { caminho: 'D:\\social-media', nivel: 1, titulo: { pt: 'Social media', en: 'Social media' },
      desc: { pt: 'Feeds para marcas de futebol, alimentação, imobiliária, saúde, estética e varejo.',
              en: 'Feeds for football, food, real estate, health, beauty and retail brands.' },
      itens: [ { nome: 'instagram-posts', tipo: { pt: 'Social media', en: 'Social media' }, ano: '2019–2026', link: 'projetos/social-media.html' } ] },
    { caminho: 'P:', nivel: 0, rotulo: { pt: 'PLAY (P:)', en: 'PLAY (P:)' }, titulo: { pt: 'Play', en: 'Play' },
      desc: { pt: 'Games, roleplay, criação de universos, interfaces para jogos, projetos de comunidades, streaming e experiências interativas.',
              en: 'Games, roleplay, world-building, game interfaces, community projects, streaming and interactive experiences.' },
      itens: [
        { nome: 'wyoming_rp.case', tipo: { pt: 'Case principal', en: 'Main case' }, ano: '2026', link: 'projetos/wyoming.html' },
        { nome: 'ui-unificada_redm.case', tipo: { pt: 'Case', en: 'Case' }, ano: '2026' },
        { nome: 'bugs_publicos_wyoming.log', tipo: { pt: 'QA · relatório', en: 'QA · report' }, ano: '2026' } ] }
  ];

  var ICONE_DISCO = '<svg aria-hidden="true" width="22" height="16" viewBox="0 0 30 22"><rect x="1" y="5" width="28" height="13" rx="2" fill="#D4CCB0" stroke="#2C2A1E"/><rect x="4" y="11" width="13" height="2" fill="#8C8468"/><circle cx="24" cy="11.5" r="1.8" fill="#A3B35C"/></svg>';
  var ICONE_PASTA = '<svg aria-hidden="true" width="20" height="16" viewBox="0 0 30 24"><path d="M1 4h10l3 3h15v16H1z" fill="#E4B028" stroke="#6E5410"/></svg>';
  var ICONE_ESTRELA = '<svg aria-hidden="true" class="ex-estrela" width="16" height="16" viewBox="0 0 16 16" shape-rendering="crispEdges"><rect x="7" y="0" width="1" height="1" fill="#171C10"/><rect x="6" y="1" width="1" height="1" fill="#171C10"/><rect x="7" y="1" width="1" height="1" fill="#E4B028"/><rect x="8" y="1" width="1" height="1" fill="#171C10"/><rect x="6" y="2" width="1" height="1" fill="#171C10"/><rect x="7" y="2" width="1" height="1" fill="#E4B028"/><rect x="8" y="2" width="1" height="1" fill="#171C10"/><rect x="5" y="3" width="1" height="1" fill="#171C10"/><rect x="6" y="3" width="1" height="1" fill="#E4B028"/><rect x="7" y="3" width="1" height="1" fill="#E4B028"/><rect x="8" y="3" width="1" height="1" fill="#E4B028"/><rect x="9" y="3" width="1" height="1" fill="#171C10"/><rect x="1" y="4" width="1" height="1" fill="#171C10"/><rect x="2" y="4" width="1" height="1" fill="#171C10"/><rect x="3" y="4" width="1" height="1" fill="#171C10"/><rect x="4" y="4" width="1" height="1" fill="#171C10"/><rect x="5" y="4" width="1" height="1" fill="#171C10"/><rect x="6" y="4" width="1" height="1" fill="#E4B028"/><rect x="7" y="4" width="1" height="1" fill="#E4B028"/><rect x="8" y="4" width="1" height="1" fill="#E4B028"/><rect x="9" y="4" width="1" height="1" fill="#171C10"/><rect x="10" y="4" width="1" height="1" fill="#171C10"/><rect x="11" y="4" width="1" height="1" fill="#171C10"/><rect x="12" y="4" width="1" height="1" fill="#171C10"/><rect x="13" y="4" width="1" height="1" fill="#171C10"/><rect x="1" y="5" width="1" height="1" fill="#171C10"/><rect x="2" y="5" width="1" height="1" fill="#E4B028"/><rect x="3" y="5" width="1" height="1" fill="#E4B028"/><rect x="4" y="5" width="1" height="1" fill="#E4B028"/><rect x="5" y="5" width="1" height="1" fill="#E4B028"/><rect x="6" y="5" width="1" height="1" fill="#E4B028"/><rect x="7" y="5" width="1" height="1" fill="#E4B028"/><rect x="8" y="5" width="1" height="1" fill="#E4B028"/><rect x="9" y="5" width="1" height="1" fill="#E4B028"/><rect x="10" y="5" width="1" height="1" fill="#E4B028"/><rect x="11" y="5" width="1" height="1" fill="#E4B028"/><rect x="12" y="5" width="1" height="1" fill="#E4B028"/><rect x="13" y="5" width="1" height="1" fill="#171C10"/><rect x="2" y="6" width="1" height="1" fill="#171C10"/><rect x="3" y="6" width="1" height="1" fill="#E4B028"/><rect x="4" y="6" width="1" height="1" fill="#E4B028"/><rect x="5" y="6" width="1" height="1" fill="#E4B028"/><rect x="6" y="6" width="1" height="1" fill="#E4B028"/><rect x="7" y="6" width="1" height="1" fill="#E4B028"/><rect x="8" y="6" width="1" height="1" fill="#E4B028"/><rect x="9" y="6" width="1" height="1" fill="#E4B028"/><rect x="10" y="6" width="1" height="1" fill="#E4B028"/><rect x="11" y="6" width="1" height="1" fill="#E4B028"/><rect x="12" y="6" width="1" height="1" fill="#171C10"/><rect x="3" y="7" width="1" height="1" fill="#171C10"/><rect x="4" y="7" width="1" height="1" fill="#E4B028"/><rect x="5" y="7" width="1" height="1" fill="#E4B028"/><rect x="6" y="7" width="1" height="1" fill="#E4B028"/><rect x="7" y="7" width="1" height="1" fill="#E4B028"/><rect x="8" y="7" width="1" height="1" fill="#E4B028"/><rect x="9" y="7" width="1" height="1" fill="#E4B028"/><rect x="10" y="7" width="1" height="1" fill="#E4B028"/><rect x="11" y="7" width="1" height="1" fill="#171C10"/><rect x="4" y="8" width="1" height="1" fill="#171C10"/><rect x="5" y="8" width="1" height="1" fill="#E4B028"/><rect x="6" y="8" width="1" height="1" fill="#E4B028"/><rect x="7" y="8" width="1" height="1" fill="#E4B028"/><rect x="8" y="8" width="1" height="1" fill="#E4B028"/><rect x="9" y="8" width="1" height="1" fill="#E4B028"/><rect x="10" y="8" width="1" height="1" fill="#171C10"/><rect x="4" y="9" width="1" height="1" fill="#171C10"/><rect x="5" y="9" width="1" height="1" fill="#E4B028"/><rect x="6" y="9" width="1" height="1" fill="#E4B028"/><rect x="7" y="9" width="1" height="1" fill="#E4B028"/><rect x="8" y="9" width="1" height="1" fill="#E4B028"/><rect x="9" y="9" width="1" height="1" fill="#E4B028"/><rect x="10" y="9" width="1" height="1" fill="#171C10"/><rect x="3" y="10" width="1" height="1" fill="#171C10"/><rect x="4" y="10" width="1" height="1" fill="#E4B028"/><rect x="5" y="10" width="1" height="1" fill="#E4B028"/><rect x="6" y="10" width="1" height="1" fill="#E4B028"/><rect x="7" y="10" width="1" height="1" fill="#171C10"/><rect x="8" y="10" width="1" height="1" fill="#E4B028"/><rect x="9" y="10" width="1" height="1" fill="#E4B028"/><rect x="10" y="10" width="1" height="1" fill="#E4B028"/><rect x="11" y="10" width="1" height="1" fill="#171C10"/><rect x="3" y="11" width="1" height="1" fill="#171C10"/><rect x="4" y="11" width="1" height="1" fill="#E4B028"/><rect x="5" y="11" width="1" height="1" fill="#E4B028"/><rect x="6" y="11" width="1" height="1" fill="#171C10"/><rect x="8" y="11" width="1" height="1" fill="#171C10"/><rect x="9" y="11" width="1" height="1" fill="#E4B028"/><rect x="10" y="11" width="1" height="1" fill="#E4B028"/><rect x="11" y="11" width="1" height="1" fill="#171C10"/><rect x="2" y="12" width="1" height="1" fill="#171C10"/><rect x="3" y="12" width="1" height="1" fill="#E4B028"/><rect x="4" y="12" width="1" height="1" fill="#E4B028"/><rect x="5" y="12" width="1" height="1" fill="#171C10"/><rect x="9" y="12" width="1" height="1" fill="#171C10"/><rect x="10" y="12" width="1" height="1" fill="#E4B028"/><rect x="11" y="12" width="1" height="1" fill="#E4B028"/><rect x="12" y="12" width="1" height="1" fill="#171C10"/><rect x="2" y="13" width="1" height="1" fill="#171C10"/><rect x="3" y="13" width="1" height="1" fill="#171C10"/><rect x="4" y="13" width="1" height="1" fill="#171C10"/><rect x="10" y="13" width="1" height="1" fill="#171C10"/><rect x="11" y="13" width="1" height="1" fill="#171C10"/><rect x="12" y="13" width="1" height="1" fill="#171C10"/></svg>';
  var ICONE_ARQ = '<svg aria-hidden="true" width="16" height="18" viewBox="0 0 24 28"><path d="M2 1h14l6 6v20H2z" fill="#FFFFFF" stroke="#2C2A1E"/><path d="M5 12h14M5 16h14M5 20h10" stroke="#5E6B33"/></svg>';

  var ICONE_MC = '<svg aria-hidden="true" width="20" height="16" viewBox="0 0 30 24"><rect x="1" y="5" width="28" height="14" rx="1" fill="#D4CCB0" stroke="#2C2A1E"/><circle cx="24" cy="12" r="1.6" fill="#A3B35C"/></svg>';
  var ICONE_DESK = '<svg aria-hidden="true" width="20" height="16" viewBox="0 0 30 24"><rect x="2" y="3" width="26" height="16" fill="#5E6B33" stroke="#2C2A1E"/><rect x="2" y="19" width="26" height="3" fill="#D4CCB0" stroke="#2C2A1E"/></svg>';

  // o explorador sempre começa em "Meu computador"
  var aberta = 'MC';

  // em qual unidade a pasta aberta está (C:, D:, P:) — só essa mostra as subpastas na árvore
  function unidadeDe(c) { return (c === 'MC' || c === 'DESK') ? '' : c.split('\\')[0]; }
  function nomeDe(u) { return u.rotulo ? t(u.rotulo) : u.caminho.split('\\').pop(); }
  function visivelNaArvore(u) { return u.nivel !== 1 || unidadeDe(u.caminho) === unidadeDe(aberta); }

  function t(obj) { return obj[window.JULES_IDIOMA === 'en' ? 'en' : 'pt']; }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }

  function desenhar() {
    var raiz = document.getElementById('explorador');
    if (!raiz) return;
    var atual = UNIDADES.filter(function (u) { return u.caminho === aberta; })[0] || UNIDADES[0];
    var endereco = atual.caminho === 'MC' ? t(atual.rotulo) : atual.caminho === 'DESK' ? 'C:\\' + t(atual.rotulo) :
      (atual.caminho.indexOf('\\') > -1 ? atual.caminho : atual.caminho + '\\');
    var desk = atual.caminho === 'DESK';
    var direita = raiz.querySelector('.ex-direita');
    direita.classList.toggle('desk-on', desk);
    raiz.querySelector('.ex-desk').hidden = !desk;

    raiz.querySelectorAll('[data-endereco]').forEach(function (el) { el.textContent = endereco; });

    // 1. lista de unidades e pastas
    // ordem: Área de trabalho, Meu computador, unidades (e as subpastas só da unidade aberta)
    var ordem = [UNIDADES[1], UNIDADES[0]].concat(UNIDADES.slice(2));
    raiz.querySelector('.ex-pastas').innerHTML = ordem.filter(visivelNaArvore).map(function (u) {
      var icone = u.caminho === 'MC' ? ICONE_MC : u.caminho === 'DESK' ? ICONE_DESK : (u.nivel === 0 ? ICONE_DISCO : ICONE_PASTA);
      var classe = u.nivel === -1 ? 'raiz' : 'nivel-' + u.nivel;
      return '<button type="button" class="ex-pasta ' + classe + '" aria-pressed="' + (u.caminho === aberta) + '" data-caminho="' + esc(u.caminho) + '">' +
        icone + '<span>' + esc(nomeDe(u)) + '</span></button>' + (u.caminho === 'DESK' ? '<span class="ex-sep" aria-hidden="true"></span>' : '');
    }).join('');

    // 1b. celular: a lista de pastas vira um menu suspenso no campo "Endereço"
    var sel = raiz.querySelector('.ex-select');
    if (sel) {
      sel.innerHTML = [UNIDADES[1], UNIDADES[0]].concat(UNIDADES.slice(2)).filter(visivelNaArvore).map(function (u) {
        var recuo = u.nivel === 0 ? '\u00A0\u00A0' : u.nivel === 1 ? '\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0└ ' : '';
        return '<option value="' + esc(u.caminho) + '"' + (u.caminho === aberta ? ' selected' : '') + '>' + recuo + esc(nomeDe(u)) + '</option>';
      }).join('');
    }

    // 2. painel da pasta aberta
    raiz.querySelector('.ex-titulo').textContent = t(atual.titulo);
    raiz.querySelector('.ex-desc').textContent = t(atual.desc);

    // 3. arquivos
    // dentro de uma subpasta: primeira linha "voltar" (pasta acima), como no Windows
    var acima = '';
    if (atual.nivel >= 0) {
      var pai = atual.nivel > 0 ? atual.caminho.split('\\')[0] : 'MC';
      var nomePai = pai === 'MC' ? t(UNIDADES[0].rotulo) : pai;
      acima = '<li class="ex-acima"><button type="button" class="ex-linha ativa" data-caminho="' + esc(pai) + '"><span class="ex-nome">' + (pai === 'MC' ? ICONE_MC : ICONE_PASTA) +
        '<span>.. <small>' + (window.JULES_IDIOMA === 'en' ? '(back to ' : '(voltar para ') + esc(nomePai) + ')</small></span></span><span class="ex-tipo"></span><span class="ex-ano"></span></button></li>';
    }
    raiz.querySelector('.ex-arquivos').innerHTML = acima + atual.itens.map(function (it) {
      var icone = it.disco ? ICONE_DISCO : it.pasta ? ICONE_PASTA : (it.estrela ? ICONE_ESTRELA : ICONE_ARQ);
      var aqui = it.aqui ? ' <span class="ex-aqui">' + esc(t(it.aqui)) + '</span>' : '';
      var conteudo = '<span class="ex-nome">' + icone + '<span>' + esc(it.nome) + aqui + '</span></span>' +
        '<span class="ex-tipo">' + esc(t(it.tipo)) + '</span><span class="ex-ano">' + esc(it.ano) + '</span>';
      if (it.pasta) return '<li><button type="button" class="ex-linha ativa" data-caminho="' + esc(it.pasta) + '">' + conteudo + '</button></li>';
      if (it.link) return '<li><a class="ex-linha ativa" href="' + esc(it.link) + '">' + conteudo + '</a></li>';
      return '<li><span class="ex-linha">' + conteudo + '</span></li>';
    }).join('');

    var qtd = desk ? 5 : atual.itens.length;
    raiz.querySelector('.ex-qtd').textContent = qtd + (window.JULES_IDIOMA === 'en' ? ' object(s)' : ' objeto(s)');
  }

  document.addEventListener('click', function (e) {
    var alvo = e.target.closest && e.target.closest('#explorador [data-caminho]');
    if (!alvo) return;
    aberta = alvo.getAttribute('data-caminho');
    desenhar();
  });
  // Links que abrem uma pasta específica, ex.: index.html#pasta-code
  // (usado nos botões OK das conquistas, na página Sobre)
  var ATALHOS = {
    'pastas': 'MC',
    'area-de-trabalho': 'DESK',
    'pasta-code': 'C:',
    'pasta-design': 'D:',
    'pasta-identidade-e-marca': 'D:\\identidade-e-marca',
    'pasta-social-media': 'D:\\social-media'
  };
  function abrirPeloEndereco() {
    var alvo = ATALHOS[location.hash.slice(1)];
    if (!alvo) return;
    aberta = alvo;
    desenhar();
    var secao = document.getElementById('pastas');
    if (secao) secao.scrollIntoView();
  }

  document.addEventListener('change', function (e) {
    if (!e.target.classList || !e.target.classList.contains('ex-select')) return;
    aberta = e.target.value;
    desenhar();
  });
  document.addEventListener('idioma', desenhar);
  document.addEventListener('DOMContentLoaded', function () { desenhar(); abrirPeloEndereco(); });
  window.addEventListener('hashchange', abrirPeloEndereco);
  // "Abrir as pastas", "Projetos" no menu etc. levam pra #pastas: mesmo se o endereço já for #pastas,
  // o explorador volta para "Meu computador"
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href$="#pastas"]');
    if (!a || e.target.closest('#explorador')) return;
    aberta = 'MC';
    desenhar();
  });
})();
