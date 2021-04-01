FROM python:3-slim
WORKDIR /usr/src/app
COPY ./http.reqs.txt ./
RUN pip install --no-cache-dir -r http.reqs.txt
COPY ./admin_cost/admin_cost.py .
CMD [ "python", "./admin_cost.py" ]
