# ⚛️ 리액트 탄생 배경 체험 저장소 (react-background)

> **"React는 왜, 어떤 문제를 풀려고 만들어졌을까?"**
> 이 저장소는 설명을 읽는 대신, **그 문제를 리액트 없이 한 번 겪어보고, 리액트로 해결해 보고, 그 과정에서 리액트가 치른 대가(트레이드오프)까지 직접 구현**해 보는 미션 6개를 담고 있습니다.

---

## 📜 5분 히스토리 — 리액트는 왜 만들어졌나

**2011년.** 페이스북 광고팀은 점점 거대해지는 웹 앱에서 고통받고 있었습니다.
데이터가 바뀌면 → 그 데이터를 참조하는 모든 화면 조각을 **개발자가 직접 찾아 DOM을 수정**해야 했고, 하나라도 빼먹으면 화면과 데이터가 어긋나는 버그가 쏟아졌습니다.
React를 만든 Pete Hunt는 나중에 이렇게 회고합니다: *"가장 큰 문제는 UI를 비즈니스 로직과 애플리케이션 상태와 동기화해 유지하는 것이었다. 그건 정말 다루기 힘들었고, 결과적으로 아무도 해결 못 하는 버그들이 쌓였다."* ([ACM Queue 인터뷰](https://queue.acm.org/doi/10.1145/2984629.2994373))

같은 해, 광고팀 엔지니어 **Jordan Walke**가 PHP용 컴포넌트 라이브러리 XHP에서 영감을 받아 사이드 프로젝트 **[FaxJS](https://github.com/jordwalke/FaxJs)**를 만듭니다. 여기에 props, state, "UI 전체를 다시 계산해서 diff로 갱신", 서버 렌더링 등 리액트의 뼈대가 전부 있었습니다 ([*Our First 50,000 Stars*, 2016](https://legacy.reactjs.org/blog/2016/09/28/our-first-50000-stars.html)). 이 프로토타입은 2011년 뉴스피드, 2012년 인스타그램에 실제로 배포됩니다.

**2013년 5월.** JSConf US에서 **React**라는 이름으로 최초 공개됩니다. GitHub 저장소의 최초 커밋은 2013년 5월 31일, petehunt에 의해 만들어졌습니다 ([최초 커밋 보기](https://github.com/facebook/react/commit/8d259093bf383a1fbbe69eae0fd5c5f615af252b)). 반응은 냉담했습니다 — *"HTML을 자바스크립트에 넣는다고?"* 한 관객의 비꼬는 트윗이 오히려 리액트의 철학을 정확히 요약했다고 나중에 인정됩니다 ([Pete Hunt 발표 소개](https://www.youtube.com/watch?v=x7cQ3mrcKaY)).

**2013년 6월.** Pete Hunt가 공식 블로그에 [*"Why did we build React?"*](https://legacy.reactjs.org/blog/2013/06/05/why-react.html)를 게시합니다. 요점은 이렇습니다:

> 전통적인 JS 앱에서는 "무엇이 바뀌었는지" 찾아서 **명령형(imperative)으로 DOM을 수정**해야 한다.
> React는 대신 **데이터가 바뀔 때마다 render를 다시 호출해 화면의 가벼운 표현(가상 DOM)을 새로 만들고, 이전 것과 diff해서 최소 변경만 실제 DOM에 적용(reconciliation)**한다.
> 개발자는 "데이터가 바뀔 때 무엇을 갱신할지" 관리하는 코드를 전부 내려놓고, **"지금 데이터로 화면이 어떻게 생겼는지"만 선언**하면 된다.

이 한 문장이 미션 1~3에서 여러분이 몸으로 배울 내용 전부입니다.
그리고 미션 4~6에서, 이 결정이 가져온 **대가**(재렌더 비용, 폼의 보일러플레이트, 훅의 함정)를 체감합니다.

---

## 🚀 시작하기

**준비물**: Node.js 20 이상

```bash
npm install   # 최초 1회
npm run dev   # 개발 서버 (기본: http://localhost:5173)
```

`http://localhost:5173` 을 열면 **미션 허브**가 나타납니다. 각 미션은 독립된 페이지이며, 코드는 각 미션 폴더에 있습니다.

```
react-background/
├── index.html                  # 미션 허브 (개발 서버 시작 페이지)
├── README.md                   # 지금 읽고 있는 문서
└── missions/
    ├── 01-dom-hell/            # [문제] 바닐라 JS로 할 일 앱 — DOM 수동 동기화 지옥
    ├── 02-react-declarative/   # [해결] 같은 앱을 React 선언형으로
    ├── 03-state-sync/          # [해결] 상태 끌어올리기 — 단방향 데이터 흐름
    ├── 04-rerender-cost/       # [트레이드오프] 재렌더링 비용 (vanilla/ + react/)
    ├── 05-form-binding/        # [트레이드오프] 폼·양방향 바인딩 포기 (native/ + react/)
    └── 06-hook-pitfalls/       # [트레이드오프] 훅의 함정 (스냅샷·의존성 배열)
```

**진행 규칙 (권장)**

1. 각 미션 폴더의 **README.md**를 먼저 읽고, 코드의 `TODO`를 따라 **직접 구현**합니다.
2. 미션 안의 "돌아보기" 질문에 **글로 답을 적어** 두세요 (이해의 최종 단계).
3. 구현을 끝낸 뒤에만 `solution/` 폴더를 열어 비교합니다.
4. 미션 1 → 2 → 3 → 4 → 5 → 6 순서를 권장합니다 (뒤의 미션이 앞의 경험을 전제합니다).

---

## 🗺️ 미션 지도

### 1부. 문제와 해결 — 리액트가 태어난 이유

| # | 미션 | 체감 포인트 | 시간 |
| --- | --- | --- | --- |
| 1 | **[DOM 지옥에서 살아남기](missions/01-dom-hell/README.md)** (바닐라 JS) | 데이터가 바뀔 때마다 갱신할 화면 조각을 개발자가 전부 기억해야 한다. 갱신 하나를 빼먹으면 데이터와 화면이 어긋난다 — 2011년 페이스북의 버그를 재현 | 40~60분 |
| 2 | **[같은 앱을 React로](missions/02-react-declarative/README.md)** | 미션 1의 "갱신 호출 목록"이 아예 사라진다. UI = f(state), 렌더 → 커밋, 불변성의 이유 | 30~40분 |
| 3 | **[상태 끌어올리기](missions/03-state-sync/README.md)** (React) | 서로 어긋나는 두 입력을 고치며 단일 출처(single source of truth)와 단방향 흐름을 체감 — React가 양방향 바인딩 대신 택한 길 | 30~40분 |

### 2부. 트레이드오프 — 리액트가 치른 대가

| # | 미션 | 체감 포인트 | 시간 |
| --- | --- | --- | --- |
| 4 | **[재렌더링의 비용](missions/04-rerender-cost/README.md)** (vanilla + React) | "전체 다시 그리기"는 편의를 위한 선택이고 비용이 따른다. memo/불변성/key로 성능을 되찾는 과정 + index key 버그 재현 | 40~60분 |
| 5 | **[폼과 양방향 바인딩](missions/05-form-binding/README.md)** (native + React) | 네이티브 폼의 자유 vs 제어 컴포넌트의 보일러플레이트. 글자 하나당 발생하는 재렌더 측정 | 40분 |
| 6 | **[훅의 함정](missions/06-hook-pitfalls/README.md)** (React) | 고장 난 타이머를 고치며 상태 스냅샷·클로저·의존성 배열이라는 새 인지 비용 체감 | 40~60분 |

---

## ⚖️ 리액트의 대표 트레이드오프 총정리

| 트레이드오프 | 얻은 것 | 잃은 것 | 어디서 체감? |
| --- | --- | --- | --- |
| **데이터 변경 시 전체 재렌더 + 가상 DOM** | "무엇을 갱신할지" 관리 코드의 완전한 제거 (미션 1의 지옥 소멸) | 컴포넌트가 전부 다시 실행되는 비용 → `memo`/`useMemo`로 개발자가 다시 성능을 챙겨야 함 | 미션 4 |
| **양방향 바인딩 포기 (제어 컴포넌트)** | 값의 단일 출처, 예측 가능한 단방향 데이터 흐름 | input 하나에도 value/onChange/state 필요, 불변성 spread 세리모니 | 미션 5 |
| **상태 = 스냅샷 + 명시적 의존성 배열** | 마법(자동 관찰)이 없어 동작이 예측 가능, 시간을 "렌더 단위"로 이해 | stale closure 같은 함정, useEffect 학습 비용 | 미션 6 |
| **라이브러리 (프레임워크가 아님)** | 자유로운 구조, 점진적 도입, 생태계 선택권 | 라우터·데이터 패칭 등 "결정"을 개발자 몫으로 | 아래 자료 |
| **클라이언트 중심 렌더링** | 풍부한 인터랙션, 컴포넌트 재사용 | 초기 로딩·SEO 부담 → SSR/메타프레임워크(Next.js 등)로 보완 | 아래 자료 |
| **DOM 위의 추상화(컴포넌트)** | UI를 조합 가능한 단위로 사고 | 디버깅에 React DevTools 필요, 렌더 파이프라인 이해 필요 | 미션 4·6 |

> 참고: "왜 라이브러리인가?"는 [*Why did we build React?*](https://legacy.reactjs.org/blog/2013/06/05/why-react.html)의 "React isn't an MVC framework" 섹션이, "SSR·SEO 보완"은 [Creating a React App](https://react.dev/learn/creating-a-react-app) 문서가 공식 답변입니다. 설계 철학 전반은 [Design Principles (legacy 문서)](https://legacy.reactjs.org/docs/design-principles.html)에 정리되어 있습니다.

---

## 📚 출처 모음

### 역사 · 공식 발표

| 자료 | 링크 |
| --- | --- |
| Pete Hunt, *"Why did we build React?"* (공식 블로그, 2013.6.5) | https://legacy.reactjs.org/blog/2013/06/05/why-react.html |
| React 팀, *"Our First 50,000 Stars"* (2016) — Bolt → FaxJS → React 내부 히스토리 | https://legacy.reactjs.org/blog/2016/09/28/our-first-50000-stars.html |
| Jordan Walke의 원형 프로젝트 **FaxJS** (2011) | https://github.com/jordwalke/FaxJs |
| facebook/react **최초 커밋** (2013.5.31, petehunt) | https://github.com/facebook/react/commit/8d259093bf383a1fbbe69eae0fd5c5f615af252b |
| Tom Occhino & Jordan Walke, *"JS Apps at Facebook"* — **React 최초 공개 발표** (JSConf US 2013) | https://www.youtube.com/watch?v=GW0rj4sNH2w |
| Pete Hunt, *"React: Rethinking best practices"* (JSConf EU 2013) — 논쟁적 3대 결정 | https://www.youtube.com/watch?v=x7cQ3mrcKaY |
| *"Introduction to React.js"* (Facebook Seattle, 2013) | https://www.youtube.com/watch?v=XxVg_s8xAms |
| Pete Hunt 외, ACM Queue 인터뷰 *"React: Facebook's Functional Turn on Writing JavaScript"* (2016) | https://queue.acm.org/doi/10.1145/2984629.2994373 |
| Jordan Walke Reactiflux 인터뷰 (2017) — 설계 영감(ML 계열 언어·불변성) | https://reactiflux.js.org/transcripts/jordan-walke |

### 공식 문서 (react.dev) — 미션에서 인용

| 주제 | 링크 |
| --- | --- |
| Thinking in React (5단계 사고법) | https://react.dev/learn/thinking-in-react |
| 컴포넌트 간 상태 공유 (미션 3 원형) | https://react.dev/learn/sharing-state-between-components |
| Render and Commit (렌더→커밋) | https://react.dev/learn/render-and-commit |
| Rendering Lists (key) | https://react.dev/learn/rendering-lists |
| State as a Snapshot (미션 6 원형) | https://react.dev/learn/state-as-a-snapshot |
| Queueing a Series of State Updates (함수형 업데이트) | https://react.dev/learn/queueing-a-series-of-state-updates |
| You Might Not Need an Effect | https://react.dev/learn/you-might-not-need-an-effect |
| Escape Hatches (useRef 등) | https://react.dev/learn/escape-hatches |
| Choosing the State Structure | https://react.dev/learn/choosing-the-state-structure |
| Creating a React App (SSR·프레임워크 관점) | https://react.dev/learn/creating-a-react-app |
| API: useState · useEffect · useRef · memo · useMemo · StrictMode · input | https://react.dev/reference/react/useState · https://react.dev/reference/react/useEffect · https://react.dev/reference/react/useRef · https://react.dev/reference/react/memo · https://react.dev/reference/react/useMemo · https://react.dev/reference/react/StrictMode · https://react.dev/reference/react-dom/components/input |

### 기록 · 설계 문서

| 자료 | 링크 |
| --- | --- |
| Hooks RFC (reactjs/rfcs#68, 2019) | https://github.com/reactjs/rfcs/pull/68 |
| React v16.8 발표 블로그 *"The One With Hooks"* | https://legacy.reactjs.org/blog/2019/02/06/react-v16.8.0.html |
| Design Principles (React 설계 원칙, legacy) | https://legacy.reactjs.org/docs/design-principles.html |

---

## 🎓 미션을 다 끝냈다면 (심화 과제)

1. **Thinking in React 재현**: [공식 튜토리얼](https://react.dev/learn/thinking-in-react)의 "검색 가능한 상품 표"를 미션 2·3의 방법으로 직접 구현해 보세요.
2. **React DevTools Profiler**: 미션 4의 리스트를 [React DevTools](https://chromewebstore.google.com/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi) Profiler로 다시 측정하고, flame graph에서 memo의 효과를 확인해 보세요.
3. **번들 크기 체감**: `npm run build` 후 `dist/`의 파일 크기를 확인하고, 미션 1(바닐라)과 비교해 보세요 — "추상화의 값"입니다.
4. **회고 글쓰기**: 각 미션의 "돌아보기" 답을 모아 블로그 글로 정리해 보세요. "리액트가 왜 그렇게 생겼는지"를 남에게 설명할 수 있다면 이 저장소의 목표는 달성입니다.
