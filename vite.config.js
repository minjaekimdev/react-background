import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// 미션마다 index.html 이 따로 있는 "멀티 페이지" 구성입니다.
// - 개발 서버(npm run dev)에서는 등록 없이도 경로로 바로 접근할 수 있습니다.
// - npm run build 시 아래 입력들이 모두 빌드됩니다.
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        home: 'index.html',
        mission01: 'missions/01-dom-hell/index.html',
        mission02: 'missions/02-react-declarative/index.html',
        mission03: 'missions/03-state-sync/react/index.html',
        mission04Vanilla: 'missions/04-rerender-cost/vanilla/index.html',
        mission04React: 'missions/04-rerender-cost/react/index.html',
        mission05Native: 'missions/05-form-binding/native/index.html',
        mission05React: 'missions/05-form-binding/react/index.html',
        mission06: 'missions/06-hook-pitfalls/react/index.html',
      },
    },
  },
});
