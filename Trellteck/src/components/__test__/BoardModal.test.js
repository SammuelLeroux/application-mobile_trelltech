import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import BoardModal from "../modals/BoardModal";

describe("BoardModal", () => {
  it("should create a board", async () => {
    const fetchBoards = jest.fn();
    const setModalVisible = jest.fn();
    const { getByPlaceholderText, getByText } = render(
      <BoardModal fetchBoards={fetchBoards} setModalVisible={setModalVisible} action="CREATE" />
    );

    const input = getByPlaceholderText("Entrer le nom du board");
    fireEvent.changeText(input, "My Board");

    const createButton = getByText("Create Board !");
    fireEvent.press(createButton);
  });
});


