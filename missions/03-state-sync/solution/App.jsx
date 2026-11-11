import { useState } from 'react';

// ============================================================
// 미션 3 정답 코드 (solution)
// ⚠️ 먼저 직접 구현한 뒤에 비교하세요!
// 이 파일 내용을 src/App.jsx 에 덮어써서 실행해 볼 수 있습니다.
// 공식 문서 "Sharing State Between Components"의 예제 구조와 같습니다.
// ============================================================

function toCelsius(fahrenheit) {
  return ((fahrenheit - 32) * 5) / 9;
}

function toFahrenheit(celsius) {
  return (celsius * 9) / 5 + 32;
}

function tryConvert(value, convert) {
  const parsed = parseFloat(value);
  if (Number.isNaN(parsed)) return '';
  const rounded = Math.round(convert(parsed) * 1000) / 1000;
  return String(rounded);
}

// 이제 입력은 "값과 변경 통지"를 props 로 받는 제어 컴포넌트입니다.
function TemperatureInput({ label, value, onChange }) {
  return (
    <label className="field">
      {label}
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="온도 입력"
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
  // 단 하나의 원본 상태: "마지막에 입력한 숫자 + 그 단위"
  const [temperature, setTemperature] = useState('');
  const [scale, setScale] = useState('c');

  function handleCelsiusChange(value) {
    setScale('c');
    setTemperature(value);
  }

  function handleFahrenheitChange(value) {
    setScale('f');
    setTemperature(value);
  }

  // 반대 단위 입력은 "계산값"입니다. 절대 상태로 저장하지 않습니다.
  const celsius = scale === 'c' ? temperature : tryConvert(temperature, toCelsius);
  const fahrenheit = scale === 'f' ? temperature : tryConvert(temperature, toFahrenheit);

  const celsiusNumber = parseFloat(celsius);

  return (
    <main className="app">
      <h1>🌡️ 온도 변환기</h1>
      <p className="sub">상태 끌어올리기 완료 버전 — 두 입력은 항상 동기화됩니다</p>

      <TemperatureInput
        label="섭씨 (°C)"
        value={celsius}
        onChange={handleCelsiusChange}
      />
      <TemperatureInput
        label="화씨 (°F)"
        value={fahrenheit}
        onChange={handleFahrenheitChange}
      />

      <BoilingVerdict celsius={Number.isNaN(celsiusNumber) ? null : celsiusNumber} />

      <p className="verdict">
        ✅ 섭씨에 100을 넣으면 화씨가 212로 자동 계산됩니다. 그 반대도 마찬가지!
        상태는 한 곳(App)에만 있고, 나머지는 전부 계산값이므로 어긋날 수 없습니다.
      </p>
    </main>
  );
}
