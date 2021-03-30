FROM python:3-slim
WORKDIR /usr/src/app
COPY http.reqs.txt ./
RUN pip install --no-cache-dir -r http.reqs.txt
COPY ./admin_portal_application.py .
CMD [ "python", "./admin_portal_application.py" ]
