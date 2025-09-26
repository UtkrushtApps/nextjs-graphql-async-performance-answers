export interface AssessmentResult {
  id: string;
  candidateId: string;
  assessmentId: string;
  score: number;
  feedback: string;
  status: string;
  updatedAt: string;
}

export interface QueryAssessmentResultVars {
  id: string;
}

export interface QueryAssessmentResultData {
  assessmentResult: AssessmentResult;
}

export interface MutationUpdateAssessmentResultVars {
  id: string;
  score: number;
  feedback: string;
  status: string;
}

export interface MutationUpdateAssessmentResultData {
  updateAssessmentResult: AssessmentResult;
}
