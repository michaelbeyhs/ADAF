/* 
    ADAF - Automatic DMV Appointment Finder!
    Node script based on zombie to automagically find an appointment at the beloved DMV
    
    Apointments at the DMV become available sporadically. I believe this is due to people canceling or not 
    confirming their apointments. Those apointment are really hard to get. This script will periodically check the DMVs specified 
    for appointments up to a certain date. If an apointment is found within the time frame a text-message is sent
    using Twilio.

    This works for the California DMV site at the time of writing (05.04.2017)


    Copyright: None, use for whatever you want!

    -- Michael Beyhs --
*/

///////////////// Includes /////////////////
var twilio = require('twilio');
var Browser = require("zombie");
////////////////////////////////////////////


///////////////// TWEAK THESE VARIABLES FOR YOUR SEARCH /////////////////
client = new twilio.RestClient('YOUR ACCOUNT SID', 'YOUR AUTH TOKEN'); // enter Twilio credentials here
dmvUrl    = "https://www.dmv.ca.gov/wasapp/foa/clear.do?goTo=officeVisit&localeName=en" // URL for general appointments
intervalMinutes = 5                         // interval in Minutes at which availability is checked
textMsgReceiver = "+11234567890"            // YOUR phone number. This is where the text message will be sent when an appointment is found
textMsgSender   = "+11234567890"            // Sender number of the text message. You will need to get this from Twilio


firstName = "testFistName"                  // real name not needed 
lastName  = "testLastName"                  // real name not needed 
tel       = ["123","321","3456"]            // real phone not needed
dateLimit = new Date("April, 30, 2017")     // set the date limit here. You will be notified if an appointment is 
                                            // available before this date
// comment out the right one
taskID      = "taskDLO"                       // New original Drivers licnese                
//task      = "taskDL"                      // Replacemennt/Renewal ToDo: this requires an additional field to be filled
//task      = "taskDLN"                     // Apply for Califormia DL but already have one from other state
//task      = "taskRWT"                     // Return to take written test
//task      = "taskVR"                      // Register vehicle

locations    = [                            // state: 05.04.2017 - uncomment which offices you want checked
//                 ['633','TEST-ONLY'],     
//                 ["587","ARLETA"],
//                 ["661","ARVIN"],
//                 ["570","AUBURN"],
//                 ["529","BAKERSFIELD"],
//                 ["679","BAKERSFIELD SW"],
//                 ["641","BANNING"],
//                 ["582","BARSTOW"],
//                 ["576","BELL GARDENS"],
//                 ["606","BELLFLOWER"],
//                 ["585","BISHOP"],
//                 ["528","BLYTHE"],
//                 ["597","BRAWLEY"],
//                 ["550","CAPITOLA"],
//                 ["625","CARMICHAEL"],
//                 ["520","CHICO"],
//                 ["613","CHULA VISTA"],
//                 ["580","CLOVIS"],
//                 ["603","COALINGA"],
//                 ["564","COLUSA"],
//                 ["581","COMPTON"],
//                 ["523","CONCORD"],
//                 ["534","CORTE MADERA"],
//                 ["628","COSTA MESA"],
//                 ["524","CRESCENT CITY"],
//                 ["514","CULVER CITY"],
//                 ["599","DALY CITY"],
//                 ["598","DAVIS"],
//                 ["615","DELANO"],
//                 ["669","EL CAJON"],
//                 ["527","EL CENTRO"],
//                 ["556","EL CERRITO"],
//                 ["685","EL MONTE"],
//                 ["526","EUREKA"],
//                 ["621","FAIRFIELD"],
//                 ["643","FALL RIVER MILLS"],
//                 ["655","FOLSOM"],
//                 ["657","FONTANA"],
//                 ["590","FORT BRAGG"],
//                 ["644","FREMONT"],
//                 ["505","FRESNO"],
//                 ["646","FRESNO NORTH"],
//                 ["607","FULLERTON"],
//                 ["627","GARBERVILLE"],
//                 ["498","GARDENA CDTC"],
//                 ["623","GILROY"],
//                 ["510","GLENDALE"],
//                 ["670","GOLETA"],
//                 ["541","GRASS VALLEY"],
//                 ["565","HANFORD"],
//                 ["609","HAWTHORNE"],
//                 ["579","HAYWARD"],
//                 ["635","HEMET"],
//                 ["546","HOLLISTER"],
//                 ["508","HOLLYWOOD"],
//                 ["652","HOLLYWOOD WEST"],
//                 ["578","INDIO"],
//                 ["610","INGLEWOOD"],
//                 ["521","JACKSON"],
//                 ["647","KING CITY"],
//                 ["605","LAGUNA HILLS"],
//                 ["687","LAKE ISABELLA"],
//                 ["530","LAKEPORT"],
//                 ["595","LANCASTER"],
//                 ["617","LINCOLN PARK"],
//                 ["622","LODI"],
//                 ["589","LOMPOC"],
//                 ["692","LOMPOC DLPC"],
//                 ["507","LONG BEACH"],
//                 ["502","LOS ANGELES"],
//                 ["693","LOS ANGELES DLPC"],
//                 ["650","LOS BANOS"],
//                 ["640","LOS GATOS"],
//                 ["533","MADERA"],
//                 ["658","MANTECA"],
//                 ["566","MARIPOSA"],
//                 ["536","MERCED"],
//                 ["557","MODESTO"],
//                 ["511","MONTEBELLO"],
//                 ["639","MOUNT SHASTA"],
//                 ["540","NAPA"],
//                 ["584","NEEDLES"],
//                 ["662","NEWHALL"],
//                 ["586","NORCO"],
//                 ["686","NOVATO"],
//                 ["504","OAKLAND CLAREMONT"],
//                 ["604","OAKLAND COLISEUM"],
//                 ["596","OCEANSIDE"],
//                 ["522","OROVILLE"],
//                 ["636","OXNARD"],
//                 ["683","PALM DESERT"],
//                 ["659","PALM SPRINGS"],
//                 ["601","PARADISE"],
//                 ["509","PASADENA"],
//                 ["574","PASO ROBLES"],
//                 ["634","PETALUMA"],
//                 ["592","PITTSBURG"],
//                 ["525","PLACERVILLE"],
//                 ["631","PLEASANTON"],
//                 ["532","POMONA"],
//                 ["573","PORTERVILLE"],
//                 ["676","POWAY"],
//                 ["544","QUINCY"],
//                 ["612","RANCHO CUCAMONGA"],
//                 ["558","RED BLUFF"],
//                 ["551","REDDING"],
//                 ["626","REDLANDS"],
                 ["548","REDWOOD CITY"],
//                 ["633","REEDLEY"],
//                 ["577","RIDGECREST"],
//                 ["545","RIVERSIDE"],
//                 ["656","RIVERSIDE EAST"],
//                 ["673","ROCKLIN"],
//                 ["543","ROSEVILLE"],
//                 ["501","SACRAMENTO"],
//                 ["602","SACRAMENTO SOUTH"],
//                 ["539","SALINAS"],
//                 ["568","SAN ANDREAS"],
//                 ["512","SAN BERNARDINO"],
//                 ["648","SAN CLEMENTE"],
//                 ["506","SAN DIEGO"],
//                 ["519","SAN DIEGO CLAIREMONT"],
                 ["503","SAN FRANCISCO"],
                 ["516","SAN JOSE"],
                 ["645","SAN JOSE DLPC"],
//                 ["547","SAN LUIS OBISPO"],
//                 ["689","SAN MARCOS RANCHEROS"],
                 ["593","SAN MATEO"],
//                 ["619","SAN PEDRO"],
//                 ["677","SAN YSIDRO"],
//                 ["542","SANTA ANA"],
//                 ["549","SANTA BARBARA"],
                 ["632","SANTA CLARA"],
//                 ["563","SANTA MARIA"],
//                 ["616","SANTA MONICA"],
//                 ["630","SANTA PAULA"],
//                 ["555","SANTA ROSA"],
//                 ["668","SANTA TERESA"],
//                 ["567","SEASIDE"],
//                 ["660","SHAFTER"],
//                 ["680","SIMI VALLEY"],
//                 ["569","SONORA"],
//                 ["538","SOUTH LAKE TAHOE"],
//                 ["698","STANTON DLPC"],
//                 ["517","STOCKTON"],
//                 ["531","SUSANVILLE"],
//                 ["575","TAFT"],
//                 ["672","TEMECULA"],
//                 ["663","THOUSAND OAKS"],
//                 ["608","TORRANCE"],
//                 ["642","TRACY"],
//                 ["513","TRUCKEE"],
//                 ["594","TULARE"],
//                 ["553","TULELAKE"],
//                 ["649","TURLOCK"],
//                 ["638","TWENTYNINE PALMS"],
//                 ["535","UKIAH"],
//                 ["588","VACAVILLE"],
//                 ["554","VALLEJO"],
//                 ["515","VAN NUYS"],
//                 ["560","VENTURA"],
//                 ["629","VICTORVILLE"],
//                 ["559","VISALIA"],
//                 ["624","WALNUT CREEK"],
//                 ["583","WATSONVILLE"],
//                 ["572","WEAVERVILLE"],
//                 ["618","WEST COVINA"],
//                 ["611","WESTMINSTER"],
//                 ["591","WHITTIER"],
//                 ["571","WILLOWS"],
//                 ["637","WINNETKA"],
//                 ["561","WOODLAND"],
//                 ["552","YREKA"],
//                 ["562","YUBA CITY"],
]
startIndex = -1    // start at -1 since we increment before the first call
dateLimitString = dateLimit.toISOString().replace(/T/, ' ').replace(/\..+/, '') // prettier string for printing
////////////////////////////////////////////////////////////////////


///////////////// MAIN /////////////////
// Start the search!
kickOff(startIndex)
////////////////////////////////////////////////////////////////////


///////////////// Functions /////////////////

// calling this kicks off the loop. It also acts as callback when one location has been handled 
function kickOff(locationIndex){
    locationIndex++
    if(locationIndex == 0){
        console.log("Searching for Appointments until " + dateLimitString)  // print header on first run of loop
    }
    if(locationIndex < locations.length){
        checkForAppointment(locationIndex,kickOff)                          // check this location
    } else {                                                                // checked all of them, run again in x minutes
        startIndex = -1
        console.log("============= Checking again in " + intervalMinutes + " Minutes =============")
        setTimeout(kickOff, intervalMinutes * 60 * 1000, startIndex);
        //process.exit()
    }
}

// This function starts the zombie browser, goes to the website, fills out the form and submits it
// The returned site is then parsed and if and apointment id available a text message is sent.
function checkForAppointment(locIndex, callback)
{
    browser = new Browser({waitDuration: 30*1000}); // 30 second timeout
    location = locations[locIndex]
    console.log("")
    console.log("-----------------" + location[1] + "-----------------");
    console.log("")
    browser.visit(dmvUrl,{ debug: true }, function(err, browser2, status) {

        //console.log("err.message: " + err.message)
        // I found that these two Errors can happen when there's connectivity issues
        if(err.message.includes("ENOTFOUND") || err.message.includes("Timeout")){ 
            console.log("ERROR occured getting the site! Skipping...")
            console.log(err.message)
            callback(locIndex)
            return
        }

        //console.log(browser.text("title"));
        browser.select("officeId",location[0]);     // fill out location ID
        browser.check(taskID)                    
        browser.choose("numberItems","1")
        browser.fill("firstName",firstName)
        browser.fill("lastName",lastName)

        browser.fill("telArea",tel[0])
        browser.fill("telPrefix",tel[1])
        browser.fill("telSuffix",tel[2])
        browser.pressButton("Submit", function(err) {

            var alerts = browser.querySelectorAll('.alert '); // The DMV is nice enough to tag all the results as class 'alert'
            results = [];
            // make an array of all the results
            for (var i = 0; i < alerts.length; i++) {
                results.push(alerts[i].textContent);
            }
            
            // I've seen two different messages if no appointment is available
            if(results[0].indexOf("Sorry") > -1 || results[0].indexOf("not available") > -1 ) {
                console.log("Nothing available in " + location[1])
                console.log(results[0])
                callback(locIndex)
            } else {                                // We get here when there is an appointment
                availableDateStr = results[1]       // the next result is the actual Date string
                availableDateStr = availableDateStr.replace(/\t/g, "")  // some fomating 
                availableDate = new Date(availableDateStr.split("at"))

                console.log("Appointment available in " + location[1] + " at:")
                console.log(availableDateStr)
                
                if(availableDate < dateLimit){       // If the apointment is within our limit 
                    console.log("Wohooo! It's before " + dateLimitString)
                    // sned the Test-Message
                    sendText("DMV Apointment avialable in " + availableDateStr + " at\r\n" + results[1], locIndex, callback)
                    //callback(locIndex)
                } else {
                    console.log("Ugh! that's far too out :/")
                    callback(locIndex)
                }
            }
        });
    });
}

// Sent message via Twilio
function sendText(message, locIndex, callback){
    //console.log("sending SMS:\r\n" + message)
    client.sms.messages.create({
        to:textMsgReceiver,
        from:textMsgSender,
        body:message
    }, function(error, message) {
    if (!error) {
        //console.log('Success! The SID for this SMS message is:');
        //console.log(message.sid);
        console.log('Message sent on:');
        console.log(message.dateCreated);
    } else {
        console.log('Oops! There was an error.');
        console.log(error)
    }
    callback(locIndex)
});
}
////////////////////////////////////////////////////////////////////

// Done, nothing else is here...
