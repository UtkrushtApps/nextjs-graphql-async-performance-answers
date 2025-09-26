export async function logAnalyticsEvent(event: string, properties: any) {
  // Simulate analytics logging
  await new Promise(resolve => setTimeout(resolve, 200));
  // eslint-disable-next-line no-console
  console.log(`Analytics event: ${event} properties:`, properties);
}
