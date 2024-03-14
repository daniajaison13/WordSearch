import React from "react";
import ReactDOM from "react-dom";
import "./styles.scss";

import { RotatingLines } from "react-loader-spinner";

const Spinner = () => {
	return ReactDOM.createPortal(
		<div className="spinner">
			<RotatingLines
				strokeColor="white"
				strokeWidth="5"
				animationDuration="1.0"
				width="30"
			/>
		</div>,
		document.getElementById("portal")
	);
};

export default Spinner;
