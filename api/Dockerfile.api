FROM python:3

WORKDIR /app

COPY /requirements.txt /app

RUN pip install -r requirements.txt

COPY ["api.py", "/app"]

EXPOSE 5001

ENTRYPOINT [ "python3" ]

CMD ["api.py"]