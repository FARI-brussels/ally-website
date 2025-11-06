export type Intensity = "low" | "medium" | "high";
export type CategoryName =
  | "Values & Structures"
  | "Culture & Skills"
  | "Communication & Participation"
  | "Processes & Methods";

export interface BlockMetadata {
  id: number;
  title: string;
  category: CategorySlug;
  cost: Intensity;
  effort: Intensity;
  time: Intensity;
  maintenance: Intensity;
  ranking: number;
  resourceIntensityScore: number;
}
