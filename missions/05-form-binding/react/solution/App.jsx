import { useState } from 'react';

// ============================================================
// 미션 5-② 정답 코드 (solution)
// ⚠️ 먼저 직접 구현한 뒤에 비교하세요!
// ============================================================

let appRenderCount = 0;

const INITIAL_FORM = {
  email: '',
  password: '',
  passwordCheck: '',
  nickname: '',
  bio: '',
  marketing: false,
};

export default function App() {
  appRenderCount += 1;

  // 필드 전체를 객체 하나의 상태로 관리합니다.
  const [form, setForm] = useState(INITIAL_FORM);

  function updateField(name, value) {
    // 불변성: 기존 객체를 고치지 않고 "새 객체"를 만듭니다.
    // 이 spread 한 줄이 미션 5-①에는 없었던 코드입니다.
    setForm({ ...form, [name]: value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    // 값이 필요하면 state 에서 읽습니다. DOM에게 물어볼 필요가 없습니다.
    console.log('제출된 값:', form);
    alert(`제출 완료! (닉네임: ${form.nickname || '없음'})`);
    setForm(INITIAL_FORM);
  }

  // 파생 값: 전부 렌더 중 계산. 상태로 저장하지 않습니다.
  const bioLength = form.bio.length;
  const pwMatch =
    form.password && form.passwordCheck
      ? form.password === form.passwordCheck
        ? 'ok'
        : 'bad'
      : null;

  return (
    <main className="app">
      <h1>🧾 회원가입 폼 — React (제어 컴포넌트)</h1>
      <p className="sub">
        모든 input 의 값이 React 상태(form)의 통제 아래 있습니다. 값의 원본은 딱 한 곳!
      </p>

      <p className="stat">
        📊 App 렌더 횟수: <strong>{appRenderCount}</strong>
      </p>

      <form onSubmit={handleSubmit}>
        <label>
          이메일
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={(e) => updateField('email', e.target.value)}
          />
        </label>
        <label>
          비밀번호
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={(e) => updateField('password', e.target.value)}
          />
        </label>
        <label>
          비밀번호 확인
          <input
            name="password-check"
            type="password"
            value={form.passwordCheck}
            onChange={(e) => updateField('passwordCheck', e.target.value)}
          />
          <p className={pwMatch ? `msg ${pwMatch}` : 'msg'}>
            {pwMatch === 'ok' && '✅ 일치합니다'}
            {pwMatch === 'bad' && '❌ 일치하지 않습니다'}
          </p>
        </label>
        <label>
          닉네임
          <input
            name="nickname"
            type="text"
            value={form.nickname}
            onChange={(e) => updateField('nickname', e.target.value)}
          />
        </label>
        <label>
          자기소개 (최대 100자)
          <textarea
            name="bio"
            maxLength={100}
            value={form.bio}
            onChange={(e) => updateField('bio', e.target.value)}
          ></textarea>
          <p className="hint">
            <span style={{ color: bioLength >= 100 ? '#e74c3c' : undefined }}>{bioLength}</span> / 100자
          </p>
        </label>
        <label className="check">
          <input
            type="checkbox"
            name="marketing"
            checked={form.marketing}
            onChange={(e) => updateField('marketing', e.target.checked)}
          />
          마케팅 정보 수신에 동의합니다
        </label>
        <button type="submit">제출</button>
      </form>
    </main>
  );
}
