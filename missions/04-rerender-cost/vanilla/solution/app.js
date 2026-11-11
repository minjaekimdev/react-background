// ============================================================
// 미션 4-① 정답 코드 (solution)
// ⚠️ 먼저 직접 구현한 뒤에 비교하세요!
// ============================================================

const PRODUCTS = Array.from({ length: 10000 }, (_, i) => ({
  id: i,
  name: `상품 ${i}`,
  price: 1000 + (i % 900) * 10,
}));

const tbody = document.querySelector('#product-rows');
const measureLogEl = document.querySelector('#measure-log');

function rowHtml(product) {
  return `<tr data-id="${product.id}">
    <td>${product.id}</td>
    <td class="name">${product.name}</td>
    <td class="price">${product.price.toLocaleString()}원</td>
  </tr>`;
}

function renderAll() {
  tbody.innerHTML = PRODUCTS.map(rowHtml).join('');
}

renderAll();

function log(label, ms) {
  const row = document.createElement('tr');
  row.innerHTML = `<td class="label">${label}</td><td>${ms.toFixed(2)} ms</td>`;
  measureLogEl.prepend(row);
}

function changeTargetPrice() {
  PRODUCTS[3].price = 990000 + Math.floor(Math.random() * 1000);
}

document.querySelector('#btn-all').addEventListener('click', () => {
  changeTargetPrice();
  const t0 = performance.now();
  renderAll();
  log('전체 다시 그리기', performance.now() - t0);
});

document.querySelector('#btn-one').addEventListener('click', () => {
  changeTargetPrice();
  const t0 = performance.now();
  const priceCell = document.querySelector('#product-rows tr[data-id="3"] .price');
  priceCell.textContent = PRODUCTS[3].price.toLocaleString() + '원';
  log('필요한 곳만 고치기', performance.now() - t0);
});
