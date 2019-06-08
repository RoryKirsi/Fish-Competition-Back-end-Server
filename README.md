# Fish-Competition-Back-end-Server

The Cloud Server is running now. http://115.146.86.6/ can see the Web.\

Reproduce User Guide:\
There are four Ansible folders are needed to execute the corresponded once in each folder. Table T1 shows the corresponded command and running order. In addition, after created the cloud server by ‘nectartest’, the IP address of the cloud server is needed to replace the ‘hosts’ file in ‘setupServerEnv’ folder.

Table 1 – Ansible commands and running order\
Sequence,	Ansible Folder,	Command#1,	Command#2\
#1,	nectartest,	'. ./run-nectar.sh'	\
#2,	setupServerEnv,	'. ./run-serverevn.sh'\
#3,	setupServerDocker,	'docker build -t kirsi/fishing_app_server .',	'docker push kirsi/fishing_app_server:latest'\
#4,	setupWebDocker,	'docker build -t kirsi/fishing_app_web .',	'docker push kirsi/fishing_app_web:latest'\

The Ansible jobs are including \
●	nectartest: set up the cloud server with IP address on NeCTaR, \
●	setupServerEnv: set up the cloud server environment which contains the Docker installation,\
●	setupServerDocker: build the Docker Image of the Back-end Server service by Dockerfile, and push to the Docker repository. (The Server Script: test.py is created by Python3)\
●	setupWebDocker: build the Docker Image of the Web service by Dockerfile, and push to the Docker repository. (The Web stuff is copied from Web Repository: https://github.com/xuqinzju/FishingWeb)\

Once the Ansible jobs are finished, Docker and Docker Image are ready. Log in to the Cloud server. To Start the Back-end Server and Web by following command.\
Back-end Server: docker run --name="fishing_app_server" -d kirsi/fishing_app_server \
Web: docker run --name="fishing_app_web" -p 80:80 -d kirsi/fishing_app_web \

Finally, browsing the cloud server IP address on browser, the Web is able to use.
