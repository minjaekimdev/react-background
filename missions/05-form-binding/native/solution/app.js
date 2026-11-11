// ============================================================
// 미션 5-① 정답 코드 (solution)
// ⚠️ 먼저 직접 구현한 뒤에 비교하세요!
// ============================================================

const form = document.querySelector('#signup-form');
const bioEl = document.querySelector('#bio');
const bioCountEl = document.querySelector('#bio-count');
const pwEl = document.querySelector('#password');
const pwCheckEl = document.querySelector('#password-check');
const pwMatchEl = document.querySelector('#pw-match');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  const values = Object.fromEntries(formData);
  // 체크박스는 체크됐을 때만 FormData 에 name 으로 들어옵니다.
  values.marketing = formData.has('marketing');
  console.log('제출된 값:', values);
  alert(`제출 완료! 콘솔을 확인하세요. (닉네임: ${values.nickname})`);
});

bioEl.addEventListener('input', () => {
  bioCountEl.textContent = String(bioEl.value.length);
  bioCountEl.style.color = bioEl.value.length >= 100 ? '#e74c3c' : '#999';
});

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
