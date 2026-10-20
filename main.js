const rm=matchMedia('(prefers-reduced-motion:reduce)').matches;
function cnt(el){const t=+el.dataset.count;let s;const f=x=>{s=s||x;const p=Math.min((x-s)/1300,1);el.textContent=Math.round(t*p)+'%';if(p<1)requestAnimationFrame(f)};requestAnimationFrame(f)}
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);if(e.target.dataset.count&&!rm)cnt(e.target)}}),{threshold:.2});
document.querySelectorAll('.rv,.line,.row,[data-count]').forEach(el=>rm?el.classList.add('in'):io.observe(el));
const m=document.querySelector('.mark');if(m&&!rm)addEventListener('scroll',()=>m.style.setProperty('--p',Math.min(scrollY/450,1)),{passive:true});
