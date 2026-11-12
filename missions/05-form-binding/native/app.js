// ============================================================
// 미션 5-① · 네이티브 폼 (React 없음)
// 트레이드오프 ② 1부: DOM이 값을 기억하는 세상의 코드량
// ============================================================

const form = document.querySelector('#signup-form');
const bioEl = document.querySelector('#bio');
const bioCountEl = document.querySelector('#bio-count');
const pwEl = document.querySelector('#password');
const pwCheckEl = document.querySelector('#password-check');
const pwMatchEl = document.querySelector('#pw-match');

// ---------- TODO (STEP 1): 제출 시 값 읽기 ----------
form.addEventListener('submit', (e) => {
  e.preventDefault();
  // HTML 표준 기능: FormData 로 폼 전체의 값을 단 한 줄에 읽을 수 있습니다.
  // 1) const formData = new FormData(form)
  // 2) Object.fromEntries(formData) 도 찍어 보세요. 체크박스 값은 어떻게 담기는지 확인!
  //    (체크박스는 체크됐을 때만 name="on" 으로 들어옵니다 — DOM이 관리하니까요)
  // 3) 콘솔에 출력

  const formData = new FormData(form);
  const values = Object.fromEntries(formData);

  console.log(formData);
  console.log(values);
});

// ---------- TODO (STEP 2): 자기소개 글자 수 카운터 ----------
// bioEl 에서 input 이벤트가 발생할 때마다:
//  1) bioEl.value.length 를 bioCountEl.textContent 에 반영
//  2) 100자에 도달하면 "제한 도달!" 문구 표시 (선택)
//
// 💡 여기서 글자 수 값을 어디에 "저장"했는지 돌아보세요.
//    저장 안 했죠? 필요할 때마다 DOM에서 "읽기만" 했습니다.
//    값의 원본이 DOM이기 때문에 동기화 버그도 없습니다.
bioEl.addEventListener('input', () => {
  bioCountEl.textContent = String(bioEl.value.length);
  bioCountEl.style.color = bioEl.value.length >= 100 ? '#e74c3c' : '#999';
})


// ---------- TODO (STEP 3): 비밀번호 일치 표시 ----------
// pwEl 과 pwCheckEl 의 input 이벤트에서:
//  1) 두 값이 같고 비어 있지 않으면 pwMatchEl.textContent = '✅ 일치합니다' (ok 클래스)
//  2) 다르면 '❌ 일치하지 않습니다' (bad 클래스)
//
// 💡 관찰: 파생 표시(카운터, 일치 문구)만 화면 갱신 코드를 썼습니다.
//    "값 저장" 코드는 단 한 줄도 없습니다. 이게 DOM = 원본 세계입니다.

function updatePwMatch() {
  const bothFilled = pwEl.value && pwCheckEl.value;
  const matched = pwEl.value === pwCheckEl.value;
  if (!bothFilled) {
    pwMatchEl.textContent = '';
    pwMatchEl.className = 'msg';
    return;
  }
  pwMatchEl.textContent = matched ? '✅ 일치합니다' : '❌ 일치하지 않습니다';
  pwMatchEl.className = matched ? 'msg ok' : 'msg bad';
}

pwEl.addEventListener('input', updatePwMatch);
pwCheckEl.addEventListener('input', updatePwMatch);