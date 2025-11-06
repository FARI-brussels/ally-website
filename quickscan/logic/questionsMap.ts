type QuestionIdMap = Record<string, number[]>;

const q1Options: QuestionIdMap = {
  small: [16, 4, 8],
  medium: [8, 24, 19],
  large: [8, 24, 13, 9, 18],
  xlarge: [8, 24, 13, 9, 18],
} as const;
const q2Options: QuestionIdMap = {
  public: [11, 10],
  private: [20, 17],
  nonprofit: [13, 4],
} as const;
const q3Options: QuestionIdMap = {
  develop: [25],
  buy: [21, 24],
  both: [21, 24, 25],
  unknown: [6],
} as const;
const q4Options: QuestionIdMap = {
  low: [17, 16, 14],
  medium: [17, 13, 15],
  high: [13, 15],
} as const;
const q5Options: QuestionIdMap = {
  Yes: [5, 19, 12],
  No: [19],
} as const;
const q6Options: QuestionIdMap = {
  low: [5],
  medium: [13, 11],
  high: [9, 22, 7, 12],
  undecided: [5],
} as const;

export const questionsToBlockIds: Record<string, QuestionIdMap> = {
  Q1: q1Options,
  Q2: q2Options,
  Q3: q3Options,
  Q4: q4Options,
  Q5: q5Options,
  Q6: q6Options,
} as const;
