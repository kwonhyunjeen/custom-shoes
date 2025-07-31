import { Scene3D } from "@components/3d/Scene3D";
import { Colors } from "@components/customization/Colors";
import { Parts } from "@components/customization/Parts";
import { Generator } from "@components/customization/Generator";

export const ShoeCustomizer = () => {
  return (
    <main className="relative h-screen pt-20 overflow-hidden bg-slate-50">
      <div className="absolute inset-0 w-full h-full">
        <Scene3D />
      </div>

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-6 top-1/2 transform -translate-y-1/2 pointer-events-auto">
          <Parts />
        </div>

        <div className="absolute right-6 top-1/2 transform -translate-y-1/2 pointer-events-auto">
          <Colors />
        </div>
      </div>

      <Generator />
    </main>
  );
};
