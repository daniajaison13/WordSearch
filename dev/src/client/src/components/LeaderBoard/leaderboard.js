import React, { useEffect, useState } from "react";
import "./styles.scss";
import Button from "../../components/Button/Button";
import { apiInstance } from "../../services/apiInstance";

const Leaderboard = ({ styles, site, gameId=null }) => {
	const [leaderboardData, setLeaderboardData] = useState([]);
	const [refreshClicked, setRefreshClicked] = useState(false);
	const [noScoresText, setNoScoresText] = useState("");

	useEffect(() => {
		fetchData();
	}, [refreshClicked]);

	const fetchData = async () => {
		let path = "";
		if (site === "landingPage") {
			path = "/leaderboard/landingpage";
		} else {
			path = `/leaderboard/get/${gameId}`;
		}

		await apiInstance
			.get(path)
			.then((res) => {
				const data = res.data.leaderboard;
				console.log(res);
				setLeaderboardData(data);
				setNoScoresText("No scores to show");
			})
			.catch(() => {
				setNoScoresText("Sorry, Leaderboard was not found");
			});
	};

	return (
		<div className={`leaderboardContainer ${styles}`}>
			<div className="leaderboardheader">
				<div className="leaderboardTitle">{site === "landingPage" ? "Daily Leaderboard" : "Leaderboard"}</div>
				<Button
					additionalStyles={"leaderboardrefreshbutton"}
					type={"button"}
					handleClick={() => setRefreshClicked(!refreshClicked)}
				>
					Refresh
				</Button>
			</div>
			{leaderboardData.length !== 0 ? (
				<table>
					<thead>
						<tr>
							<th className="rankColumn">Rank</th>
							<th className="userColumn">User</th>
							<th className="scoreColumn">Score</th>
						</tr>
					</thead>
					<tbody>
						{leaderboardData.map((row) => {
							return (
								<tr className="leaderboardRow" key={row.rank}>
									<td className="rankColumn"> {row.rank} </td>
									<td className="userColumn">{row.username}</td>
									<td className="scoreColumn">{row.score}</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			) : (
				<div className="noScoresText">{noScoresText}</div>
			)}
		</div>
	);
};

export default Leaderboard;
