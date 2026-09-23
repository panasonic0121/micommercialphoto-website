const header=document.querySelector('.site-header');
const menu=document.querySelector('.site-header .menu');
if(header&&menu){
  menu.addEventListener('click',()=>{
    const open=header.classList.toggle('open');
    menu.setAttribute('aria-expanded',String(open));
    menu.textContent=open?'×':'☰';
  });
  header.querySelectorAll('nav a').forEach(link=>link.addEventListener('click',()=>{
    header.classList.remove('open');
    menu.setAttribute('aria-expanded','false');
    menu.textContent='☰';
  }));
}
