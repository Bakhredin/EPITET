from dotenv import load_dotenv
from fastapi import FastAPI
from httpx import AsyncClient
from pydantic import BaseModel
import openai
import uvicorn
import os
from fastapi.middleware.cors import CORSMiddleware
import re

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
    mode: bool


@app.post("/message")
async def process_message(request: MessageRequest):
    prompt = request.message.split()[0]
    print(prompt)
    if prompt == "Бахредин":
        prompt = "тупой"
        print("О, Бахрединтупой")

    openai_messages = [
        {
            "role": "user",
            "content": f"Напиши 10 разных эпитетов к '{prompt}' следуя инструкции. Эпитеты не должны повторяться. Слова не должны повторяться! Пиши на русском. Ты учитель русской литературы, у которого обширный словарный запас. Ничего лишнего, кроме эпитетов.Не пиши '{prompt}'. Не пиши слово, к которому ищешь эпитет. Эпитеты должны состоять из одного слова, строго из одного.",
        },
    ]

    response = openai.ChatCompletion.create(
        model=openai_model, messages=openai_messages, temperature=0.7
    )

    assistant_messages = response["choices"][0]["message"]["content"].split("\n")
    assistant_messages = [
        msg.split(" ", 1)[1].strip() for msg in assistant_messages if msg.strip()
    ]
    epithets = []
    for msg in assistant_messages:
        words = msg.split()

        # Удалить запятые, если они есть
        words = [word.replace(",", "") for word in words]

        epithets.extend(words)

    return {"epithets": epithets}


@app.post("/generate")
async def generate_sentences(request: GenerateRequest):
    prompt = request.prompt
    epitet = request.epitet
    mode = request.mode

    if mode:
        openai_messages = [
            {
                "role": "system",
                "content": f"Сделай одно обычное предложение со словами '{prompt}' и '{epitet}' на русском языке, пиши грамотно, и не забывай про мужские и женские рода, и склонения. И исправь грамматические и стиллистические ошибки.",
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
        openai_messages = [
            {
                "role": "system",
                "content": f"Сделай одно издевательское смешное предложение со словами '{prompt}' и '{epitet}' на русском языке. И исправь грамматические и стиллистические ошибки.",
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
    sentences = assistant_message.split("\n")
    sentences = [sentence.strip() for sentence in sentences if sentence.strip()]
    return {"sentences": sentences}


@app.post("/joke")
async def generate_joke(request: GenerateRequest):
    request.mode = False
    return await generate_sentences(request)


@app.get("/")
async def root():
    return {"message": "Welcome to the Chat API!"}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
