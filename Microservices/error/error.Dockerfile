FROM python:3-slim
WORKDIR /usr/src/app
COPY ./amqp.reqs.txt ./
RUN pip install --no-cache-dir -r amqp.reqs.txt
COPY ./error/error.py ./amqp_setup.py ./
CMD [ "python", "./error.py" ]