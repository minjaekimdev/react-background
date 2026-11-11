# 미션 3 · 상태 끌어올리기 — 단방향 데이터 흐름이 필요한 이유

> **같은 데이터를 여러 곳에서 "따로" 기억하면, 언젠가 어긋난다. 답은 원본을 한 곳에 두는 것.**

## 이 미션의 배경 이야기

React 이전의 프레임워크들(Angular.js, Backbone 등)은 **양방향 데이터 바인딩**으로 이 문제를 풀었습니다.
"모델과 뷰를 서로 연결(바인딩)해 두면, 한쪽이 바뀌면 자동으로 반대쪽도 바뀐다"는 발상이지만, Pete Hunt가 지적했듯 모델이 커지면 **바인딩이 얽혀서 어떤 값이 언제 바뀌는지 추적하기 어려워졌습니다** ("computation이 chaining되어 작은 변화가 UI 대부분을 재계산하는" 문제 — Jordan Walke 인터뷰).

React의 대안은 과감하게 **양방향 바인딩을 버리고 단방향 흐름만 제공**하는 것이었습니다:

- 데이터는 **위(부모)에서 아래(자식)로 props로 흐른다**
- 자식이 데이터를 바꾸려면 → 부모가 준 "변경 함수"를 호출한다 (역방향 통지)
- **같은 값을 쓰는 컴포넌트들이 있다면, 그 상태를 공통 부모로 "끌어올린다(lift up)"**

## 준비물

- 미션 2 완료 (useState, props)
- 공식 문서 [컴포넌트 간 상태 공유](https://react.dev/learn/sharing-state-between-components)를 옆에 두고 진행하세요.

## 실행 방법

루트에서 `npm run dev` → `http://localhost:5173/missions/03-state-sync/react/`

## 미션 목표

스타터(`src/App.jsx`)는 **고의로 망가진** 온도 변환기입니다. 고쳐서 다음을 만족시키세요:

1. 섭씨에 `100` 입력 → 화씨 입력이 자동으로 `212`로 계산되어 표시된다.
2. 화씨에 `32` 입력 → 섭씨가 `0`으로 계산되어 표시된다.
3. 온도가 100°C 이상이면 "💧 물이 끓고 있습니다!" 판정이 **항상 최신 상태**로 바뀐다.

## STEP 0 · 버그 체감 (구현 전)

- 섭씨에 `100`을 입력해 보세요. 화씨는 그대로, 판정 문구도 그대로입니다.
- App이 `<BoilingVerdict celsius={null} />`을 넘길 수밖에 없는 이유는 무엇일까요?
  **"진짜 온도"가 어디에도 존재하지 않기 때문입니다.** 두 입력은 각자 자기 숫자만 기억할 뿐입니다.

## STEP 1 · 진짜 상태는 무엇인가?

트레이싱 표를 채워 보세요:

| 값 | 상태로 저장해야 하는가? | 이유 |
| --- | --- | --- |
| 마지막에 입력한 숫자 | ❓ | |
| 그 숫자의 단위(c 또는 f) | ❓ | |
| 반대 단위로 환산한 숫자 | ❓ | |
| "끓는지" 여부 | ❓ | |

정답: **숫자 + 단위**만 상태입니다. 환산값과 판정은 전부 **계산**하면 됩니다.
(판정을 상태로 저장하면? 미션 1의 동기화 버그가 부활합니다.)

## STEP 2 · 끌어올리기 구현

- 두 입력 컴포넌트를 **제어 컴포넌트**로 바꾸세요: 값을 props로 받고, `onChange`로 변경을 통지합니다.
- 상태를 `App`으로 끌어올리세요:

```jsx
const [temperature, setTemperature] = useState('');
const [scale, setScale] = useState('c'); // 마지막에 편집한 단위
```

- 섭씨 입력이 오면 `{ scale: 'c', temperature: 입력값 }`, 화씨 입력이 오면 `{ scale: 'f', temperature: 입력값 }`.
- 화면에 그릴 값은 렌더 중 계산:

```jsx
const celsius = scale === 'c' ? temperature : tryConvert(temperature, toCelsius);
const fahrenheit = scale === 'f' ? temperature : tryConvert(temperature, toFahrenheit);
```

- 판정 컴포넌트에는 `celsius`를 props로 넘기세요. 이제 절대 안 어긋납니다.

## STEP 3 · 검증

- 섭씨 `100` → 화씨 `212`, 판정 "끓고 있습니다!" ✔
- 화씨 `32` → 섭씨 `0`, 판정 "안 끓었습니다" ✔
- 입력을 지우면 판정이 "온도를 입력해 보세요"로 돌아가는지 ✔

## 돌아보기

1. 이전에는 두 입력이 "서로를 모르는" 컴포넌트였습니다. 지금은 무엇 덕분에 동기화되나요? (**단일 출처(single source of truth)**)
2. 데이터가 부모 → 자식으로만 흐른다면, 두 입력 컴포넌트는 서로를 전혀 호출하지 않습니다. 왜 그래도 동기화될까요?
3. 이 구조라면 새로운 표시(예: 켈빈 입력)를 추가할 때 무엇만 하면 되나요? 갱신 누락 위험은?
4. 양방향 바인딩(Angular.js 스타일)이었다면 이 예제는 어떻게 짜였을까요? 편의성은? 추적 가능성은?

## 정답 코드

`solution/App.jsx` — 내용을 `src/App.jsx`에 덮어써서 실행 비교하세요.

## 출처

- 공식 문서 [Sharing State Between Components](https://react.dev/learn/sharing-state-between-components) — 이 미션의 원형 예제
- 공식 문서 [Thinking in React](https://react.dev/learn/thinking-in-react) — "최소한의 상태만 찾고, 계산값은 상태로 만들지 않는다" 5단계 사고법
- Pete Hunt, *"Why did we build React?"* (2013) — 양방향 바인딩 대신 reconciliation을 택한 이유: https://legacy.reactjs.org/blog/2013/06/05/why-react.html
- Pete Hunt, *"React: Rethinking best practices"* (JSConf EU 2013) — "프레임워크의 언어가 아니라 앱의 언어로 관심사를 분리하라": https://www.youtube.com/watch?v=x7cQ3mrcKaY
- Jordan Walke Reactiflux 인터뷰 (2017) — "point-to-point binding이 chaining되며 UI 대부분을 재계산하던 문제": https://reactiflux.js.org/transcripts/jordan-walke
