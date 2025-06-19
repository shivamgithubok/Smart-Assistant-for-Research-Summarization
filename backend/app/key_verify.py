from langchain_google_genai import ChatGoogleGenerativeAI

llm = ChatGoogleGenerativeAI(
    model="gemini-1.5-flash",  # or "gemini-1.5-pro" if available for your key
    api_key="you - key - here "
)

print(llm.invoke("Test").content)
