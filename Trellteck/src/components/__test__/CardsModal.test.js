import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import CardsModal from "../modals/CardsModal";

describe("CardsModal", () => {
  it("renders correctly", () => {
    const { getByText } = render(<CardsModal />);
    const cardsModal = getByText("Valider");
    expect(cardsModal).toBeTruthy();
  });

  it("deleteCard", () => {
    const { getByText } = render(<CardsModal />);
    const deleteButton = getByText("Remove this task");
    fireEvent.press(deleteButton);
    expect(deleteButton).toBeTruthy();
  });

  it("updateCard", () => {
    const { getByPlaceholderText, getByText } = render(<CardsModal />);
    const input = getByPlaceholderText("Change name of Card");
    fireEvent.changeText(input, "New task");
    const updateButton = getByText("Valider");
    fireEvent.press(updateButton);
    expect(updateButton).toBeTruthy();
  });
});
