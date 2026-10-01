const $ = (s)=>document.querySelector(s);
const menu=$('#menu'), nav=$('#nav');
menu?.addEventListener('click',()=>nav?.classList.toggle('open'));

const search=$('#search');
const cards=[...document.querySelectorAll('.card')];
search?.addEventListener('input',()=>{
  const q=search.value.toLowerCase().trim();
  cards.forEach(c=>c.style.display=!q||c.dataset.search.toLowerCase().includes(q)?'block':'none');
});

const AUTH_KEY='ryven_games_accounts_v2';
const SESSION_KEY='ryven_games_session_v2';
const LANG_KEY='ryven_games_language_v1';
const getAccounts=()=>{try{return JSON.parse(localStorage.getItem(AUTH_KEY)||'{}')}catch{return {}}};
const saveAccounts=a=>localStorage.setItem(AUTH_KEY,JSON.stringify(a));
const getSession=()=>localStorage.getItem(SESSION_KEY);

const authModal=$('#authModal'), authTitle=$('#authTitle'), authSub=$('#authSub'), authForm=$('#authForm');
const authUsername=$('#authUsername'), authEmail=$('#authEmail'), authPassword=$('#authPassword'), authConfirm=$('#authConfirm');
const authMessage=$('#authMessage'), authSwitch=$('#authSwitch'), authSubmit=$('#authSubmit');
const authClose=$('#authClose'), accountBtn=$('#accountBtn');
const settingsModal=$('#settingsModal'), settingsBtn=$('#settingsBtn'), settingsClose=$('#settingsClose'), languageSelect=$('#languageSelect');
let authMode='login', pendingDownload=null;

const T={
 en:{navGames:'Games',navUpdates:'Updates',navAbout:'About',settings:'SETTINGS',heroText:'Games made with passion. Welcome to the official RYVEN Games hub — play in your browser or download when you are ready.',explore:'EXPLORE GAMES',library:'LIBRARY',ourGames:'OUR GAMES',search:'Search games...',sports:'SPORTS • FOOTBALL',esoccerDesc:'Play the latest eSoccer HTML build directly in your browser.',playNow:'PLAY NOW',androidApk:'ANDROID APK',simulation:'3D • SIMULATION',schoolDesc:'Download the complete School Life 3D ZIP package.',downloadZip:'DOWNLOAD ZIP',accountNote:'Account required for downloads • Play options do not require an account',updates:'UPDATES',update1:'Account system and language settings added.',update2:'Latest playable HTML build is live.',aboutText:'A small gaming hub for RYVEN projects, playable builds and downloads.',language:'Language',languageDesc:'Choose the website language.'},
 fa:{navGames:'بازی‌ها',navUpdates:'به‌روزرسانی‌ها',navAbout:'درباره',settings:'تنظیمات',heroText:'بازی‌هایی که با علاقه ساخته شده‌اند. به مرکز رسمی بازی‌های RYVEN خوش آمدید — بازی را در مرورگر اجرا کنید یا در صورت نیاز دانلود کنید.',explore:'مشاهده بازی‌ها',library:'کتابخانه',ourGames:'بازی‌های ما',search:'جستجوی بازی...',sports:'ورزشی • فوتبال',esoccerDesc:'آخرین نسخه HTML بازی eSoccer را مستقیماً در مرورگر اجرا کنید.',playNow:'اجرای بازی',androidApk:'دانلود APK اندروید',simulation:'سه‌بعدی • شبیه‌سازی',schoolDesc:'نسخه کامل ZIP بازی School Life 3D را دانلود کنید.',downloadZip:'دانلود ZIP',accountNote:'برای دانلود ساخت حساب لازم است • اجرای بازی نیازی به حساب ندارد',updates:'به‌روزرسانی‌ها',update1:'سیستم حساب کاربری و تنظیمات زبان اضافه شد.',update2:'آخرین نسخه قابل اجرای eSoccer منتشر شد.',aboutText:'یک مرکز کوچک برای پروژه‌ها، نسخه‌های قابل اجرا و دانلودهای RYVEN.',language:'زبان',languageDesc:'زبان سایت را انتخاب کنید.'}
};

function lang(){return localStorage.getItem(LANG_KEY)||'en'}
function applyLanguage(l=lang()){
  const dict=T[l]||T.en; document.documentElement.lang=l;
  document.documentElement.dir=l==='fa'?'rtl':'ltr';
  document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(dict[k])el.textContent=dict[k]});
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el=>{const k=el.dataset.i18nPlaceholder;if(dict[k])el.placeholder=dict[k]});
  if(languageSelect) languageSelect.value=l;
  updateAccountButton();
  updateAuthTexts();
}

function showMessage(msg,type='error'){authMessage.textContent=msg;authMessage.className='auth-message '+type}
function updateAccountButton(){if(!accountBtn)return; const u=getSession(); accountBtn.textContent=u?(lang()==='fa'?`حساب: ${u}`:`ACCOUNT: ${u}`):(lang()==='fa'?'ورود / ثبت‌نام':'LOGIN / SIGN UP')}
function setAuthMode(mode,download=null){
  authMode=mode==='account'?'login':mode; if(download!==null)pendingDownload=download;
  const signup=authMode==='signup', fa=lang()==='fa';
  authTitle.textContent=signup?(fa?'ساخت حساب RYVEN':'Create your RYVEN account'):(fa?'ورود به حساب':'Welcome back');
  authSub.textContent=fa?'برای دانلود بازی‌ها حساب بسازید یا وارد حساب خود شوید.':'Create an account or log in to download games.';
  $('#confirmWrap').style.display=signup?'block':'none'; $('#emailWrap').style.display=signup?'block':'none';
  authConfirm.required=signup; authEmail.required=signup;
  authSubmit.textContent=signup?(fa?'ساخت حساب':'CREATE AN ACCOUNT'):(fa?'ورود':'LOGIN');
  authSwitch.innerHTML=signup?(fa?'حساب دارید؟ ':'Already have an account? '):(fa?'حساب ندارید؟ ':'Don\'t have an account? ');
  const b=document.createElement('button'); b.type='button'; b.id='authSwitchBtn'; b.textContent=signup?(fa?'ورود':'Log in'):(fa?'ساخت حساب':'Create an account'); authSwitch.appendChild(b);
  b.addEventListener('click',()=>setAuthMode(signup?'login':'signup',pendingDownload));
  authForm.reset(); showMessage(''); authModal.classList.add('show'); authModal.setAttribute('aria-hidden','false'); document.body.classList.add('modal-open'); setTimeout(()=>authUsername.focus(),50);
}
function openAuth(mode='login',download=null){setAuthMode(mode,download)}
function closeAuth(){authModal.classList.remove('show');authModal.setAttribute('aria-hidden','true');document.body.classList.remove('modal-open');pendingDownload=null}
function openSettings(){settingsModal.classList.add('show');settingsModal.setAttribute('aria-hidden','false');document.body.classList.add('modal-open')}
function closeSettings(){settingsModal.classList.remove('show');settingsModal.setAttribute('aria-hidden','true');document.body.classList.remove('modal-open')}

authClose?.addEventListener('click',closeAuth); settingsClose?.addEventListener('click',closeSettings); settingsBtn?.addEventListener('click',openSettings);
authModal?.addEventListener('click',e=>{if(e.target===authModal)closeAuth()}); settingsModal?.addEventListener('click',e=>{if(e.target===settingsModal)closeSettings()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeAuth();closeSettings()}});
accountBtn?.addEventListener('click',()=>getSession()?openAuth('login'):openAuth('login'));
languageSelect?.addEventListener('change',()=>{localStorage.setItem(LANG_KEY,languageSelect.value);applyLanguage(languageSelect.value)});

authForm?.addEventListener('submit',e=>{
 e.preventDefault();
 const username=authUsername.value.trim(), email=authEmail.value.trim().toLowerCase(), password=authPassword.value, accounts=getAccounts();
 if(!username||!password)return showMessage(lang()==='fa'?'نام کاربری و رمز عبور را وارد کنید.':'Please fill in username and password.');
 if(username.length<3)return showMessage(lang()==='fa'?'نام کاربری باید حداقل ۳ کاراکتر باشد.':'Username must be at least 3 characters.');
 if(password.length<6)return showMessage(lang()==='fa'?'رمز عبور باید حداقل ۶ کاراکتر باشد.':'Password must be at least 6 characters.');
 if(authMode==='signup'){
   if(!email||!email.includes('@'))return showMessage(lang()==='fa'?'ایمیل معتبر وارد کنید.':'Please enter a valid email address.');
   if(authConfirm.value!==password)return showMessage(lang()==='fa'?'رمزهای عبور یکسان نیستند.':'Passwords do not match.');
   if(accounts[username.toLowerCase()])return showMessage(lang()==='fa'?'این نام کاربری قبلاً ثبت شده است.':'That username is already registered.');
   accounts[username.toLowerCase()]={username,email,password}; saveAccounts(accounts); localStorage.setItem(SESSION_KEY,username); updateAccountButton(); showMessage(lang()==='fa'?'حساب با موفقیت ساخته شد.':'Account created successfully.','success'); setTimeout(finishDownload,300);
 }else{
   const acc=accounts[username.toLowerCase()];
   if(!acc||acc.password!==password)return showMessage(lang()==='fa'?'نام کاربری یا رمز عبور اشتباه است.':'Incorrect username or password.');
   localStorage.setItem(SESSION_KEY,acc.username); updateAccountButton(); showMessage(lang()==='fa'?'با موفقیت وارد شدید.':'Logged in successfully.','success'); setTimeout(()=>pendingDownload?finishDownload():closeAuth(),300);
 }
});
function finishDownload(){const url=pendingDownload;if(!url)return closeAuth();pendingDownload=null;closeAuth();window.location.href=url}
function requestDownload(url){if(getSession()){window.location.href=url;return}openAuth('login',url)}
document.querySelectorAll('[data-download]').forEach(btn=>btn.addEventListener('click',e=>{e.preventDefault();requestDownload(btn.dataset.download)}));

applyLanguage();
