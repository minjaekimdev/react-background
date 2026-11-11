import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

// 이 미션에는 StrictMode 가 켜져 있습니다.
// 개발 모드에서 useEffect 가 의도적으로 2번 실행되는 걸 관찰하는 STEP 이 있습니다 (STEP 4).
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
