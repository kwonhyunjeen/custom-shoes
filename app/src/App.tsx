import { ShoeCustomizer } from "@/components/customization/ShoeCustomizer";
import { CustomizationProvider } from "@/contexts/CustomizationContext";

function App() {
  return (
    <CustomizationProvider>
      <header className="fixed z-100 top-8 left-10 text-sm">
        KWONHYUNJIN© <span className="text-neutral-400">2025</span>
      </header>
      <main>
        <ShoeCustomizer />
      </main>
    </CustomizationProvider>
  );
}

export default App;
