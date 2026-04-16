let s1 = document.getElementById("s1");
let s2 = document.getElementById("s2");
let s3 = document.getElementById("s3");
let main = document.getElementById("main");

// 🔊 SOUND FIX
let tick = document.getElementById("tickSound");

// SCREEN FLOW
setTimeout(()=>{
  s1.classList.remove("active");
  s2.classList.add("active");
},3000);

setTimeout(()=>{
  s2.classList.remove("active");
  s3.classList.add("active");
},6000);

// START BUTTON
document.getElementById("startBtn").onclick = ()=>{
  document.getElementById("wrap").style.display="none";
  main.style.display="block";

  tick.currentTime = 0;
  tick.play();

  startTimer();
};

// TIMER
let total = 480;
let hand = document.getElementById("hand");
let timerEl = document.getElementById("timer");

let interval;

// IMAGE PATH (SMALL LETTERS FIX)
const avatarStates = Array.from({length:8},(_,i)=>({
  happy:`avatar${i+1}_happy.jpeg`,
  normal:`avatar${i+1}_normal.jpeg`,
  sad:`avatar${i+1}_sad.jpeg`,
  cry:`avatar${i+1}_cry.jpeg`
}));

// EMOTION
function updateEmotion(min){
  let state;

  if(min>=6) state="happy";
  else if(min>=4) state="normal";
  else if(min>=2) state="sad";
  else state="cry";

  let images = document.querySelectorAll(".avatar img");
  let avatars = document.querySelectorAll(".avatar");

  images.forEach((img,i)=>{

    let finalState = avatarStates[i][state] ? state : "happy";
    img.src = avatarStates[i][finalState];

    avatars[i].classList.remove("cry");
    if(finalState==="cry") avatars[i].classList.add("cry");
  });
}

// TIMER
function startTimer(){

  interval = setInterval(()=>{

    if(total <= 0){
      clearInterval(interval);
      timerEl.innerText = "00:00";
      startShake();
      showTimeUp();
      tick.pause();
      return;
    }

    let m = Math.floor(total/60);
    let s = total%60;

    timerEl.innerText =
      String(m).padStart(2,'0')+":"+
      String(s).padStart(2,'0');

    hand.style.transform = `rotate(${s*6}deg)`;

    updateEmotion(m);

    if(total <= 10){
      startShake();
    }

    total--;

  },1000);
}

// TIME UP
function showTimeUp(){
  let msg = document.createElement("div");
  msg.innerText = "TIME'S UP Thank You!";
  msg.style.position = "absolute";
  msg.style.top = "50%";
  msg.style.left = "50%";
  msg.style.transform = "translate(-50%,-50%)";
  msg.style.fontSize = "50px";
  msg.style.color = "red";
  msg.style.fontWeight = "bold";
  msg.style.zIndex = "999";
  document.body.appendChild(msg);
}

// AVATAR CREATE (FIXED CIRCLE)
let container = document.getElementById("avatars");

for(let i=1;i<=8;i++){
  let div = document.createElement("div");
  div.className="avatar";

  let angle = (i/8)*360;
  let radius = 220;

  let x = Math.cos(angle * Math.PI/180) * radius;
  let y = Math.sin(angle * Math.PI/180) * radius;

  div.style.top = "50%";
  div.style.left = "50%";
  div.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;

  div.innerHTML = `
    <img src="avatar${i}_happy.jpeg"
    onerror="this.src='https://via.placeholder.com/80'">
  `;

  let img = div.querySelector("img");
  img.onload = function(){
    this.classList.add("loaded");
  };

  container.appendChild(div);
}

// SHAKE
function startShake(){
  document.querySelectorAll(".avatar")
    .forEach(a=>a.classList.add("shake"));
}

function stopShake(){
  document.querySelectorAll(".avatar")
    .forEach(a=>a.classList.remove("shake"));
}
