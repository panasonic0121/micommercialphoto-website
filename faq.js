const answers={
  pose:'不用事先練習。拍攝時我會一步一步引導你的站姿、肩膀、視線和表情，即使平常不喜歡面對鏡頭，也能慢慢找到自然好看的角度。',
  retouch:'不會。我們保留你的五官比例、痣與個人特色，主要修整膚況、妝容、瀏海、髮絲和衣服細節，讓照片變精緻，但還是看得出是你。',
  booking:'建議先預約，才能保留完整的拍攝、挑片與溝通時間。你可以直接透過 LINE 告訴我們想拍的項目和希望日期。',
  clothes:'衣服款式沒有規定，依照個人喜好即可。衣服顏色建議跟自身膚色搭配起來，膚色較白皙或有精神的皆可。',
  file:'拍攝完畢後，電子檔會寄 e-mail，也可自備隨身碟儲存。',
  time:'證件照有預約的話皆是一個小時內取件。形象照則看拍攝需求與修圖張數，約1-2天提供檔案。',
  size:'依照客人申辦的證件需求去輸出。'
};
const shell=document.querySelector('[data-game]');
const answerBox=document.querySelector('[data-answer]');
const soundButton=document.querySelector('[data-sound]');
const questionButtons=[...document.querySelectorAll('[data-question]')];
let soundOn=true;
let audioContext;
let typingTimer;

function audio(){
  if(!audioContext) audioContext=new (window.AudioContext||window.webkitAudioContext)();
  if(audioContext.state==='suspended') audioContext.resume();
  return audioContext;
}

function tone(frequency=440,duration=.07,volume=.035){
  if(!soundOn) return;
  const ctx=audio();
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

function dialogueBlip(index){
  if(!soundOn) return;
  const notes=[196,220,208,233,220];
  const note=notes[index%notes.length];
  tone(note,.055,.026);
  tone(note*2,.028,.007);
}

function typeAnswer(text){
  window.clearInterval(typingTimer);
  answerBox.textContent='';
  let index=0;
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduced){answerBox.textContent=text;return}
  typingTimer=window.setInterval(()=>{
    answerBox.textContent+=text[index]||'';
    if(index%2===0&&text[index]&&!/[，。！？、；：\s]/.test(text[index])) dialogueBlip(Math.floor(index/2));
    index+=1;
    if(index>=text.length) window.clearInterval(typingTimer);
  },28);
}

function selectQuestion(button){
  questionButtons.forEach(item=>item.classList.toggle('active',item===button));
  shell.classList.remove('answering');
  void shell.offsetWidth;
  shell.classList.add('answering');
  typeAnswer(answers[button.dataset.question]);
  window.setTimeout(()=>shell.classList.remove('answering'),1100);
}

questionButtons.forEach(button=>button.addEventListener('click',()=>selectQuestion(button)));
soundButton.addEventListener('click',()=>{
  soundOn=!soundOn;
  soundButton.setAttribute('aria-pressed',String(!soundOn));
  soundButton.textContent=soundOn?'♪ 音效 ON':'♪ 音效 OFF';
  if(soundOn) tone(660,.08,.035);
});
