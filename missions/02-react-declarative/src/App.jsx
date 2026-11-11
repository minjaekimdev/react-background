import { useState } from "react";

// ============================================================
// 미션 2 · 같은 앱을 React로 다시 짜기 (선언형 UI)
// 미션 1과 완전히 똑같은 화면/기능입니다. 자세한 설명은 README.md!
// ============================================================

const INITIAL_TODOS = [
  { id: 1, text: "미션 1 완료하기", done: false },
  { id: 2, text: "물 마시기", done: true },
];
let nextId = 3;

export default function App() {
  // 데이터의 "단 하나의 원본"은 이 useState 안에 삽니다.
  const [todos, setTodos] = useState(INITIAL_TODOS);

  function addTodo(text) {
    // TODO (STEP 1): setTodos 로 "새 배열"을 만들어 추가하세요.
    //  ⚠️ todos.push(...) 처럼 기존 배열을 고치지 마세요 (불변성 — 이유는 README).
    //  힌트: [...todos, { id: nextId++, text, done: false }]
    setTodos([...todos, { id: nextId++, text, done: false }]);
  }

  function toggleTodo(id) {
    // TODO (STEP 2): map 으로 해당 항목의 done 만 뒤집은 새 배열을 만드세요.
    setTodos(
      todos.map((todo) => (todo.id === id ? { ...todo, done: !todo.done } : t)),
    );
  }

  function deleteTodo(id) {
    // TODO (STEP 2): filter 로 제거한 새 배열을 만드세요.
    setTodos(todos.filter((todo) => todo.id !== id));
  }

  return (
    <main className="app">
      <h1>📝 오늘의 할 일</h1>
      <p className="sub">React + 선언형 버전 (미션 1과 같은 화면)</p>

      <header className="header">
        {/* TODO (STEP 1): 뱃지에 할 일 개수를 표시하세요.
            💡 여기서 잠깐 멈추고 생각해 보세요:
            "개수가 바뀔 때 이 뱃지를 갱신하는 코드"를 따로 써야 할까요?
            JSX의 { todos.length } 는 매 렌더마다 "다시 계산"됩니다. */}
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
  // TODO (STEP 1): input에 입력하는 값도 React 상태로 관리해 보세요.
  //  const [text, setText] = useState('');
  //  <input value={text} onChange={(e) => setText(e.target.value)} />
  //  (이런 걸 "제어 컴포넌트"라고 합니다. 장단점은 미션 5에서!)
  const [text, setText] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setText("");
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
  const QUICK_ITEMS = ["물 마시기", "산책하기", "미션 2 예고 읽기"];
  // TODO (STEP 3): 버튼을 클릭하면 onAdd(버튼의 텍스트) 를 호출하세요.
  //  💡 미션 1 STEP 3의 "갱신 누락 버그"가 여기서는 발생할 수 있을까요?
  //  이유를 README 성찰 질문에 적어 보세요.
  return (
    <div className="row quick">
      {QUICK_ITEMS.map((item) => (
        <button key={item} onClick={() => onAdd(item)} type="button">
          {item}
        </button>
      ))}
    </div>
  );
}

function TodoList({ todos, onToggle, onDelete }) {
  // TODO (STEP 2): todos.map 으로 TodoItem 을 그리세요.
  //  💡 key 로 무엇을 쓸지 고민해 보세요. (배열 인덱스? id? — 미션 4에서 다시 만납니다.)
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
    <li className={todo.done ? "todo done" : "todo"}>
      <label>
        <input
          type="checkbox"
          checked={todo.done}
          onChange={() => onToggle(todo.id)}
        />
        <span>{todo.text}</span>
      </label>
      <button
        type="button"
        className="todo-delete"
        onClick={() => onDelete(todo.id)}
      >
        삭제
      </button>
    </li>
  );
}

function Summary({ todos }) {
  // TODO (STEP 4): 전체/완료/남음 개수를 "계산"해서 표시하세요.
  //  💡 이 값들을 useState 로 저장할 필요가 있을까요?
  //  (계산 가능한 값은 상태로 저장하지 않습니다 — 항상 최신 계산값이 보장되니까!)
  //  남음이 0이면 '🎉 전부 끝냈어요!' 를, 진행률 바도 그려 보세요.
  const all = todos.length;
  const done = todos.filter((t) => t.done).length;
  const left = all - done;
  const percent = all === 0 ? 0 : (done / all) * 100;

  return (
    <section className="summary">
      <div>
        전체 <strong>{all}</strong>
      </div>
      <div>
        완료 <strong>{done}</strong>
      </div>
      <div>
        남음 <strong>{left}</strong>
      </div>
      <div id="progress-wrap">
        <div id="progress-bar" style={{ width: `${percent}%` }} />
      </div>
      {all > 0 && left === 0 && <div className="cheer">🎉 전부 끝냈어요!</div>}
    </section>
  );
}
