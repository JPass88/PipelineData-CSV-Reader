//CONTROLLER

/** 
 *  @author      Jordan Passant
 *  @description This JS file contains Express routing and the entry point
 *               for the application. CSV conversion is initiated, JSON-
 *               converted CSV data is sent to an end-point for later
 *               grabbing
 *          
 *  To start:    launch 'Git Bash', 
 *               navigate to parent folder, 
 *               enter: <npm run start>
 * 
 *  To view:     in browser navigate to: 
 *               file:///C:/Users/jorda/Desktop/2022-Winter/8333-PLRP/Phase1/Assignment1/server/index.html
 * */ 


/* Module Imports/Instantiation: */

const PORT = 8080; //Port no. configuration
const app = require('express')(); //Loads express modules, methods
//app.set('view engine', 'ejs');
const processCSV = require('./process-printCSV.js'); //Allows usage of exported method(s)
const cors = require('cors'); //Allows cross-page resource sharing
app.use(cors()); //Used to overcome CORS (cross origin..) policy errors

/* Runs processes for parsing CSV file, returning an array of objects */
let data = processCSV.processCSV();

//Root route
//file:///C:/Users/jorda/Desktop/2022-Winter/8333-PLRP/Phase1/Assignment1/server/index.html
//  If wanted to serve at localhost:8080/ -- build a string and res.send(String);
//  Express only serves static (NO embedded JS)
app.get('/', function(req, res) {      
    res.sendFile('index.html');                                  
});

//'Data' path - stores JSON data. 
//  Retrieved (by appointment only) @ localhost:8080/data
app.get('/data', (req, res) => {   
    res.json(data);
});

//Logs the message to console
app.listen(PORT, () => console.log('server running on port ' + PORT));