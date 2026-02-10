# 3D 모델 로딩 UI 설계

## 개요

신발 3D 모델 로딩 중 사용자에게 로딩 상태를 표시하는 UI 컴포넌트를 추가한다.

## 요구사항

- 단순 로딩 표시 (진행률 없음)
- 애니메이션이 적용된 SVG 컴포넌트 (마크업은 더미, 나중에 교체)
- 전체 화면을 덮되 투명 오버레이 (UI 보임, 클릭만 차단)
- React Suspense 활용
- 로딩 완료 시 즉시 전환 (페이드 효과 없음)

## 컴포넌트 구조

```
ShoeCustomizer.tsx
└── <Suspense fallback={<LoadingOverlay />}>
        └── Scene.tsx
              └── Shoes.tsx (useLoader로 모델 로딩)
```

## LoadingOverlay 컴포넌트

### 스타일

- `position: fixed`, `inset: 0` (전체 화면)
- 배경 투명 (`background: transparent`)
- 클릭 차단 (`pointer-events: all`)
- 중앙 정렬 (flexbox)
- `z-index`: Panel보다 위

### 마크업 (더미)

```tsx
<div className="fixed inset-0 flex items-center justify-center pointer-events-auto z-50">
  <div className="w-16 h-16 border-4 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
</div>
```

## 구현 위치

- `app/src/components/ui/LoadingOverlay.tsx` - 새 컴포넌트
- `app/src/components/customization/ShoeCustomizer.tsx` - Suspense 래핑
