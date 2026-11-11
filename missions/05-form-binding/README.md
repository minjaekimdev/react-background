# 미션 5 · 폼과 양방향 바인딩 — React가 버린 편의 (트레이드오프 ②)

> **"React makes this data flow explicit, but it requires a little more typing than two-way data binding."**
> — React 공식 문서 [Thinking in React](https://react.dev/learn/thinking-in-react) 5단계, 원문 그대로

## 이 미션의 배경 이야기

2013년의 경쟁자 Angular.js는 **양방향 데이터 바인딩(`ng-model`)**이 최대 장점이었습니다:
input에 `ng-model="user.email"` 한 줄이면, DOM의 값과 JS 모델이 자동으로 동기화됩니다. 정말 편합니다.
Pete Hunt의 2013년 발표에는 이런 평가도 나옵니다 — *"Angular가 관찰 가능성을 위해 만들어낸 개념들(scope, directive, transclusion…)"*. 자동 동기화의 편의 뒤에는 **모델이 관찰 가능(observable)해야 한다는 대가**가 있었고, 값이 양방향으로 흐르니 "지금 이 값이 왜 이 모양인지" 추적이 어려워졌습니다.

React의 선택: **양방향 바인딩을 아예 없애고, 값을 원본(state) → 표시(DOM) 한 방향으로만 흐르게 한다.**
사용자가 타이핑하면 `onChange`로 부모 상태를 갱신하고, 갱신된 상태가 다시 화면으로 흘러내려옵니다.
대가는 명백합니다 — **input 하나에도 `value`와 `onChange`, `useState`를 써야 합니다.** 이 미션은 그 대가를 직접 치르는 것입니다.

## 준비물

- 미션 2 완료 (useState, 이벤트)
- ①과 ②를 번갈아 보며 **코드량과 렌더 횟수**를 비교하는 것이 핵심입니다.

## 실행 방법

루트에서 `npm run dev` 후:

- 파트 ① (네이티브): `http://localhost:5173/missions/05-form-binding/native/`
- 파트 ② (React): `http://localhost:5173/missions/05-form-binding/react/`

## PART ① · 네이티브 폼 — DOM이 값을 기억하는 세상

`native/app.js`의 TODO:

- STEP 1: 제출 시 `new FormData(form)`으로 값 읽기 — 값 저장 코드 0줄
- STEP 2: 자기소개 실시간 글자 수 카운터 — 필요할 때 DOM에서 **읽기만** 함
- STEP 3: 비밀번호 일치 표시 — 이것도 파생 표시일 뿐

**체감 포인트**: 이 폼에는 state가 없습니다. 값의 원본이 DOM이므로 "동기화 버그"라는 개념 자체가 없습니다.
(미션 1에서 뱃지가 어긋났던 것과 비교해 보세요. input의 값은 누가 관리했나요? DOM 스스로였죠.)

## PART ② · React — 값의 통제권을 넘겨받기

`react/src/App.jsx`의 TODO:

- STEP 1 (비제어): 지금 폼은 `value` 연결이 없는 **비제어** 상태입니다. `FormData`로 제출 시 읽을 수 있고,
  타이핑 중에는 **App 렌더 횟수가 0회 늘어납니다.** React는 폼 값에 관여하지 않으니까요.
- STEP 2 (경고 체험): 이메일 input에 `value={...}`만 넣어 보세요(예: `value="hi"`).
  → 입력이 안 됩니다 + 콘솔에 *"You provided a `value` prop to a form field without an `onChange` handler"* 경고.
  이 경고가 말해 주는 것: **React는 값이 state에서 흘러내려오는 것을 "진실"로 봅니다.** 사용자 입력이 state를 거치지 않으면 무시됩니다.
- STEP 3 (제어 전환): 이메일만 `useState` + `value` + `onChange`로 제어하세요. 타이핑 → **렌더 횟수가 글자당 +1**.
- STEP 4 (불변성 세리모니): 필드 5개를 객체 state 하나로 묶고, 각 필드 수정마다
  `setForm({ ...form, [name]: value })`를 쓰세요. **이 spread 코드는 네이티브 파트에는 존재하지 않았습니다.**
  왜 필요한가요? 상태를 "새 객체"로 만들어야 React가 바뀜을 감지하고, 예측 가능한 단방향 흐름이 유지되니까요.
- STEP 5 (계산값): 글자 수(`form.bio.length`)와 비밀번호 일치 표시를 렌더 중 **계산**으로 구현하세요.
  상태로 저장하면 미션 1의 어긋남 버그가 돌아옵니다.

## 비교 기록 칸

| 관점 | 네이티브 ① | React 제어 ② |
| --- | --- | --- |
| 값의 원본 | DOM | state |
| 이메일 input을 위한 코드 | 1줄 (HTML) | useState 1줄 + value 1줄 + onChange 1줄 |
| 타이핑 1글자당 App(또는 페이지) 재실행 | 0회 | ____회 |
| 값 전체를 읽는 방법 | `new FormData(form)` | state 그대로 |
| 실시간 표시 만들 때 갱신 누락 가능? | 있음/없음? | 있음/없음? |

## 돌아보기

1. React는 왜 "input의 값을 DOM에 맡겨 두는 것"을 기본값으로 안 만들었을까요?
   힌트: 값이 DOM에만 있으면 — (a) 렌더로 화면을 다시 그릴 때 값이 유지되는가? (b) 이 값을 다른 UI(버튼 활성화, 미리보기)에서 쓸 수 있는가? (c) 값의 현재 상태를 코드로 알 수 있는가?
2. STEP 1(비제어)이 "나쁜 것"은 아닙니다. 언제 비제어가 합리적인가요? ([input 공식 문서](https://react.dev/reference/react-dom/components/input)와 [Escape Hatches](https://react.dev/learn/escape-hatches)의 `useRef` 폼 예제 참고)
3. 양방향 바인딩은 "편의"를 얻고 "추적 가능성"을 잃었습니다. React는 그 반대입니다. **당신이 팀 리더라면 어떤 트레이드오프를 택하겠나요?** 이유는?

## 정답 코드

- `native/solution/app.js`
- `react/solution/App.jsx`

## 출처

- 공식 문서 [Thinking in React](https://react.dev/learn/thinking-in-react) — *"two-way data binding보다 타이핑이 더 필요하다"*는 원문
- 공식 문서 [input](https://react.dev/reference/react-dom/components/input) — 제어/비제어, 경고 메시지
- Pete Hunt, *"React: Rethinking best practices"* (JSConf EU 2013) — Angular 바인딩 비판 구간: https://www.youtube.com/watch?v=x7cQ3mrcKaY
- Pete Hunt, *"Why did we build React?"* (2013) — "Even AngularJS … requires a linking function": https://legacy.reactjs.org/blog/2013/06/05/why-react.html
- 공식 문서 [Choosing the State Structure](https://react.dev/learn/choosing-the-state-structure) — 상태 구조 설계
- 공식 문서 [Escape Hatches](https://react.dev/learn/escape-hatches) — 비제어 폼과 useRef
