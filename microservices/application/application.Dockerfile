FROM python:3-slim
WORKDIR /usr/src/app
COPY ./http.reqs.txt ./
RUN pip install --no-cache-dir -r http.reqs.txt
COPY ./application/application_view/application_view.py .
CMD [ "python", "./application_view.py" ]
