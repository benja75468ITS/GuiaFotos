// Tablas: etiquetas para la vista móvil
document.querySelectorAll('table').forEach(t=>{
  const h=[...t.querySelectorAll('tr:first-child th')].map(x=>x.textContent);
  t.querySelectorAll('tr').forEach(r=>[...r.querySelectorAll('td')].forEach((c,i)=>c.dataset.label=h[i]||''));
});
// Fotos: carga diferida y quita la etiqueta cuando la imagen existe
const fotos=[...document.querySelectorAll('.ph')];
const cargar=el=>{
  const u=el.dataset.src;if(!u)return;
  const i=new Image();i.onload=()=>{el.style.setProperty('--img','url("'+new URL(u,document.baseURI).href+'")');el.classList.add('ok')};i.src=u;
};
fotos.forEach(el=>{
  const m=(el.style.getPropertyValue('--img')||'').match(/url\(([^)]+)\)/);
  if(m){el.dataset.src=m[1].replace(/['"]/g,'');el.style.removeProperty('--img')}
});
if('IntersectionObserver' in window){
  const o=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){cargar(e.target);o.unobserve(e.target)}}),{rootMargin:'400px'});
  fotos.forEach(el=>o.observe(el));
}else fotos.forEach(cargar);
// Modo claro / oscuro
const r=document.documentElement,b=document.getElementById('tema');
try{const s=localStorage.getItem('tema');if(s)r.dataset.theme=s}catch(e){}
b.onclick=()=>{
  const dark=r.dataset.theme?r.dataset.theme==='dark':matchMedia('(prefers-color-scheme:dark)').matches;
  r.dataset.theme=dark?'light':'dark';
  try{localStorage.setItem('tema',r.dataset.theme)}catch(e){}
};

// Menú
const menu=document.getElementById('menu'),mb=document.getElementById('menuBtn'),mt=document.getElementById('menuTxt');
function setMenu(open){
  menu.classList.toggle('open',open);document.body.classList.toggle('menu-open',open);
  mb.setAttribute('aria-expanded',open);mt.textContent=open?'Cerrar':'Menú';
  if(open)menu.querySelector('a').focus();else mb.focus({preventScroll:true});
}
mb.onclick=()=>setMenu(!menu.classList.contains('open'));
menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{menu.classList.remove('open');document.body.classList.remove('menu-open');mb.setAttribute('aria-expanded',false);mt.textContent='Menú'}));
addEventListener('keydown',e=>{if(e.key==='Escape'&&menu.classList.contains('open'))setMenu(false)});
matchMedia('(min-width:1200px)').addEventListener('change',e=>{if(e.matches){menu.classList.remove('open');document.body.classList.remove('menu-open');mb.setAttribute('aria-expanded',false);mt.textContent='Menú'}});
// Sección actual
const aqui=document.getElementById('aqui');
if('IntersectionObserver' in window){
  const so=new IntersectionObserver(es=>es.forEach(e=>{
    if(!e.isIntersecting)return;
    const a=menu.querySelector('a[href="#'+e.target.id+'"]');if(!a)return;
    menu.querySelectorAll('a').forEach(x=>x.removeAttribute('aria-current'));
    a.setAttribute('aria-current','true');
    document.querySelectorAll('.dnav a').forEach(x=>x.removeAttribute('aria-current'));
    const d=document.querySelector('.dnav a[href="#'+e.target.id+'"]');if(d)d.setAttribute('aria-current','true');
    aqui.innerHTML=a.dataset.n==='00'?'':'<b>'+a.dataset.n+'</b> · '+a.lastChild.textContent;
  }),{rootMargin:'-40% 0px -55% 0px'});
  document.querySelectorAll('section[id]').forEach(x=>so.observe(x));
}
