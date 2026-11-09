/* =====================================================================
   contato.js — assistente de contato em 3 etapas
   ---------------------------------------------------------------------
   1. Assunto: a pessoa escolhe o tipo de serviço.
   2. Detalhes: nome, mensagem e prazo (tudo opcional).
   3. Caminho: o site indica o canal certo e já escreve a mensagem.
      - vaga / proposta de trabalho  -> LinkedIn
      - só trocar uma ideia          -> Discord
      - todo o resto                 -> e-mail (oi@creativejul.es)
   Nada é enviado pelo site: o botão abre o e-mail, o LinkedIn ou o
   Discord, e a mensagem pronta pode ser copiada.
   ===================================================================== */
(function () {
  var EMAIL = 'oi@creativejul.es';
  var OPCOES = [
    { canal: 'email', pt: ['Identidade visual / marca', 'logo, paleta, manual de marca'], en: ['Visual identity / brand', 'logo, palette, brand guidelines'] },
    { canal: 'email', pt: ['Social media', 'posts, feed, campanhas'], en: ['Social media', 'posts, feed, campaigns'] },
    { canal: 'email', pt: ['Apresentações e key visuals', 'decks, relatórios, campanhas'], en: ['Presentations and key visuals', 'decks, reports, campaigns'] },
    { canal: 'email', pt: ['Site ou interface', 'site responsivo, landing page, UI'], en: ['Website or interface', 'responsive site, landing page, UI'] },
    { canal: 'email', pt: ['Testes / QA', 'testar fluxos, achar e reportar bugs'], en: ['Testing / QA', 'test flows, find and report bugs'] },
    { canal: 'linkedin', pt: ['Vaga ou proposta de trabalho', 'recrutamento, contratação'], en: ['Job opening or offer', 'recruiting, hiring'] },
    { canal: 'discord', pt: ['Só quero trocar uma ideia', 'games, comunidade, um oi'], en: ['I just want to chat', 'games, community, a hello'] }
  ];
  var PRAZOS = { pt: ['Sem pressa', 'Este mês', 'Urgente'], en: ['No rush', 'This month', 'Urgent'] };
  var CANAIS = {
    email: { icone: '@', link: null,
      pt: { nome: 'E-mail', porque: 'Pra projetos, o e-mail é o melhor: dá pra mandar referências e briefing, e eu respondo com calma e com orçamento.', acao: 'Abrir meu e-mail', obs: 'Se o seu e-mail não abrir sozinho, copie a mensagem e envie para ' + EMAIL + '.' },
      en: { nome: 'Email', porque: 'For projects, email is best: you can send references and a brief, and I reply calmly, with a quote.', acao: 'Open my email', obs: 'If your email app doesn’t open, copy the message and send it to ' + EMAIL + '.' } },
    linkedin: { icone: 'in', link: 'https://www.linkedin.com/in/julliaht/',
      pt: { nome: 'LinkedIn', porque: 'Pra vagas e propostas, o LinkedIn é o melhor lugar: lá está meu histórico completo e eu respondo recrutadores por mensagem.', acao: 'Abrir meu LinkedIn', obs: 'Copie a mensagem e cole na conversa do LinkedIn.' },
      en: { nome: 'LinkedIn', porque: 'For openings and offers, LinkedIn is the best place: my full history is there and I answer recruiters by message.', acao: 'Open my LinkedIn', obs: 'Copy the message and paste it into the LinkedIn chat.' } },
    discord: { icone: '#', link: 'https://discord.gg/6fMatUvej8',
      pt: { nome: 'Discord', porque: 'Pra trocar uma ideia sem compromisso, o Discord é mais rápido: entra no servidor e me chama.', acao: 'Entrar no Discord', obs: 'Copie a mensagem e mande no canal ou na minha DM.' },
      en: { nome: 'Discord', porque: 'For a casual chat, Discord is faster: join the server and ping me.', acao: 'Join the Discord', obs: 'Copy the message and send it in the channel or in my DMs.' } }
  };
  var T = {
    pt: { etapa: 'Etapa {n} de 3', voltar: '< Voltar', avancar: 'Avançar >', recomecar: 'Recomeçar', copiar: 'Copiar mensagem', copiado: 'Copiado!', semNome: '(seu nome)',
      phNome: 'Como posso te chamar?', phMsg: 'O que você tem em mente? Marca, site, prazo, referências...',
      corpo: function (d) { return 'Oi, jules! Meu nome é ' + d.nome + '.\n\nEstou procurando: ' + d.servico + '.\nPrazo: ' + d.prazo.toLowerCase() + '.' + (d.msg ? '\n\n' + d.msg : '') + '\n\nVim pelo creativejul.es'; }, assunto: 'Assunto: ' },
    en: { etapa: 'Step {n} of 3', voltar: '< Back', avancar: 'Next >', recomecar: 'Start over', copiar: 'Copy message', copiado: 'Copied!', semNome: '(your name)',
      phNome: 'What should I call you?', phMsg: 'What do you have in mind? Brand, website, timeline, references...',
      corpo: function (d) { return 'Hi, jules! My name is ' + d.nome + '.\n\nI’m looking for: ' + d.servico + '.\nTimeline: ' + d.prazo.toLowerCase() + '.' + (d.msg ? '\n\n' + d.msg : '') + '\n\nFound you at creativejul.es'; }, assunto: 'Subject: ' }
  };

  var st = { etapa: 1, op: null, prazo: 1, copiado: false };
  function L() { return window.JULES_IDIOMA === 'en' ? 'en' : 'pt'; }

  document.addEventListener('DOMContentLoaded', function () {
    var $ = function (s) { return document.querySelector(s); };
    var nome = $('#c-nome'), msg = $('#c-msg');
    var boxOp = $('.ct-opcoes'), boxPrazo = $('.ct-prazos');

    function textoMensagem() {
      var l = L(), t = T[l];
      var servico = st.op === null ? '' : OPCOES[st.op][l][0];
      var dados = { nome: nome.value.trim() || t.semNome, servico: servico, prazo: PRAZOS[l][st.prazo], msg: msg.value.trim() };
      var corpo = t.corpo(dados);
      var assunto = servico + ' — ' + dados.nome;
      return { corpo: corpo, assunto: assunto, completa: (OPCOES[st.op] && OPCOES[st.op].canal === 'email' ? t.assunto + assunto + '\n\n' : '') + corpo };
    }

    function desenhar(focar) {
      var l = L(), t = T[l];
      // etapas
      document.querySelectorAll('.ct-etapa').forEach(function (e) { e.hidden = Number(e.getAttribute('data-etapa')) !== st.etapa; });
      document.querySelectorAll('.ct-passos li').forEach(function (li, i) {
        li.className = i + 1 === st.etapa ? 'atual' : (i + 1 < st.etapa ? 'feito' : '');
      });
      // etapa 1: opções
      boxOp.innerHTML = OPCOES.map(function (o, i) {
        var on = st.op === i;
        return '<button type="button" class="ct-op" role="radio" aria-checked="' + on + '" data-i="' + i + '"><span class="ct-radio" aria-hidden="true"></span><span><b>' + o[l][0] + '</b><span>' + o[l][1] + '</span></span></button>';
      }).join('');
      // etapa 2
      $('.ct-servico').textContent = st.op === null ? '' : OPCOES[st.op][l][0];
      nome.placeholder = t.phNome; msg.placeholder = t.phMsg;
      boxPrazo.innerHTML = PRAZOS[l].map(function (p, i) {
        return '<button type="button" class="b98" role="radio" aria-checked="' + (st.prazo === i) + '" aria-pressed="' + (st.prazo === i) + '" data-i="' + i + '">' + p + '</button>';
      }).join('');
      // etapa 3
      if (st.op !== null) {
        var c = CANAIS[OPCOES[st.op].canal], m = textoMensagem();
        $('.ct-icone').textContent = c.icone;
        $('.ct-canal-nome').textContent = c[l].nome;
        $('.ct-porque').textContent = c[l].porque;
        $('.ct-msg').textContent = m.completa;
        var ir = $('.ct-ir');
        ir.textContent = c[l].acao;
        ir.href = c.link || ('mailto:' + EMAIL + '?subject=' + encodeURIComponent(m.assunto) + '&body=' + encodeURIComponent(m.corpo));
        $('.ct-obs').textContent = c[l].obs;
      }
      $('.ct-copiar').textContent = st.copiado ? t.copiado : t.copiar;
      // rodapé
      $('.ct-etapa-txt').textContent = t.etapa.replace('{n}', st.etapa);
      var voltar = $('.ct-voltar'), avancar = $('.ct-avancar');
      voltar.textContent = t.voltar;
      voltar.disabled = st.etapa === 1;
      avancar.textContent = st.etapa === 3 ? t.recomecar : t.avancar;
      avancar.disabled = st.etapa === 1 && st.op === null;
      if (focar) { var h = document.querySelector('.ct-etapa:not([hidden]) h2'); if (h) { h.setAttribute('tabindex', '-1'); h.focus(); } }
    }

    boxOp.addEventListener('click', function (e) {
      var b = e.target.closest('.ct-op'); if (!b) return;
      st.op = Number(b.getAttribute('data-i')); desenhar(false);
      boxOp.querySelector('[data-i="' + st.op + '"]').focus();
    });
    boxPrazo.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      st.prazo = Number(b.getAttribute('data-i')); desenhar(false);
    });
    $('.ct-voltar').addEventListener('click', function () { st.etapa = Math.max(1, st.etapa - 1); st.copiado = false; desenhar(true); });
    $('.ct-avancar').addEventListener('click', function () {
      if (st.etapa === 3) { st = { etapa: 1, op: null, prazo: 1, copiado: false }; nome.value = ''; msg.value = ''; }
      else if (!(st.etapa === 1 && st.op === null)) st.etapa++;
      desenhar(true);
    });
    $('.ct-copiar').addEventListener('click', function () {
      var texto = textoMensagem().completa;
      function ok() { st.copiado = true; desenhar(false); }
      try {
        navigator.clipboard.writeText(texto).then(ok, function () { selecionar(); });
      } catch (e) { selecionar(); }
      function selecionar() { var r = document.createRange(); r.selectNodeContents($('.ct-msg')); var s = getSelection(); s.removeAllRanges(); s.addRange(r); }
    });
    document.addEventListener('idioma', function () { desenhar(false); });
    desenhar(false);
  });
})();
