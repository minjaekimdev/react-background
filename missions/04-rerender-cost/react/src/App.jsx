import { Profiler, useState } from 'react';

// ============================================================
// 미션 4-② · React 재렌더링의 비용 (트레이드오프)
// 미션 4-① (바닐라)에서 측정한 기준선과 비교하세요. README 필수!
// ============================================================

// ---------- 데이터: 10,000개 상품 (미션 4-①과 동일) ----------
const PRODUCTS = Array.from({ length: 10000 }, (_, i) => ({
  id: i,
  name: `상품 ${i}`,
  price: 1000 + (i % 900) * 10,
}));

// ---------- 렌더 측정기 (제공) ----------
// ProductRow 가 "실행"(=렌더)될 때마다 기록됩니다.
const renderStats = { count: 0, totalMs: 0 };

function resetRenderStats() {
  renderStats.count = 0;
  renderStats.totalMs = 0;
}

// ---------- TODO (STEP B): 이 컴포넌트를 React.memo 로 감싸세요 ----------
function ProductRow({ product }) {
  const t0 = performance.now();
  const row = (
    <tr>
      <td>{product.id}</td>
      <td>{product.name}</td>
      <td>{product.price.toLocaleString()}원</td>
    </tr>
  );
  renderStats.count += 1;
  renderStats.totalMs += performance.now() - t0;
  return row;
}

export default function App() {
  const [products, setProducts] = useState(PRODUCTS);

  function changeOnePrice() {
    const t0 = performance.now();
    // TODO (STEP A): id 가 3 인 상품 "하나"만 가격을 바꾸되, 새 배열을 만들어
    // setProducts 하세요. 조건은 두 가지입니다.
    //   1) 불변성: 기존 배열/객체를 고치지 말 것
    //   2) 바뀌지 않은 나머지 9,999개는 "기존 객체 그대로(같은 참조)"일 것
    //      → 그래야 나중에 memo 가 "이 행은 바뀌지 않았다"고 판단할 수 있습니다.
    //
    // 힌트: products.map((p) => (p.id === 3 ? { ...p, price: 새가격 } : p))
    // 새가격은 990000 + Math.floor(Math.random() * 1000)
    //
    // 아래 콘솔 로그는 "내가 쓴 코드"의 실행 시간일 뿐이라는 점도 기억하세요.
    // 진짜 비용은 이 함수가 끝난 "다음"에 React가 전체를 다시 렌더하면서 발생합니다.
    console.log(`[측정] setState 준비 시간: ${(performance.now() - t0).toFixed(2)}ms`);
  }

  return (
    <main className="app">
      <h1>📦 10,000개 상품 리스트 — React 버전</h1>
      <p className="sub">
        "3번 상품 가격 바꾸기"를 누르면 <b>App 전체가 다시 렌더</b>됩니다.
        몇 개의 행이 다시 실행되는지 아래 측정 패널과 콘솔로 확인하세요.
      </p>

      <div className="row">
        <button onClick={changeOnePrice}>3번 상품 가격 바꾸기</button>
        <button className="ghost" onClick={resetRenderStats}>측정값 초기화</button>
      </div>

      {/* ⚠️ 이 패널의 숫자는 "직전 렌더"의 값입니다 (한 박자 늦게 갱신됨).
          React는 부모(App)를 먼저 실행하고 그다음 자식(ProductRow)을 실행하므로,
          자식들이 방금 기록한 값은 다음 렌더에서야 보입니다.
          → 버튼을 두 번 눌렀을 때 숫자를 확인해 보세요. */}
      <StatsPanel />

      <div className="wrap">
        {/* Profiler: 실제 렌더+커밋에 걸린 시간(actualDuration)을 콘솔에 기록해 줍니다. */}
        <Profiler
          id="product-list"
          onRender={(id, phase, actualDuration) => {
            console.log(
              `[Profiler] ${id} / ${phase} / 실제 커밋 시간: ${actualDuration.toFixed(2)}ms`
            );
          }}
        >
          <table>
            <thead>
              <tr><th>ID</th><th>상품명</th><th>가격</th></tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <ProductRow key={p.id} product={p} />
              ))}
            </tbody>
          </table>
        </Profiler>
      </div>

      <KeyDemo />
    </main>
  );
}

function StatsPanel() {
  return (
    <section className="stats">
      <div>직전 렌더에서 실행된 행 수 <strong>{renderStats.count.toLocaleString()}</strong></div>
      <div>렌더 함수 총 실행 시간 <strong>{renderStats.totalMs.toFixed(2)}ms</strong></div>
    </section>
  );
}

// ============================================================
// 🧪 key 실험실 (STEP C)
// ============================================================
const INITIAL_PEOPLE = ['철수', '영희', '민수'];

function KeyDemo() {
  const [people, setPeople] = useState(INITIAL_PEOPLE);
  const [newName, setNewName] = useState('신규');

  function addFirst() {
    setPeople([newName || '신규', ...people]);
  }

  return (
    <section className="key-demo">
      <h2>🧪 key 실험실</h2>
      <p>
        각 줄의 input에 아무 텍스트나 적어 둔 뒤, "맨 앞에 추가"를 눌러 보세요.
        그리고 <b>key</b>를 바꿔 보세요.
      </p>
      <ul>
        {people.map((person, index) => (
          // TODO (STEP C): key={index} 를 key={person} 으로 바꾸고 다시 실험하세요.
          // key 가 "이 DOM 노드가 누구인지"를 React에게 알려주는 것임을 체감하게 됩니다.
          <li key={index}>
            {/* 일부러 비제어 input 입니다 — 사용자가 타이핑한 값은 DOM이 기억합니다. */}
            <input type="text" placeholder={person} />
            <span className="who">{person}</span>
          </li>
        ))}
      </ul>
      <div className="row">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <button onClick={addFirst}>맨 앞에 추가</button>
      </div>
      <p className="hint">
        💡 key가 index일 때: 철수의 input에 "안녕"을 적어 두고 맨 앞에 추가하면 "안녕"이 신규 자리에 남아 있습니다.
        React는 index 0 자리의 DOM을 재사용했기 때문입니다. key를 person(고유값)으로 바꾸면 값이 사람을 따라갑니다.
        리스트에서 key의 역할은 공식 문서 "Rendering Lists"를 참고하세요.
      </p>
    </section>
  );
}
