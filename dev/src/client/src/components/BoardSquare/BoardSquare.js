import React from "react";
import "./styles.scss";

const BoardSquare = ({
	letter,
	row,
	col,
	handleClick,
	clicked,
	opened,
	level,
}) => {
	const blockSize = level === 1 ? "one" : level === 2 ? "two" : "three";
	return (
		<button
			className={`square ${clicked ? "squareClicked" : null} ${
				opened ? "squareOpened" : null
			} ${blockSize}`}
			onClick={() => handleClick(row, col, letter)}
		>
			{letter}
		</button>
	);
};

export default BoardSquare;
