export class AIService {
  async generateResponse(query: string): Promise<string> {
    try {
      console.log('Generating AI response for query:', query);

      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('AI response error:', response.status, response.statusText, errorText);
        throw new Error(`Failed to generate response: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('AI response received:', data);
      return data.response || "I apologize, but I couldn't generate a proper response at the moment.";
    } catch (error) {
      console.error('Error generating AI response:', error);
      throw new Error('Failed to connect to AI service. Please try again.');
    }
  }
}

export const aiService = new AIService();