import OpenAI from 'openai';
import { getWeather } from './weather';

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Required for browser usage
});

export interface AIResponse {
  content: string;
  suggestions: string[];
}

export async function getBusinessAdvice(
  prompt: string,
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = []
): Promise<AIResponse> {
  try {
    // Handle time queries
    if (prompt.toLowerCase().includes('time')) {
      const currentTime = new Date().toLocaleTimeString();
      return {
        content: `The current time is ${currentTime}.`,
        suggestions: [
          "Would you like to set a reminder?",
          "Would you like to know the time in a different timezone?",
          "Would you like to schedule something?"
        ]
      };
    }

    // Handle weather queries with enhanced information
    if (prompt.toLowerCase().includes('weather')) {
      try {
        const weather = await getWeather();
        if (weather.error) {
          return {
            content: `I apologize, but I'm having trouble getting the weather information: ${weather.error}`,
            suggestions: [
              "Would you like to try checking another city's weather?",
              "Would you like to try again in a moment?",
              "Can I help you with something else instead?"
            ]
          };
        }

        return {
          content: `The current weather in ${weather.city} is ${weather.description} with a temperature of ${weather.temperature}°C. The humidity is ${weather.humidity}% and wind speed is ${weather.windSpeed} m/s.`,
          suggestions: [
            "Would you like to check another city's weather?",
            "Would you like to know the forecast?",
            "Would you like weather-appropriate activity suggestions?"
          ]
        };
      } catch (error) {
        console.error('Weather fetch error:', error);
        return {
          content: "I apologize, but I'm having trouble accessing the weather information at the moment.",
          suggestions: [
            "Would you like to try again?",
            "Would you like to check a different city?",
            "Can I help you with something else?"
          ]
        };
      }
    }

    // Prepare conversation context
    const messages = [
      {
        role: "system",
        content: `You are Agent Lee, a friendly and knowledgeable life coach with expertise in both professional and personal development. Your personality traits include:

- Warm and approachable communication style while maintaining professionalism
- Balance of emotional intelligence and practical problem-solving
- Expertise in multiple areas:
  * Business strategy and career development
  * Personal growth and life balance
  * Professional writing and communication
  * Relationship and interpersonal skills
  * Daily life organization and productivity
  * General knowledge and trivia across various fields

When responding:
1. Consider the full conversation context
2. Provide practical, actionable advice
3. Be consistent with previous responses
4. Maintain context awareness across the conversation

Format your response as JSON with:
- 'content': Your main advice and explanation
- 'suggestions': Array of 2-3 follow-up suggestions or alternative approaches`
      },
      // Include previous conversation context
      ...conversationHistory,
      // Add the current prompt
      {
        role: "user",
        content: prompt
      }
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages,
      response_format: { type: "json_object" }
    });

    if (!response.choices[0].message.content) {
      throw new Error('No response content received');
    }

    return JSON.parse(response.choices[0].message.content) as AIResponse;
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw new Error('Failed to get advice');
  }
}