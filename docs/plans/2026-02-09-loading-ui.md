# 3D 모델 로딩 UI 구현 계획

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 3D 모델 로딩 중 투명 오버레이로 클릭을 차단하고 로딩 상태를 표시한다.

**Architecture:** React Suspense의 fallback으로 LoadingOverlay 컴포넌트를 표시. Scene 컴포넌트를 Suspense로 래핑하여 useLoader의 suspend를 처리.

**Tech Stack:** React, Suspense, Tailwind CSS

---

### Task 1: LoadingOverlay 컴포넌트 생성

**Files:**

- Create: `app/src/components/ui/LoadingOverlay.tsx`

**Step 1: 컴포넌트 파일 생성**

```tsx
export const LoadingOverlay = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-auto z-50">
      <div className="w-16 h-16 border-4 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
    </div>
  );
};
```

**Step 2: 커밋**

```bash
git add app/src/components/ui/LoadingOverlay.tsx
git commit -m "feat: add LoadingOverlay component"
```

---

### Task 2: ShoeCustomizer에 Suspense 적용

**Files:**

- Modify: `app/src/components/customization/ShoeCustomizer.tsx:1-2, 117-126`

**Step 1: import 추가**

Line 1에 `Suspense` 추가:

```tsx
import { Suspense, useCallback, useMemo, useState } from "react";
```

Line 2 다음에 LoadingOverlay import 추가:

```tsx
import { LoadingOverlay } from "../ui/LoadingOverlay";
```

**Step 2: Scene을 Suspense로 래핑**

Lines 119-126 변경:

Before:

```tsx
<Scene isPanelCollapsed={isPanelCollapsed}>
  <Shoes
    shoesColors={shoesColors}
    currentPart={currentPart}
    onPartSelect={selectPart}
    onHighlightingChange={setIsHighlighting}
  />
</Scene>
```

After:

```tsx
<Suspense fallback={<LoadingOverlay />}>
  <Scene isPanelCollapsed={isPanelCollapsed}>
    <Shoes
      shoesColors={shoesColors}
      currentPart={currentPart}
      onPartSelect={selectPart}
      onHighlightingChange={setIsHighlighting}
    />
  </Scene>
</Suspense>
```

**Step 3: 커밋**

```bash
git add app/src/components/customization/ShoeCustomizer.tsx
git commit -m "feat: wrap Scene with Suspense for loading state"
```

---

### Task 3: 브라우저에서 확인

**Step 1: 개발 서버 실행**

```bash
pnpm dev
```

**Step 2: 확인 항목**

- 페이지 새로고침 시 로딩 스피너가 표시되는지
- 로딩 중 UI는 보이지만 클릭이 차단되는지
- 모델 로딩 완료 후 스피너가 사라지는지

**Step 3: 최종 커밋 (필요시)**

문제 없으면 완료.
