from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import PromptTemplate
import os
from dotenv import load_dotenv

load_dotenv()
try:
    llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", google_api_key=os.getenv("GOOGLE_API_KEY"))
except Exception as e:
    raise Exception(f"Failed to initialize Gemini API: {str(e)}")

def generate_challenge_questions(document: str) -> list:
    try:
        prompt_template = PromptTemplate(
            input_variables=["text"],
            template="Generate three comprehension or reasoning-based questions based on the following document. Questions should test understanding or logical inference.\n\nDocument:\n{text}\n\nQuestions (return as a numbered list):"
        )
        prompt = prompt_template.format(text=document[:10000])  # Limit input size
        response = llm.invoke(prompt)
        questions = response.content.strip().split("\n")
        return [q.strip() for q in questions if q.strip()][:3]
    except Exception as e:
        return [f"Error generating questions: {str(e)}"]