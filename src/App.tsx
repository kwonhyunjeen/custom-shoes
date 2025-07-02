import { AppLayout } from "./components/layout/AppLayout";
import { Header } from "./components/layout/Header";

function App() {
  return (
    <>
      <Header shoeModel="3045MSAP022" price={125} />
      <AppLayout />
    </>
  );
}

export default App;
