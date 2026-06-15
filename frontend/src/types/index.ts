export type LoginCredentials = {
  username?: string;
  password?: string;
};

export type RegisterData = {
  username?: string;
  email?: string;
  password?: string;
};

export type JwtResponse = {
  token: string;
  id: number;
  username: string;
  email: string;
  role: string;
};

export type ProfileData = {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  avatarUrl?: string;
  xp: number;
  level: string;
  problemsSolved: number;
  accuracy: number;
};

export type PasswordUpdateData = {
  oldPassword?: string;
  newPassword?: string;
};

export type UserStats = {
  currentStreak: number;
  longestStreak: number;
  xp: number;
  level: string;
  problemsSolved: number;
  accuracy: number;
  courseProgress: number;
  weeklyActivity: number[];
};

export type CodingProblem = {
  id: number;
  questionId?: number;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  constraints?: string;
  timeLimitMs?: number;
  memoryLimitMb?: number;
  javaTemplate?: string;
  javascriptTemplate?: string;
  sqlTemplate?: string;
  unlocked?: boolean;
  solved?: boolean;
  category?: string;
  schemaSql?: string;
  bookmarked?: boolean;
};

export type Question = {
  id: number;
  type: 'MCQ' | 'FILL_BLANK';
  title: string;
  description: string;
  difficulty: string;
  options?: string; // stringified JSON array
  xpReward: number;
  submitted?: boolean;
  correct?: boolean;
};


