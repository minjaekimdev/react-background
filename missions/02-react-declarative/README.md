# 미션 2 · 같은 앱을 React로 다시 짜기 (선언형 UI)

> **"데이터가 바뀔 때마다 무엇을 갱신할지"라는 질문이, "지금 데이터로 화면이 어떻게 생겼는지"라는 질문으로 바뀐다.**

## 이 미션의 배경 이야기

React 공개 발표(JSConf US 2013)에서 Tom Occhino는 이렇게 말했습니다:

> "데이터가 바뀔 때마다 뷰를 통째로 날리고 처음부터 다시 그릴 수 있다면, 앱 구조와 코드량이 훨씬 단순해질 것이다.
> 우리는 '0에서 렌더된 상태로' 가는 방법만 걱정하면 된다. 상태 A→B, A→C로 가는 방법은 걱정할 필요가 없다."

미션 1에서 여러분은 "상태 A→B로 가는 방법"(`renderStats()` 호출 목록)을 계속 손으로 관리했습니다.
React는 이 책임을 라이브러리로 넘깁니다: **개발자는 화면을 상태의 함수로 선언하고, React가 매번 다시 그립니다.**
바닐라는 "전체 재렌더 = 비쌈"이었지만, React는 **가상 DOM(Virtual DOM)**으로 새 표현과 이전 표현을 비교(diff)해서 **실제로 바뀐 최소한의 부분만** 진짜 DOM에 반영합니다.

이 미션에서는 미션 1과 **완전히 같은 앱**을 React로 만듭니다. 같은 미션이라서 차이가 선명하게 보입니다.

## 준비물

- 미션 1 완료 (강력 추천 — 같은 앱이라 비교가 핵심입니다)
- JSX, 컴포넌트, props, useState 기초 (공식 문서 "UI 표현하기" + "상태 관리하기" 참고)

## 실행 방법

루트에서 `npm run dev` → `http://localhost:5173/missions/02-react-declarative/`
`src/App.jsx`를 수정하면 저장할 때마다 화면이 자동으로 다시 그려집니다(HMR).

## 미션 목표

1. `src/App.jsx`의 TODO를 완성해 미션 1과 같은 앱을 완성한다.
2. 미션 1에서 존재했던 코드들이 **React에서는 아예 존재하지 않음**을 확인한다.

## STEP 1 · 상태 선언 + 추가 기능

- `useState`로 `todos`를 만들고, `addTodo`에서 **새 배열**을 만들어 `setTodos` 하세요.

  ❌ `todos.push(...); setTodos(todos);` — 기존 배열을 고치면 React가 "바뀌었는지" 알기 어렵습니다.
  ✅ `setTodos([...todos, 새할일])` — **불변성**: 항상 새 값을 만들어 넘깁니다.
  React는 "상태가 바뀌었는지"를 `Object.is`로 비교하는데, 새 배열(다른 참조)이어야 "바뀜"으로 감지하고 재렌더를 시작합니다.

- 뱃지 개수: `<span className="badge">{todos.length}</span>` — **개수 갱신 코드가 필요 없습니다.**
  컴포넌트가 다시 실행될 때마다 `todos.length`가 다시 계산되기 때문입니다.

## STEP 2 · 토글/삭제 — 이벤트는 JSX에 붙인다

- 미션 1의 이벤트 위임(`closest('li')`, `dataset.id`)이 사라졌는지 보세요.
  React에서는 **어떤 요소가 어떤 이벤트를 받는지 JSX에서 바로** 선언합니다: `onChange={() => onToggle(todo.id)}`
- `toggleTodo`는 `map`, `deleteTodo`는 `filter`로 불변 업데이트하세요.

## STEP 3 · 빠른 추가 — "갱신 누락 버그"의 부재를 확인

- `QuickAddRow`는 그냥 `onAdd(텍스트)`를 호출하면 끝입니다.
- 미션 1 STEP 3에서 **빼먹을 수 있었던** `renderStats()` 호출이 여기엔 원래 없습니다.
  추가/삭제/토글 어느 경로든 `setTodos`만 하면 → React가 App을 다시 실행 → 뱃지·요약·진행률이 전부 다시 계산됩니다.
- 진입 경로가 100개여도 갱신 누락 버그는 **구조적으로 불가능**합니다. 이것이 "선언형"이 산 것입니다.

## STEP 4 · 파생 값은 상태로 저장하지 않기

- `Summary`의 전체/완료/남음, 진행률 바는 전부 **계산값**입니다.
  `useState`로 저장하면? → 저장해 둔 값이 최신이 아니게 되는 순간 미션 1의 버그가 다시 태어납니다.
- 공식 문서 [Thinking in React](https://react.dev/learn/thinking-in-react)의 원칙: *"계산할 수 있는 값은 절대 상태로 만들지 마세요."*

## 미션 1 vs 미션 2 비교표 (직접 채워 보세요)

| 관점 | 미션 1 (바닐라) | 미션 2 (React) |
| --- | --- | --- |
| 데이터가 바뀔 때 화면 갱신은 누가? | 개발자가 호출 목록 관리 | `setTodos` → React가 재렌더 |
| "추가" 경로에서 손대는 화면 조각 수 | ___개 | ___개 |
| 빠른 추가에서 갱신 누락 가능? | 가능했다 | 가능/불가능? 이유는? |
| DOM을 직접 만진 횟수 | ___번 | ___번 |

## 돌아보기

1. `setTodos` 이후에 화면 갱신 코드가 한 줄도 없는데 왜 화면이 바뀌는지, **렌더(컴포넌트 실행) → 커밋(실제 DOM 반영)** 흐름으로 설명해 보세요. ([Render and Commit 문서](https://react.dev/learn/render-and-commit))
2. 불변성(`[...todos]`)이 왜 필요한지, "React가 바뀜을 감지하는 방식"과 연결해서 설명해 보세요.
3. 미션 1의 코드를 다시 열어 보세요. `renderStats()` 호출 목록이 사라진 자리에 무엇이 남았나요?

## 정답 코드

`solution/App.jsx` — 직접 구현 후 비교하세요. 내용을 `src/App.jsx`에 덮어쓰면 바로 실행됩니다.

## 출처

- Tom Occhino & Jordan Walke, *"JS Apps at Facebook"* (JSConf US 2013, React 최초 공개 발표): https://www.youtube.com/watch?v=GW0rj4sNH2w
- Pete Hunt, *"Why did we build React?"* (공식 블로그, 2013): https://legacy.reactjs.org/blog/2013/06/05/why-react.html
- 공식 문서 [UI 표현하기 (Describing the UI)](https://react.dev/learn/describing-the-ui) · [상태: 컴포넌트의 메모리](https://react.dev/learn/state-a-components-memory)
- 공식 문서 [Render and Commit](https://react.dev/learn/render-and-commit) — 렌더→커밋 파이프라인
- 공식 문서 [Thinking in React](https://react.dev/learn/thinking-in-react) — "계산 가능한 값은 상태로 만들지 않는다"
- 공식 문서 [Rendering Lists](https://react.dev/learn/rendering-lists) — key 기초
