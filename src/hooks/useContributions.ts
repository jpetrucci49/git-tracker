import { useState, useEffect } from "react";
import { request, gql } from "graphql-request";

import type { ContributionDay, GQLResponse } from "../types/github";

const QUERY = gql`
  query ($username: String!) {
    user(login: $username) {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
            }
          }
        }
      }
    }
  }
`;

export const useContributions = (username: string, enabled: boolean) => {
  const [days, setDays] = useState<ContributionDay[]>([]);
  const [total, setTotal] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [loading, setLoading] = useState(false);
  const [longestStreak, setLongestStreak] = useState(0);

  const calculateLongestStreak = (days: ContributionDay[]) => {
    let longest = 0;
    let current = 0;
    for (let i = days.length - 1; i >= 0; i--) {
      if (days[i].contributionCount > 0) {
        current++;
        longest = Math.max(longest, current);
      } else {
        current = 0;
      }
    }
    return longest;
  };

  useEffect(() => {
    if (!enabled || !username) {
      setDays([]);
      setTotal(0);
      setCurrentStreak(0);
      return;
    }

    let cancelled = false;
    setLoading(true);

    (async () => {
      try {
        const data: GQLResponse = await request(
          "https://api.github.com/graphql",
          QUERY,
          { username },
          { Authorization: `Bearer ${import.meta.env.VITE_GITHUB_TOKEN}` }
        );

        const weeks =
          data.user.contributionsCollection.contributionCalendar.weeks;
        const totalContribs =
          data.user.contributionsCollection.contributionCalendar
            .totalContributions;

        const processed: ContributionDay[] = [];
        weeks.forEach((week) => {
          week.contributionDays.forEach((day) => {
            const count = day.contributionCount;
            processed.push({
              date: day.date,
              contributionCount: count,
              color:
                count === 0
                  ? "bg-gray-200 dark:bg-gray-800"
                  : count < 5
                  ? "bg-green-300 dark:bg-green-900"
                  : count < 10
                  ? "bg-green-500 dark:bg-green-700"
                  : count < 20
                  ? "bg-green-700 dark:bg-green-500"
                  : "bg-green-900 dark:bg-green-400",
            });
          });
        });

        if (!cancelled) {
          setDays(processed);
          setTotal(totalContribs);
          // Simple streak calc (good enough)
          let current = 0;
          for (let i = processed.length - 1; i >= 0; i--) {
            if (processed[i].contributionCount > 0) current++;
            else if (current > 0) break;
          }
          setCurrentStreak(current);
          setLongestStreak(calculateLongestStreak(processed));
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [username, enabled]);

  return { days, total, currentStreak, loading, longestStreak };
};
