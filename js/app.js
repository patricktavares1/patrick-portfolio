const menuLinks = document.querySelectorAll('.nav-border a[href^="#"]');

function getDistanceFromTheTop(element) {
  const id = element.getAttribute("href");
  return document.querySelector(id).offsetTop;
}

function scrollToSection(event) {
  event.preventDefault();
  const distanceFromTheTop = getDistanceFromTheTop(event.target) - 90;
  smoothScrollTo(0, distanceFromTheTop);
}

menuLinks.forEach((link) => {
  link.addEventListener("click", scrollToSection);
});

function smoothScrollTo(endX, endY, duration) {
  const startX = window.scrollX || window.pageXOffset;
  const startY = window.scrollY || window.pageYOffset;
  const distanceX = endX - startX;
  const distanceY = endY - startY;
  const startTime = new Date().getTime();

  duration = typeof duration !== "undefined" ? duration : 400;

  const easeInOutQuart = (time, from, distance, duration) => {
    if ((time /= duration / 2) < 1)
      return (distance / 2) * time * time * time * time + from;
    return (-distance / 2) * ((time -= 2) * time * time * time - 2) + from;
  };

  const timer = setInterval(() => {
    const time = new Date().getTime() - startTime;
    const newX = easeInOutQuart(time, startX, distanceX, duration);
    const newY = easeInOutQuart(time, startY, distanceY, duration);
    if (time >= duration) {
      clearInterval(timer);
    }
    window.scroll(newX, newY);
  }, 1000 / 60);
}

window.sr = ScrollReveal({ reset: true });

sr.reveal('.container-text, #wrapper, .container-info, .about-text, .about-my, .about-info, .skillls-text, .cards, .contando-text, .cont-text, .by-pk', { duration: 1000 });

let rid = null;
const spring = 0.09;
const friction = 0.02;
let divs = Array.from(document.querySelectorAll(".innerdiv"));

class Chart {
  constructor(path,text,target) {
    this.path = path;
    this.text = text;
    this.text.textContent = target+"%";
    this.R = 10;
    this.start = .01;
    this.divisions = 100;
    this.vel = 0;    
    this.stylePath(target)    
  }
  
  stylePath(target) {
    let d = `M${this.R},0  A${this.R},${this.R} 0 1,1 ${this.R},-.01z`;
    this.path.setAttributeNS(null,"d",d);
    this.pathLength = this.path.getTotalLength();
    this.unit = this.pathLength / this.divisions;
    this.strokeLength = this.start*this.unit;
    this.target = target*this.unit;
    this.path.style.strokeDasharray = `${this.strokeLength},${this.pathLength -
      this.strokeLength}`;
    }
  
    updateStrokeLength() {
    this.dist = this.target - this.strokeLength;
    this.acc = this.dist * spring;
    this.vel += this.acc;
    this.vel *= friction;
    this.strokeLength += this.vel;
    this.path.style.strokeDasharray = `${this.strokeLength},${this.pathLength -
      this.strokeLength}`;
  }  
}

let charts = [];

charts.push(new Chart(aPath,aText,70));
charts.push(new Chart(bPath,bText,40));
charts.push(new Chart(gPath,gText,20));

function Frame() {
  rid = window.requestAnimationFrame(Frame);
  charts.map((c) => c.updateStrokeLength() )
}
Frame();

divs.map((div) =>{
  div.addEventListener("input", function(){  
charts.map((c) => {
 if(isNaN(parseInt(c.text.textContent))){c.text.textContent = 0+"%";}
  if(parseInt(c.text.textContent) > 100) {c.text.textContent = 100+"%";}
  if(rid){window.cancelAnimationFrame(rid)}
  c.target = (parseInt(c.text.textContent) || 0 ) * c.unit;
  if(!c.text.textContent.match("%"))
    {c.text.textContent += "%";}
  Frame();  
});  
});
});