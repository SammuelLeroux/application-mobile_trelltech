import { render, act } from "@testing-library/react-native";
import fetchMock from "jest-fetch-mock";
import CardsGets from "../CardsGet";

fetchMock.enableMocks();

describe("CardsGets component", () => {
  beforeEach(() => {
    fetch.resetMocks(); // Reset the fetch mock before each test
  });

  it("fetches cards and renders them on successful response", async () => {
    const mockData = [
      { id: "1", name: "Card 1", desc: "Description 1" },
      { id: "2", name: "Card 2", desc: "Description 2" },
    ];

    fetch.mockResponseOnce(JSON.stringify(mockData)); // Mock the fetch response with the mockData

    const { findAllByText } = render(<CardsGets list={{ id: "123" }} />);

    // Wait for useEffect to call fetch and rerender the component
    await act(async () => {});

    const items = await findAllByText(/Card \d/); // Find all elements that match the regex pattern /Card \d/

    expect(items).toHaveLength(2); // Expect the number of items to be 2
  });

  it("handles fetch error", async () => {
    console.error = jest.fn(); // Mock the console.error function

    fetch.mockRejectOnce(new Error("Fetch failed")); // Mock the fetch to reject with an error

    render(<CardsGets list={{ id: "123" }} />);

    // Wait for useEffect to call fetch and rerender the component
    await act(async () => {});

    expect(console.error).toHaveBeenCalledWith(
      "Erreur lors de la récupération des cartes :", // Log an error message with the error
      new Error("Fetch failed")
    );
  });
});
