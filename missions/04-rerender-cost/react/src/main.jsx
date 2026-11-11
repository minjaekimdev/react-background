import { createRoot } from 'react-dom/client';
import App from './App.jsx';

// ⚠️ 이 미션에서는 의도적으로 <StrictMode> 를 빼고 실행합니다.
// StrictMode는 개발 모드에서 컴포넌트를 두 번씩 실행해 문제를 드러내는 도구인데,
// 재렌더 "비용"을 재는 이 미션에서는 측정값이 2배가 되어 직관이 흐려집니다.
// StrictMode를 경험하는 것은 미션 6의 몫입니다.
// → StrictMode를 켜면 측정값이 어떻게 바뀌는지 나중에 실험해 보세요.
createRoot(document.getElementById('root')).render(<App />);
