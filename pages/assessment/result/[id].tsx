import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { GetServerSideProps } from 'next';
import { graphQLClient } from '../../../graphql/client';
import { ASSESSMENT_RESULT_QUERY } from '../../../graphql/queries';
import type { QueryAssessmentResultData, QueryAssessmentResultVars } from '../../../graphql/types';
import useSWR from 'swr';
import { ErrorBoundary } from 'react-error-boundary';

// Dynamically import heavy feedback breakdown chart
const FeedbackChart = dynamic(() => import('../../../components/FeedbackChart'), {
  ssr: false,
  loading: () => <div>Loading chart...</div>,
});

const fetcher = async (id: string) => {
  const data = await graphQLClient.request<QueryAssessmentResultData, QueryAssessmentResultVars>(ASSESSMENT_RESULT_QUERY, { id });
  return data.assessmentResult;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query as { id: string };
  try {
    const data = await graphQLClient.request<QueryAssessmentResultData, QueryAssessmentResultVars>(ASSESSMENT_RESULT_QUERY, { id });
    return { props: { initialResult: data.assessmentResult, id } };
  } catch (error) {
    return { props: { initialResult: null, id, error: "Could not load" } };
  }
};

function ResultContent({ id, initialResult }: { id: string; initialResult: any }) {
  // Live revalidate every 5s
  const { data: result, error, isLoading, mutate } = useSWR(
    [`assessment-result`, id],
    () => fetcher(id),
    {
      fallbackData: initialResult,
      refreshInterval: 5000,
      revalidateOnFocus: true,
      revalidateIfStale: true,
      dedupingInterval: 2000,
    }
  );

  if (isLoading && !result) return <div>Loading assessment result...</div>;
  if (error) return <div>Error loading result: {error.message || error.toString()}</div>;
  if (!result) return <div>No result found.</div>;

  return (
    <div>
      <h1>Assessment Result</h1>
      <div>
        <strong>Score:</strong> {result.score}
      </div>
      <div>
        <strong>Status:</strong> {result.status}
      </div>
      <div>
        <strong>Feedback:</strong> {result.feedback}
      </div>
      <div>
        <strong>Last updated:</strong> {new Date(result.updatedAt).toLocaleString()}
      </div>
      <Suspense fallback={<div>Loading insights...</div>}>
        <FeedbackChart feedback={result.feedback} score={result.score} />
      </Suspense>
    </div>
  );
}

export default function AssessmentResultPage({ initialResult, id, error }: { initialResult: any; id: string; error?: string }) {
  return (
    <ErrorBoundary fallback={<div>Unexpected error occurred. Please refresh.</div>}>
      <ResultContent id={id} initialResult={initialResult} />
      {error && <div style={{ color: 'crimson' }}>{error}</div>}
    </ErrorBoundary>
  );
}
