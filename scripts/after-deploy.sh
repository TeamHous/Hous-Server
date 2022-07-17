#!/bin/bash
REPOSITORY=/home/ubuntu/server

cd $REPOSITORY

sudo /usr/bin/yarn

sudo /usr/bin/pm2 start dist