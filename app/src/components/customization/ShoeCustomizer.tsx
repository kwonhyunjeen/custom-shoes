import { Scene3D } from "@components/3d/Scene3D";
import { Colors } from "@components/customization/Colors";
import { Parts } from "@components/customization/Parts";
import { Generator } from "@components/customization/Generator";

export const ShoeCustomizer = () => {
  return (
    <main className="flex h-screen pt-20 bg-gradient-to-r from-stone-600 via-stone-300 to-stone-600">
      <div className="w-1/3 flex justify-center items-center p-4">
        <Parts />
      </div>

      <div className="w-3/5 relative">
        <Scene3D />
      </div>

      <div className="w-2/5 flex flex-col justify-center items-center p-4">
        <Colors />
      </div>

      <Generator />
    </main>
  );
};
