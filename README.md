# Blue Halo Assessment
## _Drone Detection Simulator_

- API/Detector Simulation code: Node.js
- Front-end: VueJS 
- Database: MongoDB

## Features

- Simulation of data transmission from drone detector. Messages are posted to the API every 3 seconds
- API for digesting simulation data and sending data to UI
- UI with table displaying active detections, count of important metrics, and histogram of specific drone RSSI's
## Tech


- [VueJS] - Since the project required a lot of dynamic changes to data displayed on the UI, I felt it would be best to use a framework rather than stick with classic jQuery. Out of the popular frameworks (react, angular, vue) I've worked with Vue most extensively so decided it was the best option since time was fairly limited. Vue has recieved a lot of updates since I used it last and the quality of life is a lot better now. By default, Vue uses Vite now instead of Webpack which has much quicker build times. Also, it seems they've made lots of changes to make components and Reactives more intuitive to work with. I didn't dabble too much with the new features but I'm interested in going back and exploring them more.   
- [PrimeVue] - I used this to get a somewhat decent-looking UI without taking forever to get there. I am not anywhere close to being a good UI designer so I usually rely on some kind of component/style library to get my pages looking acceptable.  
- [node.js] - I have experience with Spring Boot, ASP.Net, and Node and out of those 3, I think Node is by far the fastest to get a working application off the ground. Another consideration was how easy is to interact with a MongoDB database in Node, especially with the Mongoose library. I also just really enjoy writing Javascript code, so if I have a choice, I'm usually picking Node.
- [MongoDB] - MongoDB is my go-to database when I want to get something off the ground quick. Being able to easily deploy a remote database in a few clicks and define all the schema in the application (using Mongoose for Node) is a really nice pro. That being said, for a bigger, more long-term project I don't think I would choose it. I'm much more comfortable in the world of SQL tables and have never been able to wrap my head fully around all the documents and subdocuments. 
- [pino] - I like pretty logs in my terminal and being able to set log levels so I always try to use some kind of logging library outside of console.log even on a small project. 

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

 ## FAQ
**I see the area where Drone RSSI's are supposed to be but there's no data. What's going on?**
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

You need to click on a drone_id in order for data for that drone to display. It is the green button in the first column of the Active Detections table
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

**I need more logs. How do I get them?**
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

Inside the index.js file, you will find the following code snippet
```sh 
const logger = pino({ 
    level: process.env.LOG_LEVEL || 'warn', 
    transport: { target: 'pino-pretty'}
}) 
```
Either change the static value to `"info"` or set LOG_LEVEL to `"info"` in your enviroment variables. 

If you have any other issues or questions, feel free to email me at othmanakel112@gmail.com


**Thanks and looking forward to talking soon!**

[node.js]: <http://nodejs.org>
[PrimeVue]: <https://primevue.org>
[MongoDB]: <https://www.mongodb.com/>
[pino]: <https://github.com/pinojs/pino>
[VueJS]:<https://vuejs.org/>
   
  
