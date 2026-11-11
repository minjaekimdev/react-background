// ============================================================
// 미션 1 정답 코드 (solution)
// ⚠️ 먼저 직접 구현해 본 뒤에 비교하세요!
// 이 파일을 열어 내용 전체를 app.js 에 덮어써서 실행해 볼 수 있습니다.
// ============================================================

let todos = [
  { id: 1, text: '미션 1 완료하기', done: false },
  { id: 2, text: '물 마시기', done: true },
];
let nextId = 3;

const listEl = document.querySelector('#todo-list');
const countBadgeEl = document.querySelector('#todo-count');
const summaryAllEl = document.querySelector('#summary-all');
const summaryDoneEl = document.querySelector('#summary-done');
const summaryLeftEl = document.querySelector('#summary-left');
const cheerEl = document.querySelector('#cheer');
const progressBarEl = document.querySelector('#progress-bar');

function renderList() {
  listEl.innerHTML = todos
    .map((todo) => {
      const escaped = todo.text
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('"', '&quot;');
      return `
        <li class="todo ${todo.done ? 'done' : ''}" data-id="${todo.id}">
          <label>
            <input type="checkbox" class="todo-check" ${todo.done ? 'checked' : ''} />
            <span>${escaped}</span>
          </label>
          <button type="button" class="todo-delete">삭제</button>
        </li>`;
    })
    .join('');
}

function renderStats() {
  const all = todos.length;
  const done = todos.filter((t) => t.done).length;
  const left = all - done;

  countBadgeEl.textContent = String(all);
  summaryAllEl.textContent = String(all);
  summaryDoneEl.textContent = String(done);
  summaryLeftEl.textContent = String(left);

  cheerEl.textContent = all > 0 && left === 0 ? '🎉 전부 끝냈어요!' : '';
  progressBarEl.style.width = all === 0 ? '0%' : `${(done / all) * 100}%`;
}

// "데이터를 바꾼 뒤 화면 조각들을 전부 갱신한다"는 패턴을 함수로 묶어 봤지만,
// 결국 "이 데이터를 어떤 조각이 참조하는지"는 개발자가 기억해야 합니다.
function refresh() {
  renderList();
  renderStats();
}

document.querySelector('#todo-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const input = document.querySelector('#todo-input');
  const text = input.value.trim();
  if (!text) return;

  todos = [...todos, { id: nextId++, text, done: false }];
  input.value = '';
  input.focus();
  refresh();
});

document.querySelector('#quick-add').addEventListener('click', (e) => {
  const button = e.target.closest('button[data-text]');
  if (!button) return;
  todos = [...todos, { id: nextId++, text: button.dataset.text, done: false }];
  refresh();
});

listEl.addEventListener('change', (e) => {
  if (!e.target.classList.contains('todo-check')) return;
  const id = Number(e.target.closest('li').dataset.id);
  todos = todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
  refresh();
});

listEl.addEventListener('click', (e) => {
  if (!e.target.classList.contains('todo-delete')) return;
  const id = Number(e.target.closest('li').dataset.id);
  todos = todos.filter((t) => t.id !== id);
  refresh();
});

document.querySelector('#clear-done').addEventListener('click', () => {
  todos = todos.filter((t) => !t.done);
  refresh();
});

renderList();
renderStats();
