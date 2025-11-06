type QuestionId = `Q${number}`;

interface Option {
  letter: "A" | "B" | "C" | "D" | "E";
  value: string;
  label: string;
}

interface AllyQuickscanQuestion {
  id: QuestionId;
  question: string;
  options: Option[];
}

export const orgSizeField: AllyQuickscanQuestion = {
  id: "Q1",
  question: "What is the size of your organisation?",
  options: [
    { letter: "A", value: "small", label: "Small (2–9 FTE)" },
    { letter: "B", value: "medium", label: "Medium (10–50 FTE)" },
    { letter: "C", value: "large", label: "Large (51–100 FTE)" },
    { letter: "D", value: "xlarge", label: "X-Large (>100 FTE)" },
  ],
} as const;

export const orgTypeField: AllyQuickscanQuestion = {
  id: "Q2",
  question: "What is your organisation type?",
  options: [
    { letter: "A", value: "public", label: "Public" },
    { letter: "B", value: "private", label: "Private" },
    { letter: "C", value: "nonprofit", label: "Non-profit" },
  ],
} as const;

export const aiField: AllyQuickscanQuestion = {
  id: "Q3",
  question: "Does your organisation develop or buy AI?",
  options: [
    { letter: "A", value: "develop", label: "Develop" },
    { letter: "B", value: "buy", label: "Buy" },
    { letter: "C", value: "both", label: "Both" },
    { letter: "D", value: "unknown", label: "Don’t know" },
  ],
} as const;

export const ethicsField: AllyQuickscanQuestion = {
  id: "Q4",
  question:
    "How would you rate the driving force in your organisation to make ethics reality?",
  options: [
    {
      letter: "A",
      value: "low",
      label: "Low - ethics is not (yet) on the radar in my organisation",
    },
    {
      letter: "B",
      value: "medium",
      label:
        "Medium - my organisation is interested to explore how they can be more ethical, but does not know how",
    },
    {
      letter: "C",
      value: "high",
      label:
        "High - ethics is an important aspect in the values and activities of my organisation, and they would like to know how we can do more",
    },
  ],
} as const;

export const impactField: AllyQuickscanQuestion = {
  id: "Q5",
  question:
    "Is your organisation in at least one sector with a high impact? Such as: health, education, safety, employment, infrastructure, essential services, law enforcement, migration and administration of justice and democratic processes.",
  options: [
    { letter: "A", value: "Yes", label: "Yes" },
    { letter: "B", value: "No", label: "No" },
  ],
} as const;

export const aiImpactField: AllyQuickscanQuestion = {
  id: "Q6",
  question:
    "According to your estimation, how would you estimate the level of impact of the AI system?",
  options: [
    { letter: "A", value: "low", label: "Low impact" },
    { letter: "B", value: "medium", label: "Medium impact" },
    { letter: "C", value: "high", label: "High impact" },
    { letter: "D", value: "undecided", label: "No idea" },
  ],
} as const;

export const resourceField: AllyQuickscanQuestion = {
  id: "Q7",
  question:
    "How many resources are available in your organisation to work on ethics (time, budget, effort)?",
  options: [
    { letter: "A", value: "low", label: "Little resources" },
    {
      letter: "B",
      value: "medium",
      label: "Not little resources, not much resources",
    },
    { letter: "C", value: "high", label: "Much resources" },
    { letter: "D", value: "undecided", label: "Not sure" },
  ],
} as const;

export const focusField: AllyQuickscanQuestion = {
  id: "Q8",
  question:
    "On what do you want to focus the most/first? Ethical actions related to ...",
  options: [
    { letter: "A", value: "values_structures", label: "Values & Structures" },
    { letter: "B", value: "methods_processes", label: "Processes & Methods" },
    { letter: "C", value: "culture_skills", label: "Culture & Skills" },
    {
      letter: "D",
      value: "communication_participation",
      label: "Communication & Participation",
    },
    {
      letter: "E",
      value: "undecided",
      label: "Don't know, just give me the basics",
    },
  ],
} as const;
