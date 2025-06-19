from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, validator
from typing import List
from .document_processor import process_document, generate_summary
from .question_answerer import answer_question
from .question_generator import generate_challenge_questions
from .answer_evaluator import evaluate_answer
from .models.context import ContextManager

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage for document and context
context_manager = ContextManager()

class QuestionResponse(BaseModel):
    question: str
    answer: str
    justification: str

class EvaluateRequest(BaseModel):
    question: str
    user_answer: str

class AskAnythingRequest(BaseModel):
    question: str

    @validator('question')
    def not_empty(cls, v):
        if not v or not v.strip():
            raise ValueError('Question must not be empty')
        return v

@app.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    if file.filename.endswith((".pdf", ".txt")):
        content = await file.read()
        document_text = process_document(content, file.filename)
        summary = generate_summary(document_text)
        context_manager.set_document(document_text)
        return {"text": document_text, "summary": summary}
    raise HTTPException(status_code=400, detail="Invalid file format. Use PDF or TXT.")

@app.post("/ask", response_model=QuestionResponse)
async def ask_question(request: AskAnythingRequest):
    if not context_manager.document:
        raise HTTPException(status_code=400, detail="No document uploaded.")
    answer, justification = answer_question(request.question, context_manager.document, context_manager)
    context_manager.add_interaction(request.question, answer)
    return {"question": request.question, "answer": answer, "justification": justification}

@app.get("/challenge", response_model=List[str])
async def get_challenge_questions():
    if not context_manager.document:
        raise HTTPException(status_code=400, detail="No document uploaded.")
    questions = generate_challenge_questions(context_manager.document)
    return questions

@app.post("/evaluate", response_model=QuestionResponse)
async def evaluate_user_answer(request: EvaluateRequest):
    if not context_manager.document:
        raise HTTPException(status_code=400, detail="No document uploaded.")
    evaluation, justification = evaluate_answer(request.question, request.user_answer, context_manager.document)
    return {"question": request.question, "answer": evaluation, "justification": justification}

@app.get("/")
def read_root():
    return {"message": "Smart Research Assistant API is running."}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)