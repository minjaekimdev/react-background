import { useState } from "react";

// ============================================================
// 미션 3 · 상태 끌어올리기 (Reacting to Input with State)
// ✅ README STEP 0~3: 두 입력의 온도를 App(부모)으로 끌어올려 해결했습니다.
//    고치기 전의 "설계 문제" 코드는 아래 🐛 주석으로 남겨두었습니다.
// ============================================================

// ✅ 해결 후: 진짜 온도(temperature, scale)는 App 하나만 기억하고,
//    두 입력에 보이는 값은 전부 그 원본에서 계산된 파생값입니다.
//    (🐛 고치기 전에는 각 입력이 "자기 온도"를 각자 기억해 서로 동기화되지 않았습니다)

function toCelsius(fahrenheit) {
  return ((fahrenheit - 32) * 5) / 9;
}

function toFahrenheit(celsius) {
  return (celsius * 9) / 5 + 32;
}

function tryConvert(temperature, to) {
  return to(temperature);
}

// 🐛 고치기 전 (끌어올리기 전) 코드 (기록용): 각 입력이 자기 온도를 따로 기억
// → 두 입력은 서로를 모르고, App 도 온도를 몰라 화씨 자동 환산이 되지 않았습니다.
// function CelsiusInput() {
//   const [celsius, setCelsius] = useState('');
//   return (
//     <label className="field">
//       섭씨 (°C)
//       <input
//         type="number"
//         placeholder="예: 100"
//         value={celsius}
//         onChange={(e) => setCelsius(e.target.value)}
//       />
//     </label>
//   );
// }

// ✅ 해결: 값을 props 로 받고, 변경은 onChange 로 부모에게 "통지"만 한다 (제어 컴포넌트)
function CelsiusInput({ value, onChange }) {
  return (
    <label className="field">
      섭씨 (°C)
      <input
        type="number"
        placeholder="예: 100"
        value={value}
        onChange={(e) => onChange(e.target.value, 'c')}
      />
    </label>
  );
}

// 🐛 고치기 전 코드 (기록용):
// function FahrenheitInput() {
//   const [fahrenheit, setFahrenheit] = useState('');
//   return (
//     <label className="field">
//       화씨 (°F)
//       <input
//         type="number"
//         placeholder="예: 212"
//         value={fahrenheit}
//         onChange={(e) => setFahrenheit(e.target.value)}
//       />
//     </label>
//   );
// }

function FahrenheitInput({ value, onChange }) {
  return (
    <label className="field">
      화씨 (°F)
      <input
        type="number"
        placeholder="예: 212"
        value={value}
        onChange={(e) => onChange(e.target.value, 'f')}
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
  // ❌ 고치기 전에는 App이 "지금 온도가 몇 도인지" 전혀 몰랐습니다.
  // ✅ 해결: 진짜 온도(원본)를 App 하나가 기억하고, 나머지는 전부 파생값(계산값)

  const [temperature, setTemperature] = useState("");
  const [scale, setScale] = useState("c");

  const celsius =
    scale === "c" ? temperature : tryConvert(temperature, toCelsius);
  const fahrenheit =
    scale === "f" ? temperature : tryConvert(temperature, toFahrenheit);

  console.log(`celsius: ${celsius}, farenheit: ${fahrenheit}`);

  const handleTemperatureChange = (value, scale) => {
    setScale(scale);
    setTemperature(value);
  };

  return (
    <main className="app">
      <h1>🌡️ 온도 변환기</h1>
      <p className="sub">
        미션: 두 입력이 항상 일치하도록 고치기 (README STEP 0~3)
      </p>

      {/* 🐛 고치기 전 (기록용): 넘길 값이 없어 두 입력은 각자 따로 놀았고,
          판정은 온도를 입력해도 영원히 "온도를 입력해 보세요." 상태였습니다.
          <CelsiusInput />
          <FahrenheitInput />
          <BoilingVerdict celsius={null} />
      */}
      <CelsiusInput value={celsius} onChange={handleTemperatureChange} />
      <FahrenheitInput value={fahrenheit} onChange={handleTemperatureChange} />

      <BoilingVerdict celsius={celsius} />

      <p className="warn">
        ✅ 해결됨 — 고치기 전에는 섭씨에 100을 넣어도 화씨는 그대로, "끓고
        있습니다" 판정도 갱신되지 않았습니다. "진짜 온도"가 세 곳에(혹은 아무
        곳에도) 존재하지 않았기 때문입니다. (🐛 원본 코드는 위 주석 참고)
      </p>
    </main>
  );
}
