from dotenv import load_dotenv
from fastapi import FastAPI
from httpx import AsyncClient
from pydantic import BaseModel
import openai
import uvicorn
import os
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)
openai.api_key = os.getenv("OPENAI")
openai_model = "gpt-3.5-turbo"


class MessageRequest(BaseModel):
    message: str


class GenerateRequest(BaseModel):
    prompt: str
    epitet: str


@app.post("/message")
async def process_message(request: MessageRequest):
    prompt = request.message.split()[0]
    print(prompt)
    if prompt == "Жанторе":
        prompt = "Лох"
        print("О, тупой")

    openai_messages = [
        {
            "role": "user",
            "content": f"Напиши 10 разных эпитетов к '{prompt}' следуя инструкциям. Пиши на русском. Ты учитель русской литературы. Ничего лишнего, кроме эпитетов. Никаких цифр, и запятых. Не пиши слов, к которому ищешь эпитет. Ищи эпитет, состоящий из одного, или максимум двух слов, но только если эпитет крутой",
        },
    ]

    response = openai.ChatCompletion.create(
        model=openai_model, messages=openai_messages, temperature=0.7
    )
    assistant_messages = response["choices"][0]["message"]["content"].split("\n")
    assistant_messages = [
        msg.split(" ", 1)[1].strip() for msg in assistant_messages if msg.strip()
    ]

    return {"messages": assistant_messages}


@app.post("/generate")
async def generate_sentences(request: GenerateRequest):
    prompt = request.prompt
    epitet = request.epitet

    if prompt == "Жанторе":
        print("Ща будет мясо")
        openai_messages = [
            {
                "role": "system",
                "content": f"Сделай 2 издевательских предложения со словами '{prompt}' и '{epitet}' на русском языке",
            },
            {
                "role": "user",
                "content": prompt,
            },
            {
                "role": "assistant",
                "content": epitet,
            },
        ]
    else:
        print(prompt)
        print(epitet)
        openai_messages = [
            {
                "role": "system",
                "content": f"Сделай 2 красивых предложения со словами '{prompt}' и '{epitet}' на русском языке",
            },
            {
                "role": "user",
                "content": prompt,
            },
            {
                "role": "assistant",
                "content": epitet,
            },
        ]

    response = openai.ChatCompletion.create(
        model=openai_model, messages=openai_messages, temperature=0.7
    )

    assistant_message = response.choices[0].message.content.strip()
    print(assistant_message)
    return {"message": assistant_message}


@app.get("/")
async def root():
    return {"message": "Welcome to the Chat API!"}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
