import { Scene } from "@components/customization/Scene";
import { Colors } from "@components/customization/Colors";
import { Parts } from "@components/customization/Parts";
import { Generator } from "@components/customization/Generator";

export const ShoeCustomizer = () => {
  return (
    <>
      <header className="fixed z-100 top-8 left-10 text-sm">
        KWONHYUNJIN© <span className="text-neutral-400">2025</span>
      </header>
      <main className="w-screen h-screen flex flex-col">
        <div className="grow">
          <Scene />
        </div>
        <div className="absolute w-full left-0 bottom-0 overflow-hidden h-60 flex justify-center items-center gap-14 bg-zinc-100">
          <Parts />
          <Colors />
        </div>
        <Generator />
      </main>
    </>
  );
};
