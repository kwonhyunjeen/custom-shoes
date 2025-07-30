import { ShoeCustomizer } from "@/components/customization/ShoeCustomizer";
import { CustomizationProvider } from "@/contexts/CustomizationContext";

function App() {
  return (
    <CustomizationProvider>
      <header className="fixed top-0 left-0 right-0 z-50 grid grid-cols-2 py-6 px-8 min-w-0 bg-black bg-gradient-to-r from-stone-600 via-stone-300 to-stone-600">
        <div className=" min-w-0 flex">
          <h1 className="text-md font-light tracking-wide text-white whitespace-nowrap mr-1">
            KWONHYUNJIN©
          </h1>
          <span className="text-md font-thin text-white/90 whitespace-nowrap">
            2025
          </span>
        </div>
      </header>
      <ShoeCustomizer />
    </CustomizationProvider>
  );
}

export default App;
