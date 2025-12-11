// src/__tests__/useContributions.test.ts
import { renderHook, waitFor } from "@testing-library/react";
import { useContributions } from "../hooks/useContributions";
import { request } from "graphql-request";
import { describe, it, expect, vi } from "vitest";

vi.mock("graphql-request");

describe("useContributions", () => {
  it("fetches and calculates streak", async () => {
    vi.mocked(request).mockResolvedValueOnce({
      user: {
        contributionsCollection: {
          contributionCalendar: {
            totalContributions: 1000,
            weeks: [
              {
                contributionDays: [
                  { date: "2025-04-01", contributionCount: 10 },
                  { date: "2025-04-02", contributionCount: 5 },
                ],
              },
            ],
          },
        },
      },
    });

    const { result } = renderHook(() => useContributions("jpetrucci49", true));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.total).toBe(1000);
    expect(result.current.streak).toBeGreaterThan(0);
  });
});
