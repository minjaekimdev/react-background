// ============================================================
// 미션 4-① · 바닐라 기준선 측정 (트레이드오프: 재렌더링 비용)
// "필요한 곳만" 고치는 게 얼마나 빠른지 몸으로 기억하세요.
// 미션 4-②(React 버전)에서 이 숫자와 비교하게 됩니다. README 필수!
// ============================================================

// ---------- 데이터: 10,000개 상품 (제공) ----------
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

// 전체를 다시 그리는 함수 (제공)
function renderAll() {
  tbody.innerHTML = PRODUCTS.map(rowHtml).join('');
}

// 초기 렌더: 화면을 처음 그릴 때는 전체 그리기가 맞습니다.
renderAll();

// ---------- 측정 기록 헬퍼 (제공) ----------
function log(label, ms) {
  const row = document.createElement('tr');
  row.innerHTML = `<td class="label">${label}</td><td>${ms.toFixed(2)} ms</td>`;
  measureLogEl.prepend(row);
}

function changeTargetPrice() {
  // 3번 상품 가격을 무작위로 바꿔, 두 방식 모두 "눈에 보이는 변화"를 만듭니다.
  PRODUCTS[3].price = 990000 + Math.floor(Math.random() * 1000);
}

// ---------- TODO (STEP 1): "전체 다시 그리기" 버튼 ----------
document.querySelector('#btn-all').addEventListener('click', () => {
  //  1) changeTargetPrice() 호출
  //  2) performance.now() 로 renderAll() 의 실행 시간을 측정
  //  3) log('전체 다시 그리기', 측정한 ms) 기록
  //
  // 💡 DOM 관점에서 이 방식은 10,000개의 <tr> 을 문자열로 다시 만들고
  //    innerHTML 로 통째로 갈아엎는 것입니다. 당연히 비쌉니다.
});

// ---------- TODO (STEP 2): "필요한 곳만 고치기" 버튼 ----------
document.querySelector('#btn-one').addEventListener('click', () => {
  //  1) changeTargetPrice() 호출
  //  2) document.querySelector('#product-rows tr[data-id="3"] .price') 로
  //     바뀐 셀 "하나"만 찾아 textContent 를 갱신
  //  3) log('필요한 곳만 고치기', 측정한 ms) 기록
  //
  // ⚠️ 체감 포인트: 이 방식이 빠른 이유는 "내가 어디가 바뀌는지 알고 있기 때문"입니다.
  //    빠르지만, 그 지식을 유지 보수하는 책임도 개발자의 몫이었죠. (미션 1!)
});

// ---------- STEP 3 · 돌아보기 ----------
// 두 버튼을 번갈아 5회씩 눌러 기록을 비교하세요.
//  - 대략 몇 배 차이인가요?
//  - React(미션 4-②)는 이 중 어느 쪽과 비슷할까요, 아니면 그 사이 어딘가일까요?
//    예측을 적어 두고 미션 4-②에서 확인하세요. 예측: ________
