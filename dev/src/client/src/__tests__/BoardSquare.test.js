import React from "react";
import { render, fireEvent, cleanup } from "@testing-library/react";
import BoardSquare from "D:/CSS566-Final-Project/src/client/src/components/BoardSquare/BoardSquare.js";

// A test suite for the "BoardSquare" component
describe("BoardSquare", () => {
	// Variable to store the mock function
	let mockHandleClick;

	// Before each test, initialize mock function
	beforeEach(() => {
		mockHandleClick = jest.fn();
	});

	// After each test, clean up the testing environment
	afterEach(() => {
		cleanup();
	});

	// Test to check if the component renders without crashing
	test("renders without crashing", () => {
		const { container } = render(
			<BoardSquare
				letter="A"
				row={0}
				col={0}
				handleClick={mockHandleClick}
				clicked={false}
				opened={false}
				level={1}
			/>,
		);
		// Check if the first child in the container is in the document
		expect(container.firstChild).toBeInTheDocument();
	});

	// Test to check if clicking the square invokes handleClick function
	test("invokes handleClick on click", () => {
		const { getByRole } = render(
			<BoardSquare
				letter="A"
				row={0}
				col={0}
				handleClick={mockHandleClick}
				clicked={false}
				opened={false}
				level={1}
			/>,
		);

		// Simulate a click event on the square
		fireEvent.click(getByRole("button"));
		// Verify that handleClick was called with the right arguments
		expect(mockHandleClick).toHaveBeenCalledWith(0, 0, "A");
	});

	// Test suite for when the square is clicked and opened
	describe("when clicked and opened", () => {
		test("assigns correct classes", () => {
			const { getByRole } = render(
				<BoardSquare
					letter="A"
					row={0}
					col={0}
					handleClick={mockHandleClick}
					clicked={true}
					opened={true}
					level={1}
				/>,
			);
			// Check if the button has the expected classes
			expect(getByRole("button")).toHaveClass("square squareClicked squareOpened one");
		});
	});

	// Test suite for when the square is opened but not clicked
	describe("when opened but not clicked", () => {
		test("assigns correct classes", () => {
			const { getByRole } = render(
				<BoardSquare
					letter="A"
					row={0}
					col={0}
					handleClick={mockHandleClick}
					clicked={false}
					opened={true}
					level={2}
				/>,
			);
			// Check if the button has the expected classes
			expect(getByRole("button")).toHaveClass("square squareOpened two");
		});
	});

	// Test suite for when the square is neither opened nor clicked
	describe("when neither opened nor clicked", () => {
		test("assigns correct classes", () => {
			const { getByRole } = render(
				<BoardSquare
					letter="A"
					row={0}
					col={0}
					handleClick={mockHandleClick}
					clicked={false}
					opened={false}
					level={3}
				/>,
			);
			// Check if the button has the expected classes
			expect(getByRole("button")).toHaveClass("square three");
		});
	});
});
