import React from "react";
import { render, fireEvent } from "@testing-library/react";
import Button from "../components/Button/Button";

describe("Button", () => {
	it("renders correctly", () => {
		const { getByText } = render(<Button>Test Button</Button>);
		expect(getByText("Test Button")).toBeInTheDocument();
	});

	it("handles click correctly", () => {
		const handleClick = jest.fn();
		const { getByText } = render(<Button handleClick={handleClick}>Click Me</Button>);
		fireEvent.click(getByText("Click Me"));
		expect(handleClick).toHaveBeenCalledTimes(1);
	});

	it("renders with additional styles", () => {
		const { getByText } = render(<Button additionalStyles="testClass">Styled Button</Button>);
		expect(getByText("Styled Button")).toHaveClass("defaultButton", "testClass");
	});

	it("renders with correct button type", () => {
		const { getByText } = render(<Button buttonType="submit">Submit Button</Button>);
		expect(getByText("Submit Button")).toHaveAttribute("type", "submit");
	});
});
