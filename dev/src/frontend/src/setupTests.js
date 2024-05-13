// setupTests.js
import "@testing-library/jest-dom";
import fetchMock from "jest-fetch-mock";
import "@testing-library/user-event";
import "@testing-library/jest-dom/extend-expect";

fetchMock.enableMocks();

// Any other global setup needed for your tests
