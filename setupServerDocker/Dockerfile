FROM python:3
ADD test.py /
ADD fishingtest-8c959-firebase-adminsdk-4uunj-fa9c0e110a.json /
RUN ln -sf /usr/share/zoneinfo/Australia/Melbourne /etc/localtime
RUN echo 'Australia/Melbourne' >/etc/timezone
RUN pip install firebase-admin

CMD ["python3","-u","test.py"]