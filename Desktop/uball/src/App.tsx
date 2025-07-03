import { Routes, Route } from "react-router-dom";
import LiveScores from "./components/LiveScores";
import MatchPage from "./components/MatchPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LiveScores />} />
      <Route path="/match/:id" element={<MatchPage />} />
    </Routes>
    
  );
}

export default App;
