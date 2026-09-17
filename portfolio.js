const viewport=document.querySelector('.gallery-viewport');
const cards=[...document.querySelectorAll('.gallery-card')];
const move=direction=>{const gap=18;const distance=(cards[0]?.getBoundingClientRect().width||viewport.clientWidth)+gap;viewport.scrollBy({left:direction*distance,behavior:'smooth'})};
document.querySelector('[data-prev]').addEventListener('click',()=>move(-1));
document.querySelector('[data-next]').addEventListener('click',()=>move(1));
viewport.addEventListener('keydown',event=>{if(event.key==='ArrowLeft'){event.preventDefault();move(-1)}if(event.key==='ArrowRight'){event.preventDefault();move(1)}});
