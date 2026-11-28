'use strict';
function createFilmReel(root, onFrameChange) {
  const reel = root.querySelector('.film-reel');
  const viewport = reel.querySelector('.film-window');
  const ring = reel.querySelector('.film-ring');
  const strip = reel.querySelector('.film-strip');
  const play = reel.querySelector('.film-play');
  const photos = [...root.querySelectorAll('.im-photo')];
  const holders = photos.map(photo => photo.parentElement);
  const cuts = [
    ['O primeiro', 'encontro.', 'O rosto que você passou meses imaginando, agora tão perto do seu.'],
    ['Um beijo', 'de boas-vindas.', 'Ainda de touca, ele se inclina para dar o primeiro beijo.'],
    ['Na ponta', 'dos pés.', 'Um pezinho se estica por um segundo. De perto, dá para ver cada dobrinha.'],
    ['Dentro', 'da manta.', 'Só o rostinho de fora. Os olhos já começam a procurar.'],
    ['Cabe mais', 'um abraço.', 'Três rostos dividem o espaço que antes era de dois.'],
    ['Pela primeira vez,', 'juntos.', 'Por um instante, toda a sala cabe nesse olhar.']
  ];
  const originals = [...root.querySelectorAll('.im-scene .im-copy')].map(copy => copy.cloneNode(true));
  const loupe = reel.querySelector('.film-loupe');
  const lens = reel.querySelector('.film-lens');
  function closeLens(){
    loupe.hidden=true;
    lens.setAttribute('aria-pressed','false');
    lens.textContent='Lupa';
  }
  function inspect(x,y){
    const image=photos[index].querySelector('img');
    if(!image.naturalWidth)return;
    const bounds=image.getBoundingClientRect();
    const area=viewport.getBoundingClientRect();
    const radius=loupe.offsetWidth/2;
    const px=Math.max(bounds.left,Math.min(bounds.right,x));
    const py=Math.max(bounds.top,Math.min(bounds.bottom,y));
    const scale=Math.max(bounds.width/image.naturalWidth,bounds.height/image.naturalHeight);
    const width=image.naturalWidth*scale, height=image.naturalHeight*scale;
    const [fx,fy]=getComputedStyle(image).objectPosition.split(' ').map(v=>parseFloat(v)/100);
    loupe.style.left=(px-area.left)+'px';loupe.style.top=(py-area.top)+'px';
    loupe.style.backgroundImage='url("'+ image.src +'")';
    loupe.style.backgroundSize=(width*1.9)+'px '+(height*1.9)+'px';
    loupe.style.backgroundPosition=(radius-1.9*(px-bounds.left-(bounds.width-width)*fx))+'px '+(radius-1.9*(py-bounds.top-(bounds.height-height)*fy))+'px';
  }
  lens.onclick=()=>{
    if(!loupe.hidden){closeLens();return}
    stop();loupe.hidden=false;
    lens.textContent='Fechar lupa';lens.setAttribute('aria-pressed','true');
    const area=viewport.getBoundingClientRect();
    inspect(area.left+area.width*.62,area.top+area.height*.38);
  };
  let index = 0;
  let timer = 0;
  let watching = false;
  let start = null;
  let blockClick = false;
  const buttons = photos.map((photo, i) => {
    const button = document.createElement('button');
    const thumb = photo.querySelector('img').cloneNode();
    thumb.alt = '';
    button.type = 'button';
    button.setAttribute('aria-label','Ver fotografia: ' + photo.querySelector('img').alt);
    button.append(thumb);
    button.onclick = () => { stop(); go(i); };
    strip.append(button);
    return button;
  });
  function stop() {
    clearTimeout(timer);
    watching = false;
    reel.removeAttribute('data-playing');
    play.textContent = '▷ Assistir sequência';
    play.setAttribute('aria-pressed','false');
  }
  function schedule() {
    clearTimeout(timer);
    if (!watching) return;
    timer = setTimeout(() => {
      if (index === photos.length-1) { stop(); onFrameChange(6); }
      else go(index+1);
    },6500);
  }
  function go(i) {
    index = (i + photos.length) % photos.length;
    onFrameChange(index);
    schedule();
  }
  function show(chapter,flat) {
    closeLens();
    reel.hidden = flat || chapter === 3;
    if (reel.hidden) stop();
    if (flat) {
      photos.forEach((photo,i) => {
        holders[i].append(photo);
        photo.inert = false;
      });
      originals.slice(0,3).forEach((original,i)=>{
        const copy=root.querySelector('#scene-'+i+' .im-copy');
        copy.querySelector('h2').innerHTML=original.querySelector('h2').innerHTML;
        copy.querySelector('p:not(.im-eyebrow)').textContent=original.querySelector('p:not(.im-eyebrow)').textContent;
      });
      return;
    }
    if (chapter === 3) return;
    if (Math.floor(index/2) !== chapter) index=chapter*2;
    const copy=root.querySelector('#scene-'+chapter+' .im-copy');
    const title=copy.querySelector('h2');
    const italic=document.createElement('em');
    italic.textContent=cuts[index][1];
    title.replaceChildren(cuts[index][0]+' ',italic);
    copy.querySelector('p:not(.im-eyebrow)').textContent=cuts[index][2];
    photos.forEach((photo,i)=>{
      if(photo.parentElement !== ring) ring.append(photo);
      photo.inert=i!==index;
      photo.dataset.current=String(i===index);
      buttons[i].setAttribute('aria-pressed',String(i===index));
    });
    root.dataset.frame=String(index);
    schedule();
  }
  play.onclick=()=>{
    if(watching){stop();return;}
    closeLens();watching=true;
    reel.dataset.playing='true';
    play.textContent='Ⅱ Pausar sequência';
    play.setAttribute('aria-pressed','true');
    if(index===photos.length-1)go(0);else schedule();
  };
  reel.querySelector('.film-open').onclick=()=>{stop();photos[index].click()};
  ring.addEventListener('click',stop);
  root.querySelector('.im-dock').addEventListener('click',stop);
  root.addEventListener('keydown',event=>{
    if(reel.hidden || !['ArrowLeft','ArrowRight'].includes(event.key))return;
    event.preventDefault();stop();go(index+(event.key==='ArrowLeft'?-1:1));
    buttons[index].focus({preventScroll:true});
  });
  viewport.addEventListener('dragstart',e=>e.preventDefault());
  viewport.addEventListener('pointerdown',e=>{
    if(!e.isPrimary||e.button!==0)return;
    if(!loupe.hidden){viewport.setPointerCapture(e.pointerId);inspect(e.clientX,e.clientY);return;}
    start={id:e.pointerId,x:e.clientX};blockClick=false;
  });
  viewport.addEventListener('pointermove',e=>{
    if(!loupe.hidden){inspect(e.clientX,e.clientY);return;}
    if(start?.id!==e.pointerId || !e.buttons)return;
    const distance=e.clientX-start.x;
    if(Math.abs(distance)>10){
      viewport.setPointerCapture(e.pointerId);blockClick=true;
      viewport.style.setProperty('--drag',Math.max(-9,Math.min(9,distance/23))+'deg');
    }
  });
  function finish(e){
    if(start?.id!==e.pointerId)return;
    const distance=e.clientX-start.x;
    start=null;viewport.style.removeProperty('--drag');
    if(e.type==='pointerup' && Math.abs(distance)>32){stop();go(index+(distance<0?1:-1))}
  }
  for(const type of ['pointerup','pointercancel','lostpointercapture'])viewport.addEventListener(type,finish);
  viewport.addEventListener('click',e=>{
    if((blockClick || !loupe.hidden) && e.detail){e.preventDefault();e.stopPropagation();blockClick=false}
  },true);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stop()});
  return {show};
}
