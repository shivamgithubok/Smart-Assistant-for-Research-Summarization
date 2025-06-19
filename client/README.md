Smart Assistant Frontend
This is the frontend for the Smart Assistant for Research Summarization project, built with React and Tailwind CSS. It integrates with a FastAPI backend to upload documents, display summaries, answer questions, and provide challenge questions.
Setup Instructions

Install Node.js:

Ensure Node.js (v14 or higher) is installed.


Install Dependencies:
cd frontend
npm install


Configure Tailwind CSS:

Tailwind is already configured via tailwind.config.js.


Start the Backend:

Ensure the FastAPI backend is running at http://localhost:8000 (see backend README).


Run the Frontend:
npm start


The app will open at http://localhost:3000.



Usage

Upload Document: Upload a PDF or TXT file to generate a summary.
View Summary: The summary (≤150 words) is displayed after upload.
Ask Anything: Enter free-form questions to get answers with justifications.
Challenge Me: Answer three logic-based questions and receive evaluations.
Conversation History: View past interactions for context.

Dependencies

React: Frontend framework.
Axios: API communication.
Tailwind CSS: Styling.

Notes

Ensure the backend is running before starting the frontend.
The app uses a proxy (http://localhost:8000) defined in package.json to avoid CORS issues.

