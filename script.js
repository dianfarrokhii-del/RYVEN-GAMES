const search = document.getElementById("gameSearch");
const cards = [...document.querySelectorAll(".game-card")];
const noResults = document.getElementById("noResults");
const toast = document.getElementById("toast");

search.addEventListener("input", () => {
  const q = search.value.trim().toLowerCase();
  let visible = 0;
  cards.forEach(card => {
    const ok = (card.dataset.search || "").includes(q);
    card.style.display = ok ? "" : "none";
    if(ok) visible++;
  });
  noResults.style.display = visible ? "none" : "block";
});

document.querySelectorAll("[data-soon]").forEach(btn => {
  btn.addEventListener("click", () => {
    toast.textContent = "Download will be available soon!";
    toast.classList.add("show");
    clearTimeout(window.toastTimer);
    window.toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
  });
});

document.getElementById("menuBtn").addEventListener("click", () => {
  const nav = document.querySelector(".nav");
  const open = nav.style.display === "flex";
  nav.style.display = open ? "" : "flex";
  if(!open){
    nav.style.position = "absolute";
    nav.style.top = "78px";
    nav.style.right = "18px";
    nav.style.flexDirection = "column";
    nav.style.padding = "18px";
    nav.style.background = "#0a0f16";
    nav.style.border = "1px solid rgba(82,217,255,.18)";
  }
});

document.querySelectorAll(".nav a").forEach(a => a.addEventListener("click", () => {
  if(innerWidth <= 850) document.querySelector(".nav").style.display = "";
}));
