import { render, act } from "@testing-library/react-native";
import fetchMock from "jest-fetch-mock";
import GetList from "../GetList";

fetchMock.enableMocks();

describe("GetList component", () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  it("fetches data and renders the list on successful response", async () => {
    const mockData = [
      { id: "1", name: "List 1" },
      { id: "2", name: "List 2" },
    ];

    fetch.mockResponseOnce(JSON.stringify(mockData));

    const { findAllByText } = render(<GetList id="123" />);

    await act(async () => {});

    const items = await findAllByText(/List \d/);

    expect(items).toHaveLength(2);
  });

  it("handles fetch error", async () => {
    console.error = jest.fn();

    fetch.mockRejectOnce(new Error("Fetch failed"));

    render(<GetList id="123" />);

    // Wait for useEffect to call fetch and rerender the component
    await act(async () => {});

    expect(console.error).toHaveBeenCalledWith(
      "Erreur lors de la récupération des boards :",
      new Error("Fetch failed")
    );
  });
});
