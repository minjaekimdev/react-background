import { Profiler, memo, useState } from 'react';

// ============================================================
// 미션 4-② 정답 코드 (solution)
// ⚠️ 먼저 직접 구현한 뒤에 비교하세요!
// ============================================================

const PRODUCTS = Array.from({ length: 10000 }, (_, i) => ({
  id: i,
  name: `상품 ${i}`,
  price: 1000 + (i % 900) * 10,
}));

const renderStats = { count: 0, totalMs: 0 };

function resetRenderStats() {
  renderStats.count = 0;
  renderStats.totalMs = 0;
}

// ✅ STEP B: React.memo 로 감싸서, props 가 바뀌지 않은 행은 재실행하지 않습니다.
const ProductRow = memo(function ProductRow({ product }) {
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
});

export default function App() {
  const [products, setProducts] = useState(PRODUCTS);

  function changeOnePrice() {
    // ✅ STEP A: 불변 업데이트 + 바뀌지 않은 행은 같은 객체 참조 유지
    setProducts(
      products.map((p) =>
        p.id === 3 ? { ...p, price: 990000 + Math.floor(Math.random() * 1000) } : p
      )
    );
  }

  return (
    <main className="app">
      <h1>📦 10,000개 상품 리스트 — React 버전 (memo 적용)</h1>
      <p className="sub">
        App은 여전히 전체를 다시 렌더하지만, memo 덕분에 "props 가 바뀐 행 하나"만 실제로 재실행됩니다.
      </p>

      <div className="row">
        <button onClick={changeOnePrice}>3번 상품 가격 바꾸기</button>
        <button className="ghost" onClick={resetRenderStats}>측정값 초기화</button>
      </div>

      <StatsPanel />

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
        key가 이제 <b>사람(고유 id)</b>이라서, 적어 둔 값이 사람을 따라다닙니다.
      </p>
      <ul>
        {people.map((person) => (
          <li key={person}>
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
    </section>
  );
}
