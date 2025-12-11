// src/__tests__/SearchInput.test.tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SearchInput } from "../components/SearchInput";

describe("SearchInput", () => {
  const user = userEvent.setup();

  it("debounces input and calls onChange", async () => {
    const handleChange = vi.fn();
    render(<SearchInput value="" onChange={handleChange} />);

    const input = screen.getByRole("textbox");

    await user.type(input, "john");

    // onChange called once after debounce (not 4 times)
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith("john");
  });

  it("shows placeholder", () => {
    render(
      <SearchInput value="" onChange={() => {}} placeholder="Find user..." />
    );
    expect(screen.getByPlaceholderText("Find user...")).toBeInTheDocument();
  });
});
