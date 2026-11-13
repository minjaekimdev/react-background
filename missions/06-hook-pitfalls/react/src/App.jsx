import { useEffect, useState } from "react";

// ============================================================
// 미션 6 · 훅(Hooks)의 함정 (트레이드오프)
// ✅ 두 버그를 모두 해결했습니다. 고치기 전의 버그 코드는
//    각 컴포넌트의 🐛 주석으로 남겨두었습니다.
// ============================================================

const FRUITS = [
  "apple",
  "banana",
  "cherry",
  "durian",
  "elderberry",
  "fig",
  "grape",
  "honeydew",
  "kiwi",
  "lemon",
];

// 버그 ① (✅ 해결): 고치기 전에는 1초마다 1씩 늘어야 하는데, 1에서 멈췄습니다. (STEP 1~2)
function StopWatch() {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(true);

  useEffect(() => {
    if (!running) return;

    // 🐛 고치기 전 버그 코드 (기록용 — STEP 1 진단):
    //   콜백이 기억하는 `seconds` 는 이 컴포넌트가 렌더될 당시의 값(스냅샷)이라,
    //   몇 번 실행돼도 `setSeconds(0 + 1)` 만 반복 → 영원히 1에서 멈췄습니다.
    // const intervalId = setInterval(() => {
    //   setSeconds(seconds + 1);
    // }, 1000);

    // ✅ 해결: 함수형 업데이트 — `s` 는 콜백 실행 시점에 React 가 넘겨주는 "가장 최신 상태"
    const intervalId = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []); // ← 의존성 배열이 비어 있습니다. "마운트 시 딱 한 번"이라는 뜻.

  return (
    <div className="panel">
      <p className="timer">
        {seconds}
        <small> 초</small>
      </p>
      <button onClick={() => setRunning(!running)}>
        {running ? "⏸ 정지" : "▶ 재생"}
      </button>
      <button onClick={() => setSeconds(0)}>↺ 초기화</button>
    </div>
  );
}

// 버그 ② (✅ 해결): 동작은 하지만, 매 입력마다 불필요한 렌더가 한 번 더 발생했습니다. (STEP 3)
function SearchList() {
  const [query, setQuery] = useState("");

  // 🐛 고치기 전 버그 코드 (기록용 — STEP 3 진단): 계산 가능한 파생값을 "상태"로 저장하고
  //   useEffect 로 동기화 → 입력 1글자마다 렌더가 2번 발생했고,
  //   filtered 가 query 보다 뒤처질 위험도 구조적으로 남아 있었습니다.
  // const [filtered, setFiltered] = useState(FRUITS);
  // useEffect(() => {
  //   setFiltered(
  //     FRUITS.filter((fruit) =>
  //       fruit.toLowerCase().includes(query.toLowerCase()),
  //     ),
  //   );
  // }, [query]);

  // ✅ 해결: 상태를 지우고 렌더 중에 "계산" → 입력마다 렌더가 정확히 한 번 발생
  const filtered = FRUITS.filter((fruit) =>
    fruit.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="panel">
      <p>
        <strong>🍎 과일 검색</strong>
      </p>
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
      <p style={{ fontSize: 13, color: "#888" }}>
        {filtered.length}개 결과 · 검색어: {query || "(없음)"}
      </p>
    </div>
  );
}

export default function App() {
  return (
    <main className="app">
      <h1>⏱️ 훅의 함정 진단실</h1>
      <p className="sub">
        트레이드오프 ③: 훅은 "마법 없는 명시성"을 준 대신, 새로운 실수 포인트를
        줬습니다. 두 버그의 원인은 각 컴포넌트의 🐛 주석에 기록해 두었습니다.
        자세한 순서는 README!
      </p>

      <div className="warn">
        ✅ <b>버그 ① 해결</b> 스톱워치: 고치기 전에는 1초 후 <b>1에서 멈췄습니다.</b>{" "}
        원인: 스냅샷 → 함수형 업데이트로 해결.
        <br />
        ✅ <b>버그 ② 해결</b> 과일 검색: 고치기 전에는 렌더가 두 번씩
        발생했습니다. 원인: 파생값을 상태로 저장 → 렌더 중 계산으로 해결.
      </div>

      <StopWatch />
      <SearchList />
    </main>
  );
}
