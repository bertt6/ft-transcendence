FROM python:3.12.2-bullseye

WORKDIR /app/API

COPY . /app/API

RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 8000
