import { Routes, Route } from "react-router-dom";
import LiveScores from "./components/LiveScores";
import MatchPage from "./components/MatchPage";
import Layout from "./components/Layout";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* This means: show LiveScores at "/" inside Layout */}
        <Route index element={<LiveScores />} />

        {/* This means: show MatchPage at "/match/:id" inside Layout */}
        <Route path="match/:id" element={<MatchPage />} />
      </Route>
    </Routes>
  );
}

export default App;
