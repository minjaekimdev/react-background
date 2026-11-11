import { useEffect, useState } from 'react';

// ============================================================
// 미션 6 · 훅(Hooks)의 함정 (트레이드오프)
// ⚠️ 아래 두 컴포넌트에는 고의로 "훅 시대의 전형적 버그"가 있습니다.
// ============================================================

const FRUITS = [
  'apple', 'banana', 'cherry', 'durian', 'elderberry',
  'fig', 'grape', 'honeydew', 'kiwi', 'lemon',
];

// ⚠️ 버그 ①: 1초마다 1씩 늘어야 하는데, 1에서 멈춥니다. (STEP 1~2)
function StopWatch() {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(true);

  useEffect(() => {
    if (!running) return;

    const intervalId = setInterval(() => {
      // 🐛 왜 1에서 멈출까요?
      // 이 화살표 함수가 기억하고 있는 `seconds` 는
      // 이 컴포넌트가 렌더될 당시의 값(스냅샷)입니다.
      setSeconds(seconds + 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []); // ← 의존성 배열이 비어 있습니다. "마운트 시 딱 한 번"이라는 뜻.

  return (
    <div className="panel">
      <p className="timer">
        {seconds}<small> 초</small>
      </p>
      <button onClick={() => setRunning(!running)}>
        {running ? '⏸ 정지' : '▶ 재생'}
      </button>
      <button onClick={() => setSeconds(0)}>↺ 초기화</button>
    </div>
  );
}

// ⚠️ 버그 ②: 동작은 하지만, 매 입력마다 불필요한 렌더가 한 번 더 발생합니다. (STEP 3)
function SearchList() {
  const [query, setQuery] = useState('');
  // 🐛 필터 결과를 "상태"로 저장하고, useEffect 로 동기화하고 있습니다.
  const [filtered, setFiltered] = useState(FRUITS);

  useEffect(() => {
    setFiltered(
      FRUITS.filter((fruit) => fruit.toLowerCase().includes(query.toLowerCase()))
    );
  }, [query]);

  return (
    <div className="panel">
      <p><strong>🍎 과일 검색</strong></p>
      <input
        type="text"
        placeholder="검색어 입력 (예: ap)"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <ul>
        {filtered.map((fruit) => (
          <li key={fruit}>{fruit}</li>
        ))}
      </ul>
      <p style={{ fontSize: 13, color: '#888' }}>
        {filtered.length}개 결과 · 검색어: {query || '(없음)'}
      </p>
    </div>
  );
}

export default function App() {
  return (
    <main className="app">
      <h1>⏱️ 훅의 함정 진단실</h1>
      <p className="sub">
        트레이드오프 ③: 훅은 "마법 없는 명시성"을 준 대신, 새로운 실수 포인트를 줬습니다.
        두 버그를 진단하고 고치세요. 자세한 순서는 README!
      </p>

      <div className="warn">
        🐛 <b>버그 ①</b> 스톱워치: 1초 후 <b>1에서 멈춥니다.</b>
        원인을 아는 것(스냅샷)이 이 미션의 절반입니다.
        <br />
        🐛 <b>버그 ②</b> 과일 검색: 동작은 합니다. 하지만 렌더가 두 번씩 발생합니다.
      </div>

      <StopWatch />
      <SearchList />
    </main>
  );
}
