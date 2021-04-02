FROM python:3-slim
WORKDIR /usr/src/app
COPY ./microservices/amqp.reqs.txt ./
RUN pip install --no-cache-dir -r amqp.reqs.txt
COPY ./microservices/error/error.py ./microservices/amqp_setup.py ./.env ./
CMD [ "python", "./error.py" ]