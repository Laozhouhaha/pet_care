/* ===== 商品列表页逻辑 ===== */
const state = {
  cat: "all",
  price: "all",
  tag: "all",
  kw: "",
  sort: "default",
};

function parsePriceRange(p) {
  if (p === "all") return null;
  if (p === "50") return [0, 50];
  if (p === "50-100") return [50, 100];
  if (p === "100-200") return [100, 200];
  if (p === "200") return [200, Infinity];
  return null;
}

function filterProducts() {
  const range = parsePriceRange(state.price);
  return PRODUCTS.filter(p => {
    if (state.cat !== "all" && p.cat !== state.cat) return false;
    if (state.tag !== "all" && p.tag !== state.tag) return false;
    if (range) {
      const [lo, hi] = range;
      if (p.price < lo || p.price >= hi) return false;
    }
    if (state.kw && !p.name.includes(state.kw)) return false;
    return true;
  });
}

function sortProducts(list) {
  const salesNum = p => parseFloat(p.sales.replace("k", "")) * (p.sales.includes("k") ? 1000 : 1);
  const arr = [...list];
  switch (state.sort) {
    case "price-asc": arr.sort((a, b) => a.price - b.price); break;
    case "price-desc": arr.sort((a, b) => b.price - a.price); break;
    case "rating": arr.sort((a, b) => b.rating - a.rating); break;
    case "sales": arr.sort((a, b) => salesNum(b) - salesNum(a)); break;
    default: arr.sort((a, b) => (b.tag === "hot") - (a.tag === "hot") || salesNum(b) - salesNum(a));
  }
  return arr;
}

function render() {
  const list = sortProducts(filterProducts());
  const grid = document.getElementById("productGrid");
  const empty = document.getElementById("emptyBox");
  grid.innerHTML = list.map(productCard).join("");
  empty.style.display = list.length ? "none" : "block";
  document.getElementById("resultCount").innerHTML = list.length
    ? `共找到 <b>${list.length}</b> 件商品`
    : "";
}

function initSidebar() {
  const catBox = document.getElementById("catFilter");
  catBox.innerHTML = `
    <button data-cat="all" class="active">全部商品 <span class="n">${PRODUCTS.length}</span></button>
  ` + CATEGORIES.map(c => {
    const n = PRODUCTS.filter(p => p.cat === c.key).length;
    return `<button data-cat="${c.key}">${c.emoji} ${c.name} <span class="n">${n}</span></button>`;
  }).join("");

  document.querySelectorAll("#catFilter button").forEach(btn =>
    btn.addEventListener("click", () => {
      state.cat = btn.dataset.cat;
      setActive("#catFilter button", btn);
      render();
    })
  );

  document.querySelectorAll("#priceFilter button").forEach(btn =>
    btn.addEventListener("click", () => {
      state.price = btn.dataset.price;
      setActive("#priceFilter button", btn);
      render();
    })
  );

  document.querySelectorAll("#tagFilter button").forEach(btn =>
    btn.addEventListener("click", () => {
      state.tag = btn.dataset.tag;
      setActive("#tagFilter button", btn);
      render();
    })
  );
}

function setActive(selector, activeBtn) {
  document.querySelectorAll(selector).forEach(b => b.classList.toggle("active", b === activeBtn));
}

function resetAll() {
  state.cat = state.price = state.tag = "all";
  state.kw = "";
  state.sort = "default";
  document.getElementById("searchInput").value = "";
  document.getElementById("sortSelect").value = "default";
  document.querySelectorAll(".side-filter button").forEach(b => b.classList.remove("active"));
  document.querySelectorAll('#catFilter [data-cat="all"], #priceFilter [data-price="all"], #tagFilter [data-tag="all"]')
    .forEach(b => b.classList.add("active"));
  render();
}

document.addEventListener("DOMContentLoaded", () => {
  initSidebar();

  // URL 参数（首页分类跳转）
  const params = new URLSearchParams(location.search);
  const catParam = params.get("cat");
  if (catParam && CATEGORIES.some(c => c.key === catParam)) {
    state.cat = catParam;
    const btn = document.querySelector(`#catFilter [data-cat="${catParam}"]`);
    if (btn) setActive("#catFilter button", btn);
  }

  const searchInput = document.getElementById("searchInput");
  let t;
  searchInput.addEventListener("input", () => {
    clearTimeout(t);
    t = setTimeout(() => { state.kw = searchInput.value.trim(); render(); }, 200);
  });

  document.getElementById("sortSelect").addEventListener("change", e => {
    state.sort = e.target.value;
    render();
  });

  render();
});
