export interface GitHubUser {
  login: string;
  avatar_url: string;
  name?: string;
  public_repos: number;
  followers: number;
}

export interface ContributionDay {
  date: string;
  contributionCount: number;
  color: string;
}

export interface GQLResponse {
  user: {
    contributionsCollection: {
      contributionCalendar: {
        totalContributions: number;
        weeks: {
          contributionDays: {
            date: string;
            contributionCount: number;
            weekday: number;
          }[];
        }[];
      };
    };
  };
}

export interface LanguageData {
  name: string;
  value: number;
  color: string;
  [key: string]: string | number;
}
