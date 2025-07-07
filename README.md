# Custom Shoes - 3D 신발 커스터마이징 웹사이트

실시간 3D 모델링을 통해 사용자가 신발을 커스터마이징할 수 있는 인터랙티브 웹 애플리케이션입니다.

👉🏻 [Custom Shoes Project 개발 블로그](https://kwonhyunjin.super.site/learnings)

## 🚀 기능

- **3D 신발 모델 시각화**: Three.js와 React Three Fiber를 사용한 실시간 3D 렌더링
- **인터랙티브 커스터마이징**: 색상, 재질, 패턴 등을 실시간으로 변경
- **프리셋 구성**: 미리 정의된 스타일 조합으로 빠른 커스터마이징
- **반응형 디자인**: 데스크톱과 모바일 모두 지원
- **모던 UI/UX**: Tailwind CSS를 활용한 세련된 인터페이스

## 🛠 기술 스택

- **Frontend**: React 19, TypeScript
- **3D Graphics**: Three.js, React Three Fiber (@react-three/fiber), React Three Drei (@react-three/drei)
- **Styling**: Tailwind CSS
- **Development**: Vite, Leva (디버깅용 컨트롤)
- **Build**: ES2020, 모던 브라우저 대상

## 📦 설치 및 실행

### 사전 요구사항

- Node.js 20.19.0 이상
- pnpm (권장) 또는 npm

### 설치

```bash
# 레포지토리 클론
git clone https://github.com/your-username/custom-shoes.git
cd custom-shoes

# 의존성 설치
pnpm install
```

### 개발 서버 실행

```bash
pnpm run dev
```

개발 서버가 실행되면 `http://localhost:5173`에서 애플리케이션을 확인할 수 있습니다.

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x';
import reactDom from 'eslint-plugin-react-dom';

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```
