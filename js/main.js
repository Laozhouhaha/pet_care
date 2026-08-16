/* ===== 购物车（localStorage）===== */
const CART_KEY = "paw_cart";

function getCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
  catch { return []; }
}
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
}
function cartCount() {
  return getCart().reduce((n, i) => n + i.qty, 0);
}
function addToCart(id, qty = 1) {
  const cart = getCart();
  const item = cart.find(i => i.id === id);
  if (item) item.qty += qty;
  else cart.push({ id, qty });
  saveCart(cart);
  toast("已加入购物车 🐾");
}
function updateCartBadge() {
  const n = cartCount();
  document.querySelectorAll(".cart-badge").forEach(b => {
    b.textContent = n;
    b.style.display = n > 0 ? "grid" : "none";
  });
}
function findProduct(id) {
  return PRODUCTS.find(p => p.id === id);
}

/* ===== Toast ===== */
function toast(msg, type = "ok") {
  let wrap = document.querySelector(".toast-wrap");
  if (!wrap) {
    wrap = document.createElement("div");
    wrap.className = "toast-wrap";
    document.body.appendChild(wrap);
  }
  const el = document.createElement("div");
  el.className = "toast";
  if (type === "error") el.classList.add("error");
  el.innerHTML = `${type === "error" ? "⚠️" : "✅"} ${msg}`;
  wrap.appendChild(el);
  requestAnimationFrame(() => el.classList.add("show"));
  setTimeout(() => {
    el.classList.remove("show");
    setTimeout(() => el.remove(), 300);
  }, 2000);
}

/* ===== 商品卡片 DOM ===== */
function productCard(p) {
  const style = catStyle(p.cat);
  const tag = tagInfo(p.tag);
  const catName = CAT_NAMES[p.cat] || "";
  return `
  <div class="card" data-id="${p.id}">
    <div class="thumb" style="background:${style.grad}">
      ${tag ? `<span class="tag-badge ${tag.cls}">${tag.text}</span>` : ""}
      <span>${p.emoji}</span>
    </div>
    <div class="body">
      <div class="cat-tag">${catName}</div>
      <h3>${p.name}</h3>
      <div class="meta">
        <span class="stars">${"★".repeat(Math.round(p.rating))}${p.rating < 5 ? "☆" : ""}</span>
        <span>${p.rating}</span>
        <span>· 已售 ${p.sales}</span>
      </div>
      <div class="foot">
        <div class="price">¥${p.price}${p.oldPrice ? `<span class="old">¥${p.oldPrice}</span>` : ""}</div>
        <button class="add-btn" onclick="addToCart(${p.id})" title="加入购物车">＋</button>
      </div>
    </div>
  </div>`;
}

/* ===== 头部渲染与移动端菜单 ===== */
document.addEventListener("DOMContentLoaded", () => {
  updateCartBadge();

  const burger = document.querySelector(".burger");
  const mobileNav = document.querySelector(".mobile-nav");
  if (burger && mobileNav) {
    burger.addEventListener("click", () => mobileNav.classList.add("open"));
    mobileNav.addEventListener("click", e => {
      if (e.target.classList.contains("mobile-nav")) mobileNav.classList.remove("open");
    });
    mobileNav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => mobileNav.classList.remove("open")));
  }
});
