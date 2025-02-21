import sys
import json
import spacy
from spacy_llm.util import assemble

def init_nlp():
    # Create basic configuration for spaCy-LLM
    config = {
        "nlp": {
            "lang": "en",
            "pipeline": ["llm"]
        },
        "components": {
            "llm": {
                "factory": "llm",
                "task": {
                    "@llm_tasks": "spacy.TextCat.v3",
                    "labels": ["WEB_DEV", "CODE", "GENERAL"]
                },
                "model": {
                    "@llm_models": "spacy.GPT-4.v2"
                }
            }
        }
    }

    # Initialize the pipeline
    nlp = assemble(config)
    return nlp

def process_input(input_text: str) -> str:
    try:
        # For now, return a simple response since spaCy setup might take time
        response_text = f"Web Buddy AI: I understood your message: {input_text}\n\n"

        # Add some default web development suggestions
        suggestions = [
            "✨ Try adding interactive components for better user engagement",
            "🎨 Consider using a consistent color scheme across the project",
            "📱 Ensure responsive design for mobile devices",
            "🚀 Optimize loading times with lazy loading"
        ]

        return response_text + "Suggestions:\n" + "\n".join(suggestions)
    except Exception as e:
        return f"Error processing input: {str(e)}"

if __name__ == "__main__":
    try:
        # Read raw input from stdin
        raw_input = sys.stdin.read().strip()

        try:
            # Try to parse as JSON
            data = json.loads(raw_input)
            # Extract message content from the expected format
            messages = data.get("messages", [])
            if messages and isinstance(messages, list) and len(messages) > 0:
                query = messages[0].get("content", "")
            else:
                query = raw_input
        except json.JSONDecodeError:
            # If JSON parsing fails, use the raw input
            query = raw_input

        # Process the query
        result = process_input(query)

        # Return response in JSON format
        print(json.dumps({"response": result}))
        sys.exit(0)
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)