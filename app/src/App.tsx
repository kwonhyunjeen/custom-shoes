import { ShoeCustomizer } from "@/components/customization/ShoeCustomizer";
import { CustomizationProvider } from "@/contexts/CustomizationContext";

function App() {
  return (
    <CustomizationProvider>
      <ShoeCustomizer />
    </CustomizationProvider>
  );
}

export default App;
