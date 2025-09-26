import React from 'react';

interface Props {
  feedback: string;
  score: number;
}

// Simulate a heavy component with some delay
const FeedbackChart: React.FC<Props> = ({ feedback, score }) => {
  // Artificial delay for suspense simulation
  if (typeof window !== 'undefined') {
    const start = Date.now();
    while (Date.now() - start < 300) {
      // Simulate CPU work
    }
  }
  // Basic visualization (could use recharts, etc)
  return (
    <div style={{ marginTop: '2rem' }}>
      <h3>Feedback Insights</h3>
      <div><strong>Key Feedback:</strong> {feedback.slice(0, 128)}</div>
      <progress value={score} max={100} style={{ width: 200 }} />
    </div>
  );
};

export default FeedbackChart;
