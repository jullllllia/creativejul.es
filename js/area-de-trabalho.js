/* =====================================================================
   area-de-trabalho.js — a "Área de trabalho" escondida no explorador
   ---------------------------------------------------------------------
   Quando a pessoa clica em "Área de trabalho" (explorador.js), o lado
   direito vira uma tela de computador com ícones. Aqui ficam:
   1. abrir/fechar as janelinhas (fotos.jpg, cobrinha.exe, termo.exe)
   2. o relógio da barra de tarefas
   3. o jogo da cobrinha
   4. o termo (adivinhe a palavra de 5 letras)
   As fotos entram na pasta fotos.jpg quando os rolos forem digitalizados.
   ===================================================================== */
function en(){return window.JULES_IDIOMA==='en'}

// 1. janelas
(function(){
  document.addEventListener('click',function(e){
    var abre=e.target.closest&&e.target.closest('[data-abre]');
    if(abre){var w=document.getElementById('dk-w-'+abre.getAttribute('data-abre'));if(w){w.hidden=false;
      // a última janela aberta fica por cima
      document.querySelectorAll('.dk-jan').forEach(function(j){j.style.zIndex=j===w?3:2})}
      if(abre.getAttribute('data-abre')==='jogo')setTimeout(function(){var t=document.getElementById('cb-tab');if(t)t.focus({preventScroll:true})},50);
      return}
    var fecha=e.target.closest&&e.target.closest('[data-fecha]');
    if(fecha){var f=document.getElementById(fecha.getAttribute('data-fecha'));if(f)f.hidden=true}
  });
})();

// 2. relógio
(function(){
  var h=document.getElementById('dk-hora');if(!h)return;
  function tique(){var d=new Date();h.textContent=('0'+d.getHours()).slice(-2)+':'+('0'+d.getMinutes()).slice(-2)}
  tique();setInterval(tique,20000);
})();

// ---------- cobrinha.exe jogável ----------
(function(){
  if(!document.getElementById('cb'))return;
  function inicio(){return en()?'press an arrow<br>or tap to start':'aperte uma seta<br>ou toque para começar'}
  var cv=document.getElementById('cb'),ctx=cv.getContext('2d'),N=16,T=cv.width/N;
  var msg=document.getElementById('cb-msg'),pts=document.getElementById('cb-pts'),rec=document.getElementById('cb-rec'),tab=document.getElementById('cb-tab');
  var recorde=0;try{recorde=+localStorage.getItem('jules-cobrinha')||0}catch(e){}
  rec.textContent=recorde;
  var cobra,dir,prox,fruta,vivo=false,timer=null,pontos=0;
  function nova(){do{fruta=[Math.floor(Math.random()*N),Math.floor(Math.random()*N)]}while(cobra.some(function(p){return p[0]===fruta[0]&&p[1]===fruta[1]}))}
  function desenha(){
    ctx.fillStyle='#26301A';ctx.fillRect(0,0,cv.width,cv.height);
    ctx.fillStyle='#2E3A1F';for(var y=0;y<N;y++)for(var x=0;x<N;x++)if((x+y)%2)ctx.fillRect(x*T,y*T,T,T);
    ctx.fillStyle='#E4B028';ctx.fillRect(fruta[0]*T+3,fruta[1]*T+3,T-6,T-6);
    cobra.forEach(function(p,i){ctx.fillStyle=i===cobra.length-1?'#EDEBDD':'#A3B35C';ctx.fillRect(p[0]*T+1,p[1]*T+1,T-2,T-2)});
  }
  function reinicia(){cobra=[[4,8],[5,8],[6,8]];dir=[1,0];prox=[1,0];pontos=0;pts.textContent=0;nova();desenha()}
  function passo(){
    dir=prox;var c=cobra[cobra.length-1],n=[c[0]+dir[0],c[1]+dir[1]];
    if(n[0]<0||n[1]<0||n[0]>=N||n[1]>=N||cobra.some(function(p){return p[0]===n[0]&&p[1]===n[1]})){return fim()}
    cobra.push(n);
    if(n[0]===fruta[0]&&n[1]===fruta[1]){pontos++;pts.textContent=pontos;nova();clearInterval(timer);timer=setInterval(passo,Math.max(70,150-pontos*4))}
    else cobra.shift();
    desenha();
  }
  function comeca(){if(vivo)return;reinicia();vivo=true;msg.hidden=true;timer=setInterval(passo,150);tab.focus()}
  function fim(){
    vivo=false;clearInterval(timer);
    if(pontos>recorde){recorde=pontos;rec.textContent=recorde;try{localStorage.setItem('jules-cobrinha',recorde)}catch(e){}}
    msg.innerHTML=en()?'game over · '+pontos+' point(s)<br>tap or press an arrow':'fim de jogo · '+pontos+' ponto(s)<br>toque ou aperte uma seta';msg.hidden=false;
  }
  function vira(d){if(!vivo){comeca()}if(d[0]===-dir[0]&&d[1]===-dir[1])return;prox=d}
  var K={ArrowUp:[0,-1],ArrowDown:[0,1],ArrowLeft:[-1,0],ArrowRight:[1,0]};
  tab.addEventListener('keydown',function(e){if(K[e.key]){e.preventDefault();vira(K[e.key])}});
  msg.addEventListener('click',comeca);
  document.querySelectorAll('.cb-ctrl button').forEach(function(b){b.addEventListener('click',function(){vira(b.getAttribute('data-d').split(',').map(Number))})});
  var t0=null;tab.addEventListener('touchstart',function(e){t0=[e.touches[0].clientX,e.touches[0].clientY]},{passive:true});
  tab.addEventListener('touchend',function(e){if(!t0)return;var dx=e.changedTouches[0].clientX-t0[0],dy=e.changedTouches[0].clientY-t0[1];t0=null;
    if(Math.max(Math.abs(dx),Math.abs(dy))<20){comeca();return}
    vira(Math.abs(dx)>Math.abs(dy)?[dx>0?1:-1,0]:[0,dy>0?1:-1])});
  // ao fechar a janela, pausa o jogo
  document.querySelector('[data-fecha="dk-w-jogo"]').addEventListener('click',function(){if(vivo){vivo=false;clearInterval(timer);msg.innerHTML=inicio();msg.hidden=false}});
  document.querySelector('[data-abre="jogo"]').addEventListener('click',function(){setTimeout(function(){tab.focus()},50)});
  msg.innerHTML=inicio();
  document.addEventListener('idioma',function(){if(!vivo&&!msg.hidden&&pontos===0)msg.innerHTML=inicio()});
  reinicia();
})();

// ---------- termo.exe ----------
(function(){
  // palavras de 5 letras do universo design / code / play / foto (sem acento)
  var PALAVRAS=['PIXEL','FONTE','GRADE','CORES','TEXTO','JOGOS','MOUSE','TECLA','PASTA','MARCA','TRACO','PAPEL','FILME','FOTOS','LENTE','PONTO','VERDE','SERIF','LINHA','BOTAO','CAMPO','CICLO','DADOS','FLUXO','LAYER','SALVA','BRUSH','PALCO','MUNDO','NIVEL','FASES','PLACA','TINTA','ARTES','CODEX','BUGAR','TESTE','LOJAS','ICONE','TELAS'];
  if(!document.getElementById('tm-grade'))return;
  var grade=document.getElementById('tm-grade'),tec=document.getElementById('tm-teclado'),info=document.getElementById('tm-info');
  var segredo,tent,atual,acabou;
  var FILAS=['QWERTYUIOP','ASDFGHJKL','⌫ZXCVBNM↵'];
  function monta(){
    segredo=PALAVRAS[Math.floor(Math.random()*PALAVRAS.length)];tent=[];atual='';acabou=false;
    info.textContent=en()?'6 tries':'6 tentativas';
    grade.innerHTML=Array(6).fill(0).map(function(){return '<div class="tm-lin">'+Array(5).fill('<span class="tm-c"></span>').join('')+'</div>'}).join('');
    tec.innerHTML=FILAS.map(function(f){return '<div class="tm-fila">'+f.split('').map(function(k){
      var nome=k==='⌫'?'apagar':k==='↵'?'enviar':k;
      return '<button type="button" class="tm-k'+(k==='⌫'||k==='↵'?' larga':'')+'" data-k="'+(k==='⌫'?'DEL':k==='↵'?'OK':k)+'" aria-label="'+nome+'">'+(k==='⌫'?'APAGA':k==='↵'?'ENTER':k)+'</button>'}).join('')+'</div>'}).join('');
    pinta();
  }
  function pinta(){
    var linhas=grade.children;
    for(var i=0;i<6;i++){var cel=linhas[i].children,txt=i<tent.length?tent[i]:(i===tent.length?atual:'');
      for(var j=0;j<5;j++){cel[j].textContent=txt[j]||'';cel[j].classList.toggle('atual',i===tent.length&&j===atual.length&&!acabou)}}
  }
  function avalia(chute){
    var res=Array(5).fill('nao'),resto={};
    for(var i=0;i<5;i++){if(chute[i]===segredo[i])res[i]='certo';else resto[segredo[i]]=(resto[segredo[i]]||0)+1}
    for(var i=0;i<5;i++){if(res[i]!=='certo'&&resto[chute[i]]){res[i]='quase';resto[chute[i]]--}}
    return res;
  }
  function envia(){
    if(atual.length<5){var l=grade.children[tent.length];l.classList.remove('erro');void l.offsetWidth;l.classList.add('erro');return}
    var res=avalia(atual),cel=grade.children[tent.length].children;
    res.forEach(function(r,i){cel[i].classList.add(r);var k=tec.querySelector('[data-k="'+atual[i]+'"]');
      if(k&&!k.classList.contains('certo')){k.classList.remove('quase','nao');k.classList.add(r==='nao'&&k.classList.contains('quase')?'quase':r)}});
    tent.push(atual);
    if(atual===segredo){acabou=true;info.textContent=(en()?'got it in ':'acertou em ')+tent.length+'! ★'}
    else if(tent.length===6){acabou=true;info.textContent=(en()?'it was ':'era ')+segredo+(en()?' · try another':' · tente outra')}
    atual='';pinta();
  }
  function tecla(k){
    if(acabou)return;
    if(k==='OK')return envia();
    if(k==='DEL'){atual=atual.slice(0,-1);return pinta()}
    if(/^[A-Z]$/.test(k)&&atual.length<5){atual+=k;pinta()}
  }
  tec.addEventListener('click',function(e){var b=e.target.closest('.tm-k');if(b)tecla(b.getAttribute('data-k'))});
  document.addEventListener('keydown',function(e){
    if(document.getElementById('dk-w-termo').hidden)return;
    var w=document.getElementById('dk-w-termo'),a=document.activeElement;
    // só escuta o teclado com o foco dentro do termo (ou em lugar nenhum), pra não atrapalhar o resto do site
    if(w.closest('.ex-desk').hidden||(a&&a!==document.body&&!w.contains(a)))return;
    if(e.key==='Enter'){e.preventDefault();tecla('OK')}
    else if(e.key==='Backspace'){e.preventDefault();tecla('DEL')}
    else{var k=e.key.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase();if(/^[A-Z]$/.test(k))tecla(k)}
  });
  document.getElementById('tm-novo').addEventListener('click',monta);
  document.addEventListener('idioma',function(){if(!tent.length&&!acabou)info.textContent=en()?'6 tries':'6 tentativas'});
  var jt=document.getElementById('dk-w-termo');jt.tabIndex=-1;jt.addEventListener('mousedown',function(){setTimeout(function(){if(!jt.contains(document.activeElement))jt.focus({preventScroll:true})},0)});
  document.querySelector('[data-abre="termo"]').addEventListener('click',function(){setTimeout(function(){jt.focus({preventScroll:true})},50)});
  monta();
})();
