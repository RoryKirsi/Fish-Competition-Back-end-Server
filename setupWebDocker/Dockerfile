FROM httpd
ADD FishingWeb /usr/local/apache2/
RUN ln -sf /usr/share/zoneinfo/Australia/Melbourne /etc/localtime
RUN echo 'Australia/Melbourne' >/etc/timezone
