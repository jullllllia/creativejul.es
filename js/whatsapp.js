/* =====================================================================
   whatsapp.js — o número do WhatsApp Business fica SÓ AQUI
   ---------------------------------------------------------------------
   Como preencher: código do país (55) + DDD + número, tudo junto,
   sem espaço, traço, parêntese ou "+".  Ex.: '5511912345678'
   Enquanto estiver vazio (''), os botões aparecem, mas o link abre o
   WhatsApp sem destinatário. Depois de preencher, abre direto a conversa.
   ===================================================================== */
window.JULES_WHATSAPP = '';

(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var numero = window.JULES_WHATSAPP;
    var texto = encodeURIComponent('Oi, jules! Vim pelo creativejul.es.');
    document.querySelectorAll('[data-whatsapp]').forEach(function (a) {
      a.href = 'https://wa.me/' + numero + '?text=' + texto;
      a.hidden = false;
    });
  });
})();
