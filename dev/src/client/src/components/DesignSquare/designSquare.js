import React from "react";
import "./styles.scss";

const DesignSquare = ({letter, level}) => {
	const blockSize = level === 1 ? "one" : level === 2 ? "two" : "three";

	return (
		<button
			className={`designSquare ${blockSize}`}
		>
			{letter}
		</button>
	);
};

export default DesignSquare;