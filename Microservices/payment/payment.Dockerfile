FROM python:3-slim
WORKDIR /usr/src/app
COPY ./microservices/http.reqs.txt ./
RUN pip install --no-cache-dir -r http.reqs.txt
COPY ./microservices/payment/payment.py ./.env ./
CMD [ "python", "./payment.py" ]
