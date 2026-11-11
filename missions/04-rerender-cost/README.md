# 미션 4 · 재렌더링의 비용 — "전체 다시 그리기"는 공짜가 아니다 (트레이드오프 ①)

> **React는 "전체 다시 그리기"를 기본값으로 선택했다. 그 대가로, 성능은 개발자가 다시 챙겨야 한다.**

## 이 미션의 배경 이야기

Pete Hunt의 유명한 발표(JSConf EU 2013, *"React: Rethinking best practices"*)에서 React의 논쟁적인 3대 결정이 소개됩니다:

1. 템플릿 대신 컴포넌트로 UI를 만든다
2. **데이터가 바뀔 때마다 앱 전체를 다시 렌더한다**
3. 그걸 가능하게 하는 것이 **가상 DOM(Virtual DOM)**과 diff

"전체 다시 그리기"는 미션 1의 동기화 지옥을 없애는 대박이었지만, **비용**이 따라왔습니다.
React는 "무엇이 바뀌는지" 모르기 때문에 일단 전부 실행해 보고 비교(diff)합니다. 바뀌지 않은 9,999개의 행도 실행됩니다.
React도 이것이 트레이드오프임을 인정합니다 — Pete Hunt: *"React는 마법이 아니다. 원한다면 네이티브 DOM 조작으로 React를 이길 수 있다."*
그래서 `React.memo`, `useMemo` 같은 최적화 도구가 존재하고, 언제 써야 하는지 아는 것이 개발자의 몫입니다.

## 준비물

- 미션 2 완료 (props, useState, key)
- 두 파트를 **왔다 갔다** 실행하며 숫자를 비교하는 것이 핵심입니다.

## 실행 방법

루트에서 `npm run dev` 후:

- 파트 ① (바닐라 기준선): `http://localhost:5173/missions/04-rerender-cost/vanilla/`
- 파트 ② (React): `http://localhost:5173/missions/04-rerender-cost/react/`

## PART ① · 바닐라 기준선 측정

`vanilla/app.js`의 TODO:

- STEP 1: "① 전체 다시 그리기" — 3번 상품 가격 변경 후 **10,000행 전체**를 innerHTML로 재구성하고 시간을 기록
- STEP 2: "② 필요한 곳만 고치기" — 바뀐 **셀 하나의 textContent만** 갱신하고 시간을 기록
- 두 버튼을 번갈아 눌러 기록을 비교하세요. (②는 보통 ①의 수십~수백 배 빠릅니다)

**체감 포인트**: ②가 빠른 이유는 "내가 어디가 바뀌는지 알고 있기 때문"입니다.
빠르지만, 그 "지식"을 유지하는 책임이 개발자에게 있다 — 미션 1의 고통과 정확히 같은 뿌리입니다.

## PART ② · React: 전부 다시 실행된다

`react/src/App.jsx`의 TODO:

- STEP A: `changeOnePrice`를 **불변 업데이트**로 구현 (`map` + 바뀐 행만 새 객체, 나머지는 기존 객체 참조 유지)
  → 버튼 클릭 후 측정 패널과 콘솔의 Profiler 로그를 확인하세요.
  **"렌더된 행 수"가 몇 개인가요?** (히든 답: 10,000개 — App이 다시 실행되고, 모든 ProductRow도 다시 실행됩니다)
  ⚠️ 패널 숫자는 **한 박자 늦게** 갱신됩니다. React가 부모(App)를 먼저 실행하고 자식(ProductRow)이 그다음 실행되기 때문입니다. 버튼을 두 번 눌러 확인해 보세요. 이 자체가 렌더 순서를 이해하는 좋은 연습입니다.
- STEP B: `ProductRow`를 `React.memo`로 감싸고 다시 클릭 → 이제 실행된 행 수가 **1개**가 됩니다.
  memo는 "props가 이전과 같으면(여기선 같은 객체 참조) 재실행하지 않는다"는 최적화입니다.
  STEP A에서 "나머지 행은 기존 객체 그대로"여야 했던 이유가 바로 이것입니다.
- STEP C: key 실험실 — `key={index}` 상태에서 각 input에 텍스트를 적어 두고 "맨 앞에 추가"를 누르면
  **적어 둔 값이 사람이 아니라 자리(위치)에 남습니다.** `key={person}`으로 바꾸면 값이 사람을 따라갑니다.
  key는 "이 노드가 누구인지" React에게 알려주는 신분증입니다. 신분증이 틀리면 상태가 엉뚱한 사람에게 배정됩니다.

## 측정 결과 기록 칸

| 방식 | 대략 시간 | 실행된 행 수 |
| --- | --- | --- |
| 바닐라 ① 전체 다시 그리기 | ____ ms | 10,000 (DOM 재구성) |
| 바닐라 ② 필요한 곳만 | ____ ms | 1 |
| React 기본 (memo 전) | ____ ms | ____ 개 |
| React + memo | ____ ms | ____ 개 |

## 돌아보기

1. React의 "전체 재렌더"는 바닐라 ①에 가까운가요, ②에 가까운가요? **virtual DOM diff가 해주는 것은 무엇이고, 못 해주는 것은 무엇인가요?**
   (diff는 *실제 DOM에 최소 변경만 반영*하는 것까지는 해줍니다. 하지만 컴포넌트 **함수를 다시 실행하는 비용**은 그대로 지불합니다.)
2. `memo`를 "무조건 다 붙이면 되는 것"이 아닌 이유는? (측정 비용, props 비교 비용, 프리마 쳐 오버엔지니어링 — 공식 문서 [memo](https://react.dev/reference/react/memo)의 "불필요한 memo" 경고 참고)
3. 미션 1에서 "갱신 호출 목록을 개발자가 관리"했던 고통과, 이번 미션에서 "memo/불변성 규칙을 개발자가 관리"하는 부담 — 이 둘은 같은 종류의 일인가요?

## 정답 코드

- `vanilla/solution/app.js`
- `react/solution/App.jsx`

## 출처

- Pete Hunt, *"React: Rethinking best practices"* (JSConf EU 2013) — 논쟁적 3대 결정(전체 재렌더, Virtual DOM): https://www.youtube.com/watch?v=x7cQ3mrcKaY
- Pete Hunt, *"Why did we build React?"* (2013) — reconciliation 설명: https://legacy.reactjs.org/blog/2013/06/05/why-react.html
- 공식 문서 [Render and Commit](https://react.dev/learn/render-and-commit)
- 공식 문서 [Rendering Lists](https://react.dev/learn/rendering-lists) — key
- 공식 문서 [memo](https://react.dev/reference/react/memo) · [useMemo](https://react.dev/reference/react/useMemo) — 필요할 때만 쓰라는 지침 포함
