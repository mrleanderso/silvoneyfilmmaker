'use strict';
function createFilmReel(root, onFrameChange) {
  const reel = root.querySelector('.film-reel');
  const viewport = reel.querySelector('.film-window');
  const ring = reel.querySelector('.film-ring');
  const caption = reel.querySelector('.film-caption');
  const photos = [...root.querySelectorAll('.im-photo')];
  const holders = photos.map(photo => photo.parentElement);
  const scenes = [...root.querySelectorAll('.im-scene')];
  const step = 360 / photos.length;
  let position = 0;
  let drag = null;
  let suppressClick = false;

  function frame() {
    return ((position % photos.length) + photos.length) % photos.length;
  }

  function paint(offset = 0) {
    ring.style.setProperty('--angle', (offset - position * step) + 'deg');
  }

  function show(chapter, flat) {
    if (flat) {
      photos.forEach((photo, i) => {
        holders[i].append(photo);
        photo.inert = false;
      });
    }
    reel.hidden = flat || chapter === 3;
    if (reel.hidden) return;
    if (Math.floor(frame() / 2) !== chapter) position = chapter * 2;
    if (reel.parentElement !== scenes[chapter]) scenes[chapter].append(reel);
    photos.forEach((photo, i) => {
      if (photo.parentElement !== ring) ring.append(photo);
      photo.style.setProperty('--face', i * step + 'deg');
      photo.inert = i !== frame();
    });
    caption.textContent = photos[frame()].querySelector('img').alt;
    paint();
  }

  function advance(direction) {
    position += direction;
    onFrameChange(frame());
  }

  reel.querySelector('.film-prev').onclick = () => advance(-1);
  reel.querySelector('.film-next').onclick = () => advance(1);
  reel.addEventListener('keydown', event => {
    if (!['ArrowLeft','ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    advance(event.key === 'ArrowLeft' ? -1 : 1);
    photos[frame()].focus({preventScroll:true});
  });
  viewport.addEventListener('dragstart', event => event.preventDefault());
  viewport.addEventListener('pointerdown', event => {
    if (!event.isPrimary || event.button !== 0) return;
    suppressClick = false;
    drag = { id: event.pointerId, start: event.clientX, moved: false };
  });
  viewport.addEventListener('pointermove', event => {
    if (drag?.id !== event.pointerId || !event.buttons) return;
    const delta = event.clientX - drag.start;
    if (!drag.moved && Math.abs(delta) < 8) return;
    drag.moved = true;
    viewport.setPointerCapture(event.pointerId);
    ring.classList.add('dragging');
    paint(Math.max(-step, Math.min(step, delta / viewport.clientWidth * 130)));
  });
  function finish(event) {
    if (drag?.id !== event.pointerId) return;
    const delta = event.clientX - drag.start;
    suppressClick = drag.moved;
    drag = null;
    ring.classList.remove('dragging');
    if (event.type === 'pointerup' && Math.abs(delta) > viewport.clientWidth * .09) advance(delta < 0 ? 1 : -1);
    else paint();
  }
  viewport.addEventListener('pointerup', finish);
  viewport.addEventListener('pointercancel', finish);
  viewport.addEventListener('lostpointercapture', finish);
  viewport.addEventListener('click', event => {
    if (suppressClick && event.detail) {
      event.preventDefault();
      event.stopPropagation();
      suppressClick = false;
    }
  }, true);
  return { show };
}
