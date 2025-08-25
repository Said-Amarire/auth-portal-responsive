// ========================== Canvas Particle Network Background ==========================
const canvas = document.querySelector('.background-canvas');
const ctx = canvas.getContext('2d');
let particlesArray;
let mouse = { x: null, y: null, radius: 100 };

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

canvas.addEventListener('mousemove', function(event){
  mouse.x = event.x;
  mouse.y = event.y;
});

// Particle Class
class Particle {
  constructor(x, y, size, directionX, directionY, color) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.directionX = directionX;
    this.directionY = directionY;
    this.color = color;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI*2);
    ctx.fillStyle = this.color;
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 10;
    ctx.fill();
  }
  update() {
    if (this.x + this.size > canvas.width || this.x - this.size < 0) this.directionX = -this.directionX;
    if (this.y + this.size > canvas.height || this.y - this.size < 0) this.directionY = -this.directionY;
    this.x += this.directionX;
    this.y += this.directionY;

    let dx = mouse.x - this.x;
    let dy = mouse.y - this.y;
    let distance = Math.sqrt(dx*dx + dy*dy);
    if(distance < mouse.radius) {
      let forceDirectionX = dx / distance;
      let forceDirectionY = dy / distance;
      let maxDistance = mouse.radius;
      let force = (maxDistance - distance) / maxDistance;
      this.x -= forceDirectionX * force * 2;
      this.y -= forceDirectionY * force * 2;
    }
    this.draw();
  }
}

function initParticles() {
  particlesArray = [];
  let numberOfParticles = (canvas.height * canvas.width) / 7000;
  for(let i=0; i<numberOfParticles; i++){
    let size = (Math.random() * 2) + 1;
    let x = Math.random() * canvas.width;
    let y = Math.random() * canvas.height;
    let directionX = (Math.random() * 0.4) - 0.2;
    let directionY = (Math.random() * 0.4) - 0.2;
    let color = 'rgba(255, 165, 0, 0.6)';
    particlesArray.push(new Particle(x, y, size, directionX, directionY, color));
  }
}

function connectParticles() {
  for(let a=0; a<particlesArray.length; a++){
    for(let b=a; b<particlesArray.length; b++){
      let dx = particlesArray[a].x - particlesArray[b].x;
      let dy = particlesArray[a].y - particlesArray[b].y;
      let distance = Math.sqrt(dx*dx + dy*dy);
      if(distance < 120){
        ctx.beginPath();
        ctx.strokeStyle = `rgba(255,165,0,${1 - distance/120})`;
        ctx.lineWidth = 1;
        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
        ctx.stroke();
        ctx.closePath();
      }
    }
  }
}

function animateParticles() {
  requestAnimationFrame(animateParticles);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particlesArray.forEach(p => p.update());
  connectParticles();
}

initParticles();
animateParticles();

// ========================== Form Submission ==========================
const forms = ['loginForm', 'registerForm', 'forgotForm'];
forms.forEach(formId => {
  const form = document.getElementById(formId);
  if(form){
    form.addEventListener('submit', e => {
      e.preventDefault();
      if(formId === 'registerForm'){
        const fullName = document.getElementById('full-name');
        const userName = document.getElementById('username-register');
        const password = document.getElementById('new-password');
        const confirmPassword = document.getElementById('confirm-password');

        let valid = true;

        [fullName,userName,password,confirmPassword].forEach(f=>{
          f.style.borderColor = 'rgba(255,255,255,0.15)';
        });

        if(!fullName.value.trim()){ valid=false; fullName.style.borderColor='red'; fullName.classList.add('shake'); }
        if(!userName.value.trim()){ valid=false; userName.style.borderColor='red'; userName.classList.add('shake'); }
        if(password.value.length<6){ valid=false; password.style.borderColor='red'; password.classList.add('shake'); alert("Password must be at least 6 characters!"); }
        if(password.value!==confirmPassword.value){ valid=false; confirmPassword.style.borderColor='red'; confirmPassword.classList.add('shake'); alert("Passwords do not match!"); }

        setTimeout(()=>{ [fullName,userName,password,confirmPassword].forEach(f=>f.classList.remove('shake')); },500);

        if(valid){ alert("Registration Successful!"); form.reset(); }
      } else {
        alert("Form submitted successfully!");
        form.reset();
      }
    });
  }
});

// ========================== Toggle Password Visibility ==========================
const toggles = document.querySelectorAll('.toggle-password');
toggles.forEach(toggle=>{
  toggle.addEventListener('click', ()=>{
    const input = toggle.previousElementSibling;
    const eyeOpen = toggle.querySelector('#eye-open');
    const eyeClosed = toggle.querySelector('#eye-closed');
    if(input.type==='password'){
      input.type='text';
      eyeOpen.style.display='none';
      eyeClosed.style.display='block';
    } else {
      input.type='password';
      eyeOpen.style.display='block';
      eyeClosed.style.display='none';
    }
  });
});
