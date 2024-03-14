import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./styles.scss";
import { apiInstance } from "../../services/apiInstance";

const Register = ({ setToken }) => {
	const [username, setUsername] = useState("");
	const [pass, setPass] = useState("");
	const navigate = useNavigate();

	const handleLogin = (data, message) => {
		apiInstance
			.post("/auth/login", data)
			.then((loginRes) => {
				setToken(loginRes.data.access_token);

				toast.success(`${message}, Redirecting`, {
					autoClose: 2000
				});
				setTimeout(() => {
					navigate("/");
				}, 2800);
			})
			.catch((error) => {
				toast.error(error.response.data.error, {
					autoClose: 3000
				});
			});
	};

	const handleRegister = (e) => {
		const data = {
			username: username,
			password: pass,
		};
		apiInstance
			.post("/auth/register", data)
			.then((res) => {
				if(res.status === 200) {
					handleLogin(data, res.data.message);
				}
			})
			.catch((error) => {
				toast.error(error.response.data.error, {
					autoClose: 3000
				});
			});

		setUsername("");
		setPass("");
		e.preventDefault();
	};
	return (
		<>
			<div className="title">Register</div>
			<form onSubmit={handleRegister} className="registerForm">
				<label htmlFor="username" className="registerLabel">
					username
				</label>
				<input
					value={username}
					onChange={(e) => setUsername(e.target.value)}
					type="text"
					className="registerInput"
				/>
				<label htmlFor="password" className="registerLabel">
					password
				</label>
				<input
					value={pass}
					onChange={(e) => setPass(e.target.value)}
					type="password"
					className="registerInput"
				/>
				<button type="submit" className="defaultButton registerButton">
					REGISTER
				</button>
			</form>
		</>
	);
};

export default Register;
