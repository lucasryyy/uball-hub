import { Routes, Route } from "react-router-dom";
import LiveScores from "./components/LiveScores";
import MatchPage from "./components/MatchPage";
import LeaguePage from "./components/league/LeaguePage";
import TeamPage from "./components/team/TeamPage";
import Layout from "./components/Layout";
import LeagueOverview from "./components/league/LeagueOverview";
import TransferPage from "./components/transfers/TransferPage";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<LiveScores />} />
        <Route path="match/:id" element={<MatchPage />} />
        <Route path="league" element={<LeagueOverview />} />
        <Route path="league/:id" element={<LeaguePage />} />
        <Route path="team/:id" element={<TeamPage />} />
        <Route path="/team/:teamId" element={<TeamPage />} />
        <Route path="/league/:leagueId/team/:teamId" element={<TeamPage />} />
        <Route path="transfers" element={<TransferPage />} />
      </Route>
    </Routes>
  );
}

export default App;
