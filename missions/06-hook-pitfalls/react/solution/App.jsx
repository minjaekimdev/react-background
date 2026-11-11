import { useEffect, useRef, useState } from 'react';

// ============================================================
// 미션 6 정답 코드 (solution)
// ⚠️ 먼저 직접 구현한 뒤에 비교하세요!
// ============================================================

const FRUITS = [
  'apple', 'banana', 'cherry', 'durian', 'elderberry',
  'fig', 'grape', 'honeydew', 'kiwi', 'lemon',
];

// ✅ 해결: 함수형 업데이트 (setState 에 "값"이 아니라 "함수"를 넘긴다)
// setSeconds(s => s + 1) 의 s 는 React가 넘겨주는 "가장 최신 상태"입니다.
// 스냅샷 문제를 피하면서도 의존성 배열을 [] 로 유지할 수 있습니다.
function StopWatch() {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(true);

  useEffect(() => {
    if (!running) return;

    const intervalId = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [running]);

  return (
    <div className="panel">
      <p className="timer">
        {seconds}
        <small> 초</small>
      </p>
      <button onClick={() => setRunning(!running)}>
        {running ? '⏸ 정지' : '▶ 재생'}
      </button>
      <button onClick={() => setSeconds(0)}>↺ 초기화</button>
    </div>
  );
}

// 🔬 대안 해법 (참고): useRef 로 "최신 값"을 따로 기억하기
// 이벤트/타이머 콜백이 스냅샷이 아닌 최신 값을 필요로 할 때 쓰는 전형적 패턴입니다.
function StopWatchWithRef() {
  const [seconds, setSeconds] = useState(0);
  const latestSeconds = useRef(0); // 렌더 사이에 유지되지만, 바뀌어도 재렌더는 일으키지 않는 상자

  useEffect(() => {
    const intervalId = setInterval(() => {
      latestSeconds.current += 1;
      setSeconds(latestSeconds.current);
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="panel">
      <p className="timer">{seconds}<small> 초 (useRef 버전)</small></p>
    </div>
  );
}

// ✅ 해결: 필터 결과는 "계산값"이다. 상태도, useEffect도 필요 없습니다.
// 렌더 중에 그냥 계산하면, 항상 최신 query 로 계산된다는 것이 보장됩니다.
function SearchList() {
  const [query, setQuery] = useState('');

  // 렌더 중 계산 — "You Might Not Need an Effect"의 핵심 교훈
  const filtered = FRUITS.filter((fruit) =>
    fruit.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="panel">
      <p><strong>🍎 과일 검색 (계산값 버전)</strong></p>
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
      <h1>⏱️ 훅의 함정 진단실 — 해결 버전</h1>
      <p className="sub">
        스톱워치는 계속 늘어나고, 검색은 이제 한 번의 렌더로 끝납니다.
      </p>

      <StopWatch />
      <SearchList />
      <StopWatchWithRef />
    </main>
  );
}
