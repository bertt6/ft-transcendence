FROM python:3.9

WORKDIR /app/Backend

COPY . /app/Backend
RUN pip install --upgrade pip

RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 3000
