'use strict';
(() => {
  const panel=document.querySelector('#sf-depth-panel');
  if(!panel)return;
  const stage=panel.querySelector('.sf-depth-stage');
  const track=panel.querySelector('.sf-depth-photos');
  const prev=panel.querySelector('[data-depth-prev]');
  const next=panel.querySelector('[data-depth-next]');
  const caption=panel.querySelector('#sf-depth-caption');
  const count=panel.querySelector('#sf-depth-count');
  const photos=[...document.querySelectorAll('#galeria .album .photo')].map(fig=>{
    const img=fig.querySelector('img');
    return {src:img?.getAttribute('src'),alt:img?.alt||'',caption:fig.querySelector('figcaption span')?.textContent||''};
  }).filter(p=>p.src);
  if(!photos.length||![stage,track,prev,next,caption,count].every(Boolean))return;
  let index=0, cards=[], start=null;
  function build(){
    if(cards.length)return;
    cards=photos.map((photo,i)=>{
      const card=document.createElement('button');
      card.type='button';
      card.className='sf-depth-card';
      card.setAttribute('aria-label','Selecionar fotografia '+(i+1)+': '+photo.caption);
      const img=document.createElement('img');
      img.src=photo.src;img.alt=photo.alt;img.decoding='async';img.loading='lazy';
      card.append(img);
      card.addEventListener('click',()=>{
        if(i===index){
          const event=new CustomEvent('sf:open-photo',{cancelable:true,detail:{index:i,opener:card}});
          if(document.dispatchEvent(event))location.assign(photo.src);
          return;
        }
        index=i;render();card.focus({preventScroll:true});
      });
      track.append(card);
      return card;
    });
  }
  function render(){
    cards.forEach((card,i)=>{
      let offset=i-index;
      if(offset>photos.length/2)offset-=photos.length;
      if(offset< -photos.length/2)offset+=photos.length;
      const visible=Math.abs(offset)<=2;
      const distance=Math.abs(offset);
      card.style.setProperty('--card-x',offset*53+'%');
      card.style.setProperty('--card-z',distance*-115+'px');
      card.style.setProperty('--card-angle',offset*-21+'deg');
      card.style.setProperty('--card-x-mobile',offset*42+'%');
      card.style.setProperty('--card-z-mobile',distance*-85+'px');
      card.style.setProperty('--card-angle-mobile',offset*-18+'deg');
      card.style.setProperty('--card-order',String(10-distance));
      card.style.setProperty('--card-brightness',String(1-distance*.23));
      card.hidden=!visible;
      card.tabIndex=offset===0?0:-1;
      card.setAttribute('aria-current',offset===0?'true':'false');
      card.setAttribute('aria-label',(offset===0?'Ampliar':'Selecionar')+' fotografia '+(i+1)+': '+photos[i].caption);
    });
    caption.textContent=photos[index].caption;
    count.textContent=(index+1)+' / '+photos.length;
  }
  function move(dir){
    index=(index+dir+photos.length)%photos.length;
    render();
  }
  panel.addEventListener('sf:depth-open',()=>{build();render()});
  prev.addEventListener('click',()=>move(-1));
  next.addEventListener('click',()=>move(1));
  panel.addEventListener('keydown',e=>{
    if(e.key==='ArrowLeft'||e.key==='ArrowRight'){
      e.preventDefault();move(e.key==='ArrowLeft'?-1:1);
      if(e.target.classList.contains('sf-depth-card'))cards[index].focus({preventScroll:true});
    }
  });
  stage.addEventListener('touchstart',e=>{
    start=e.touches.length===1?[e.touches[0].clientX,e.touches[0].clientY]:null;
  },{passive:true});
  stage.addEventListener('touchcancel',()=>{start=null},{passive:true});
  stage.addEventListener('touchend',e=>{
    if(!start)return;
    const dx=e.changedTouches[0].clientX-start[0],dy=e.changedTouches[0].clientY-start[1];start=null;
    if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)*1.5)move(dx<0?1:-1);
  },{passive:true});
  panel.dataset.ready='true';
})();
