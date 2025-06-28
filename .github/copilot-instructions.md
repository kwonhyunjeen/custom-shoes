# Custom Shoes - 3D 신발 커스터마이징 웹사이트

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## 프로젝트 개요

이 프로젝트는 3D 신발 모델링을 통해 사용자가 신발을 실시간으로 커스터마이징할 수 있는 웹 애플리케이션입니다.

## 기술 스택

- **Frontend**: React 19, TypeScript
- **3D Graphics**: Three.js, React Three Fiber (R3F), React Three Drei
- **UI Framework**: Tailwind CSS
- **Development Tools**: Leva (컨트롤 패널)
- **Build Tool**: Vite

## 아키텍처 패턴

### 컴포넌트 구조

- `App.tsx`: 메인 애플리케이션 레이아웃

### 스타일링 규칙

- Tailwind CSS 유틸리티 클래스 사용
- 커스텀 컴포넌트 클래스는 `@layer components`에 정의
- 반응형 디자인 적용

### 3D 개발 가이드라인

- React Three Fiber의 선언적 방식 사용

## 코딩 규칙

1. **TypeScript**: 엄격한 타입 정의, interface 활용
2. **함수형 컴포넌트**: React Hooks 사용
3. **네이밍**: 한국어 UI 텍스트, 영어 코드명
4. **접근성**: ARIA 속성 및 키보드 네비게이션 고려
