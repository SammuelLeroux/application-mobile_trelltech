import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import BoardList from "../BoardList";
import { NavigationContainer } from "@react-navigation/native";

describe("BoardList", () => {
  it("should fetch boards on mount", async () => {
    // Mock the fetch function
    global.fetch = jest.fn().mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce([
        { id: "board1", name: "Board 1" },
        { id: "board2", name: "Board 2" },
      ]),
    });

    // Render the component
    const { getByText } = render(
      <NavigationContainer>
        <BoardList />
        );
      </NavigationContainer>
    );

    // Wait for the fetch request to complete
    await waitFor(() => expect(fetch).toHaveBeenCalled());

    // Assert that the boards are set correctly
    expect(getByText("Board 1"));
    expect(getByText("Board 2"));
  });
});
