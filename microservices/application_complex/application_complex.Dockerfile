FROM python:3-slim
WORKDIR /usr/src/app
COPY ./microservices/http.reqs.txt ./microservices/amqp.reqs.txt ./
RUN pip install --no-cache-dir -r http.reqs.txt -r amqp.reqs.txt
COPY ./microservices/application_complex/application_complex.py ./microservices/application_complex/invokes.py ./microservices/amqp_setup.py ./.env ./
CMD [ "python", "./application_complex.py" ]
