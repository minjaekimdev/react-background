// ============================================================
// 미션 1 · DOM 지옥 체험 (바닐라 JS)
// TODO 주석을 순서대로 구현하세요. 자세한 설명은 README.md!
// ============================================================

// ---------- 데이터: 이 앱의 "진짜" 상태 ----------
// 우리의 모든 데이터는 여기에만 삽니다.
let todos = [
  { id: 1, text: "미션 1 완료하기", done: false },
  { id: 2, text: "물 마시기", done: true },
];
let nextId = 3;

// ---------- 화면 조각들: DOM 요소 참조 ----------
const listEl = document.querySelector("#todo-list");
const countBadgeEl = document.querySelector("#todo-count");
const summaryAllEl = document.querySelector("#summary-all");
const summaryDoneEl = document.querySelector("#summary-done");
const summaryLeftEl = document.querySelector("#summary-left");
const cheerEl = document.querySelector("#cheer");
const progressBarEl = document.querySelector("#progress-bar");

// ---------- 렌더링: 목록을 데이터로 다시 그리기 (미리 구현됨) ----------
function renderList() {
  listEl.innerHTML = todos
    .map((todo) => {
      // XSS 방지를 위해 텍스트를 이스케이프합니다.
      const escaped = todo.text
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll('"', "&quot;");
      return `
        <li class="todo ${todo.done ? "done" : ""}" data-id="${todo.id}">
          <label>
            <input type="checkbox" class="todo-check" ${todo.done ? "checked" : ""} />
            <span>${escaped}</span>
          </label>
          <button type="button" class="todo-delete">삭제</button>
        </li>`;
    })
    .join("");
}

// ---------- TODO (STEP 1): 나머지 화면 조각을 갱신하는 함수 ----------
// 뱃지, 요약 패널(전체/완료/남음), 격려 메시지, 진행률 바를
// todos 데이터를 기준으로 갱신하는 함수를 만드세요. 이름 예: renderStats()
//
// 힌트)
//   todos.length                     → 전체
//   todos.filter((t) => t.done).length → 완료
//   남음 = 전체 - 완료
//   남음이 0이면 cheerEl.textContent = '🎉 전부 끝냈어요!'
//   진행률(%) = (완료 / 전체) * 100  → progressBarEl.style.width = '50%'
// ✅ STEP 1에서 구현한 함수 — 스타터에는 이 함수 자체가 없어서
//    뱃지·요약·진행률은 0인 채로 멈춰 있었습니다 (아래 "앱 시작" 주석 참고).
function renderStats() {
  const all = todos.length;
  const done = todos.filter((todo) => todo.done).length;
  const left = all - done;

  // #todo-count 선택 후 최신화
  countBadgeEl.textContent = String(all);
  // #summary-all, summary-done, summary-left 최신화
  summaryAllEl.textContent = String(all);
  summaryDoneEl.textContent = String(done);
  summaryLeftEl.textContent = String(left);

  cheerEl.textContent = all > 0 && left === 0 ? '🎉 전부 끝냈어요!' : '';
  progressBarEl.style.width = `${(done / all) * 100}%`;
}

function refresh() {
  renderList();
  renderStats();
}

// ---------- 이벤트: 입력 경로 ① 폼 ----------
document.querySelector("#todo-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const input = document.querySelector("#todo-input");
  const text = input.value.trim();
  if (!text) return;

  // TODO (STEP 1):
  //  1) todos 에 새 할 일 추가 (id 는 nextId++, done: false)
  todos.push({ id: nextId++, text, done: false });

  //  2) input.value 를 비우고 input.focus()
  input.value = "";
  input.focus();
  //  3) renderList() 호출
  renderList();
  //  4) renderStats() 호출
  renderStats();
  //
  // ⚠️ 체감 포인트: 새로 생긴 데이터를 "어떤 화면 조각들이" 참조하는지
  // 지금 이 순간 내가 전부 기억해서 호출해 줘야 합니다.
});

// ---------- 이벤트: 입력 경로 ② 빠른 추가 버튼 ----------
document.querySelector("#quick-add").addEventListener("click", (e) => {
  const button = e.target.closest("button[data-text]");
  if (!button) return;
  const text = button.dataset.text;

  // TODO (STEP 3):
  //  폼 경로와 똑같은 코드를 "복사"해서 여기에 붙여넣어야 합니다.
  //  그리고 README의 지시대로, 일부러 renderStats() 호출을 빼먹어 보세요.
  //  → 데이터는 늘었는데 뱃지와 요약이 그대로인 버그를 목격하게 됩니다.
  todos.push({ id: nextId++, text, done: false });

  //  3) renderList() 호출
  //
  // 🐛 STEP 3 의도적 버그 (기록용): renderStats() 호출을 빼고 실행해 보면
  //   → 목록에는 "💧 물 마시기"가 생기는데 뱃지·요약·진행률은 그대로인
  //     데이터-화면 불일치가 발생했습니다 (갱신 한 줄을 빼먹은 것뿐인데!).
  // renderList();
  // renderStats(); // ← 이 한 줄을 빼먹으면 화면이 어긋납니다 (빼먹은 채로 실행해 봄)

  renderList();
  renderStats();
});

// ---------- 이벤트: 목록 안의 체크박스 / 삭제 버튼 (이벤트 위임) ----------
listEl.addEventListener("change", (e) => {
  if (!e.target.classList.contains("todo-check")) return;

  // TODO (STEP 2): 완료 토글
  //  1) e.target.closest('li').dataset.id 로 id 를 얻기 (문자열! Number() 필요)
  const targetId = Number(e.target.closest('li').dataset.id);

  //  2) todos 에서 해당 항목을 찾아 done 값 뒤집기
  const target = todos.find((todo) => todo.id === targetId);
  target.done = !target.done;
  //  3) renderList(), renderStats() 호출
  renderList();
  renderStats();
});

listEl.addEventListener("click", (e) => {
  if (!e.target.classList.contains("todo-delete")) return;

  // TODO (STEP 2): 삭제
  //  1) 삭제 버튼이 속한 li 의 data-id 로 항목 찾기
  const targetId = Number(e.target.closest('li[data-id]').dataset.id);

  //  2) todos 에서 제거 (filter 사용을 권장)
  todos = todos.filter((todo) => todo.id !== targetId);
  //  3) renderList(), renderStats() 호출
  renderList();
  renderStats();
});

// ---------- 이벤트: 완료 항목 일괄 삭제 ----------
document.querySelector("#clear-done").addEventListener("click", () => {
  // TODO (STEP 4):
  //  1) done 이 true 인 항목들을 todos 에서 제거
  todos = todos.filter((todo) => todo.done === false);
  //  2) renderList(), renderStats() 호출
  renderList();
  renderStats();
  //  → 이 경로 하나가 더 늘었을 뿐인데, 갱신 코드 호출 목록이 또 복사됩니다.
});

// ---------- 앱 시작 ----------
// 🐛 스타터의 모습 (기록용 — STEP 0 관찰): renderList() 만 호출하고 통계 갱신은 없었습니다.
//   → 리스트에는 할 일 2개가 보이는데 뱃지·요약·진행률은 전부 0인 채 멈춰 있는
//     "데이터-화면 불일치" 상태로 페이지가 열렸습니다.
// renderList(); // ← 이 한 줄만 있었고, renderStats() 는 호출되지 않았습니다.

// ✅ 해결: 두 렌더 함수를 모두 호출해 해결했지만 — 새 화면 조각이 늘어날 때마다
//          사람이 이 호출 목록에 한 줄씩 "추가"해야 하는 구조적 문제는 그대로 남습니다
//          (STEP 5의 refresh(), 그리고 미션 2의 React로 이어지는 지점).
renderList();
renderStats();
