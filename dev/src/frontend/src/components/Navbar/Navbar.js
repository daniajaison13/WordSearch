import { React, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./styles.scss";
import Modal from "../Modal/modal";
import Login from "../Login/Login";
import Button from "../Button/Button";
import { apiInstance } from "../../services/apiInstance";
import { authApiInstance } from "../../services/authApiInstance";
import config from "../../util/api-config.js";

// Get the environment
const env = process.env.NODE_ENV || "development";
// Get the API URL based on the environment
const apiUrl = config[env].REACT_APP_API_URL;

const Navbar = ({ token, removeToken, setToken }) => {
	const [isOpen, setIsOpen] = useState(false);
	const [user, setUser] = useState("");

	
	useEffect(() => {
		if (token) {
			getProfile();
		}
	}, [token]);

	const handleLogout = () => {
		apiInstance
			.post(apiUrl + "/auth/logout")
			.then((res) => {
				toast.success(`${res.data.message}, Redirecting`, {
					autoClose:2000
				});
				removeToken();
				setUser("");
				setTimeout(() => {
					window.location.href = "/";
				}, 2800);

			})
			.catch(() => {
				toast.error("Something went wrong while logging out", {
					autoClose:3000
				});
			});
	};

	const getProfile = () => {
		const path = "/auth/user/profile";
		authApiInstance
			.get(apiUrl + path)
			.then((res) => setUser(res.data.username))
			.catch(() => {
				toast.error("Something went wrong while fetching user information", {
					autoClose:3000
				});
			});
	};

	return (
		<>
			<div className="navbar">
				<Link to="/">
					<img
						src={process.env.PUBLIC_URL + "/logo192.png"}
						alt="logo"
						className="logo"
					></img>
				</Link>
				{!token && token !== "" && token !== undefined ? (
					<Button
						additionalStyles={"signButton"}
						buttonType={"button"}
						handleClick={() => setIsOpen(true)}
					>
						Sign in
					</Button>
				) : (
					<div>
						<span className="userGreeting">{`Hi, ${user}`}</span>
						<Button
							additionalStyles={"signButton"}
							buttonType={"button"}
							handleClick={handleLogout}
						>
							Sign out
						</Button>
					</div>
				)}
				<Modal additionalStyles={"loginModal"} open={isOpen} onClose={() => setIsOpen(false)}>
					<Login onClose={() => setIsOpen(false)} setToken={setToken} />
				</Modal>
			</div>
			<ToastContainer
				position="top-right"
				hideProgressBar={false}
				newestOnTop={true}
				closeOnClick={false}
				rtl={false}
				pauseOnFocusLoss={false}
				draggable={false}
				pauseOnHover={false}
				theme="dark"
			/>
		</>
	);
};

export default Navbar;
