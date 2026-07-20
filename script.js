const menuButton=document.querySelector(".menu-toggle");
const nav=document.querySelector(".main-nav");
menuButton?.addEventListener("click",()=>{const open=nav.classList.toggle("open");menuButton.setAttribute("aria-expanded",String(open));});
document.querySelectorAll(".main-nav a").forEach(link=>link.addEventListener("click",()=>{nav.classList.remove("open");menuButton?.setAttribute("aria-expanded","false");}));
document.getElementById("year").textContent=new Date().getFullYear();

const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("visible");observer.unobserve(entry.target);}}),{threshold:.12});
document.querySelectorAll(".reveal").forEach(el=>observer.observe(el));

const languageButton=document.getElementById("language-toggle");
const savedLanguage=localStorage.getItem("patriot-language");
const browserLanguage=(navigator.language||"de").toLowerCase();
let currentLanguage=savedLanguage || (browserLanguage.startsWith("en") ? "en" : "de");

function applyLanguage(lang){
  currentLanguage=lang;
  document.documentElement.lang=lang;
  document.querySelectorAll("[data-de][data-en]").forEach(el=>{
    const value=el.dataset[lang];
    if(value) el.textContent=value;
  });
  document.querySelectorAll("option[data-de][data-en]").forEach(option=>option.textContent=option.dataset[lang]);
  languageButton.textContent=lang==="de"?"EN":"DE";
  languageButton.setAttribute("aria-label",lang==="de"?"Switch to English":"Auf Deutsch wechseln");
  localStorage.setItem("patriot-language",lang);
}
languageButton?.addEventListener("click",()=>applyLanguage(currentLanguage==="de"?"en":"de"));
applyLanguage(currentLanguage);

const quoteForm=document.getElementById("quote-form");
const formMessage=document.getElementById("form-message");
quoteForm?.addEventListener("submit",event=>{
  event.preventDefault();
  const data=new FormData(quoteForm);
  const subject=`Patriot Detailing Anfrage – ${data.get("vehicle")}`;
  const lines=[
    `Name: ${data.get("firstName")} ${data.get("lastName")}`,
    `E-Mail: ${data.get("email")}`,
    `Telefon: ${data.get("phone")}`,
    `Fahrzeug: ${data.get("vehicle")}`,
    `Ort / PLZ: ${data.get("location")}`,
    `Wunschtermin: ${data.get("preferredDate")||"-"}`,
    `Wunschzeit: ${data.get("preferredTime")||"-"}`,
    `Fahrzeuggröße: ${data.get("vehicleSize")||"-"}`,
    `Kontaktart: ${data.get("contactMethod")}`,
    `Leistung: ${data.get("service")}`,
    "",
    "Zustand / gewünschte Arbeiten:",
    data.get("message")
  ];
  const mailto=`mailto:patriotdetailing@kennybell.de?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;
  formMessage.textContent=currentLanguage==="de"?"Ihr E-Mail-Programm wird geöffnet. Bitte senden Sie die vorbereitete Anfrage ab.":"Your email app will open. Please send the prepared request.";
  window.location.href=mailto;
});
window.addEventListener("load",()=>setTimeout(()=>document.getElementById("loading-screen")?.classList.add("hidden"),350));

const comparisonRange=document.getElementById("comparison-range");
const comparisonBefore=document.getElementById("comparison-before");
comparisonRange?.addEventListener("input",()=>{comparisonBefore.style.width=`${comparisonRange.value}%`;});

function updateEstimate(){
  const pkg=document.getElementById("calc-package");
  const size=Number(document.getElementById("calc-size")?.value||0);
  if(!pkg)return;
  let [low,high]=pkg.value.split("|").map(Number);
  low+=size;high+=size;
  document.querySelectorAll(".calc-extra:checked").forEach(el=>{const [a,b]=el.value.split("|").map(Number);low+=a;high+=b;});
  document.getElementById("estimate-price").textContent=`${low}–${high} €`;
}
document.getElementById("calc-package")?.addEventListener("change",updateEstimate);
document.getElementById("calc-size")?.addEventListener("change",updateEstimate);
document.querySelectorAll(".calc-extra").forEach(el=>el.addEventListener("change",updateEstimate));
updateEstimate();

const assistantToggle=document.getElementById("assistant-toggle");
const assistantPanel=document.getElementById("assistant-panel");
const assistantClose=document.getElementById("assistant-close");
const assistantAnswer=document.getElementById("assistant-answer");
function setAssistant(open){assistantPanel?.classList.toggle("open",open);assistantPanel?.setAttribute("aria-hidden",String(!open));}
assistantToggle?.addEventListener("click",()=>setAssistant(!assistantPanel.classList.contains("open")));
assistantClose?.addEventListener("click",()=>setAssistant(false));
document.querySelectorAll(".assistant-question").forEach(btn=>btn.addEventListener("click",()=>{assistantAnswer.textContent=currentLanguage==="de"?btn.dataset.answerDe:btn.dataset.answerEn;}));
