export interface Subject {
  course: string;
  faculty: string;
  color: string;
}

export interface SectionRanking {
  section: string;
  score: number;
  greens: number;
  yellows: number;
  reds: number;
  whites: number;
  subjects: Subject[];
}

export interface AnalyticsData {
  highest_score: number;
  lowest_score: number;
  average_score: number;
  total_sections: number;
  total_subjects: number;
  green_percentage: number;
  yellow_percentage: number;
  red_percentage: number;
  white_percentage: number;
  top_5_sections: string[];
}

export interface UploadResponse {
  statistics: AnalyticsData;
  topSections: SectionRanking[];
  rankings: SectionRanking[];
}

export interface UploadError {
  detail: string;
}
