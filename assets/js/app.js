
const SITE_DATA = [
  {title:"首页", url:"index.html", text:"清韵茶坊 茶文化 经典名茶 项目特色"},
  {title:"茶叶种类", url:"tea.html", text:"绿茶 红茶 乌龙茶 白茶 黄茶 黑茶 六大茶类"},
  {title:"品茶知识", url:"knowledge.html", text:"观色 闻香 品味 看叶底 水温 茶汤"},
  {title:"茶具鉴赏", url:"tools.html", text:"紫砂壶 玻璃杯 盖碗 茶海 茶盘 品茗杯"},
  {title:"茶史文化", url:"culture.html", text:"神农 唐宋 明清 茶马古道 茶文化发展"},
  {title:"冲泡指南", url:"brewing.html", text:"温杯 投茶 注水 出汤 冲泡流程"},
  {title:"茶与养生", url:"health.html", text:"合理饮茶 健康 茶多酚 咖啡碱 适量"},
  {title:"茶礼茶俗", url:"ceremony.html", text:"奉茶 礼仪 茶俗 客来敬茶"},
  {title:"项目说明", url:"about.html", text:"网站设计 实验报告 功能定位 技术方案"},
  {title:"后台演示", url:"admin.html", text:"添加 修改 删除 茶叶资料 管理"},
  {title:"会员中心", url:"member.html", text:"登录 注册 收藏 留言 本地存储"}
];

const DEFAULT_TEAS = [
  {name:"西湖龙井", type:"绿茶", origin:"浙江杭州", img:"assets/images/longjing.jpg", desc:"外形扁平挺秀，汤色嫩绿明亮，香气清高，适合玻璃杯或盖碗冲泡。"},
  {name:"祁门红茶", type:"红茶", origin:"安徽祁门", img:"assets/images/keemun.jpg", desc:"具有独特祁门香，汤色红艳，滋味甜醇，适合清饮或加入牛奶。"},
  {name:"武夷岩茶", type:"乌龙茶", origin:"福建武夷山", img:"assets/images/wuyi-rock-tea.jpg", desc:"岩骨花香明显，焙火香与果香并存，适合小壶高温快出汤。"}
];

function getStore(key, fallback){
  try{return JSON.parse(localStorage.getItem(key)) ?? fallback}catch(e){return fallback}
}
function setStore(key, value){localStorage.setItem(key, JSON.stringify(value))}
function currentUser(){return getStore("qy_current_user", null)}
function showNotice(id, text){
  const el=document.getElementById(id);
  if(!el) return;
  el.textContent=text;
  el.classList.add("show");
}
function updateUserArea(){
  const area=document.querySelector("[data-user-area]");
  if(!area) return;
  const user=currentUser();
  area.innerHTML = user
    ? `<a class="btn secondary" href="member.html">${user.name}</a><button class="btn" data-logout>退出</button>`
    : `<a class="btn secondary" href="login.html">登录</a><a class="btn gold" href="register.html">注册</a>`;
  const logout=area.querySelector("[data-logout]");
  if(logout){logout.addEventListener("click",()=>{localStorage.removeItem("qy_current_user");location.href="index.html"})}
}
function initRegister(){
  const form=document.getElementById("registerForm");
  if(!form) return;
  form.addEventListener("submit", e=>{
    e.preventDefault();
    const users=getStore("qy_users", []);
    const name=form.username.value.trim();
    const phone=form.phone.value.trim();
    const password=form.password.value;
    if(users.some(u=>u.name===name)){showNotice("registerNotice","该用户名已存在，请更换用户名。");return}
    users.push({name, phone, password, created:new Date().toLocaleString()});
    setStore("qy_users", users);
    setStore("qy_current_user", {name, phone});
    showNotice("registerNotice","注册成功，已自动登录。");
    setTimeout(()=>location.href="member.html",700);
  });
}
function initLogin(){
  const form=document.getElementById("loginForm");
  if(!form) return;
  form.addEventListener("submit", e=>{
    e.preventDefault();
    const users=getStore("qy_users", []);
    const name=form.username.value.trim();
    const password=form.password.value;
    const user=users.find(u=>u.name===name && u.password===password);
    if(!user){showNotice("loginNotice","用户名或密码不正确。没有账号可先注册，或使用演示账号 demo / 123456。");return}
    setStore("qy_current_user", {name:user.name, phone:user.phone});
    showNotice("loginNotice","登录成功，正在进入会员中心。");
    setTimeout(()=>location.href="member.html",700);
  });
  if(getStore("qy_users", []).every(u=>u.name!=="demo")){
    const users=getStore("qy_users", []);
    users.push({name:"demo", phone:"13800000000", password:"123456", created:new Date().toLocaleString()});
    setStore("qy_users", users);
  }
}
function initSearch(){
  const form=document.getElementById("searchForm");
  const box=document.getElementById("searchResults");
  if(!form || !box) return;
  form.addEventListener("submit", e=>{
    e.preventDefault();
    const q=form.keyword.value.trim().toLowerCase();
    const results=SITE_DATA.filter(item=>(item.title+item.text).toLowerCase().includes(q));
    box.innerHTML = results.length
      ? results.map(r=>`<div class="result-item"><h3>${r.title}</h3><p>${r.text}</p><a class="btn secondary" href="${r.url}">查看页面</a></div>`).join("")
      : `<div class="result-item">没有找到相关内容，请尝试“绿茶”“茶具”“冲泡”等关键词。</div>`;
  });
}
function initMessages(){
  const form=document.getElementById("messageForm");
  const list=document.getElementById("messageList");
  if(!form || !list) return;
  function render(){
    const messages=getStore("qy_messages", []);
    list.innerHTML=messages.length ? messages.map(m=>`<div class="message-item"><h3>${m.name}</h3><p>${m.content}</p><span class="tag">${m.time}</span></div>`).join("") : "<div class='message-item'>暂无留言，欢迎留下你的品茶心得。</div>";
  }
  form.addEventListener("submit", e=>{
    e.preventDefault();
    const messages=getStore("qy_messages", []);
    messages.unshift({name:form.name.value.trim(), content:form.content.value.trim(), time:new Date().toLocaleString()});
    setStore("qy_messages", messages);
    form.reset();
    render();
  });
  render();
}
function initMember(){
  const box=document.getElementById("memberBox");
  if(!box) return;
  const user=currentUser();
  if(!user){
    box.innerHTML=`<h3>尚未登录</h3><p>请先登录或注册后查看会员中心。</p><a class="btn" href="login.html">去登录</a>`;
    return;
  }
  const messages=getStore("qy_messages", []).filter(m=>m.name===user.name);
  box.innerHTML=`<h3>欢迎，${user.name}</h3><p>手机号：${user.phone || "未填写"}</p><p>你的留言数量：${messages.length}</p><div class="pill-row"><a class="btn" href="admin.html">进入后台演示</a><a class="btn secondary" href="about.html">查看项目说明</a></div>`;
}
function initAdmin(){
  const form=document.getElementById("teaForm");
  const list=document.getElementById("adminList");
  if(!form || !list) return;
  if(!localStorage.getItem("qy_teas")) setStore("qy_teas", DEFAULT_TEAS);
  const imageMap = Object.fromEntries(DEFAULT_TEAS.map(t => [t.name, t.img]));
  const storedTeas = getStore("qy_teas", DEFAULT_TEAS).map(t => ({...t, img: t.img || imageMap[t.name] || ""}));
  setStore("qy_teas", storedTeas);
  function render(){
    const teas=getStore("qy_teas", DEFAULT_TEAS);
    list.innerHTML=teas.map((t,i)=>`<div class="admin-item">${t.img ? `<img class="tea-photo" src="${t.img}" alt="${t.name}">` : ""}<h3>${t.name} <span class="tag">${t.type}</span></h3><p>产地：${t.origin}</p><p>${t.desc}</p><div class="admin-actions"><button class="btn secondary" data-edit="${i}">修改</button><button class="btn" data-del="${i}">删除</button></div></div>`).join("");
    list.querySelectorAll("[data-del]").forEach(btn=>btn.onclick=()=>{const arr=getStore("qy_teas", DEFAULT_TEAS);arr.splice(btn.dataset.del,1);setStore("qy_teas",arr);render()});
    list.querySelectorAll("[data-edit]").forEach(btn=>btn.onclick=()=>{const t=getStore("qy_teas", DEFAULT_TEAS)[btn.dataset.edit];form.index.value=btn.dataset.edit;form.name.value=t.name;form.type.value=t.type;form.origin.value=t.origin;form.img.value=t.img || "";form.desc.value=t.desc;window.scrollTo({top:0,behavior:"smooth"})});
  }
  form.addEventListener("submit", e=>{
    e.preventDefault();
    const arr=getStore("qy_teas", DEFAULT_TEAS);
    const item={name:form.name.value.trim(), type:form.type.value.trim(), origin:form.origin.value.trim(), img:form.img.value.trim(), desc:form.desc.value.trim()};
    if(form.index.value){arr[Number(form.index.value)]=item}else{arr.unshift(item)}
    setStore("qy_teas", arr);
    form.reset();
    form.index.value="";
    render();
  });
  render();
}
document.addEventListener("DOMContentLoaded", ()=>{
  updateUserArea();
  initRegister();
  initLogin();
  initSearch();
  initMessages();
  initMember();
  initAdmin();
});
