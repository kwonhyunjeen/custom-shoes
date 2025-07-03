// import { useState } from "react";

import { Scene3D } from "../3d/Scene3D";

export const AppLayout: React.FC = () => {
  // const [selectedPart, setSelectedPart] = useState("laces");

  return (
    <main className="grid grid-cols-3 h-[calc(100vh-120px)]">
      {/* 왼쪽: 특성 설명 & 커스터마이징 옵션 */}
      <div className="p-8 border-r border-gray-200 overflow-y-auto">
        {/* <CustomizationOptions
          selectedPart={selectedPart}
          onPartChange={setSelectedPart}
        /> */}
        <div>CustomizationOptions</div>
      </div>

      {/* 중앙: 3D 신발 모델 */}
      <div className="relative">
        <Scene3D />
      </div>

      {/* 오른쪽: 세부 커스터마이징 패널 */}
      <div className="p-8 border-l border-gray-200 overflow-y-auto">
        {/* <CustomizationPanel selectedPart={selectedPart} /> */}
        <div>CustomizationPanel</div>
      </div>
    </main>
  );
};
