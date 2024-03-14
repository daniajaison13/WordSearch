import React from "react";
import ReactDOM from "react-dom";
import "./styles.scss";

const Modal = ({ additionalStyles=null, open, children, onClose }) => {
	if (!open) return null;

	return ReactDOM.createPortal(
		<>
			<div className="overlay" />
			<div className={`modal ${additionalStyles}`}>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 20 20"
					fill="currentColor"
					className="closeButton w-5 h-5"
					onClick={onClose}
				>
					<path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
				</svg>

				{children}
			</div>
		</>,
		document.getElementById("portal")
	);
};

export default Modal;
