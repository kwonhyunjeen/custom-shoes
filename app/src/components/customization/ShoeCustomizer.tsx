import { Scene } from "./Scene";
import { Generator } from "./Generator";
import { Panel } from "./Panel";
import { Shoes } from "./Shoes";

export const ShoeCustomizer = () => {
  return (
    <div className="h-screen relative">
      <Scene>
        <Shoes />
      </Scene>
      <Panel />
      <Generator />
    </div>
  );
};
