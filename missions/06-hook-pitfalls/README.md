# 미션 6 · 훅(Hooks)의 함정 — 스냅샷과 의존성 배열 (트레이드오프 ③)

> **훅은 "컴포넌트에서 시간과 부수효과를 다루는" 명시적 도구다. 명시적이라는 건, 실수할 자리가 명확하다는 뜻이기도 하다.**

## 이 미션의 배경 이야기

2019년 2월, React 16.8에서 **Hooks**가 정식 출시되었습니다 (RFC: [reactjs/rfcs#68](https://github.com/reactjs/rfcs/pull/68) — 공식 발표: [*"React v16.8: The One With Hooks"*](https://legacy.reactjs.org/blog/2019/02/06/react-v16.8.0.html)).
`useEffect`는 React가 "선언형으로 화면을 그린다"는 원칙을 지키면서 **렌더 이후의 시간 흐름(타이머, 구독, 정리)**을 다루게 해 준 도구입니다.

하지만 트레이드오프가 있었습니다. 값은 변하지만 화면 그리기는 "순간의 스냅샷"이라는 모델과,
`useEffect`의 **의존성 배열**이라는 새로운 개념을 개발자가 학습해야 했습니다. 이 미션에서 두 가지 전형적 사고를 직접 겪습니다.

## 준비물

- 미션 2 완료 (useState), 미션 4 완료 (key, 재렌더 개념)
- 옆에 둘 공식 문서: [상태는 스냅샷이다](https://react.dev/learn/state-as-a-snapshot) · [You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect)

## 실행 방법

루트에서 `npm run dev` → `http://localhost:5173/missions/06-hook-pitfalls/react/`
스타터는 **고의로 버그가 있는 코드**입니다. 콘솔을 함께 여세요.

## STEP 1 · 버그 ① 진단 — 타이머가 1에서 멈춘다

`StopWatch`를 관찰하세요: 1초 뒤 1이 되고, 그 뒤로 멈춥니다.

**왜일까요?** 손으로 그려 보세요:
1. 마운트 → `seconds = 0`인 시점의 컴포넌트가 실행됩니다.
2. `useEffect`가 인터벌을 등록합니다. 이때 인터벌 콜백은 **`seconds`가 0이었던 시점의 함수**(클로저)입니다.
3. 1초 뒤 `setSeconds(0 + 1)` → `seconds`가 1로 바뀌고 → **컴포넌트가 다시 렌더됩니다.**
4. 그런데 `useEffect`는 `[]`(빈 배열)라서 **다시 실행되지 않습니다.** 인터벌은 여전히 "0 시점의 `seconds`"를 기억합니다.
5. 1초 뒤 `setSeconds(0 + 1)` — 또 1입니다. 영원히 1.

핵심: **컴포넌트가 렌더될 때의 값들은 그 렌더만의 고정된 스냅샷입니다.**
렌더 함수는 그 순간의 상태를 찍은 사진이지, 시간이 지나면 알아서 최신이 되는 live 변수가 아닙니다.

## STEP 2 · 버그 ① 고치기 — 세 가지 해법을 전부 구현해 보세요

1. **함수형 업데이트** (권장): `setSeconds(seconds + 1)` → `setSeconds((s) => s + 1)`
   `s`는 React가 콜백 실행 시점에 넘겨주는 **가장 최신 상태**입니다. 스냅샷 문제를 우회합니다.
2. **의존성 배열에 [seconds] 넣기**: 그러면 매 틱마다 이펙트가 정리되고(cleanup) 새로 등록됩니다.
   동작은 하지만 "매 초 인터벌 재생성"이라는 비용과 함께, 인터벌의 타이밍이 렌더와 얽힙니다. 차이를 관찰하세요.
3. **useRef로 최신 값 기억하기**: `const latest = useRef(0)` → 인터벌에서 `latest.current += 1; setSeconds(latest.current)`.
   ref는 "렌더 사이에 유지되지만 바뀌어도 재렌더를 일으키지 않는 상자"입니다. ([useRef 문서](https://react.dev/reference/react/useRef)) — `solution/App.jsx`의 `StopWatchWithRef` 참고.

## STEP 3 · 버그 ② 진단 — 검색 렌더가 두 번 발생한다

`SearchList`에 검색어를 입력하면서 콘솔을 보세요. **입력 1글자마다 렌더가 두 번 일어납니다**:

- 1번째: `query`가 바뀌어서 렌더 (필요함)
- 2번째: `useEffect` 안의 `setFiltered(...)`가 실행되어 또 렌더 (불필요!)

이것은 오동작이 아니라 **구조 문제**입니다. `filtered`는 `query`만 있으면 **계산 가능한 파생 값**입니다.
미션 2에서 배운 원칙("계산 가능한 값은 상태로 만들지 않는다")이 이펙트에도 똑같이 적용됩니다.

**고치기**: `filtered` 상태와 `useEffect`를 지우고, 렌더 중에 계산하세요:

```jsx
const filtered = FRUITS.filter((f) => f.toLowerCase().includes(query.toLowerCase()));
```

이제 입력마다 렌더가 **정확히 한 번** 발생하고, `filtered`가 상태보다 뒤처질 위험도 구조적으로 없습니다.

## STEP 4 · StrictMode 관찰 — 이펙트가 왜 두 번씩?

이 미션은 `<StrictMode>`가 켜져 있습니다. 개발 모드에서 `useEffect`는 **마운트 → 언마임트 → 다시 마운트**를 시뮬레이션해 2번 실행됩니다. 콘솔에 로그를 남겨 확인해 보세요.
목적: **cleanup(정리 함수)을 제대로 안 쓴 이펙트를 개발 중에 일부러 드러내는 것**입니다.
`setInterval`을 정리하는 `return () => clearInterval(id)`이 없다면 어떻게 되는지도 실험해 보세요.
(프로덕션 빌드에서는 이런 이중 실행이 일어나지 않습니다 — [StrictMode 문서](https://react.dev/reference/react/StrictMode))

## 돌아보기

1. 클래스 시대의 `componentDidMount`/`componentDidUpdate`는 "시점"으로 코드를 나눴다면, `useEffect`는 "무엇을 위해"로 나눕니다. 어떤 쪽이 이해하기 쉬웠나요? 어떤 쪽이 실수하기 쉬웠나요?
2. 의존성 배열을 비우면(`[]`) "마운트 때 딱 한 번"이 됩니다. 이건 편리한데, STEP 1의 버그가 그 편리에서 나왔습니다. **편리와 함정이 같은 자리에서 나오는 다른 예를 아는 주제(라이브러리/API)와 비교해 보세요.**
3. STEP 3의 교훈을 한 문장으로: "useEffect를 쓰기 전에 물어볼 질문은?"

## 정답 코드

`react/solution/App.jsx` — 내용을 `src/App.jsx`에 덮어써서 실행 비교하세요.

## 출처

- 공식 문서 [State as a Snapshot](https://react.dev/learn/state-as-a-snapshot) — STEP 1 버그의 공식 해설
- 공식 문서 [Queueing a Series of State Updates](https://react.dev/learn/queueing-a-series-of-state-updates) — 함수형 업데이트
- 공식 문서 [You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect) — STEP 3의 공식 해설
- 공식 문서 [useEffect](https://react.dev/reference/react/useEffect) · [useRef](https://react.dev/reference/react/useRef) · [StrictMode](https://react.dev/reference/react/StrictMode)
- React v16.8 발표 블로그 (2019): https://legacy.reactjs.org/blog/2019/02/06/react-v16.8.0.html
- Hooks RFC (reactjs/rfcs#68): https://github.com/reactjs/rfcs/pull/68
- [Design Principles (legacy)](https://legacy.reactjs.org/docs/design-principles.html) — "Scheduling"과 렌더 모델 철학
