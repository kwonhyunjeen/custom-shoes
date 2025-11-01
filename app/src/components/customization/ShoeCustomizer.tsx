import { useState } from "react";
import { Scene } from "./Scene";
import { Generator } from "./Generator";
import { Panel } from "./Panel";
import { Shoes } from "./Shoes";

export const ShoeCustomizer = () => {
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false);

  return (
    <div className="h-screen relative">
      <Scene isPanelCollapsed={isPanelCollapsed}>
        <Shoes />
      </Scene>
      <Panel
        isCollapsed={isPanelCollapsed}
        onCollapseChange={setIsPanelCollapsed}
      />
      <Generator />
    </div>
  );
};
