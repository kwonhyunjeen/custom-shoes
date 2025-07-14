import { Scene3D } from "@components/3d/Scene3D";
import { Colors } from "@components/customization/Colors";

export const AppLayout: React.FC = () => {
  return (
    <main className="flex h-screen bg-gradient-to-r from-stone-600 via-stone-300 to-stone-600">
      <div className="w-1/3 flex flex-col justify-center p-4 border-r border-stone-400/20">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-gray-200/50 h-fit">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Select Part
          </h2>
          <p className="text-sm text-gray-500">Choose shoe part to customize</p>
        </div>
      </div>

      <div className="w-3/5 relative">
        <Scene3D />
      </div>

      <div className="w-2/5 flex flex-col justify-center p-4 border-l border-stone-400/20">
        <Colors />
      </div>
    </main>
  );
};
