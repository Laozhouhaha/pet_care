/* ===== 购物车页逻辑 ===== */

const PET_OPTIONS = [
  { key: "dog", name: "狗狗", emoji: "🐶" },
  { key: "cat", name: "猫咪", emoji: "🐱" },
  { key: "rabbit", name: "兔子", emoji: "🐰" },
  { key: "hamster", name: "仓鼠", emoji: "🐹" },
  { key: "bird", name: "鸟类", emoji: "🐦" },
  { key: "reptile", name: "爬宠", emoji: "🦎" },
  { key: "fish", name: "水族", emoji: "🐠" },
  { key: "other", name: "其他", emoji: "🐾" },
];

const EXP_OPTIONS = [
  { value: "new", label: "新手（<1 年）" },
  { value: "1-3", label: "1-3 年" },
  { value: "3-5", label: "3-5 年" },
  { value: "5+", label: "5 年以上" },
];

const CUSTOMER_KEY = "paw_customer";

function getCustomerInfo() {
  try { return JSON.parse(localStorage.getItem(CUSTOMER_KEY)) || {}; }
  catch { return {}; }
}

function esc(s = "") {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function checkedIf(list, val) {
  return Array.isArray(list) && list.includes(val) ? "checked" : "";
}

function infoForm() {
  const saved = getCustomerInfo();
  const petChips = PET_OPTIONS.map(p => `
    <label class="chip"><input type="checkbox" name="pets" value="${p.key}" ${checkedIf(saved.pets, p.key)}><span>${p.emoji} ${p.name}</span></label>`).join("");
  const catChips = CATEGORIES.map(c => `
    <label class="chip"><input type="checkbox" name="cats" value="${c.key}" ${checkedIf(saved.cats, c.key)}><span>${c.emoji} ${c.name}</span></label>`).join("");
  const expChips = EXP_OPTIONS.map(e => `
    <label class="chip"><input type="radio" name="exp" value="${e.value}" ${saved.exp === e.value ? "checked" : ""}><span>${e.label}</span></label>`).join("");

  return `
  <form class="info-form" id="customerForm" onsubmit="event.preventDefault();checkout()">
    <h3>📋 收件信息</h3>
    <label class="field"><span>收货人姓名 *</span><input id="cfName" type="text" placeholder="请输入收货人姓名" value="${esc(saved.name)}" required></label>
    <label class="field"><span>手机号码 *</span><input id="cfPhone" type="tel" placeholder="请输入 11 位手机号" value="${esc(saved.phone)}" required></label>
    <label class="field"><span>收货地址 *</span><textarea id="cfAddress" rows="2" placeholder="省市区 + 详细地址" required>${esc(saved.address)}</textarea></label>

    <h3>🐾 养宠档案 <span style="font-size:12px;font-weight:500;color:var(--ink-soft)">（选填，用于个性化推荐）</span></h3>
    <div class="field">
      <span>家里养了什么宠物？</span>
      <div class="chips">${petChips}</div>
    </div>
    <div class="field">
      <span>偏爱哪些品类？</span>
      <div class="chips">${catChips}</div>
    </div>
    <div class="field">
      <span>养宠经验</span>
      <div class="chips">${expChips}</div>
    </div>
    <label class="field"><span>订单备注（选填）</span><textarea id="cfNote" rows="2" placeholder="例如：家有挑食猫咪，希望顺带推荐一些零食…">${esc(saved.note)}</textarea></label>
  </form>`;
}

function renderCart() {
  const cart = getCart();
  const area = document.getElementById("cartArea");

  if (cart.length === 0) {
    area.innerHTML = `
      <div class="cart-empty" style="background:#fff;border:1px solid var(--line);border-radius:var(--radius)">
        <div class="e">🛒</div>
        <h3 style="font-size:20px">购物车还是空的</h3>
        <p>快去给毛孩子挑点好吃的、好玩的吧～</p>
        <a class="btn btn-primary" href="products.html">去逛逛 🐾</a>
      </div>`;
    return;
  }

  const items = cart.map(ci => findProduct(ci.id)).filter(Boolean);
  const subtotal = items.reduce((sum, p) => sum + p.price * (cart.find(c => c.id === p.id)?.qty || 0), 0);
  const shipping = subtotal >= 99 || subtotal === 0 ? 0 : 8;
  const discount = subtotal >= 199 ? 20 : 0;
  const total = subtotal + shipping - discount;

  area.innerHTML = `
    <div class="cart-layout">
      <div class="cart-left">
        <div class="cart-items">
          ${items.map(p => {
            const qty = cart.find(c => c.id === p.id).qty;
            const s = catStyle(p.cat);
            return `
            <div class="cart-item" data-id="${p.id}">
              <div class="thumb" style="background:${s.grad}">${p.emoji}</div>
              <div>
                <h3>${p.name}</h3>
                <span class="cat-tag">${CAT_NAMES[p.cat]}</span>
                <div class="qty">
                  <button onclick="changeQty(${p.id}, -1)" ${qty <= 1 ? "disabled" : ""}>−</button>
                  <span>${qty}</span>
                  <button onclick="changeQty(${p.id}, 1)">＋</button>
                </div>
              </div>
              <div class="right">
                <div class="price">¥${(p.price * qty).toFixed(1).replace(/\.0$/, "")}</div>
                <button class="rm-btn" onclick="removeItem(${p.id})">🗑️ 移除</button>
              </div>
            </div>
            `;
          }).join("")}
        </div>
        ${infoForm()}
      </div>

      <div class="summary">
        <h3>订单结算</h3>
        <div class="row"><span>商品小计</span><span>¥${subtotal.toFixed(1).replace(/\.0$/, "")}</span></div>
        <div class="row"><span>运费</span><span>${shipping === 0 ? "免运费 🎉" : "¥" + shipping}</span></div>
        <div class="row"><span>满减优惠</span><span>${discount > 0 ? "-¥" + discount : "¥0"}</span></div>
        <div class="row total">
          <span>应付合计</span>
          <span class="price">¥${total.toFixed(1).replace(/\.0$/, "")}</span>
        </div>
        <button class="btn btn-primary checkout-btn" onclick="checkout()">立即结算 🐾</button>
        <p class="note">💡 满 ¥99 免运费 · 满 ¥199 减 ¥20<br>🛡️ 正品保障 · 7 天无理由退换</p>
      </div>
    </div>`;
}

function changeQty(id, delta) {
  const cart = getCart();
  const item = cart.find(c => c.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) return removeItem(id);
  saveCart(cart);
  renderCart();
  toast(delta > 0 ? "已增加数量" : "已减少数量");
}

function removeItem(id) {
  saveCart(getCart().filter(c => c.id !== id));
  renderCart();
  toast("已从购物车移除");
}

function checkout() {
  const cart = getCart();
  if (cart.length === 0) return;

  const name = document.getElementById("cfName")?.value.trim() || "";
  const phone = document.getElementById("cfPhone")?.value.trim() || "";
  const address = document.getElementById("cfAddress")?.value.trim() || "";
  if (!name) return toast("请先填写收货人姓名", "error");
  if (!/^1[3-9]\d{9}$/.test(phone)) return toast("请填写正确的 11 位手机号", "error");
  if (!address) return toast("请先填写收货地址", "error");

  const pets = [...document.querySelectorAll('input[name="pets"]:checked')].map(i => i.value);
  const cats = [...document.querySelectorAll('input[name="cats"]:checked')].map(i => i.value);
  const exp = document.querySelector('input[name="exp"]:checked')?.value || "";
  const note = document.getElementById("cfNote")?.value.trim() || "";

  localStorage.setItem(CUSTOMER_KEY, JSON.stringify({ name, phone, address, pets, cats, exp, note, updatedAt: Date.now() }));
  document.getElementById("orderModal").classList.add("open");
}

function closeModal() {
  document.getElementById("orderModal").classList.remove("open");
  saveCart([]);
  renderCart();
}

document.addEventListener("DOMContentLoaded", renderCart);
document.getElementById("orderModal")?.addEventListener("click", e => {
  if (e.target.id === "orderModal") closeModal();
});
