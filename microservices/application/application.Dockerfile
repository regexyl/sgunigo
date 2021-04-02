FROM python:3-slim
WORKDIR /usr/src/app
COPY ./microservices/http.reqs.txt ./
RUN pip install --no-cache-dir -r http.reqs.txt
COPY ./microservices/application/application.py ./.env ./
CMD [ "python", "./application.py" ]
