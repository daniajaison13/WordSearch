import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import GameGrid from '../components/GameGrid/GameGrid';
import React from "react";
import { MemoryRouter as Router } from "react-router-dom";

describe("GameGrid Component", () => {

  const mockProps = {
    puzzle: [
      ['a', 'b', 'c'],
      ['d', 'e', 'f'],
      ['g', 'h', 'i']
    ],
    size: 3,
    words: ['abc', 'def', 'ghi'],
    level: 1,
    gameId: 1,
    gameHistoryId: 1,
    token: 'mockToken',
  };
  
  test('renders GameGrid component', async () => {
    render(
      <Router>
        <GameGrid {...mockProps} />
      </Router>
    );
    await waitFor(() => expect(screen.getByText('WORDS TO FIND')).toBeInTheDocument());
  });

  test("should display correct game level", async () => {
    
  });

  test("should render the puzzle grid correctly", async () => {
    const { container } = render(
      <Router>
        <GameGrid {...mockProps} />
      </Router>
    );
    await waitFor(() => {
      const rows = container.querySelectorAll('.boardRow');
      expect(rows.length).toBe(3);

      const cells = container.querySelectorAll('.square');
      expect(cells.length).toBe(mockProps.size * mockProps.size); // Ensure the correct number of cells are present
    });
  });

  test("should trigger the correct action on cell selection", async () => {
    const { container } = render(
      <Router>
        <GameGrid {...mockProps} />
      </Router>
    );
    await waitFor(() => {
        const firstCell = container.querySelector('.square');
        fireEvent.click(firstCell);
        
      });
  });
});
