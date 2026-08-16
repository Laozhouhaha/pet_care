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

/* ===== 用户评价轮播 ===== */
function initTestiCarousel() {
  const root = document.getElementById("testiCarousel");
  if (!root) return;
  const viewport = root.querySelector(".testi-viewport");
  const track = root.querySelector(".testi-track");
  const cards = Array.from(root.querySelectorAll(".testi"));
  const dotsBox = root.querySelector(".testi-dots");
  const prevBtn = root.querySelector(".prev");
  const nextBtn = root.querySelector(".next");

  const COUNT = cards.length;
  const CLONE = 3; // 首尾克隆张数，需 ≥ 单屏最大展示数
  const REAL_START = CLONE; // 克隆后真实卡片的起始内容索引

  // 首尾各克隆 CLONE 张，配合回跳实现无缝无限循环
  const pre = [], post = [];
  for (let i = 0; i < CLONE; i++) {
    const p = cards[(COUNT - CLONE + i) % COUNT].cloneNode(true);
    const q = cards[i % COUNT].cloneNode(true);
    p.setAttribute("aria-hidden", "true");
    q.setAttribute("aria-hidden", "true");
    pre.push(p);
    post.push(q);
  }
  track.prepend(...pre);
  track.append(...post);

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let perView = 3;
  let step = 0; // cardW + gap
  let offset = REAL_START; // 可见窗口的起始内容索引
  let timer = null;
  let animating = false;
  let paused = false;

  function layout() {
    const w = viewport.clientWidth;
    const gap = parseFloat(getComputedStyle(track).gap) || 22;
    perView = w >= 900 ? 3 : w >= 620 ? 2 : 1;
    const cardW = (w - gap * (perView - 1)) / perView;
    step = cardW + gap;
    track.style.setProperty("--testi-gap", gap + "px");
    track.style.setProperty("--testi-card", cardW + "px");
    offset = Math.min(Math.max(offset, REAL_START), REAL_START + COUNT);
  }

  function render(immediate = false) {
    const x = -offset * step;
    if (immediate) {
      track.style.transition = "none";
      track.style.transform = `translateX(${x}px)`;
      void track.offsetWidth;
      track.style.transition = "";
    } else {
      track.style.transform = `translateX(${x}px)`;
      animating = true;
      clearTimeout(render.timer);
      render.timer = setTimeout(() => { animating = false; }, 700);
    }
    syncDots();
  }
  track.addEventListener("transitionend", () => { animating = false; });

  function syncDots() {
    const pages = Math.ceil(COUNT / perView);
    const active = Math.min(Math.floor((offset - REAL_START) / perView), pages - 1);
    dotsBox.querySelectorAll("button").forEach((d, i) => {
      d.classList.toggle("active", i === active);
      d.setAttribute("aria-selected", i === active ? "true" : "false");
    });
  }

  function buildDots() {
    const pages = Math.ceil(COUNT / perView);
    dotsBox.innerHTML = "";
    for (let i = 0; i < pages; i++) {
      const b = document.createElement("button");
      b.type = "button";
      b.setAttribute("role", "tab");
      b.setAttribute("aria-label", `第 ${i + 1} 页`);
      b.addEventListener("click", () => {
        if (animating) return;
        offset = REAL_START + i * perView;
        render();
        resetAuto();
      });
      dotsBox.appendChild(b);
    }
    syncDots();
  }

  function next() {
    if (animating) return;
    if (offset >= REAL_START + COUNT) {
      offset = REAL_START;
      render(true); // 跳到内容相同的克隆起点，视觉无感
    }
    offset += 1;
    render();
  }

  function prev() {
    if (animating) return;
    if (offset <= REAL_START) {
      offset = REAL_START + COUNT;
      render(true); // 跳到内容相同的克隆终点，视觉无感
    }
    offset -= 1;
    render();
  }

  function resetAuto() {
    stopAuto();
    startAuto();
  }
  function stopAuto() {
    if (timer) { clearInterval(timer); timer = null; }
  }
  function startAuto(delay = 4000) {
    if (reduceMotion) return;
    stopAuto();
    timer = setInterval(() => {
      if (!paused && !document.hidden) next();
    }, delay);
  }

  prevBtn.addEventListener("click", () => { prev(); resetAuto(); });
  nextBtn.addEventListener("click", () => { next(); resetAuto(); });

  // 悬停/聚焦暂停自动播放
  root.addEventListener("mouseenter", () => { paused = true; });
  root.addEventListener("mouseleave", () => { paused = false; });
  root.addEventListener("focusin", () => { paused = true; });
  root.addEventListener("focusout", () => { paused = false; });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stopAuto();
    else if (!paused) startAuto();
  });

  let resizeTimer = null;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      layout();
      buildDots();
      render(true);
    }, 150);
  });

  layout();
  buildDots();
  render(true);
  startAuto();
}

/* ===== Toast ===== */
function toast(msg) {
  let wrap = document.querySelector(".toast-wrap");
  if (!wrap) {
    wrap = document.createElement("div");
    wrap.className = "toast-wrap";
    document.body.appendChild(wrap);
  }
  const el = document.createElement("div");
  el.className = "toast";
  el.innerHTML = `✅ ${msg}`;
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
  initTestiCarousel();

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
