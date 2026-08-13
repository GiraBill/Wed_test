const menuItems = [
  { name: "Матча цитрус", category: "tea", label: "Чаи", price: "2 190 ₸", volume: "450 мл", pos: "0% 0%", description: "Холодная матча, лайм, лимон и немного тростникового сахара. Бодрый баланс мягкой горчинки и цитрусовой свежести." },
  { name: "Малиновый бриз", category: "tea", label: "Чаи", price: "1 990 ₸", volume: "500 мл", pos: "50% 0%", description: "Чёрный чай, малина, мята и капля цветочного мёда. Можно заказать горячим или охлаждённым." },
  { name: "Фисташковое джелато", category: "icecream", label: "Мороженое", price: "1 790 ₸", volume: "140 г", pos: "100% 0%", description: "Плотное сливочное джелато с натуральной фисташковой пастой и дроблёной фисташкой." },
  { name: "Манговый сорбет", category: "icecream", label: "Мороженое", price: "1 590 ₸", volume: "140 г", pos: "0% 100%", description: "Яркий сорбет из спелого манго без молока. Лёгкий, фруктовый и очень освежающий." },
  { name: "Тост с лососем", category: "food", label: "Лёгкая еда", price: "3 490 ₸", volume: "280 г", pos: "50% 100%", description: "Зерновой хлеб, авокадо, слабосолёный лосось, редис и микрозелень. Подаём с долькой лайма." },
  { name: "Ягодный чизкейк", category: "dessert", label: "Десерты", price: "2 390 ₸", volume: "170 г", pos: "100% 100%", description: "Нежный сливочный чизкейк на хрустящей основе с соусом и свежими сезонными ягодами." },
  { name: "Матча-тоник", category: "tea", label: "Чаи", price: "2 290 ₸", volume: "450 мл", pos: "0% 0%", description: "Матча, тоник и свежий лайм со льдом. Газированный и уверенно освежающий вариант на весь день." },
  { name: "Фисташковый аффогато", category: "dessert", label: "Десерты", price: "2 190 ₸", volume: "160 г", pos: "100% 0%", description: "Шарик фисташкового джелато, порция горячего эспрессо и хрустящая ореховая крошка." }
];

const grid = document.querySelector("#menuGrid");
const modal = document.querySelector("#itemModal");
const modalImage = document.querySelector("#modalImage");
const modalTitle = document.querySelector("#modalTitle");
const modalCategory = document.querySelector("#modalCategory");
const modalDescription = document.querySelector("#modalDescription");
const modalVolume = document.querySelector("#modalVolume");
const modalPrice = document.querySelector("#modalPrice");
let lastFocusedCard = null;

function renderMenu(filter = "all") {
  grid.innerHTML = "";
  menuItems.filter(item => filter === "all" || item.category === filter).forEach(item => {
    const card = document.createElement("button");
    card.className = "menu-card";
    card.type = "button";
    card.setAttribute("aria-label", `Открыть: ${item.name}`);
    card.innerHTML = `
      <div class="card-image menu-image" style="background-position:${item.pos}" role="img" aria-label="${item.name}"></div>
      <div class="card-content">
        <div class="card-top"><h3>${item.name}</h3><strong>${item.price}</strong></div>
        <p>${item.label} · ${item.volume}</p>
      </div>`;
    card.addEventListener("click", () => openModal(item, card));
    grid.appendChild(card);
  });
}

function openModal(item, source) {
  lastFocusedCard = source;
  modalImage.style.backgroundPosition = item.pos;
  modalImage.setAttribute("aria-label", item.name);
  modalTitle.textContent = item.name;
  modalCategory.textContent = item.label;
  modalDescription.textContent = item.description;
  modalVolume.textContent = item.volume;
  modalPrice.textContent = item.price;
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  requestAnimationFrame(() => modal.querySelector(".close-button").focus());
}

function closeModal() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  lastFocusedCard?.focus();
}

document.querySelectorAll(".filter").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelector(".filter.active")?.classList.remove("active");
    button.classList.add("active");
    renderMenu(button.dataset.filter);
  });
});

document.querySelectorAll("[data-close-modal]").forEach(element => element.addEventListener("click", closeModal));
document.addEventListener("keydown", event => { if (event.key === "Escape" && modal.classList.contains("open")) closeModal(); });
document.querySelector("#year").textContent = new Date().getFullYear();
renderMenu();
