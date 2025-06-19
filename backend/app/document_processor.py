from PyPDF2 import PdfReader
from io import BytesIO
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import PromptTemplate
import os
from dotenv import load_dotenv

load_dotenv()
try:
    llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", google_api_key=os.getenv("GOOGLE_API_KEY"))
except Exception as e:
    raise Exception(f"Failed to initialize Gemini API: {str(e)}")

def process_document(content: bytes, filename: str) -> str:
    try:
        if filename.endswith(".pdf"):
            pdf = PdfReader(BytesIO(content))
            text = ""
            for page in pdf.pages:
                extracted = page.extract_text()
                if extracted:
                    text += extracted + "\n"
            return text
        elif filename.endswith(".txt"):
            return content.decode("utf-8")
        return ""
    except Exception as e:
        raise Exception(f"Error processing document: {str(e)}")

def generate_summary(document_text: str) -> str:
    try:
        prompt_template = PromptTemplate(
            input_variables=["text"],
            template="Summarize the following document in 150 words or less:\n\n{text}"
        )
        prompt = prompt_template.format(text=document_text[:10000])  # Limit input size
        response = llm.invoke(prompt)
        summary = response.content.strip()
        if len(summary.split()) > 150:
            summary = " ".join(summary.split()[:150])
        return summary
    except Exception as e:
        return f"Error generating summary: {str(e)}"