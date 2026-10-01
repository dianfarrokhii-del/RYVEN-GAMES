const menu=document.getElementById('menu'),nav=document.getElementById('nav');
menu?.addEventListener('click',()=>nav.classList.toggle('open'));

const search=document.getElementById('search');
const cards=[...document.querySelectorAll('.card')];
search?.addEventListener('input',()=>{
  const q=search.value.toLowerCase().trim();
  cards.forEach(c=>c.style.display=!q||c.dataset.search.toLowerCase().includes(q)?'block':'none');
});

// Simple static-site account system. Accounts are stored only in this browser via localStorage.
const AUTH_KEY='ryven_games_accounts_v1';
const SESSION_KEY='ryven_games_session_v1';
const getAccounts=()=>JSON.parse(localStorage.getItem(AUTH_KEY)||'{}');
const saveAccounts=a=>localStorage.setItem(AUTH_KEY,JSON.stringify(a));
const getSession=()=>localStorage.getItem(SESSION_KEY);

const authModal=document.getElementById('authModal');
const authTitle=document.getElementById('authTitle');
const authForm=document.getElementById('authForm');
const authUsername=document.getElementById('authUsername');
const authEmail=document.getElementById('authEmail');
const authPassword=document.getElementById('authPassword');
const authConfirm=document.getElementById('authConfirm');
const authMessage=document.getElementById('authMessage');
const authSwitch=document.getElementById('authSwitch');
const authSwitchBtn=document.getElementById('authSwitchBtn');
const authClose=document.getElementById('authClose');
const accountBtn=document.getElementById('accountBtn');
let authMode='login';
let pendingDownload=null;

function showMessage(msg,type='error'){authMessage.textContent=msg;authMessage.className='auth-message '+type;}
function updateAccountButton(){
  const u=getSession();
  if(accountBtn) accountBtn.textContent=u?`ACCOUNT: ${u}`:'LOGIN / SIGN UP';
}
function openAuth(mode='login',download=null){
  authMode=mode; pendingDownload=download; authTitle.textContent=mode==='login'?'Welcome back':'Create your RYVEN account';
  authConfirm.parentElement.style.display=mode==='signup'?'block':'none';
  authEmail.parentElement.style.display=mode==='signup'?'block':'none';
  authSwitch.innerHTML=mode==='login'?`Don't have an account? <button type="button" id="authSwitchBtn">Create one</button>`:`Already have an account? <button type="button" id="authSwitchBtn">Log in</button>`;
  authSwitchBtn.onclick=()=>openAuth(mode==='login'?'signup':'login',pendingDownload);
  authForm.reset();showMessage('');authModal.classList.add('show');document.body.classList.add('modal-open');setTimeout(()=>authUsername.focus(),50);
}
function closeAuth(){authModal.classList.remove('show');document.body.classList.remove('modal-open');pendingDownload=null;}
authClose?.addEventListener('click',closeAuth);
authModal?.addEventListener('click',e=>{if(e.target===authModal)closeAuth()});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeAuth()});
accountBtn?.addEventListener('click',()=>getSession()?openAuth('account'):openAuth('login'));

function finishDownload(){
  const url=pendingDownload;
  if(!url)return closeAuth();
  pendingDownload=null;closeAuth();
  window.location.href=url;
}

authForm?.addEventListener('submit',e=>{
  e.preventDefault();
  const username=authUsername.value.trim();
  const email=authEmail.value.trim().toLowerCase();
  const password=authPassword.value;
  const accounts=getAccounts();
  if(!username||!password)return showMessage('Please fill in all required fields.');
  if(username.length<3)return showMessage('Username must be at least 3 characters.');
  if(password.length<6)return showMessage('Password must be at least 6 characters.');
  if(authMode==='signup'){
    if(!email||!email.includes('@'))return showMessage('Please enter a valid email address.');
    if(authConfirm.value!==password)return showMessage('Passwords do not match.');
    if(accounts[username.toLowerCase()])return showMessage('That username is already registered.');
    accounts[username.toLowerCase()]={username,email,password};
    saveAccounts(accounts);localStorage.setItem(SESSION_KEY,username);updateAccountButton();showMessage('Account created successfully.','success');
    setTimeout(finishDownload,350);
  }else{
    const acc=accounts[username.toLowerCase()];
    if(!acc||acc.password!==password)return showMessage('Incorrect username or password.');
    localStorage.setItem(SESSION_KEY,acc.username);updateAccountButton();showMessage('Logged in successfully.','success');
    setTimeout(()=>{if(pendingDownload)finishDownload();else closeAuth()},350);
  }
});

function requestDownload(url){
  if(getSession()){window.location.href=url;return;}
  openAuth('login',url);
}
document.querySelectorAll('[data-download]').forEach(btn=>btn.addEventListener('click',e=>{e.preventDefault();requestDownload(btn.dataset.download)}));

updateAccountButton();
