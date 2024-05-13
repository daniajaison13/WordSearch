import React from "react";
import "./styles.scss";

const Button = ({ additionalStyles, buttonType, handleClick, children }) => {
	return (
		<button
			className={`defaultButton ${additionalStyles} `}
			type={buttonType}
			onClick={handleClick}
		>
			{children}
		</button>
	);
};

export default Button;
