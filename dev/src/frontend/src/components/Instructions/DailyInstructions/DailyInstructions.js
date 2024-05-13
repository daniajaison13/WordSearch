import React from "react";
import "./styles.scss";
import Button from "../../Button/Button";

const DailyInstructions = ({ onClose }) => {
	return (
		<>
			<h1>Instruction of Daily Puzzle</h1>
			<ol>
				<li className="instruction">
					This mode is set to be equal to difficulty level 2 and has a new puzzle every day.
					You can only play this puzzle once a day (if you&#39;ve logged in).
				</li>
				<li className="instruction">
					Select the grid indexes and click on the confirm button to unhidden the indexes.
					If the letters in thoes indexes form a word in the word list,
					the indexes will not be hidden again and you&#39;ve found a word!
					If not, the indexes will be hidden again.
				</li>
				<li className="instruction">
					You can also clear your selection by clicking on the clear button or
					clicking on the selected indexes.
				</li>
				<li className="instruction">
					When all the words are found, the game is over and you can see your score.
				</li>
				<li className="instruction">
					When the game is over, you&#39;ll have the option to share your score to the leaderboard
					either by username (if you&#39;ve logged in) or anonymously.
				</li>
			</ol>
			<Button additionalStyles={"dailyModalButton"} buttonType={"button"} handleClick={onClose}>Got it!</Button>

		</>
	);
};

export default DailyInstructions;