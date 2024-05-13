import React, { useState, useEffect } from "react";
import { apiInstance } from "../../services/apiInstance";
import { authApiInstance } from "../../services/authApiInstance";
import "./styles.scss";
import Spinner from "../../components/Spinner/Spinner";
import GameGrid from "../../components/GameGrid/GameGrid";
import Select from "react-select";
import Modal from "../../components/Modal/modal";
import NormalInstructions from "../../components/Instructions/NormalInstructions/NormalInstructions"; 
import Button from "../../components/Button/Button";
import config from "../../util/api-config.js";

const NormalPuzzle = ({ token }) => {

	const [isOpen, setIsOpen] = useState(false);
	const [gameData, setGameData] = useState({});
	const [gameHistoryId, setGameHistoryId] = useState("");
	const [noGame, setNoGame] = useState(null);
	const [level, setLevel] = useState({ value: 1, label: "1" });
	const [loading, setLoading] = useState(true);

	const options = [
		{ value: 1, label: "1" },
		{ value: 2, label: "2" },
		{ value: 3, label: "3" },
	];
	const getGame = async () => {
		setLoading(true);
		// Get the environment
		const env = process.env.NODE_ENV || "development";
		// Get the API URL based on the environment
		const apiUrl = config[env].REACT_APP_API_URL;

		const path = `/game/normalpuzzle/${level.value}`;
		if (token === null) {
			await apiInstance
				.get(apiUrl + path)
				.then((res) => {
					const data = res.data.game_data;
					setGameData(data);
					setGameHistoryId(res.data.game_history_id);
					setNoGame(false);
				})
				.catch(() => {
					setNoGame(true);
				});
		} else {
			await authApiInstance
				.get(apiUrl + path)
				.then((res) => {
					const data = res.data.game_data;
					setGameData(data);
					setGameHistoryId(res.data.game_history_id);
					setNoGame(false);
				})
				.catch(() => {
					setNoGame(true);
				});
		}
		setLoading(false);
	};

	useEffect(() => {
		getGame();
	}, [level]);

	return (
		
		<div className="normalContainer">
			<Button additionalStyles={"normalHelpButton"} buttonType={"button"} handleClick={() => setIsOpen(true)}>?</Button>
			{noGame === null || loading ? (
				<Spinner />
			) : noGame ? (
				<>
					<div className="normalTitle">Normal Puzzle</div>
					<div className="noGameText">Sorry No Daily Puzzle Available, come back later!</div>
				</>
			) : (
				<>
					<div className="normalTitle">Normal Puzzle</div>
					<div className="levelSelection">
						<div className="levelText">Difficulty Level</div>
						<Select
							className="levelDropdown"
							defaultValue={level}
							options={options}
							onChange={setLevel}
						/>
					</div>
					<GameGrid
						puzzle={gameData.puzzle}
						size={gameData.size}
						words={gameData.words}
						level={gameData.level}
						gameId={gameData._id}
						gameHistoryId={gameHistoryId}
						token={token}
					/>
				</>
			)}
			<Modal additionalStyles={"normalModal"} open={isOpen} onClose={() => setIsOpen(false)}>
				<NormalInstructions onClose={() => setIsOpen(false)} />
			</Modal>
		</div>
	);
};

export default NormalPuzzle;