# Smart Assistant for Research Summarization

A smart assistant designed to help researchers upload documents, get concise summaries, ask intelligent questions, and test their understanding via challenge-based questions—all powered by Google Gemini and FAISS.

---

# 📁 Project Structure: Smart Assistant for Research Summarization

![Smart Assistant Screenshot](structure.png)

---


## 📄 Description

- `backend/`: Contains the FastAPI application and logic for document parsing, summarization, question answering, and challenge-based evaluation.
- `frontend/`: React Single Page Application (SPA) with upload interface, summary viewer, Q&A chat, and challenge mode.

---

## 🧰 Dependencies Setup

### 🔧 Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend

python -m venv venv_name
.\venv_name\Scripts\activate  # Windows


run the requirements.txt file for dependency installment:-
pip install -r requirements.txt

goto client
cd client 
run:--
npm install 


TO run the project :---------------
BACKEND command:--
python -m app.main

client (fortend):--
npm start

Create a .env file store your GOOGLE_API_KEY
GOOGLE_API_KEY=="you api key"

the backend run on localhost:8000
and forntend will run on localhost:5000



Accuracy part :------------
the accuracy will appear on challanging question you answer along with justification.
you will see three question in the caht and then answer from in the same input chat where chat boot of question - answering is happend

The Q&A Cahtboot:--------------
write question in the input sumbit the question and answer will apper in the display you can ask question about the reseach paper you parsed




Data Flow Description::::::-----------------
The project consists of a React frontend (client directory) and a FastAPI backend (backend directory). The frontend allows users to upload documents (PDF/TXT), view summaries, ask questions, and receive answers based on the document content. The backend processes documents, generates summaries, and answers questions using Google’s Gemini model and FAISS for vector search. Here’s the step-by-step data flow:

User Interaction (Frontend):---------------------------
The user interacts with the React app at http://localhost:3000.
In App.js, the initial state is mode: 'upload', rendering FileUpload.js.
The user uploads a PDF or TXT file via the FileUpload component.
File Upload Request (Frontend to Backend):------------------------

FileUpload.js sends a POST request to http://localhost:8000/upload using axios (configured in axios.js with base URL http://localhost:8000).
The request includes the file as a FormData object.
App.js updates its state (document, summary, mode: 'summary') with the response.
Document Processing (Backend):------------------------


In main.py, the /upload endpoint receives the file and validates its format (PDF/TXT).
The process_document function (from document_processor.py) extracts text from the file.
The generate_summary function creates a summary of the extracted text.
The ContextManager stores the document text in memory (context_manager.set_document).
The backend returns a JSON response: { "text": document_text, "summary": summary }.

Summary Display (Frontend):-------------------------
App.js renders SummaryDisplay.js, showing the summary.
Buttons in App.js allow switching to mode: 'ask' (rendering AskAnything.js) or mode: 'challenge' (rendering ChallengeMe.js).



Question Submission (Frontend to Backend):--------------------------
In AskAnything.js, the user enters a question in the input field.
On form submission, AskAnything.js sends a POST request to /ask with a JSON body: { "question": "<user_question>" }.
The AskAnythingRequest model in main.py validates the question (non-empty).




Question Answering (Backend):-------------------
The /ask endpoint in main.py checks if a document is uploaded (context_manager.document).
It calls answer_question from question_answerer.py, passing the question, document text, and ContextManager.




In question_answerer.py:-------------------------
The document is split into chunks (split_document).
A FAISS vector store is created using HuggingFaceEmbeddings (all-MiniLM-L6-v2).
Relevant chunks are retrieved via similarity search (vector_store.similarity_search).
Conversation history is fetched from ContextManager (get_history).
A prompt is constructed using PromptTemplate, combining the question, context, and history.
The ChatGoogleGenerativeAI model (gemini-1.5-flash) generates an answer.
A justification is extracted from the top relevant chunk.
The ContextManager stores the interaction (add_interaction).
The backend returns a JSON response: { "question": "<question>", "answer": "<answer>", "justification": "<justification>" }.



Response Display (Frontend):-----------------
AskAnything.js receives the response and updates its state (response).
The question, answer, and justification are displayed in the UI.
The interaction is added to the history via addToHistory (passed from App.js), which updates App.js’s history state.
HistoryDisplay.js renders the updated history.



Challenge Questions (Optional):------------------
If the user selects "Challenge Me," ChallengeMe.js sends a GET request to /challenge.
The backend’s /challenge endpoint in main.py calls generate_challenge_questions, returning a list of questions.
User answers are sent to /evaluate, processed by evaluate_answer, and returned as a response.
External Services:
The backend uses langchain-google-genai to interact with Google’s Gemini API (requires GOOGLE_API_KEY from .env).
HuggingFaceEmbeddings generates embeddings for FAISS, enabling document chunk retrieval.