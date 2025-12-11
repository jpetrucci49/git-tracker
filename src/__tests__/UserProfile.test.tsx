import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import axios, { type AxiosResponse } from "axios";
import { UserProfile } from "../components/UserProfile";

vi.mock("axios");

const mockedAxios = axios as unknown as {
  get: ReturnType<typeof vi.fn>;
};

describe("UserProfile", () => {
  it("renders user data from API", async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        login: "jpetrucci49",
        name: "Joe Petrucci",
        avatar_url: "https://avatars.githubusercontent.com/u/123",
        public_repos: 42,
        followers: 999,
      },
    } as AxiosResponse);

    render(
      <UserProfile
        user={{
          login: "jpetrucci49",
          name: "Joe Petrucci",
          avatar_url: "",
          public_repos: 42,
          followers: 999,
        }}
        total={1337}
        streak={42}
      />
    );

    await screen.findByText("Joe Petrucci");
    expect(screen.getByText("@jpetrucci49")).toBeInTheDocument();
  });
});
