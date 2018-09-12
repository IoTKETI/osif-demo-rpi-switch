#!/bin/sh

docker build -f Dockerfile.rpi -t ciot/iotweek-demo-button:rpi .
docker tag ciot/iotweek-demo-button:rpi dev.synctechno.com:5000/iotweek-ciot-demo-button:rpi

