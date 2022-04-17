import { render, screen, fireEvent } from "@testing-library/react";
import UserList from "../UserList/UserList";
import userEvent from "@testing-library/user-event";
import axios from "axios";

jest.mock("axios");

test("Render Page Header", () => {
  render(<UserList />);
  const text = screen.getByText("Example With Search and Filter");
  expect(text).toBeInTheDocument();
});

it("Testing onClick on text reset filter to reset dropdown value", () => {
  render(<UserList />);
  const resetButton = screen.getByText("Reset Filter");
  userEvent.click(resetButton);
  expect(screen.getByDisplayValue("all")).toHaveValue("all");
});

it("Change dropdown value to male", async () => {
  render(<UserList />);
  const contentInput = screen.getByTestId("content-input");
  fireEvent.change(contentInput, {
    target: { value: "male" },
  });
  expect(contentInput).toHaveValue("male");
});
