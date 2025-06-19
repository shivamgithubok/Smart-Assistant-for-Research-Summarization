# Smart Assistant for Research Summarization

A smart assistant designed to help researchers upload documents, get concise summaries, ask intelligent questions, and test their understanding via challenge-based questions—all powered by Google Gemini and FAISS.

---

# 📁 Project Structure: Smart Assistant for Research Summarization

smart-assistant/
│
├── backend/
│ ├── app/
│ │ ├── init.py
│ │ ├── main.py # FastAPI app with API endpoints
│ │ ├── document_processor.py # Handles PDF/TXT extraction and summarization
│ │ ├── question_answerer.py # Handles question answering and justification
│ │ ├── question_generator.py # Generates logic-based questions
│ │ ├── answer_evaluator.py # Evaluates user answers in Challenge Me mode
│ │ └── models/
│ │ ├── init.py
│ │ ├── document.py # Data models for documents and responses
│ │ └── context.py # Manages conversation context (for memory)
│ ├── requirements.txt # Python dependencies
│ └── .env # Environment variables (e.g., API keys)
│
├── frontend/
│ ├── public/
│ │ ├── index.html # Main HTML file
│ │ └── favicon.ico
│ ├── src/
│ │ ├── components/
│ │ │ ├── FileUpload.js # Component for document upload
│ │ │ ├── SummaryDisplay.js # Displays document summary
│ │ │ ├── AskAnything.js # Interface for free-form questions
│ │ │ ├── ChallengeMe.js # Interface for challenge mode
│ │ │ └── HistoryDisplay.js # Displays highlighted document snippets
│ │ ├── App.js # Main React app
│ │ ├── App.css # Tailwind CSS imports
│ │ ├── index.js # React entry point
│ │ └── axios.js # Axios setup for API calls
│ ├── package.json # Node dependencies
│ └── tailwind.config.js # Tailwind CSS configuration
│
├── README.md # Project documentation
├── .gitignore # Git ignore file

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
Create and activate a virtual environment:

bash
Copy
Edit
python -m venv venv_name
.\venv_name\Scripts\activate   # On Windows
Install the required dependencies:

bash
Copy
Edit
pip install -r requirements.txt
Create a .env file inside the backend folder and add your Google API key:

ini
Copy
Edit
GOOGLE_API_KEY=your_api_key_here
🌐 Frontend Setup
Navigate to the frontend directory:

bash
Copy
Edit
cd frontend
Install dependencies using npm:

bash
Copy
Edit
npm install
▶️ Running the Project
🚀 Start the Backend
bash
Copy
Edit
python -m app.main
This runs the FastAPI backend at http://localhost:8000.

💻 Start the Frontend
bash
Copy
Edit
npm start
This runs the React frontend at http://localhost:3000 or http://localhost:5000, depending on configuration.

🎯 Accuracy Feature
In Challenge Me mode, the app presents three logic-based questions based on the uploaded document. Your answers will be evaluated, and justifications will be shown alongside the response—helping users assess their understanding of the content.

🤖 Q&A Chatbot
You can ask any question about the uploaded research paper. Just type the question in the input field, and the AI will respond with an answer and a justification. Everything happens in the same interactive chat area.

🔄 Data Flow Description
The project is divided into two major parts:

Frontend: React-based Single Page Application (SPA)

Backend: FastAPI-based document processor and QA system using Gemini and FAISS

📥 User Interaction (Frontend)
Users visit the app at http://localhost:3000.

App.js starts in upload mode, showing the FileUpload.js component.

Users upload a PDF/TXT file.

📤 File Upload Request (Frontend → Backend)
FileUpload.js sends a POST request to http://localhost:8000/upload with the file using axios.

The backend processes the file and returns:

json
Copy
Edit
{
  "text": "original_document_text",
  "summary": "generated_summary"
}
App.js updates state and switches to summary view.

🧠 Document Processing (Backend)
main.py receives the file via /upload.

document_processor.py extracts text and generates summary.

Summary and document text are stored in memory via ContextManager.

📰 Summary Display (Frontend)
App.js renders SummaryDisplay.js.

User can switch to:

'ask' → renders AskAnything.js

'challenge' → renders ChallengeMe.js

❓ Question Submission (Frontend → Backend)
AskAnything.js sends a POST request to /ask with:

json
Copy
Edit
{ "question": "your_question_here" }
💡 Question Answering (Backend)
main.py verifies the document is present.

Calls answer_question() from question_answerer.py.

question_answerer.py Details:
Splits document into chunks.

Builds FAISS index with HuggingFaceEmbeddings (all-MiniLM-L6-v2).

Retrieves relevant chunks via similarity search.

Constructs prompt using:

User's question

Retrieved context

Conversation history

Uses Gemini (gemini-1.5-flash) to generate an answer.

Extracts justification from top result.

Stores interaction in ContextManager.

Returns:

json
Copy
Edit
{
  "question": "original_question",
  "answer": "generated_answer",
  "justification": "why_this_answer"
}
📬 Response Display (Frontend)
AskAnything.js updates the response in state.

The question, answer, and justification are rendered.

History is updated via addToHistory().

🎮 Challenge Questions (Optional)
ChallengeMe.js sends a GET request to /challenge.

main.py uses generate_challenge_questions() to return a set of logic questions.

User answers are POSTed to /evaluate.

evaluate_answer() processes answers and sends feedback.

🔌 External Integrations
Google Gemini API via langchain-google-genai

FAISS for semantic search

HuggingFace embeddings (all-MiniLM-L6-v2) for document chunk vectorization