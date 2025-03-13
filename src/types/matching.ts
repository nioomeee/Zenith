export interface MatchScore {
  userId: string;
  score: number;
  subscores: {
    interests: number;
    careerPath: number;
    mentorship: number;
    universityInvolvement: number;
    location: number;
  };
  explanation: string[];
}

export interface MatchWeights {
  interests: number;
  careerPath: number;
  mentorship: number;
  universityInvolvement: number;
  location: number;
}

export const DEFAULT_WEIGHTS: MatchWeights = {
  interests: 0.2,
  careerPath: 0.4,
  mentorship: 0.3,
  universityInvolvement: 0.05,
  location: 0.05,
};
