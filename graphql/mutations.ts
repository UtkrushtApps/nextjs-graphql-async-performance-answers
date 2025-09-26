import { gql } from 'graphql-request';

export const UPDATE_ASSESSMENT_RESULT_MUTATION = gql`
  mutation UpdateAssessmentResult($id: ID!, $score: Float!, $feedback: String!, $status: String!) {
    updateAssessmentResult(id: $id, score: $score, feedback: $feedback, status: $status) {
      id
      candidateId
      assessmentId
      score
      feedback
      status
      updatedAt
    }
  }
`;
