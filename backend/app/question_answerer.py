from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings
from langchain.prompts import PromptTemplate
from langchain_community.vectorstores import FAISS
from app.models.context import ContextManager
import os
from dotenv import load_dotenv

load_dotenv()

try:
    llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", google_api_key=os.getenv("GOOGLE_API_KEY"))
    embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001", google_api_key=os.getenv("GOOGLE_API_KEY"))

except Exception as e:
    raise Exception(f"Failed to initialize models: {str(e)}")

def split_document(text: str, chunk_size: int = 500, chunk_overlap: int = 50) -> list:
    chunks = []
    start = 0
    while start < len(text):
        end = start + chunk_size
        chunks.append(text[start:end])
        start += chunk_size - chunk_overlap
    return chunks

def answer_question(question: str, document: str, context_manager: ContextManager) -> tuple:
    try:
        chunks = split_document(document)
        vector_store = FAISS.from_texts(texts=chunks, embedding=embeddings)
        
        retriever = vector_store.as_retriever(search_kwargs={"k": 2})
        relevant_chunks = retriever.invoke(question)
        context = "\n".join([chunk.page_content for chunk in relevant_chunks])
        
        history = context_manager.get_history()
        history_text = "\n".join([f"Q: {q}\nA: {a}" for q, a in history])
        
        prompt_template = PromptTemplate(
            input_variables=["question", "context", "history"],
            template=(
                "You are a helpful assistant. Using the following document context and the conversation "
                "history, please answer the question. Provide a clear and concise answer, followed by a "
                "brief justification referencing the provided document context.\n\n"
                "## Context from Document:\n{context}\n\n"
                "## Conversation History:\n{history}\n\n"
                "## Question:\n{question}\n\n"
                "## Answer:"
            )
        )
        prompt = prompt_template.format(question=question, context=context, history=history_text)
        
        response = llm.invoke(prompt)
        answer = response.content.strip()
        
        justification = f"This answer is based on the following document content: '{relevant_chunks[0].page_content[:150]}...'"
        
        return answer, justification
        
    except Exception as e:
        print(f"An error occurred: {e}") 
        return "Sorry, I encountered an error while processing your request.", f"Error: {str(e)}"