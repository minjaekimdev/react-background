import { useState } from "react";

// ============================================================
// 미션 5-② · 제어 컴포넌트의 대가 (트레이드오프)
// 미션 5-① (네이티브)와 완전히 같은 폼입니다. README 필수!
// ============================================================

const INITIAL_FORM = {
  email: "",
  password: "",
  passwordCheck: "",
  nickname: "",
  bio: "",
  marketing: false,
};

// App 컴포넌트가 "실행"(=렌더)될 때마다 1씩 늘어나는 카운터 (제공)
let appRenderCount = 0;

export default function App() {
  appRenderCount += 1;

  const [form, setForm] = useState(INITIAL_FORM);

  const bioLength = form.bio.length;
  const pwMatch =
    form.password && form.passwordCheck
      ? form.password === form.passwordCheck
        ? "ok"
        : "bad"
      : null;

  function handleSubmit(e) {
    e.preventDefault();
    // TODO (STEP 1): 지금 이 폼은 "비제어(uncontrolled)" 상태입니다.
    //  input 에 value 를 연결하지 않으면 값은 DOM이 기억하고,
    //  React는 값을 모른 채 있어도 제출할 때 읽을 수 있습니다.
    //  1) new FormData(e.target) 으로 값 읽기
    //  2) 체크박스 marketing 은 formData.has('marketing') 로 판정
    //  3) 콘솔에 출력
    //  4) 그리고 타이핑하는 동안 아래 "App 렌더 횟수"가 늘어나는지 관찰하세요.
    //     (늘어나지 않을 것입니다 — React는 값에 관여하지 않으니까!)

    const formData = new FormData(e.target);

    // 체크박스는 "체크됐을 때만" entries 에 name="on" 으로 들어옵니다.
    // 안 체크하면 아예 사라지므로, has() 로 판정해 boolean 으로 만듭니다.
    const values = {
      ...Object.fromEntries(formData),
      marketing: formData.has("marketing"),
    };

    console.log("제출된 값:", values);
  }

  return (
    <main className="app">
      <h1>🧾 회원가입 폼 — React</h1>
      <p className="sub">
        트레이드오프 ② 2부. 미션 5-①과 같은 폼입니다. STEP 3~5를 거쳐 제어
        컴포넌트가 되었습니다. (🐛 비제어 시절 코드는 아래 주석 참고)
      </p>

      <p className="stat">
        📊 App 렌더 횟수: <strong>{appRenderCount}</strong>
        {/* ⚠️ 이 숫자도 렌더 시점의 값이라 정확히는 "직전까지의 횟수"를 보여 줍니다.
            타이핑할 때 숫자가 얼마나 늘어나는지(또는 안 늘어나는지) 흐름으로 보세요. */}
      </p>

      {/* 🐛 고치기 전 (STEP 1 비제어 상태, 기록용): input 에 value/onChange 가 없어
          값의 원본이 DOM 이었습니다. 타이핑해도 App 은 재렌더되지 않았고(렌더 횟수 0 유지),
          실시간 카운터·비밀번호 일치 표시를 만들 방법이 없었습니다.
          <input name="email" type="email" required />
          <input name="password" type="password" required />
          <input name="password-check" type="password" required />
          <p className="msg" id="pw-match"></p>
          <input name="nickname" type="text" required />
          <textarea name="bio" maxLength={100}></textarea>
          <p className="hint"><span>0</span> / 100자</p>
          <input type="checkbox" name="marketing" />
      */}
      <form onSubmit={handleSubmit}>
        <label>
          이메일
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </label>
        <label>
          비밀번호
          <input
            name="password"
            type="password"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
        </label>
        <label>
          비밀번호 확인
          <input
            name="password-check"
            type="password"
            onChange={(e) =>
              setForm({ ...form, passwordCheck: e.target.value })
            }
            required
          />
          <p className={pwMatch ? `msg ${pwMatch}` : "msg"} id="pw-match">
            {pwMatch === "ok" && "✅ 일치합니다"}
            {pwMatch === "bad" && "❌ 일치하지 않습니다"}
          </p>
        </label>
        <label>
          닉네임
          <input
            name="nickname"
            onChange={(e) => setForm({ ...form, nickname: e.target.value })}
            type="text"
            required
          />
        </label>
        <label>
          자기소개 (최대 100자)
          <textarea
            name="bio"
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            maxLength={100}
          ></textarea>
          {/* TODO (STEP 3~5): 이 자리에 실시간 카운터가 들어갑니다. */}
          <p className="hint">
            <span>{bioLength}</span> / 100자
          </p>
        </label>
        <label className="check">
          <input type="checkbox" name="marketing" />
          마케팅 정보 수신에 동의합니다
        </label>
        <button type="submit">제출</button>
      </form>

      <section className="guide">
        <h2 style={{ marginTop: 0 }}>📌 진행 순서</h2>
        <ol>
          <li>
            <b>STEP 1</b> — 비제어 상태로 값 읽기 (<code>FormData</code>),
            타이핑 중 렌더 횟수 관찰
          </li>
          <li>
            <b>STEP 2</b> — 이메일 input에 <code>value</code>만 연결해 보기 →
            콘솔 경고 읽기
          </li>
          <li>
            <b>STEP 3</b> — 제어 컴포넌트로 전환: <code>value</code> +{" "}
            <code>onChange</code> + <code>useState</code>
          </li>
          <li>
            <b>STEP 4</b> — 필드 5개의 state를 객체 하나로 묶고{" "}
            <code>setForm({"{ ...form, email: v }"})</code> 불변성 연습
          </li>
          <li>
            <b>STEP 5</b> — 카운터·비밀번호 일치 표시를 "계산값"으로 만들기
          </li>
        </ol>
        STEP 3 완료 후 다시 타이핑해 보세요. 렌더 횟수가{" "}
        <b>글자 하나당 1회씩</b> 늘어나는 것을 보세요. 이것이 React가 양방향
        바인딩을 버린 대가이자, 얻은 예측 가능성의 값입니다.
      </section>
    </main>
  );
}
