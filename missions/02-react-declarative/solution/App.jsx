import { useState } from 'react';

// ============================================================
// 미션 2 정답 코드 (solution)
// ⚠️ 먼저 직접 구현한 뒤에 비교하세요!
// 이 파일 내용을 src/App.jsx 에 덮어써서 실행해 볼 수 있습니다.
// ============================================================

const INITIAL_TODOS = [
  { id: 1, text: '미션 1 완료하기', done: false },
  { id: 2, text: '물 마시기', done: true },
];
let nextId = 3;

export default function App() {
  const [todos, setTodos] = useState(INITIAL_TODOS);

  function addTodo(text) {
    setTodos([...todos, { id: nextId++, text, done: false }]);
  }

  function toggleTodo(id) {
    setTodos(todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  }

  function deleteTodo(id) {
    setTodos(todos.filter((t) => t.id !== id));
  }

  return (
    <main className="app">
      <h1>📝 오늘의 할 일</h1>
      <p className="sub">React + 선언형 버전 (미션 1과 같은 화면)</p>

      <header className="header">
        {/* 뱃지 갱신 코드가 없습니다. todos.length 는 매 렌더마다 다시 계산됩니다. */}
        <span className="badge">{todos.length}</span>
        <span>개의 할 일이 있습니다</span>
      </header>

      <AddTodoForm onAdd={addTodo} />
      <QuickAddRow onAdd={addTodo} />

      <TodoList todos={todos} onToggle={toggleTodo} onDelete={deleteTodo} />

      <Summary todos={todos} />
    </main>
  );
}

function AddTodoForm({ onAdd }) {
  const [text, setText] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setText('');
  }

  return (
    <form className="row" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="새 할 일을 입력하세요"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button type="submit">추가</button>
    </form>
  );
}

function QuickAddRow({ onAdd }) {
  const QUICK_ITEMS = ['물 마시기', '산책하기', '미션 2 예고 읽기'];
  return (
    <div className="row quick">
      {QUICK_ITEMS.map((item) => (
        <button key={item} type="button" onClick={() => onAdd(item)}>
          {item}
        </button>
      ))}
    </div>
  );
}

function TodoList({ todos, onToggle, onDelete }) {
  return (
    <ul className="todo-list">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}

function TodoItem({ todo, onToggle, onDelete }) {
  return (
    <li className={todo.done ? 'todo done' : 'todo'}>
      <label>
        <input type="checkbox" checked={todo.done} onChange={() => onToggle(todo.id)} />
        <span>{todo.text}</span>
      </label>
      <button type="button" className="todo-delete" onClick={() => onDelete(todo.id)}>
        삭제
      </button>
    </li>
  );
}

function Summary({ todos }) {
  const all = todos.length;
  const done = todos.filter((t) => t.done).length;
  const left = all - done;
  const percent = all === 0 ? 0 : (done / all) * 100;

  return (
    <section className="summary">
      <div>전체 <strong>{all}</strong></div>
      <div>완료 <strong>{done}</strong></div>
      <div>남음 <strong>{left}</strong></div>
      <div id="progress-wrap">
        <div id="progress-bar" style={{ width: `${percent}%` }} />
      </div>
      {all > 0 && left === 0 && <div className="cheer">🎉 전부 끝냈어요!</div>}
    </section>
  );
}
