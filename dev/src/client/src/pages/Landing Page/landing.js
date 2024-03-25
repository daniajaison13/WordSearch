import React, {useState} from "react";
import { Link } from "react-router-dom";
import "./styles.scss";
import Button from "../../components/Button/Button";
import Leaderboard from "../../components/LeaderBoard/leaderboard";
import GameHistory from "../../components/GameHistory/gameHistory";
import Modal from "../../components/Modal/modal";
import LandingInstructions from "../../components/Instructions/LandingInstructions/LandingInstructions";

const LandingPage = () => {

	const [isOpen, setIsOpen] = useState(false);
	return (
		<>
			<div className="landingContainer">
				<div className="infoContainer">
					<Button additionalStyles={"landingHelpButton"} buttonType={"button"} handleClick={() => setIsOpen(true)}>?</Button>
				</div>
				<div className="pageTitle">WordSearch</div>
				<div className="dataContainer">
					<Leaderboard
						styles={"landingLeaderboard"}
						site={"landingPage"}
					/>
					<GameHistory />
				</div>
				<div className="gameButtons">
					<Link to="/game/normalpuzzle">
						<Button additionalStyles={"buttons"} buttonType={"button"}>
							Normal Puzzle
						</Button>
					</Link>
					<Link to="/game/dailypuzzle">
						<Button additionalStyles={"buttonsspecial"} buttonType={"button"}>
							Daily Puzzle
						</Button>
					</Link>
					<Link to="/game/designpuzzle">
						<Button additionalStyles={"buttons"} buttonType={"button"}>
							Design Puzzle
						</Button>
					</Link>
				</div>
			</div>
			<Modal additionalStyles={"landingModal"} open={isOpen} onClose={() => setIsOpen(false)}>
				<LandingInstructions onClose={() => setIsOpen(false)} />
			</Modal>
		</>
	);
};



export default LandingPage;