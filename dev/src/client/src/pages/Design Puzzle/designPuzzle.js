import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles.scss";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";
import Button from "../../components/Button/Button";
import { apiInstance } from "../../services/apiInstance";
import DesignSquare from "../../components/DesignSquare/designSquare";
import Spinner from "../../components/Spinner/Spinner";
import Modal from "../../components/Modal/modal";
import DesignInstructions from "../../components/Instructions/DesignInstructions/DesignInstructions";

const DesignPuzzle = () => {

	const [isOpen, setIsOpen] = useState(false);
	const [wordList, setWordList] = useState("");
	const [levelDifficulty, setLevelDifficulty] = useState({ value: 1, label: "1" });
	const [puzzleData, setPuzzleData] = useState({});
	const [gameID, setGameID] = useState("");
	const [showBoard, setShowBoard] = useState(false);
	const [loading, setLoading] = useState(false);

	let navigate = useNavigate();
	const options = [
		{ value: 1, label: "1" },
		{ value: 2, label: "2" },
		{ value: 3, label: "3" },
	];

	const handleSubmit = async (e) => {
		setLoading(true);
		e.preventDefault();
		const containsLetters = /^[A-Za-z\s]*$/.test(wordList);
		if (containsLetters) {
			const data = {
				words: wordList,
				level: levelDifficulty.value
			};
			await apiInstance
				.post("/game/designpuzzle/create", data)
				.then((res) => {
					setPuzzleData(res.data.game);
					setGameID(res.data.game_id);
				}).catch((e) => {
					toast.error(e.response.data.error, {
						autoClose: 3000
					});
				});
			setShowBoard(true);
			
		} else {
			toast.error("Words are not containing just letters.", {
				autoClose: 3000
			});
			setShowBoard(false);
		}
		setLoading(false);
	};

	const handlechange = (e) => {
		setWordList(e.target.value);
	};

	const handleConfirm = async () => {
		const data = {
			game_id: gameID,
		};

		await apiInstance
			.post("/game/designpuzzle/submit", data)
			.then((res) => {
				if (res.data.status) {
					toast.success("Puzzle successfully created! Redirecting", {
						autoClose: 3000
					});
					setTimeout(() => {
						navigate("/");
					}, 3500);
				}
			}).catch(() => {
				toast.error("Something went wrong", {
					autoClose: 3000
				});
			});
	};
	

	return (
		<>
			<div className="designContainer">
				<Button additionalStyles={"designHelpButton"} buttonType={"button"} handleClick={() => setIsOpen(true)}>?</Button>
				<div className="designTitle">Design Your Own Puzzle</div>
				<form onSubmit={handleSubmit} className="puzzleForm">
					<label htmlFor="wordList" className="wordsLabel">
						Word List
					</label>
					<input
						value={wordList}
						onChange={handlechange}
						type="text"
						className="wordsInput"
					/>
					<div className="level">
						<label htmlFor="difficulty" className="difficultyLabel">
							Level Difficulty
						</label>
						<Select
							className="wordsDropdown"
							defaultValue={options[0]}
							options={options}
							onChange={setLevelDifficulty}
						/>
					</div>
					{/* <Button type={"submit"} additionalStyles={"wordsButton"}>
						Generate
					</Button> */}
				</form>
				{showBoard && Object.keys(puzzleData).length !== 0 ? (
					<div className="gameWordsContainer">
						<div className="wordsContainer">
							<div>WORDS TO FIND</div>
							<br />
							{puzzleData.words.map((word) => {
								return (
									<div
										className="gameWord"
										key={word}
									>
										{word}
									</div>
								);
							})}
						</div>
						<div className="designGame">
							<div className="designBoard">
								{puzzleData.puzzle.map((row, rowIndex) => {
									return (
										<div className="boardRow" key={rowIndex}>
											{row.map((letter, colIndex) => {
												return (
													<DesignSquare
														key={`${rowIndex}-${colIndex}`}
														letter={letter}
														level={levelDifficulty}
													/>
												);
											})}
										</div>
									);
								})}
							</div>
							<div className="designButtons">
								<Button
									additionalStyles={"designButton"}
									buttonType={"button"}
									handleClick={handleConfirm}
								>
									Confirm
								</Button>
								<Button
									additionalStyles={"designButton"}
									buttonType={"submit"}
									handleClick={handleSubmit}
								>
									Refresh
								</Button>
							</div>
						</div>
					</div>
				): null}
			</div>
			{loading ?
				<Spinner /> : null
			}
			<Modal additionalStyles={"designModal"} open={isOpen} onClose={() => setIsOpen(false)}>
				<DesignInstructions onClose={() => setIsOpen(false)} />
			</Modal>
		</>
	);
};

export default DesignPuzzle;
