#!/bin/bash

. ./pt-44680-openrc.sh; ANSIBLE_HOST_KEY_CHECKING=False ansible-playbook -i hosts serverevn.yaml