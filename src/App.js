import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CaptainProvider } from "./context/CaptainContext";
import AldimVerdimMain from "./pages/aldimVerdim/AldimVerdimMain";
import HaftaOlusturmaMain from "./pages/aldimVerdim/odaOlusturma/HaftaOlusturmaMain";

function App() {
  return (
      <CaptainProvider>
        <Router>
          <div className="min-h-screen p-4 bg-gray-100">
            <Routes>
              <Route
                path="/aldim-verdim/:weekId"
                element={<AldimVerdimMain />}
              />
              <Route path="/" element={<HaftaOlusturmaMain />} />
            </Routes>
          </div>
        </Router>
      </CaptainProvider>
  );
}

export default App;
