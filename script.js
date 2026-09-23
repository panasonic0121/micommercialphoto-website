const header=document.querySelector('.site-header');const menu=document.querySelector('.menu');menu.addEventListener('click',()=>{const open=header.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));menu.textContent=open?'×':'☰'});document.querySelectorAll('nav a').forEach(a=>a.addEventListener('click',()=>{header.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.textContent='☰'}));

const reviews=[
  {name:'翁小姐',avatar:'翁',text:'幾年前在中西區拍護照成果很滿意，推薦我自己的朋友也很滿意，當時印象就很深刻。剛好要換證店家搬來東區，地方更舒適，技術還是一樣好。適合人面對鏡頭的尷尬笑歪都可以修正、當下討論，修片速度真的快又可以當下拿到照片！太喜歡了，一生推～～'},
  {name:'蔡小姐',avatar:'蔡',text:'趕辦護照 Google 找了一下評價超高的這間，拍照、修片到拿到成品約 40 分鐘。不化妝的臉上瑕疵、頭髮老是不聽話的問題，到超專業老闆手裡全部化腐朽為神奇，修得極度自然。袋子設計是舊磁碟片的包裝懷舊設計，覺得有用心也喜歡。除了完美、除了讚，找不到其他形容詞了。超級滿意！'},
  {name:'林小姐',avatar:'林',text:'環境很好！之前米商業在中西區時也過去拍攝過一次，最近有需要還是來找他們拍攝！攝影師也很好，會讓妳適度放鬆後再微笑，現場直接修圖也會問妳意見。修圖過程約 25–30 分、拍照過程約 5–8 分，最後把照片印出來再幫妳裁切，電子檔會寄信箱給你，整個結束約 45 分！快速又專業，之後有需要還是會來找他們拍。'},
  {name:'余小姐',avatar:'余',text:'真的要給米商業攝影的攝影師五星。來拍畢業照需要的證件照，本來很猶豫要去哪間，因為傳統的證件照不是我想要的。剛好學生有同學也推薦這邊，就想說來這邊試試看。攝影師很厲害，自己一人作業還會修片，不化妝來也不擔心拍起來會醜醜的，而且動作很迅速。如果之後有同學需要，也會推薦來這邊拍！'},
  {name:'B小姐',avatar:'B',text:'在網路上找了很多家，一直很猶豫不知道要哪一間才好。後來看了評論及米家的 FB 後，就決定來這裡了。老闆拍照很快速，也會引導你放鬆臉部表情，還說要笑（只要不露牙齒）。老闆的修片也很自然，還會問你需不需再修改，完全客製化、尊重客人的感覺。除了照片，老闆也會給電子檔。還好我選了這裡，照片非常好看，我超喜歡，大推。'},
  {name:'艾小姐',avatar:'艾',text:'老闆技術非常厲害，整個拍照流程迅速不拖泥帶水，而且對素顏懶得上妝的人來說是一大福音。拍完看到成品後馬上推薦給親朋好友，希望老闆可以一直生意興隆，我打算要在這家拍到 100 歲！'},
  {name:'S小姐',avatar:'S',text:'推推，快狠準！以前拍韓系證件照還要加價妝容，這間素顏去拍照就好了～很厲害。'}
];
const reviewButtons=document.querySelectorAll('[data-review]');const reviewName=document.querySelector('.review-meta h3');const reviewAvatar=document.querySelector('.review-avatar');const reviewText=document.querySelector('.review-text');
let reviewAudioContext;
let reviewTypingTimer;

function reviewAudio(){
  if(!reviewAudioContext) reviewAudioContext=new (window.AudioContext||window.webkitAudioContext)();
  if(reviewAudioContext.state==='suspended') reviewAudioContext.resume();
  return reviewAudioContext;
}

function reviewTone(frequency=220,duration=.055,volume=.023){
  const ctx=reviewAudio();
  const oscillator=ctx.createOscillator();
  const gain=ctx.createGain();
  oscillator.type='square';
  oscillator.frequency.value=frequency;
  gain.gain.setValueAtTime(volume,ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(.0001,ctx.currentTime+duration);
  oscillator.connect(gain).connect(ctx.destination);
  oscillator.start();
  oscillator.stop(ctx.currentTime+duration);
}

function reviewDialogueBlip(index){
  const notes=[196,220,208,233,220];
  const note=notes[index%notes.length];
  reviewTone(note,.055,.023);
  reviewTone(note*2,.028,.006);
}

function typeReview(text){
  window.clearInterval(reviewTypingTimer);
  reviewText.textContent='';
  let index=0;
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduced){reviewText.textContent=text;return}
  reviewText.classList.add('typing');
  reviewTypingTimer=window.setInterval(()=>{
    const character=text[index]||'';
    reviewText.textContent+=character;
    if(index%2===0&&character&&!/[，。！？、；：～\s]/.test(character)) reviewDialogueBlip(Math.floor(index/2));
    index+=1;
    if(index>=text.length){
      window.clearInterval(reviewTypingTimer);
      reviewText.classList.remove('typing');
    }
  },28);
}

function showReview(index,animate=false){
  const item=reviews[index];
  if(!item||!reviewName||!reviewAvatar||!reviewText)return;
  reviewName.textContent=item.name;
  reviewAvatar.textContent=item.avatar;
  if(animate){reviewAudio();typeReview(item.text)}else reviewText.textContent=item.text;
  reviewButtons.forEach(button=>{
    const selected=Number(button.dataset.review)===index;
    button.classList.toggle('active',selected);
    button.setAttribute('aria-pressed',String(selected));
  });
}

reviewButtons.forEach(button=>button.addEventListener('click',()=>showReview(Number(button.dataset.review),true)));
showReview(0);
