/* ===== 购物车页逻辑 ===== */
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
          </div>`;
        }).join("")}
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
