from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import PromptTemplate
from sentence_transformers import SentenceTransformer, util
import os
from dotenv import load_dotenv

load_dotenv()
try:
    llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", google_api_key=os.getenv("GOOGLE_API_KEY"))
    model = SentenceTransformer("all-MiniLM-L6-v2")
except Exception as e:
    raise Exception(f"Failed to initialize models: {str(e)}")

def evaluate_answer(question: str, user_answer: str, document: str) -> tuple:
    try:
        prompt_template = PromptTemplate(
            input_variables=["question", "document"],
            template="Answer the following question based on the document:\n\nDocument:\n{document}\n\nQuestion: {question}\n\nAnswer:"
        )
        prompt = prompt_template.format(question=question, document=document[:10000])
        reference_answer = llm.invoke(prompt).content.strip()
        
        embeddings = model.encode([user_answer, reference_answer], convert_to_tensor=True)
        similarity = util.cos_sim(embeddings[0], embeddings[1]).item()
        
        evaluation = "Correct" if similarity > 0.7 else "Incorrect"
        justification = f"Similarity score: {similarity:.2f}. Reference answer: {reference_answer[:100]}..."
        return evaluation, justification
    except Exception as e:
        return "Error evaluating answer", f"Error: {str(e)}"