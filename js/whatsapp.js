/* =====================================================================
   whatsapp.js — o número do WhatsApp Business fica SÓ AQUI
   ---------------------------------------------------------------------
   Como preencher: código do país (55) + DDD + número, tudo junto,
   sem espaço, traço, parêntese ou "+".  Ex.: '5511912345678'
   Enquanto estiver vazio (''), nada de WhatsApp aparece no site:
   nem o link do rodapé, nem o botão no assistente de contato.
   ===================================================================== */
window.JULES_WHATSAPP = '';

(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var numero = window.JULES_WHATSAPP;
    if (!numero) return;
    var texto = encodeURIComponent('Oi, jules! Vim pelo creativejul.es.');
    document.querySelectorAll('[data-whatsapp]').forEach(function (a) {
      a.href = 'https://wa.me/' + numero + '?text=' + texto;
      a.hidden = false;
    });
  });
})();
