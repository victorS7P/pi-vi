FROM python:3

RUN apt update
RUN apt -y install cron

WORKDIR /app

COPY crontab /etc/cron.d/crontab
RUN chmod 0644 /etc/cron.d/crontab
RUN /usr/bin/crontab /etc/cron.d/crontab

COPY src /app/src
COPY requirements.txt /app/
RUN pip3 install -r /app/requirements.txt

CMD ["cron", "-f"]
