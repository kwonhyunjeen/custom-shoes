import { Scene } from "./Scene";
import { Generator } from "./Generator";
import { Panel } from "./Panel";
import { Shoes } from "./Shoes";

export const ShoeCustomizer = () => {
  return (
    <>
      <div className="w-screen h-screen">
        <Scene>
          <Shoes />
        </Scene>
      </div>
      <Panel />
      <Generator />
    </>
  );
};
