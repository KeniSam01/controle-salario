const KEY = "controle_salario_pwa_v1";
const categories = {
  Moradia:"⌂", Alimentação:"🍴", Transporte:"🚗", Lazer:"🎮",
  Contas:"📄", Compras:"🛍️", Saúde:"✚", Outros:"•"
};
const money = n => new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(n);
const today = () => new Date().toISOString().slice(0,10);
let data = JSON.parse(localStorage.getItem(KEY) || '{"salary":0,"expenses":[]}');

const $ = id => document.getElementById(id);
function save(){localStorage.setItem(KEY,JSON.stringify(data)); render();}
function parseMoney(v){return Number(String(v).replace(/\s/g,"").replace(/\./g,"").replace(",", ".")) || 0;}
function dateBR(s){return new Date(s+"T12:00:00").toLocaleDateString("pt-BR",{day:"2-digit",month:"2-digit"});}

function render(){
  const spent = data.expenses.reduce((a,e)=>a+e.amount,0);
  const remaining = data.salary-spent;
  const pct = data.salary ? Math.min(spent/data.salary*100,100) : 0;
  $("remaining").textContent = money(remaining);
  $("remaining").style.color = remaining < 0 ? "#ff3b30" : "";
  $("spent").textContent = money(spent);
  $("count").textContent = data.expenses.length;
  $("salaryLabel").textContent = "Salário "+money(data.salary);
  $("percentLabel").textContent = Math.round(pct)+"% usado";
  $("progressBar").style.width = pct+"%";
  $("progressBar").style.background = remaining < 0 ? "#ff3b30" : "";
  $("monthLabel").textContent = new Date().toLocaleDateString("pt-BR",{month:"long",year:"numeric"});
  const recent = [...data.expenses].sort((a,b)=>b.date.localeCompare(a.date)).slice(0,5);
  $("recentList").innerHTML = recent.length ? recent.map(expenseHTML).join("") :
    '<div class="expense"><div class="exp-icon">🧾</div><div class="exp-main"><div class="exp-title">Nenhum gasto cadastrado</div><div class="exp-cat">Adicione seu primeiro lançamento</div></div></div>';
  drawChart();
}
function expenseHTML(e){
  return `<div class="expense">
    <div class="exp-icon">${categories[e.category]||"•"}</div>
    <div class="exp-main"><div class="exp-title">${escapeHTML(e.title)}</div><div class="exp-cat">${e.category}</div></div>
    <div class="exp-right"><div class="exp-value">${money(e.amount)}</div><div class="exp-date">${dateBR(e.date)}</div></div>
  </div>`;
}
function escapeHTML(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));}

function drawChart(){
  const canvas=$("chart"), ctx=canvas.getContext("2d");
  const dpr=window.devicePixelRatio||1, rect=canvas.getBoundingClientRect();
  canvas.width=rect.width*dpr; canvas.height=260*dpr; ctx.scale(dpr,dpr);
  const w=rect.width,h=260, cx=w/2,cy=124,r=Math.min(92,w*.27);
  ctx.clearRect(0,0,w,h);
  const totals={}; data.expenses.forEach(e=>totals[e.category]=(totals[e.category]||0)+e.amount);
  const entries=Object.entries(totals).sort((a,b)=>b[1]-a[1]);
  const total=entries.reduce((a,e)=>a+e[1],0);
  if(!total){ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.strokeStyle="#e5e7eb";ctx.lineWidth=28;ctx.stroke();ctx.fillStyle="#6b7280";ctx.font="13px -apple-system";ctx.textAlign="center";ctx.fillText("Sem gastos",cx,cy+4);$("legend").innerHTML="";return;}
  let start=-Math.PI/2;
  const palette=["#0A84FF","#FF9500","#34C759","#AF52DE","#FF2D55","#5AC8FA","#8E8E93","#FFCC00"];
  entries.forEach((e,i)=>{
    const angle=e[1]/total*Math.PI*2;
    ctx.beginPath();ctx.arc(cx,cy,r,start,start+angle);ctx.strokeStyle=palette[i%palette.length];ctx.lineWidth=28;ctx.stroke();start+=angle;
  });
  ctx.fillStyle=getComputedStyle(document.body).color;ctx.font="700 16px -apple-system";ctx.textAlign="center";ctx.fillText(money(total),cx,cy+5);
  $("legend").innerHTML=entries.map((e,i)=>`<div><span>● ${escapeHTML(e[0])}</span><b>${money(e[1])}</b></div>`).join("");
}

function init(){
  Object.keys(categories).forEach(c=>{const o=document.createElement("option");o.value=c;o.textContent=c;$("category").appendChild(o)});
  $("date").value=today();
  $("addBtn").onclick=()=>{$("expenseDialog").showModal()};
  $("salaryBtn").onclick=()=>{$("salary").value=data.salary?data.salary.toFixed(2).replace(".",","):"";$("salaryDialog").showModal()};
  $("expenseForm").addEventListener("submit",e=>{
    e.preventDefault();
    const amount=parseMoney($("amount").value);
    if(!$("title").value.trim()||amount<=0)return;
    data.expenses.push({id:crypto.randomUUID(),title:$("title").value.trim(),amount,category:$("category").value,date:$("date").value});
    $("expenseForm").reset();$("date").value=today();$("expenseDialog").close();save();
  });
  $("salaryForm").addEventListener("submit",e=>{
    e.preventDefault(); data.salary=parseMoney($("salary").value); $("salaryDialog").close();save();
  });
  $("allBtn").onclick=()=>alert(data.expenses.length ? data.expenses.map(e=>`${dateBR(e.date)} • ${e.title} • ${money(e.amount)}`).join("\n") : "Nenhum gasto cadastrado.");
  document.querySelectorAll(".tab").forEach(t=>t.onclick=()=>document.querySelectorAll(".tab").forEach(x=>x.classList.toggle("active",x===t)));
  window.addEventListener("resize",drawChart); render();
}
init();
