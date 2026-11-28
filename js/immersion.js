'use strict';
(() => {
  const root=document.querySelector('.im-stage');
  if(!root)return;
  const scenes=[...root.querySelectorAll('.im-scene')], nav=[...root.querySelectorAll('[data-scene-go]')];
  const mode=root.querySelector('#im-mode'), sound=root.querySelector('#im-sound'), dock=root.querySelector('.im-dock'), progress=root.querySelector('#im-progress-text');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let current=0, flat=false, frame=0, point=null;
  const names=['O encontro','Os detalhes','A família','Seu registro'];
  const reel=createFilmReel(root, index=>select(Math.floor(index/2)));
  function resetMotion(){cancelAnimationFrame(frame);frame=0;point=null;for(const key of ['--mx','--my','--dx','--dy','--rx','--ry'])root.style.removeProperty(key)}
  function select(i,focus=false){if(!Number.isInteger(i)||i<0||i>=scenes.length)return;current=i;reel.show(i,flat);root.dataset.scene=String(i);scenes.forEach((s,n)=>s.hidden=!flat&&n!==i);nav.forEach((b,n)=>b.setAttribute('aria-pressed',String(n===i)));progress.textContent='0'+(i+1)+' / 04 · '+names[i];resetMotion();if(focus){const h=scenes[i].querySelector('h2');h.tabIndex=-1;h.focus({preventScroll:true});scenes[i].scrollIntoView({block:'nearest',behavior:'instant'})}}
  function setFlat(value){flat=value;root.dataset.mode=flat?'flat':'immersive';mode.textContent=flat?'Imersão':'Vista calma';mode.setAttribute('aria-pressed',String(flat));dock.hidden=flat;select(current);root.querySelectorAll('[data-next]').forEach(b=>b.hidden=flat)}
  mode.hidden=false;sound.hidden=false;setFlat(reduced.matches);
  nav.forEach((b,i)=>b.addEventListener('click',()=>select(i,true)));
  root.querySelectorAll('[data-next]').forEach(b=>b.addEventListener('click',()=>select(Number(b.dataset.next),true)));
  mode.addEventListener('click',()=>setFlat(!flat));
  reduced.addEventListener?.('change',()=>{if(reduced.matches)setFlat(true)});
  function followPointer(e){if(flat||reduced.matches)return;const r=root.getBoundingClientRect();point=[Math.max(0,Math.min(1,(e.clientX-r.left)/r.width)),Math.max(0,Math.min(1,(e.clientY-r.top)/r.height))];if(frame)return;frame=requestAnimationFrame(()=>{frame=0;if(!point)return;const [x,y]=point;root.style.setProperty('--mx',x*100+'%');root.style.setProperty('--my',y*100+'%');root.style.setProperty('--dx',(x-.5)*12+'px');root.style.setProperty('--dy',(y-.5)*10+'px');root.style.setProperty('--rx',(y-.5)*-8+'deg');root.style.setProperty('--ry',(x-.5)*10+'deg')})}
  root.addEventListener('pointermove',followPointer);root.addEventListener('pointerdown',followPointer);
  root.addEventListener('pointerleave',resetMotion);root.addEventListener('pointercancel',resetMotion);
  const score=document.getElementById('score');
  let muted=false;
  try { muted=sessionStorage.getItem('sf-score-muted')==='yes'; } catch {}
  // The master level is also baked into the recording for mobile volume controls.
  score.volume=.42;
  function soundLabel(){
    sound.textContent=muted?'Som desligado':score.paused?'Ativar som':'Som baixo';
    sound.setAttribute('aria-pressed', String(!muted && !score.paused));
  }
  function startScore(){
    if(!muted && !document.hidden && score.paused)score.play().catch(soundLabel);
  }
  sound.addEventListener('click',()=>{
    muted=!score.paused && !muted;
    try {sessionStorage.setItem('sf-score-muted',muted?'yes':'no')} catch {}
    if(muted)score.pause();else startScore();
    soundLabel();
  });
  for(const type of ['playing','pause','error'])score.addEventListener(type,soundLabel);
  function startOnGesture(e){if(!sound.contains(e.target))startScore()}
  document.addEventListener('click',startOnGesture);
  document.addEventListener('pointerup',startOnGesture);
  document.addEventListener('keydown',startOnGesture);
  document.addEventListener('visibilitychange',()=>{
    if(document.hidden){score.pause();resetMotion()}else startScore();
  });
  addEventListener('pagehide',()=>score.pause());
  addEventListener('pageshow',startScore);
  soundLabel();startScore();
  const chat=root.querySelector('.im-chat'), message=chat.querySelector('.im-chat-message'), choices=chat.querySelector('.im-chat-choices'), answer=chat.querySelector('.im-chat-answer'), send=chat.querySelector('.im-send'), restart=chat.querySelector('.im-reset');
  let kind='',service='',favorite='';
  const choice=chat.querySelector('.film-choice');
  function updateChoice(){
    choice.hidden=!favorite;
    choice.textContent=favorite?'Momento escolhido · '+favorite:'';
    if(!send.hidden){
      const url=new URL(send.href);
      const base=url.searchParams.get('text').split(' O momento que escolhi:')[0];
      url.searchParams.set('text',base+(favorite?' O momento que escolhi: '+favorite+'.':''));
      send.href=url.href;
    }
  }
  function options(items,fn){choices.replaceChildren();items.forEach(label=>{const b=document.createElement('button');b.type='button';b.textContent=label;b.addEventListener('click',()=>fn(label));choices.append(b)})}
  function summary(){answer.textContent=[kind,service].filter(Boolean).join(' · ');answer.hidden=!answer.textContent}
  function begin(){kind=service='';summary();message.textContent='Você já sabe como será o parto?';send.hidden=true;restart.hidden=true;options(['Cesárea','Parto normal','Ainda não sei'],label=>{kind=label;summary();message.textContent='O que você gostaria de guardar desse dia?';options(['Fotografias','Filme','Fotografias e filme','Ainda quero conhecer'],label=>{service=label;summary();message.textContent='Tudo certo. Se quiser, podemos continuar pelo WhatsApp.';choices.replaceChildren();const text='Olá, Silvoney! Conheci a experiência Entre instantes e gostaria de saber mais. Tipo de parto: '+kind+'. Interesse: '+service+'.'+(favorite?' O momento que escolhi: '+favorite+'.':'');send.href='https://wa.me/5565984010597?text='+encodeURIComponent(text);send.hidden=false;restart.hidden=false;send.focus({preventScroll:true})});choices.firstElementChild?.focus({preventScroll:true})})}
  restart.addEventListener('click',()=>{begin();choices.firstElementChild?.focus()});chat.hidden=false;begin();
  const dialog=document.querySelector('.im-dialog'), large=dialog.querySelector('.im-large'), caption=dialog.querySelector('.im-dialog-caption');let opener=null;
  const save=dialog.querySelector('.film-save');
  function updateSave(){
    const chosen=favorite===large.alt;
    save.setAttribute('aria-pressed',String(chosen));
    save.textContent=chosen?'Remover escolha':'Escolher este momento';
  }
  save.addEventListener('click',()=>{
    favorite=favorite===large.alt?'':large.alt;
    updateSave();updateChoice();
    if(favorite)dialog.close();
  });
  root.querySelectorAll('.im-photo').forEach(a=>a.addEventListener('click',e=>{if(e.ctrlKey||e.metaKey||e.shiftKey||e.altKey||typeof dialog.showModal!=='function')return;e.preventDefault();opener=a;large.src=a.href;large.alt=a.querySelector('img').alt;caption.textContent=large.alt;updateSave();dialog.showModal()}));
  dialog.querySelector('.im-close').addEventListener('click',()=>dialog.close());dialog.addEventListener('close',()=>opener?.focus({preventScroll:true}));large.addEventListener('error',()=>{caption.textContent='Não foi possível carregar a fotografia. Feche e tente novamente.'});large.addEventListener('load',()=>{caption.textContent=large.alt});
})();
