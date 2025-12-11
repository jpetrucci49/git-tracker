import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ContributionHeatmap } from "../components/ContributionHeatmap";

describe("ContributionHeatmap", () => {
  it("renders without crashing when no data", () => {
    render(<ContributionHeatmap days={[]} />);
    expect(screen.getByText(/Contribution Heatmap/i)).toBeInTheDocument();
  });

  it("shows contributions when data exists", async () => {
    const days = [
      {
        date: "2025-01-01",
        contributionCount: 5,
        color: "bg-green-500",
      },
    ];

    render(<ContributionHeatmap days={days} />);

    const cell = await screen.findByTitle(/5 commits/);
    expect(cell).toBeInTheDocument();
    expect(cell).toHaveClass("bg-green-500");
  });
});
