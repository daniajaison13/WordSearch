import { React, useState } from "react";
import "./styles.scss";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import { apiInstance } from "../../services/apiInstance";
import Button from "../Button/Button";

const Login = ({ onClose, setToken }) => {
	const [username, setUsername] = useState("");
	const [pass, setPass] = useState("");
	const [wrong, setWrong] = useState(false);
	

	const handleLogin = (e) => {
		const data = {
			username: username,
			password: pass,
		};

		apiInstance
			.post("/auth/login", data)
			.then((res) => {
				setToken(res.data.access_token);
				setUsername("");
				setPass("");
				setWrong(false);
				window.location.href = "/";
			})
			.catch(() => {
				setWrong(true);
			});
		e.preventDefault();
	};

	return (
		<>
			<div className="modalTitle">Sign in</div>
			<form onSubmit={handleLogin}>
				<label htmlFor="username" className="formLabel">
					username
				</label>
				<input
					value={username}
					onChange={(e) => setUsername(e.target.value)}
					type="text"
					className="formInput"
				/>
				<label htmlFor="password" className="formLabel">
					password
				</label>
				<input
					value={pass}
					onChange={(e) => setPass(e.target.value)}
					type="password"
					className="formInput"
				/>
				{wrong ? (
					<span className="wrongPassword">Wrong password. Try again</span>
				) : null}
				<Link to={"./forgot"} onClick={onClose} className="forgotLink">
					Forgot Password?
				</Link>
				<Button type={"submit"} additionalStyles={"formButton"}>
					SIGN IN
				</Button>
			</form>
			<hr className="lineBreak" />
			<div className="register">
				Not a member?{" "}
				<Link to={"./register"} onClick={onClose}>
					Sign Up
				</Link>
			</div>
		</>
	);
};

export default Login;
