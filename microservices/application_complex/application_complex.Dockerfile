FROM python:3-slim
WORKDIR /usr/src/app
COPY ./http.reqs.txt ./amqp.reqs.txt ./
RUN pip install --no-cache-dir -r http.reqs.txt -r amqp.reqs.txt
COPY ./application_complex/application_complex.py ./application_complex/invokes.py ./amqp_setup.py ./
CMD [ "python", "./application_complex.py" ]
