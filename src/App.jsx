import { Routes, Route } from "react-router-dom";
import Shop from "./pages/Shop";
import Kiosk from "./pages/Kiosk";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Shop />} />
      <Route path="/kiosk" element={<Kiosk />} />
    </Routes>
  );
}
