let s1 = document.getElementById("s1");
let s2 = document.getElementById("s2");
let s3 = document.getElementById("s3");
let main = document.getElementById("main");

// SCREEN FLOW
setTimeout(()=>{
  s1.classList.remove("active");
  s2.classList.add("active");
}, 10000);

setTimeout(()=>{
  s2.classList.remove("active");
  s3.classList.add("active");
}, 20000);

// START BUTTON
document.getElementById("startBtn").onclick = ()=>{
  document.getElementById("wrap").style.display = "none";
  main.style.display = "block";

  launchPopper();

  let tick = document.getElementById("tickSound");
  tick.currentTime = 0;
  tick.play();

  startTimer();
};

// TIMER VARIABLES
let total = 480;
let hand = document.getElementById("hand");
let timerEl = document.getElementById("timer");
let interval;
let shakeStarted = false; // ✅ FIX: ek baar hi shake shuru ho

// IMAGE PATHS
const avatarStates = Array.from({length:8}, (_,i) => ({
  happy:  `avatar${i+1}_happy.jpeg`,
  normal: `avatar${i+1}_normal.jpeg`,
  sad:    `avatar${i+1}_sad.jpeg`,
  cry:    `avatar${i+1}_cry.jpeg`
}));

// AVATAR CREATE
let container = document.getElementById("avatars");
let avatarEls = []; // ✅ FIX: array banaya

for(let i = 1; i <= 8; i++){
  let div = document.createElement("div");
  div.className = "avatar";
  div.id = "av" + i; // ✅ FIX: id diya

  let angle = ((i-1) / 8) * 360;
  let radius = 220;
  let x = Math.cos(angle * Math.PI / 180) * radius;
  let y = Math.sin(angle * Math.PI / 180) * radius;

  div.style.top = "50%";
  div.style.left = "50%";
  div.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;

  div.innerHTML = `
    <img src="avatar${i}_happy.jpeg"
    onerror="this.src='https://via.placeholder.com/80'">
  `;

  let img = div.querySelector("img");
  img.onload = function(){ this.classList.add("loaded"); };

  container.appendChild(div);
  avatarEls.push(div); // ✅ FIX: array mein push
}

// EMOTION UPDATE
function updateEmotion(min){
  let state;
  if(min >= 6)      state = "happy";
  else if(min >= 4) state = "normal";
  else if(min >= 2) state = "sad";
  else              state = "cry";

  let images  = document.querySelectorAll(".avatar img");
  let avatars = document.querySelectorAll(".avatar");

  images.forEach((img, i) => {
    let finalState = avatarStates[i][state] ? state : "happy";
    img.src = avatarStates[i][finalState];

    avatars[i].classList.remove("cry");
    if(finalState === "cry") avatars[i].classList.add("cry");
  });
}

// TIMER
function startTimer(){
  interval = setInterval(()=>{

    if(total <= 0){
      clearInterval(interval);
      timerEl.innerText = "00:00";

      let tick = document.getElementById("tickSound");
      tick.pause();
      tick.currentTime = 0;

      stopShake(); // ✅ FIX: shake band

      document.getElementById("timeUpScreen").classList.add("show");
      return;
    }

    let m = Math.floor(total / 60);
    let s = total % 60;

    timerEl.innerText =
      String(m).padStart(2,'0') + ":" +
      String(s).padStart(2,'0');

    hand.style.transform = `rotate(${s * 6}deg)`;

    updateEmotion(m);

    // ✅ FIX: sirf ek baar shake shuru ho
    if(total <= 10 && !shakeStarted){
      shakeStarted = true;
      startShake();
    }

    total--;

  }, 1000);
}

// SHAKE START
function startShake(){
  avatarEls.forEach(el => {
    const baseTransform = el.style.transform || '';
    el.dataset.baseTransform = baseTransform;

    const id = 'shake_' + el.id;
    const existing = document.getElementById(id);
    if(existing) existing.remove();

    const style = document.createElement('style');
    style.id = id;
    style.textContent = `
      @keyframes ${id} {
        0%,100% { transform: ${baseTransform} translate(0,0) rotate(0deg); }
        15%     { transform: ${baseTransform} translate(-4px,-3px) rotate(-1deg); }
        30%     { transform: ${baseTransform} translate(4px,2px) rotate(1deg); }
        45%     { transform: ${baseTransform} translate(-5px,1px) rotate(-0.5deg); }
        60%     { transform: ${baseTransform} translate(5px,-2px) rotate(1deg); }
        75%     { transform: ${baseTransform} translate(-3px,3px) rotate(-1deg); }
        90%     { transform: ${baseTransform} translate(3px,-1px) rotate(0.5deg); }
      }
    `;
    document.head.appendChild(style);
    el.style.animation = `${id} 0.45s ease-in-out infinite`;
  });
}

// SHAKE STOP
function stopShake(){
  avatarEls.forEach(el => {
    el.style.animation = 'none';
    if(el.dataset.baseTransform !== undefined){
      el.style.transform = el.dataset.baseTransform;
    }
    const s = document.getElementById('shake_' + el.id);
    if(s) s.remove();
  });
}

// CONFETTI POPPER
function launchPopper(){
  const corners = ["top-left", "top-right", "bottom-left", "bottom-right"];

  let popperInterval = setInterval(()=>{
    corners.forEach(pos => {
      let cont = document.querySelector(".popper." + pos);
      if(!cont) return;

      for(let i = 0; i < 10; i++){
        let conf = document.createElement("div");
        conf.className = "confetti";
        conf.style.setProperty("--x", (Math.random() * 300 - 150) + "px");

        if(pos.includes("bottom")){
          conf.style.setProperty("--y", (-Math.random() * 300 - 100) + "px");
        } else {
          conf.style.setProperty("--y", (Math.random() * 300 + 100) + "px");
        }

        cont.appendChild(conf);
      }
    });
  }, 300);

  setTimeout(()=>{
    clearInterval(popperInterval);
    document.querySelectorAll(".popper").forEach(e => e.innerHTML = "");
  }, 120000);
}
