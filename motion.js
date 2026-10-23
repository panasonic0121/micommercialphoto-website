(function(){
  var reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var body=document.body;
  var progress=document.createElement('div');
  progress.className='scroll-progress';
  progress.setAttribute('aria-hidden','true');
  body.appendChild(progress);

  var revealSelectors=[
    '.hero-copy','.pixel-stage','.intro>div','.features article',
    '.section-head>div','.section-head>p','.service-card','.service-shortcuts',
    '.process li','.faq>div','.faq details','.review-game','.contact>div',
    '.info-hero>div','.info-card','.spec-row','.notice','.info-cta',
    '.portfolio-hero>div','.gallery-card','.portfolio-cta>div','.portfolio-cta>a',
    '.faq-intro>div','.faq-game','.faq-cta>div','.faq-cta>a',
    '.retouch-intro>div','.comparison-section .section-heading','.case-tabs',
    '.comparison-layout','.boundary-section .section-heading','.boundary-grid article',
    '.retouch-faq .section-heading','.retouch-faq details','.retouch-cta>div','.retouch-cta>a'
  ];

  var titleSelector=[
    '.hero h1','.intro h2','.section-head h2','.reviews-heading h2','.faq h2','.contact h2',
    '.portfolio-intro h1','.gallery-top h2','.portfolio-cta h2',
    '.faq-intro h1','.faq-cta h2','.info-hero h1','.info-section h2',
    '.retouch-intro h1','.section-heading h2','.retouch-cta h2'
  ].join(',');

  var nodes=[];
  revealSelectors.forEach(function(selector){
    document.querySelectorAll(selector).forEach(function(node){
      if(nodes.indexOf(node)===-1) nodes.push(node);
    });
  });

  nodes.forEach(function(node,index){
    node.classList.add('motion-reveal');
    if(node.matches('p,a,details,.case-tabs')) node.classList.add('motion-soft');
    var parent=node.parentElement;
    if(parent){
      var siblings=Array.prototype.filter.call(parent.children,function(el){
        return el.matches('.motion-reveal,.service-card,article,li,details,.gallery-card');
      });
      var order=siblings.indexOf(node);
      if(order>0) node.style.setProperty('--motion-delay',Math.min(order*70,280)+'ms');
    }
  });

  var titles=[];
  document.querySelectorAll(titleSelector).forEach(function(title){
    title.classList.add('motion-title');
    titles.push(title);
  });

  body.classList.add('motion-enabled');

  if(!reduceMotion&&'IntersectionObserver' in window){
    var observer=new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('motion-visible');
          observer.unobserve(entry.target);
        }
      });
    },{threshold:.1,rootMargin:'0px 0px -7% 0px'});
    nodes.forEach(function(node){observer.observe(node)});

    var titleParents=[];
    titles.forEach(function(title){
      if(title.parentElement&&titleParents.indexOf(title.parentElement)===-1){
        titleParents.push(title.parentElement);
      }
    });
    var titleObserver=new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.querySelectorAll('.motion-title').forEach(function(title){title.classList.add('motion-visible')});
          titleObserver.unobserve(entry.target);
        }
      });
    },{threshold:.08,rootMargin:'0px 0px -7% 0px'});
    titleParents.forEach(function(parent){titleObserver.observe(parent)});
  }else{
    nodes.forEach(function(node){node.classList.add('motion-visible')});
    titles.forEach(function(title){title.classList.add('motion-visible')});
  }

  function updateScroll(){
    var y=window.scrollY||document.documentElement.scrollTop;
    var max=document.documentElement.scrollHeight-window.innerHeight;
    progress.style.transform='scaleX('+(max>0?Math.min(y/max,1):0)+')';
    body.classList.toggle('has-scrolled',y>18);
  }
  updateScroll();
  window.addEventListener('scroll',updateScroll,{passive:true});

  document.querySelectorAll('a[href]').forEach(function(link){
    link.addEventListener('click',function(event){
      if(reduceMotion||event.defaultPrevented||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey) return;
      if(link.target==='_blank'||link.hasAttribute('download')) return;
      var href=link.getAttribute('href');
      if(!href||href.charAt(0)==='#'||href.indexOf('mailto:')===0||href.indexOf('tel:')===0) return;
      var url=new URL(link.href,window.location.href);
      if(url.origin!==window.location.origin) return;
      event.preventDefault();
      body.classList.add('page-leaving');
      window.setTimeout(function(){window.location.href=url.href},180);
    });
  });

  var refreshTargets=document.querySelectorAll('.comparison-notes');
  refreshTargets.forEach(function(target){
    var timer;
    new MutationObserver(function(){
      window.clearTimeout(timer);
      target.classList.remove('dialog-refresh');
      void target.offsetWidth;
      target.classList.add('dialog-refresh');
      timer=window.setTimeout(function(){target.classList.remove('dialog-refresh')},460);
    }).observe(target,{subtree:true,childList:true,characterData:true});
  });

  document.querySelectorAll('.gallery-viewport').forEach(function(viewport){
    var cards=Array.prototype.slice.call(viewport.querySelectorAll('.gallery-card'));
    var controls=viewport.parentElement.querySelector('.gallery-controls');
    if(!cards.length||!controls) return;
    var counter=document.createElement('span');
    counter.className='gallery-frame-counter';
    counter.setAttribute('aria-live','polite');
    controls.appendChild(counter);
    var ticking=false;
    function updateCounter(){
      var gap=18;
      var step=(cards[0]?.getBoundingClientRect().width||viewport.clientWidth)+gap;
      var nearest=Math.max(0,Math.min(cards.length-1,Math.round(viewport.scrollLeft/step)));
      var text='FRAME '+String(nearest+1).padStart(2,'0')+' / '+String(cards.length).padStart(2,'0');
      if(counter.textContent!==text){
        counter.textContent=text;
        counter.classList.remove('is-changing');
        void counter.offsetWidth;
        counter.classList.add('is-changing');
        window.setTimeout(function(){counter.classList.remove('is-changing')},260);
      }
      ticking=false;
    }
    viewport.addEventListener('scroll',function(){
      if(!ticking){ticking=true;window.requestAnimationFrame(updateCounter)}
    },{passive:true});
    window.addEventListener('resize',updateCounter,{passive:true});
    updateCounter();
  });

  var gameScreen=document.querySelector('.game-screen');
  if(gameScreen){
    var ownerIdle=document.createElement('span');
    ownerIdle.className='owner-idle';
    ownerIdle.setAttribute('aria-hidden','true');
    gameScreen.insertBefore(ownerIdle,gameScreen.querySelector('.scanlines'));
  }
})();
