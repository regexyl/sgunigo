FROM python:3-slim
WORKDIR /usr/src/app
COPY ./http.reqs.txt ./
RUN pip install --no-cache-dir -r http.reqs.txt
COPY ./application/admin_view/admin_view.py .
CMD [ "python", "./admin_view.py" ]
