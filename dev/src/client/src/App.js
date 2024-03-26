import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import LandingPage from "./pages/Landing Page/landing";
import DailyPuzzle from "./pages/Daily Puzzle/dailyPuzzle";
import DesignPuzzle from "./pages/Design Puzzle/designPuzzle";
import NormalPuzzle from "./pages/Normal Puzzle/normalPuzzle";
import NotFound from "./pages/Not Found/notFound";
import Register from "./pages/Register Page/register";
import Token from "./components/Token";

function App() {
	const { token, removeToken, setToken } = Token();

	return (
		<Router>
			<Navbar token={token} removeToken={removeToken} setToken={setToken} />
			<Routes>
				<Route exact path="/" element={<LandingPage />} />
				<Route
					path="/game/dailypuzzle"
					element={<DailyPuzzle token={token} />}
				/>
				<Route
					path="/game/normalpuzzle"
					element={<NormalPuzzle token={token} />} 
				/>
				<Route path="/game/designpuzzle" element={<DesignPuzzle />} />
				<Route path="/register" element={<Register setToken={setToken} />} />
				<Route path="*" element={<NotFound />} />
			</Routes>
		</Router>
	);
}

export default App;
