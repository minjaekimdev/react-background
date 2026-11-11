import { useState } from 'react';

// ============================================================
// 미션 3 · 상태 끌어올리기 (Reacting to Input with State)
// ⚠️ 이 코드에는 고의로 "설계 문제"가 있습니다. README의 STEP 0부터!
// ============================================================

// 각 입력이 "자기 온도"를 각자 기억하고 있습니다.
// → 두 입력은 서로를 모르고, App도 지금 온도를 모릅니다.

function CelsiusInput() {
  const [celsius, setCelsius] = useState('');
  return (
    <label className="field">
      섭씨 (°C)
      <input
        type="number"
        placeholder="예: 100"
        value={celsius}
        onChange={(e) => setCelsius(e.target.value)}
      />
    </label>
  );
}

function FahrenheitInput() {
  const [fahrenheit, setFahrenheit] = useState('');
  return (
    <label className="field">
      화씨 (°F)
      <input
        type="number"
        placeholder="예: 212"
        value={fahrenheit}
        onChange={(e) => setFahrenheit(e.target.value)}
      />
    </label>
  );
}

function BoilingVerdict({ celsius }) {
  if (celsius === null) {
    return <p className="verdict">온도를 입력해 보세요.</p>;
  }
  return celsius >= 100 ? (
    <p className="verdict hot">💧 물이 끓고 있습니다!</p>
  ) : (
    <p className="verdict">아직 물이 끓지 않습니다.</p>
  );
}

export default function App() {
  // ❌ 문제: App은 "지금 온도가 몇 도인지" 전혀 모릅니다.
  return (
    <main className="app">
      <h1>🌡️ 온도 변환기</h1>
      <p className="sub">미션: 두 입력이 항상 일치하도록 고치기 (README STEP 0~3)</p>

      <CelsiusInput />
      <FahrenheitInput />

      {/* STEP 0: 지금은 넘길 값이 없어서 null 을 넘깁니다.
          온도를 입력해도 이 문장은 절대 바뀌지 않는다는 것을 먼저 확인하세요. */}
      <BoilingVerdict celsius={null} />

      <p className="warn">
        🐛 현재 상태: 섭씨에 100을 넣어도 화씨는 그대로, "끓고 있습니다" 판정도 갱신되지 않습니다.
        이 앱에는 "진짜 온도"가 세 곳에 (혹은 아무 곳에도) 존재하지 않기 때문입니다.
      </p>
    </main>
  );
}
