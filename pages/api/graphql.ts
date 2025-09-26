import { NextApiRequest, NextApiResponse } from 'next';
import { getAssessmentResultById, updateAssessmentResultInDb } from '../../server/db';
import { AssessmentResult } from '../../graphql/types';

async function handleGraphQL(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).end();
    return;
  }
  const { query, variables, operationName } = req.body;
  // Minimalistic GraphQL implementation for demo
  if (query.includes('query AssessmentResult')) {
    const id = variables.id as string;
    const result = await getAssessmentResultById(id);
    if (!result)
      return res.status(404).json({ errors: [{ message: 'Not found' }] });
    return res.json({ data: { assessmentResult: result } });
  }
  if (query.includes('mutation UpdateAssessmentResult')) {
    const { id, score, feedback, status } = variables;
    const updated = await updateAssessmentResultInDb(id, score, feedback, status);
    return res.json({ data: { updateAssessmentResult: updated } });
  }
  res.status(400).json({ error: 'Not supported in demo' });
}

export default handleGraphQL;
