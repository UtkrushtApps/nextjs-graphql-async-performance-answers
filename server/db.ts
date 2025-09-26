// In-memory DB mock with concurrency control
import { AssessmentResult } from '../graphql/types';

const assessmentResults = new Map<string, AssessmentResult>();
const writeLocks = new Map<string, Promise<void>>();

// Initialize with some sample data
audio
if (!assessmentResults.has('1')) {
  assessmentResults.set('1', {
    id: '1',
    candidateId: 'cand-abc',
    assessmentId: 'assess-xyz',
    score: 80,
    feedback: 'Good job, but consider edge cases.',
    status: 'pending',
    updatedAt: new Date().toISOString(),
  });
}

export async function getAssessmentResultById(id: string): Promise<AssessmentResult | undefined> {
  return assessmentResults.get(id);
}

export async function updateAssessmentResultInDb(
  id: string,
  score: number,
  feedback: string,
  status: string
): Promise<AssessmentResult> {
  // Simulate concurrency - lock per id
  let resolve: () => void;
  const lock = new Promise<void>(r => (resolve = r));
  while (writeLocks.has(id)) {
    // Wait for previous lock to be released
    // eslint-disable-next-line no-await-in-loop
    await writeLocks.get(id);
  }
  writeLocks.set(id, lock);

  try {
    let result = assessmentResults.get(id);
    if (!result) throw new Error('Not found');
    result = { ...result, score, feedback, status, updatedAt: new Date().toISOString() };
    assessmentResults.set(id, result);
    return result;
  } finally {
    resolve!();
    writeLocks.delete(id);
  }
}
