import { Scene } from "./Scene";
import { Generator } from "./Generator";
import { Panel } from "./Panel";

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
        <Panel />
        <Generator />
      </main>
    </>
  );
};
