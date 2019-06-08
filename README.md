# Fish-Competition-Back-end-Server

There are four Ansible folders are needed to execute the corresponded once in each folder. Table T1 shows the corresponded command and running order. In addition, after created the cloud server by ‘nectartest’, the IP address of the cloud server is needed to replace the ‘hosts’ file in ‘setupServerEnv’ folder.

Table 1 – Ansible commands and running order /n
Sequence,	Ansible Folder,	Command#1,	Command#2
#1,	nectartest,	'. ./run-nectar.sh'	
#2,	setupServerEnv,	'. ./run-serverevn.sh'
#3,	setupServerDocker,	'docker build -t kirsi/fishing_app_server .',	'docker push kirsi/fishing_app_server:latest'
#4,	setupWebDocker,	'docker build -t kirsi/fishing_app_web .',	'docker push kirsi/fishing_app_web:latest'

The Ansible jobs are including 
●	nectartest: set up the cloud server with IP address on NeCTaR, 
●	setupServerEnv: set up the cloud server environment which contains the Docker installation,
●	setupServerDocker: build the Docker Image of the Back-end Server service by Dockerfile, and push to the Docker repository. (The Server Script: test.py is created by Python3)
●	setupWebDocker: build the Docker Image of the Web service by Dockerfile, and push to the Docker repository. (The Web stuff is copied from Web Repository: https://github.com/xuqinzju/FishingWeb)

