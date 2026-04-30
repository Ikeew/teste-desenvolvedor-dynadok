import os
import json
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, SystemMessage


class LLMService:
    def __init__(self):
        hf_token = os.getenv("HF_TOKEN")

        if not hf_token:
            raise ValueError("HF_TOKEN não configurado nas variáveis de ambiente")

        self.llm = ChatOpenAI(
            model="Qwen/Qwen2.5-72B-Instruct",
            temperature=0.5,
            top_p=0.7,
            api_key=hf_token,
            base_url="https://router.huggingface.co/v1",
        )

    def summarize_text(self, text: str, lang: str) -> dict:
        system_prompt = self.get_base_prompt(lang)

        messages = [
            SystemMessage(content=system_prompt),
            HumanMessage(content=text),
        ]

        response = self.llm.invoke(messages)

        content = response.content

        try:
            return json.loads(content)
        except json.JSONDecodeError:
            return {"summary": content}

    def get_base_prompt(self, lang: str) -> str:
        prompts = {
            "pt": (
                "Você é um assistente que resume textos em português. "
                "Resuma o texto de forma clara e concisa. "
                "Retorne apenas um JSON válido no formato: "
                '{"summary": "resumo aqui"}'
            ),
            "es": (
                "Eres un asistente que resume textos en español. "
                "Resume el texto de forma clara y concisa. "
                "Devuelve solo un JSON válido en el formato: "
                '{"summary": "resumen aquí"}'
            ),
            "en": (
                "You are an assistant that summarizes texts in English. "
                "Summarize the text clearly and concisely. "
                "Return only valid JSON in this format: "
                '{"summary": "summary here"}'
            ),
        }

        return prompts[lang]