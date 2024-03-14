import React from "react";
import "./styles.scss";
import Button from "../../Button/Button";

const NormalInstructions = ({ onClose }) => {
	return (
		<>
			<h1>Instruction of Normal Puzzle</h1>
			<ol>
				<li className="instruction">
					Select your desired difficulty from the difficulty level dropdown
					and you&#39;ll be given a random puzzle in that level.
					(Level 1 has a 5x5 grid and up to 3 words to be found,
					level 2 has a 7x7 grid and up to 5 words to be found,
					level 3 has a 10x10 grid and up to 7 words to be found.)
				</li>
				<li className="instruction">
					Select the grid indexes and click on the confirm button to unhidden the indexes.
					If the letters in thoes indexes form a word in the word list, 
					the indexes will not be hidden again and you&#39;ve found a word!
					If not, the indexes will be hidden again (level 1 will not hide indexes again).
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
			<Button additionalStyles={"normalModalButton"} buttonType={"button"} handleClick={onClose}>Got it!</Button>
		</>
	);

};

export default NormalInstructions;