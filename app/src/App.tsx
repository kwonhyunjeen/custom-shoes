import { Header } from "@/components/layout/Header";
import { AppLayout } from "@/components/layout/AppLayout";
import { CustomizationProvider } from "@/contexts/CustomizationContext";

function App() {
  return (
    <CustomizationProvider>
      <Header />
      <AppLayout />
    </CustomizationProvider>
  );
}

export default App;
