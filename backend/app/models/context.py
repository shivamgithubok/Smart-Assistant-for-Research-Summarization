from typing import List, Tuple

class ContextManager:
    def __init__(self):
        self.document: str = ""
        self.history: List[Tuple[str, str]] = []

    def set_document(self, document: str):
        self.document = document
        self.history = []  # Reset history on new document

    def add_interaction(self, question: str, answer: str):
        self.history.append((question, answer))

    def get_history(self) -> List[Tuple[str, str]]:
        return self.history