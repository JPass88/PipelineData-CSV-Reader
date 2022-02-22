//MODEL

/**
 * @author Jordan Passant
 * @description This JS file contains methods used to iteratively parse and
 *              create JS objects.
 * 
 * *For reference: CSV columns: A,B,C,D,E,F,K,M,R, e.g., 0,1,2,3,4,5,10,12,17*
 * 
 * Open Government License - Dataset (acknowledgement):
 * 
 *  [0] Government of Canada, Pipeline Incident Data, 
 *      Canada: Canada Energy Regulator, 2022. [CSV]. 
 *      Available: https://doi.org/10.35002/nb1p-vw48. [Accessed: 2022-01-25].
 */

const csv = require('csv-parser');  //CSV parsing module with built-in conversion methods
const fs  = require('fs');          //LoadsFilesystem module


const csvFile = './pipeline-incidents-comprehensive-data-formed.csv'; //Path to CSV data file

let fsStream;           //Declaration of filesystem streaming object
let csvStream = csv();  //Instantiates a (CSV)-parsable object

let incidents = [];     //Stores 'incident' objects

/** 
    @name        processCSV  
    @description Attempts to create a read-stream using the provided file(path),
                 Attempts to iteratively parse the stream and create objects.
                 Finally, it returns the incident collection as an array.
    @returns     incident array of objects    
*/
function processCSV() {    
   
    try {
        fsStream  = fs.createReadStream(csvFile); //instantiates a stream object
        try {
            parseStream(fsStream); 
        }
        catch(e){
            console.log("OH, NO!\n" + e);
        }
    }
    catch(e){
        console.log("OH, NO!\n" + e);
    }
    finally {        
        return incidents;
    }
}

/**
    @name       parseStream
    @param      stream : a CSV stream object
    @description Using a CSV parsing package and a read stream, parses
                each CSV row (split with a specified delimeter) and 
                creates an 'incident' record object.
                Stream data is piped to then be manipulated/stored.
*/
function parseStream(stream) {
    
    let count    = 0;
    let maxLines = 4; //Specifies the number of rows to process

    stream.pipe( csv( {separator:'|'})) //separater == column delimeter
        .on('data', (record) => { //'record' is the JSON object converted via headers+columns
            if( count >= maxLines) { //If count reaches no. of lines to stop at, begin teardown:
                stream.unpipe( csvStream); 
                csvStream.end();
                stream.destroy();                 
            } else {                
                createRecordObject(record); //Creates a record object from a JSON object (e.g., record)              
                count++;
            }
        });
}

/**
    @name        createRecordObject
    @description Creates record objects based on specified object parameters 
                 & adds to the 'incidents' array
    @param       record - a JSON object piped from the readStream
*/
function createRecordObject(record) {
    //Custom 'incident' object mapped from columns: A-F,K,M,R of CSV file
    const incident = {  
        incidentNumber:         record['Incident Number'], //A
        incidentType:           record['Incident Types'],        
        reportedDate:           record['Reported Date'],        
        nearestPopulatedCentre: record['Nearest Populated Centre'],        
        province:               record.Province,
        company:                record.Company, //F
        substance:              record.Substance, //K
        significant:            record.Significant, //M
        whatHappenedCategory:   record['What happened category'] //R        
    };
    incidents.push(incident); //Adds incident object to 'incidents' object array
}

//Allows the following functions to be used in other JS files
exports.processCSV = processCSV; 