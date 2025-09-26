import { gql } from 'graphql-request';

export const ASSESSMENT_RESULT_QUERY = gql`
  query AssessmentResult($id: ID!) {
    assessmentResult(id: $id) {
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
