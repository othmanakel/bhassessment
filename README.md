# Blue Halo Assessment
## _Drone Detection Simulator_

- API/Detector Simulation code: Node.js
- Front-end: VueJS 
- Database: MongoDB

## Features

- Simulation of data transmission from drone detector. Messages are posted to the API every 3 seconds
- API for digesting simulation data and sending data to UI
- UI with table displaying active detections, count of important metrics, and histogram of specific drone RSSI's

## Installation

First open your terminal and run the following command to clone the git repository
```sh
git clone https://github.com/othmanakel/bhassessment.git
```
Then run the following command to navigate to the root folder
```sh
cd bhassessment
```
Then run the following commands to install and start the server
```sh
cd server
npm i
node index.js
```

Then open a new terminal, navigate back to the root folder and run the following commands to install and run the UI application 

```sh
cd client
npm i
npm run dev
```

Verify the deployment by navigating to the following address

```sh
http://localhost:8080
```
If you have any issues or questions, feel free to email me at othmanakel112@gmail.com


**Thanks and looking forward to talking soon!**

