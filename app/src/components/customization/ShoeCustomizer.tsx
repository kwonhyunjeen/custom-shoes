import { Scene3D } from "@components/3d/Scene3D";
import { Colors } from "@components/customization/Colors";
import { Parts } from "@components/customization/Parts";
import { Generator } from "@components/customization/Generator";

export const ShoeCustomizer = () => {
  return (
    <>
      <div className="fixed inset-0 bg-gradient-to-br from-zinc-200 to-zinc-100 [clip-path:polygon(0_60%,_100%_15%,_100%_100%,_0_100%)]" />
      <header className="fixed z-100 top-8 left-10 text-sm">
        KWONHYUNJIN© <span className="text-neutral-400">2025</span>
      </header>
      <main className="relative w-screen h-screen">
        <h1 className="sr-only">Select Color</h1>

        <div className="w-full h-full">
          <div className="-ml-[30%] -mb-[25%] w-[130%] h-[140%]">
            <Scene3D />
          </div>
        </div>

        <div className="absolute top-12 right-12 pb-10 flex py-9 px-8 gap-6 bg-white shadow-2xl rounded-3xl">
          <div>
            <h2 className="mb-6 text-neutral-400 text-xs font-semibold uppercase">
              Select Part
            </h2>
            <Parts />
          </div>
          <div>
            <h2 className="mb-6 text-neutral-400 text-xs font-semibold uppercase">
              Select Color
            </h2>
            <Colors />
          </div>
        </div>

        <Generator />
      </main>
    </>
  );
};
