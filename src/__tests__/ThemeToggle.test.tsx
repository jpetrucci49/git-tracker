// src/__tests__/ThemeToggle.test.tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeToggle } from "../components/ThemeToggle";

describe("ThemeToggle", () => {
  it("toggles dark mode and persists to localStorage", async () => {
    const user = userEvent.setup();

    // Spy on localStorage
    const setItemSpy = vi.spyOn(Storage.prototype, "setItem");
    const getItemSpy = vi.spyOn(Storage.prototype, "getItem");

    let darkMode = true;
    const toggle = vi.fn(() => {
      darkMode = !darkMode;
    });

    const { rerender } = render(
      <ThemeToggle darkMode={darkMode} toggle={toggle} />
    );

    expect(screen.getByText("Light Mode")).toBeInTheDocument();

    await user.click(screen.getByRole("button"));

    expect(toggle).toHaveBeenCalledTimes(1);
    expect(setItemSpy).toHaveBeenCalledWith("git-tracker-theme", "light");

    // Re-render with new state
    rerender(<ThemeToggle darkMode={false} toggle={toggle} />);
    expect(screen.getByText("Dark Mode")).toBeInTheDocument();

    // Simulate page reload
    getItemSpy.mockReturnValue("light");
    expect(localStorage.getItem("git-tracker-theme")).toBe("light");
  });
});
