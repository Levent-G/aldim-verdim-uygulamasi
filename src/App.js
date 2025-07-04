import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CaptainProvider } from "./context/CaptainContext";
import AldimVerdimMain from "./pages/aldimVerdim/AldimVerdimMain";

function App() {
  return (
    <CaptainProvider>
      <Router>
        <div className="min-h-screen p-4 bg-gray-100">
          <Routes>
            <Route path="/" element={<AldimVerdimMain />} />
          </Routes>
        </div>
      </Router>
    </CaptainProvider>
  );
}

export default App;
