import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiInstance } from "../../services/apiInstance";
import { authApiInstance } from "../../services/authApiInstance";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./styles.scss";
import BoardSquare from "../BoardSquare/BoardSquare";
import Timer from "../Timer/Timer";
import Modal from "../Modal/modal";
import Leaderboard from "../LeaderBoard/leaderboard";
import Button from "../Button/Button";

const GameGrid = ({
	puzzle,
	size,
	words,
	level,
	gameId,
	gameHistoryId,
	token,
}) => {
	const [selectedBlocks, setSelectedBlocks] = useState([]);
	const [guessedWords, setGuessedWords] = useState([]);
	const [openedLetters, setOpenedLetters] = useState([]);
	const [time, setTime] = useState(0);
	const [numberOfAttempts, setNumberOfAttempts] = useState(0);
	const [finishedGameData, setFinishedGameData] = useState({});

	const [canContinue, setCanContinue] = useState(true);
	const [openLeaderboard, setOpenLeaderboard] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const [stopTimer, setStopTimer] = useState(false);

	const maxSelected = size;
	let navigate = useNavigate();

	const handleClick = (row, col, letter) => {
		if (canContinue) {
			const newBlock = { row: row, col: col, letter: letter };
			if (
				!selectedBlocks.some(
					(block) => block.row === row && block.col === col
				) &&
				selectedBlocks.length < maxSelected
			) {
				setSelectedBlocks([...selectedBlocks, newBlock]);
			} else {
				if (
					selectedBlocks.some((block) => block.row === row && block.col === col)
				) {
					setSelectedBlocks(
						selectedBlocks.filter(
							(block) => block.row !== row || block.col !== col
						)
					);
				} else {
					toast.info("Maximum amount of letters selected", {
						autoClose: 1500
					});
				}
			}
		} else {
			toast.info("Wait for the previous blocks to close", {
				autoClose: 1500,
			});
		}
	};

	const handleConfirm = () => {
		let word = "";
		let prevNeighbors = null;

		for (let i = 0; i < selectedBlocks.length; i++) {
			const block = selectedBlocks[i];
			if (i === 0) {
				prevNeighbors = getBlockNeighbors(block.row, block.col);
			} else {
				if (
					prevNeighbors.some(
						(neighbor) =>
							neighbor.row === block.row && neighbor.col === block.col
					)
				) {
					prevNeighbors = getBlockNeighbors(block.row, block.col);
				} else {
					break;
				}
			}
			word = word + block.letter;
		}

		const prevOpenedLetters = openedLetters;
		const currentlyOpenedLetters = openedLetters.concat(selectedBlocks);
		setOpenedLetters(currentlyOpenedLetters);
		setNumberOfAttempts(numberOfAttempts + 1);

		const reversedWord = word.split("").reverse().join("");
		if (words.includes(word) || words.includes(reversedWord)) {
			const wordToBeAdded = words.includes(word) ? word : reversedWord;
			setGuessedWords([...guessedWords, wordToBeAdded]);
			toast.success(`Word found, ${wordToBeAdded}`, {
				autoClose: 2000
			});
		} else {
			const closeTime = level === 1 ? 1500 : 2000;
			if(word === "") {
				toast.error("At least one block needs to be selected", {
					autoClose: 1500,
				});
			} else {
				setCanContinue(false);
				toast.error("Wrong word, Try again", {
					autoClose: closeTime,
				});
			}
			
			if (level === 1) {
				setCanContinue(true);
			} else if (level === 2) {
				setTimeout(() => {
					setOpenedLetters(prevOpenedLetters);
					setCanContinue(true);
					handleClear(); // Clear selected blocks only when the word is wrong
				}, 2800);
			} else {
				setTimeout(() => {
					setOpenedLetters(prevOpenedLetters);
					setCanContinue(true);
					handleClear(); // Clear selected blocks only when the word is wrong
				}, 2800);
			}
		}
		handleClear();
	};

	const handleClear = () => {
		setSelectedBlocks([]);
	};

	const getBlockNeighbors = (row, col) => {
		const neighbors = [];
		const row_limit = puzzle.length;
		if (row_limit > 0) {
			const column_limit = puzzle[0].length;
			for (
				let r = Math.max(0, row - 1);
				r <= Math.min(row + 1, row_limit - 1);
				r++
			) {
				for (
					let c = Math.max(0, col - 1);
					c <= Math.min(col + 1, column_limit - 1);
					c++
				) {
					if (r !== row || c !== col) {
						const neighbor = {
							row: r,
							col: c,
							letter: puzzle[r][c],
						};
						neighbors.push(neighbor);
					}
				}
			}
		}
		return neighbors;
	};

	const endGame = async () => {
		setStopTimer(true);
		const data = {
			time_elapsed: time,
			attempts: numberOfAttempts,
		};
		if (token === null) {
			await apiInstance
				.post(`/game/finish/${gameHistoryId}`, data)
				.then((res) => {
					setFinishedGameData(res.data);
				})
				.catch(() => {
					toast.error("Something went wrong trying to finish the game", {
						autoClose: 3000
					});
				});
		} else {
			await authApiInstance
				.post(`/game/finish/${gameHistoryId}`, data)
				.then((res) => {
					setFinishedGameData(res.data);
				})
				.catch(() => {
					toast.error("Something went wrong trying to finish the game", {
						autoClose: 3000
					});
				});
		}
		setIsOpen(true);
	};


	const shareScore = async (mode) => {
		const isAnonymous = mode === "anonymous";
		const data = {
			share_anonymously: isAnonymous,
		};

		if (token === null) {
			await apiInstance
				.post(`/leaderboard/sharescore/${gameHistoryId}`, data)
				.then((res) => {
					if (res.data.status) {
						toast.success("Score successfully shared! Redirecting", {
							autoClose: 2000
						});
						setTimeout(() => {
							navigate("/");
						}, 2800);
					}
				})
				.catch(() => {
					toast.error("Something went wrong while sharing scores", {
						autoClose: 3000
					});
				});
		} else {
			await authApiInstance
				.post(`/leaderboard/sharescore/${gameHistoryId}`, data)
				.then((res) => {
					if (res.data.status) {
						toast.success("Score successfully shared! Redirecting", {
							autoClose: 2000
						});
						setTimeout(() => {
							navigate("/");
						}, 2800);
					}
				})
				.catch(() => {
					toast.error("Something went wrong while sharing scores", {
						autoClose: 3000
					});
				});
		}
	};

	const handleModalClose = () => {
		setIsOpen(false);
		navigate("/");
	};

	useEffect(() => {
		if (guessedWords.length === words.length) {
			endGame();
		}
	}, [guessedWords, words]);

	return (
		<>
			<div className="gameContainer">
				<div className="gameWordsContainter">
					<div className="wordsContainer">
						<div>WORDS TO FIND</div>
						<br />
						{words.map((word) => {
							return (
								<div
									className={`${
										guessedWords.includes(word) ? "guessedWord" : null
									} gameWord`}
									key={word}
								>
									{word}
								</div>
							);
						})}
					</div>
					<div className="game">
						<div className="gameFunctions">
							<Timer stopTimer={stopTimer} time={time} setTime={setTime} />
							<span className="blockSelect">
								{selectedBlocks.length} selected
							</span>
						</div>
						<div className="puzzleBoard">
							{puzzle.map((row, rowIndex) => {
								return (
									<div className="boardRow" key={rowIndex}>
										{row.map((letter, colIndex) => {
											return (
												<BoardSquare
													key={`${rowIndex}-${colIndex}`}
													letter={letter}
													row={rowIndex}
													col={colIndex}
													handleClick={handleClick}
													clicked={
														canContinue
															? selectedBlocks.some(
																(b) =>
																	b.row === rowIndex &&
																	b.col === colIndex &&
																	b.letter === letter
															)
															: false
													}
													opened={openedLetters.some(
														(b) =>
															b.row === rowIndex &&
															b.col === colIndex &&
															b.letter === letter
													)}
													level={level}
												/>
											);
										})}
									</div>
								);
							})}
						</div>
						<div className="boardButtons">
							<Button
								additionalStyles={"boardButton"}
								buttonType={"button"}
								handleClick={handleConfirm}
							>
								Confirm
							</Button>
							<Button
								additionalStyles={"boardButton"}
								buttonType={"button"}
								handleClick={handleClear}
							>
								Clear
							</Button>
						</div>
					</div>
				</div>

				<div className="dailyLeaderboard">
					<Button
						additionalStyles={"leadearboardButton"}
						type={"button"}
						handleClick={() => setOpenLeaderboard(!openLeaderboard)}
					>
						{openLeaderboard ? "Close leaderboard" : "Open Leaderboard"}
					</Button>
					<Leaderboard
						styles={`${
							!openLeaderboard ? "hideLeaderboard" : null
						} leaderboardStyles`}
						site={"dailyPuzzle"}
						gameId={gameId}
					/>
				</div>
			</div>

			<Modal additionalStyles={"scoreModal"} open={isOpen} onClose={handleModalClose}>
				{finishedGameData.error && finishedGameData.score === 0 ? (
					<>
						<div className="modalTitle">Uh Oh!</div>
						<p className="gameEndText">{finishedGameData.error}</p>
						<div className="score">Your score: {finishedGameData.score}</div>
					</>
				) : (
					<>
						<div className="modalTitle">Puzzle Solved!</div>
						<p className="gameEndText">
							Great job, you have solved the Daily Puzzle!
						</p>
						<div className="score">Your score: {finishedGameData.score}</div>
						{token !== null ? (
							<Button
								additionalStyles={"shareButton"}
								type={"button"}
								handleClick={() => shareScore("user")}
							>
								Share my score
							</Button>
						) : null}
						<Button
							additionalStyles={"shareButton"}
							type={"button"}
							handleClick={() => shareScore("anonymous")}
						>
							Share my score anonymously
						</Button>
					</>
				)}
			</Modal>
		</>
	);
};

export default GameGrid;
