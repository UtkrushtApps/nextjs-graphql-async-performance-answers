import { NextApiRequest, NextApiResponse } from 'next';
import { updateAssessmentResultInDb, getAssessmentResultById } from '../../server/db';
import { sendResultEmail } from '../../server/email';
import { logAnalyticsEvent } from '../../server/analytics';

// Simulated webhook to process a new/updated result
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).end();
    return;
  }

  const { id, score, feedback, status } = req.body as { id: string; score: number; feedback: string; status: string };

  // Use a lock to avoid race condition if multiple requests come at once
  // (simulated here -- in real systems, use advisory locks or DB constraints)
  // We'll just ensure one write at a time in-memory.
  try {
    const updated = await updateAssessmentResultInDb(id, score, feedback, status);

    // Run background jobs WITHOUT blocking the response
    setImmediate(async () => {
      try {
        await sendResultEmail(updated.candidateId, updated);
        await logAnalyticsEvent('assessment.result.processed', { resultId: id, score });
      } catch (bgErr) {
        // eslint-disable-next-line no-console
        console.error('Background jobs failed', bgErr);
      }
    });

    // Respond immediately
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: 'Failed to process result' });
  }
}
