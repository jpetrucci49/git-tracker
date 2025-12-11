// src/__tests__/App.integration.test.tsx
import { beforeEach, describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import App from "../App";
import axios from "axios";
import { request } from "graphql-request";

vi.mock("axios");
vi.mock("graphql-request");

const mockedAxios = axios as unknown as { get: ReturnType<typeof vi.fn> };
const mockedRequest = request as ReturnType<typeof vi.fn>;

describe("App — Full User Flow", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();

    // Mock user
    mockedAxios.get.mockResolvedValue({
      data: {
        login: "jpetrucci49",
        name: "John Petrucci",
        avatar_url: "https://avatars.githubusercontent.com/u/123",
        public_repos: 50,
        followers: 999,
      },
    });

    // Mock contributions
    mockedRequest.mockResolvedValue({
      user: {
        contributionsCollection: {
          contributionCalendar: {
            totalContributions: 1337,
            weeks: Array(52).fill({
              contributionDays: Array(7).fill({
                contributionCount: 10,
                date: "2025-01-01",
              }),
            }),
          },
        },
      },
    });

    // Mock languages
    mockedAxios.get.mockImplementation((url) => {
      if (url.includes("/languages")) {
        return Promise.resolve({
          data: { TypeScript: 2000, JavaScript: 1500, Python: 500 },
        });
      }
      return Promise.resolve({ data: [] });
    });
  });

  it("searches, shows data, toggles theme, and persists it", async () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    // Type username
    const input = screen.getByPlaceholderText(/github username/i);
    await user.type(input, "jpetrucci49");

    // Wait for everything to load
    await waitFor(() =>
      expect(screen.getByText("John Petrucci")).toBeInTheDocument()
    );
    expect(screen.getByText("1,337")).toBeInTheDocument();

    // Wait for language chart (async)
    await screen.findByText("Top Languages");

    // Toggle theme
    const toggle = screen.getByRole("button", { name: /mode/i });
    await user.click(toggle);

    expect(localStorage.getItem("git-tracker-theme")).toBe("light");

    await user.click(toggle);
    expect(localStorage.getItem("git-tracker-theme")).toBe("dark");
  });
});
