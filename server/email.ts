export async function sendResultEmail(candidateId: string, result: any) {
  // Simulate async email sending
  await new Promise(resolve => setTimeout(resolve, 800));
  // eslint-disable-next-line no-console
  console.log(`Email sent to candidate ${candidateId} about result ${result.id}`);
}
