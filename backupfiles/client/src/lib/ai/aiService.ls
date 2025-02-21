import OpenAI from "openai";
import { DraggableItemProps } from "@/components/dnd/DraggableComponent";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

interface AIResponse {
  action: 'create' | 'modify' | 'update';
  components?: DraggableItemProps[];
  modifications?: {
    colors?: string[];
    layout?: string;
    animations?: string[];
    content?: {
      answer?: string;
      [key: string]: any;
    };
  };
}

export async function processAICommand(command: string): Promise<AIResponse> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are Web Buddy, a helpful AI assistant for web development. 
            Provide clear, concise answers for development-related questions.
            For numerical or factual questions, respond directly with the answer.
            Keep responses informative but concise.`,
        },
        {
          role: "user",
          content: command,
        },
      ],
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No response content received from AI");
    }

    // For component creation/modification commands
    if (command.toLowerCase().includes('create') || command.toLowerCase().includes('modify')) {
      const structuredResponse = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a website design AI assistant that helps modify and create components. Respond with specific actions and modifications in JSON format.",
          },
          {
            role: "user",
            content: command,
          },
        ],
        response_format: { type: "json_object" },
      });

      const structuredContent = structuredResponse.choices[0].message.content;
      if (!structuredContent) {
        throw new Error("No structured response content received from AI");
      }

      return JSON.parse(structuredContent) as AIResponse;
    }

    // For general questions, return the response as a regular message
    return {
      action: 'update',
      modifications: {
        content: {
          answer: content
        }
      }
    };
  } catch (error) {
    console.error("AI processing error:", error);
    throw new Error("Failed to process AI command");
  }
}

export async function generateComponentVariants(
  baseComponent: DraggableItemProps,
  count: number = 10
): Promise<DraggableItemProps[]> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `Generate ${count} variations of the following component with different styles, colors, and layouts. Respond in JSON format with an array of component definitions.`,
        },
        {
          role: "user",
          content: JSON.stringify(baseComponent),
        },
      ],
      response_format: { type: "json_object" },
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No response content received from AI");
    }

    const variants = JSON.parse(content).variants;
    return variants.map((variant: any, index: number) => ({
      ...baseComponent,
      id: `${baseComponent.id}-variant-${index + 1}`,
      name: variant.name || `${baseComponent.name} (Variant ${index + 1})`,
      ...variant,
    }));
  } catch (error) {
    console.error("Error generating variants:", error);
    throw new Error("Failed to generate component variants");
  }
}

export async function updateBusinessPlan(
  command: string,
  currentPlan: any
): Promise<any> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a business plan expert. Update the provided business plan according to the user's request. Maintain the same structure but modify content and metrics as requested.",
        },
        {
          role: "user",
          content: `Current plan: ${JSON.stringify(currentPlan)}\nUpdate request: ${command}`,
        },
      ],
      response_format: { type: "json_object" },
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No response content received from AI");
    }

    return JSON.parse(content);
  } catch (error) {
    console.error("Error updating business plan:", error);
    throw new Error("Failed to update business plan");
  }
}