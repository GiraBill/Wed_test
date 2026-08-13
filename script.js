let menuItems = [
  { name: "Освежающий лимонад", category: "fruit", label: "Фруктовые чаи", price: "400 ₸", volume: "700 мл", pos: "0% 0%", image_url: "assets/menu-1.webp", description: "Лёгкий холодный лимонад с лимоном и льдом. Одна из самых освежающих позиций меню WEDRINK." },
  { name: "Освежающий маракуйя-чай", category: "fruit", label: "Фруктовые чаи", price: "600 ₸", volume: "700 мл", pos: "50% 0%", image_url: "assets/menu-2.webp", description: "Яркий фруктовый чай с маракуйей, льдом и тропической кислинкой." },
  { name: "Двойной маракуйя-коктейль", category: "cocktail", label: "Коктейли", price: "750 ₸", volume: "700 мл", pos: "100% 0%", image_url: "assets/menu-3.webp", description: "Насыщенный коктейль с двойной порцией маракуйи и сочной тропической текстурой." },
  { name: "Манго-грейпфрутовый коктейль", category: "cocktail", label: "Коктейли", price: "800 ₸", volume: "500 мл", pos: "0% 50%", image_url: "assets/menu-4.webp", description: "Сладкое манго и свежая горчинка грейпфрута в ярком холодном коктейле." },
  { name: "Черничный чай", category: "fruit", label: "Фруктовые чаи", price: "650 ₸", volume: "500 мл", pos: "50% 50%", image_url: "assets/menu-5.webp", description: "Холодный чай с кусочками ягод и насыщенным черничным вкусом." },
  { name: "Чай «Шесть виноградин»", category: "fruit", label: "Фруктовые чаи", price: "700 ₸", volume: "500 мл", pos: "100% 50%", image_url: "assets/menu-6.webp", description: "Фирменный виноградный чай с фруктовыми кусочками и льдом." },
  { name: "Клубника-кокос чай", category: "milk", label: "Молочные чаи", price: "900 ₸", volume: "500 мл", pos: "0% 100%", image_url: "assets/menu-7.webp", description: "Нежный молочный чай с кокосом и клубникой, холодный и сливочный." },
  { name: "Шоколад-кокос чай", category: "milk", label: "Молочные чаи", price: "900 ₸", volume: "500 мл", pos: "50% 100%", image_url: "assets/menu-8.webp", description: "Шоколадный молочный чай с кокосом и шариками тапиоки." },
  { name: "Клубничный сандэ", category: "icecream", label: "Мороженое", price: "650 ₸", volume: "400 мл", pos: "100% 100%", image_url: "assets/menu-9.webp", description: "Клубничный сандэ с мягким мороженым и ягодным вкусом." }
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
      <div class="card-image menu-image" style="${item.image_url ? `background-image:url(\'${item.image_url}\');background-size:cover;background-position:center` : `background-position:${item.pos}`}" role="img" aria-label="${item.name}"></div>
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
  const modalVideo = document.querySelector("#modalVideo");
  if (item.video_url) {
    modalImage.hidden = true;
    modalVideo.hidden = false;
    modalVideo.src = item.video_url;
    modalVideo.play().catch(() => {});
  } else {
    modalVideo.hidden = true;
    modalVideo.removeAttribute("src");
    modalImage.hidden = false;
    modalImage.style.backgroundImage = item.image_url ? `url("${item.image_url}")` : "";
    modalImage.style.backgroundSize = item.image_url ? "cover" : "";
    modalImage.style.backgroundPosition = item.image_url ? "center" : item.pos;
    modalImage.setAttribute("aria-label", item.name);
  }
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
  const video = document.querySelector("#modalVideo");
  video.pause();
  video.removeAttribute("src");
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

const categoryLabels = { fruit: "Фруктовые чаи", cocktail: "Коктейли", milk: "Молочные чаи", icecream: "Мороженое" };

async function loadDatabaseMenu() {
  if (!window.menuDb) { renderMenu(); return; }
  const { data } = await window.menuDb.from("menu_items").select("*").eq("is_active", true).order("sort_order");
  if (data?.length) {
    menuItems = [...menuItems, ...data.map(item => ({
      ...item,
      label: categoryLabels[item.category] || item.category,
      price: `${item.price.toLocaleString("ru-RU")} ₸`,
      pos: "0% 0%"
    }))];
  }
  renderMenu();
}

async function revealEditorAccess() {
  if (!window.menuDb) return;
  const { data: { session } } = await window.menuDb.auth.getSession();
  if (!session) return;
  const { data: allowed } = await window.menuDb.rpc("is_menu_editor");
  if (!allowed) return;
  const link = document.createElement("a");
  link.href = "editor.html";
  link.className = "editor-link";
  link.textContent = "Управление меню";
  document.body.append(link);
}

loadDatabaseMenu();
revealEditorAccess();
