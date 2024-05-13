import React, { useEffect, useState } from "react";
import "./styles.scss";
import config from "../../util/api-config.js";

import { authApiInstance } from "../../services/authApiInstance";

const GameHistory = () => {
	const [gameHistoryData, setGameHistoryData] = useState([]);
	const [noHistoryText, setNoHistoryText] = useState("");

	useEffect(() => {
		fetchData();
	}, []);

	const fetchData = async () => {
		// Get the environment
		const env = process.env.NODE_ENV || "development";
		// Get the API URL based on the environment
		const apiUrl = config[env].REACT_APP_API_URL;
		
		const path = "/auth/user/gamehistory";
		await authApiInstance
			.get(apiUrl + path)
			.then((res) => {
				let data = res.data;
				data.sort((a, b) => {
					const dateTimePartsA = a.start_time.split(" ");
					const isoDateTimeA = `${dateTimePartsA[0]}T${dateTimePartsA[1]}Z`;

					const dateTimePartsB = b.start_time.split(" ");
					const isoDateTimeB = `${dateTimePartsB[0]}T${dateTimePartsB[1]}Z`;

					return new Date(isoDateTimeB) - new Date(isoDateTimeA);
				});

				const convertedData = data.map(game => {
					const dateTimeParts = game.start_time.split(" ");
					const isoDateTime = `${dateTimeParts[0]}T${dateTimeParts[1]}`;
					const startTimeInLocal = new Date(isoDateTime).toLocaleString();
					return { ...game, start_time: startTimeInLocal};
				});

				setNoHistoryText("You have not played any games yet");
				setGameHistoryData(convertedData);
			})
			.catch(() => {
				setNoHistoryText("Sign in to view recent games");
			});
	};

	return (
		<div className="gameHistoryContainer">
			<div className="gameHistoryTitle">User History</div>
			{gameHistoryData.length === 0 ? (
				<p className="noGamesText">{noHistoryText}</p>
			) : (
				<table>
					<thead>
						<tr>
							<th className="gameColumn">Game Name</th>
							<th className="timeColumn">Start Time</th>
							<th className="scoreColumn">Score</th>
						</tr>
					</thead>
					<tbody>
						{gameHistoryData.map((game) => {
							return (
								<tr className="gameHistoryItem" key={game.game_history_id}>
									<td className="gameColumn">{game.game_name}</td>
									<td className="timeColumn">{game.start_time}</td>
									<td className="scoreColumn">{game.score}</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			)}
		</div>
	);
};

export default GameHistory;
