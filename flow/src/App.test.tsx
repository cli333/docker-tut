import React from "react";
import { render } from "@testing-library/react";
import App from "./App";

test("renders hello docker", () => {
  const { getByText } = render(<App />);
  const linkElement = getByText(/Hello DOCKER@@!/i);
  expect(linkElement).toBeInTheDocument();
});

test("renders hello docker", () => {
  const { getByText } = render(<App />);
  const linkElement = getByText(/Hello DOCKER@@!/i);
  expect(linkElement).toBeInTheDocument();
});

test("renders hello docker", () => {
  const { getByText } = render(<App />);
  const linkElement = getByText(/Hello DOCKER@@!/i);
  expect(linkElement).toBeInTheDocument();
});

test("renders hello docker", () => {
  const { getByText } = render(<App />);
  const linkElement = getByText(/Hello DOCKER@@!/i);
  expect(linkElement).toBeInTheDocument();
});

test("renders hello docker", () => {
  const { getByText } = render(<App />);
  const linkElement = getByText(/Hello DOCKER@@!/i);
  expect(linkElement).toBeInTheDocument();
});
