const express = require('express');
const path = require('path');
const fs = require('fs');




//day and time globals
var today;
var time;


/**
 * Set up express
 */
var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

//Initailize the database
const Database = require('./database');
Database.initDataBase();


/**
 * load the home page
 */
app.get("/", function (req, res) {
    console.log('loading home page');
    res.sendFile(path.join(__dirname + "/public/index.html"));
});

// Send Style, do not change
app.get("/style.css", function (req, res) {
    //Feel free to change the contents of style.css to prettify your Web app
    res.sendFile(path.join(__dirname + "/public/style.css"));
});



/**
 * Endpoint for adding an item
 */
app.post('/addItem', (req, res) => {
    var name = req.body.name;
    var sNum = req.body.sNum;
    var manufacturer = req.body.manufacturer;
    var data;
    today = new Date();
    time = formatTime(today.getHours(), today.getMinutes(), today.getSeconds());
    try {
        var result = Database.addItem(name, manufacturer, sNum);

        if (result == false) {
            data = {
                status: 403,
                time: time
            }
        } else {


            data = {
                name: name,
                manufacturer: manufacturer,
                sNum: sNum,
                time: time,
                status: 200
            };
        }
    } catch (e) {
        data = {
            status: 404,
            time: time
        };
    }
    res.send(data);

});//end endpoint

//edit endpoints


//endpoint to load the editboard
app.get('/editBoard', (req, res) => {
    var data;
    try {
        data = {
            status: 200,
            items: []
        };
        var items = Database.getItemsForEditTable();
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            for (var j = 0; j < item.serialNumbers.length; j++) {
                var subItem = {
                    name: item.name,
                    manufacturer: item.manufacturer,
                    serialNumber: item.serialNumbers[j]
                }
                data.items.push(subItem);
            }

        }

    } catch (e) {
        data = {
            status: 404
        };
    }
    res.send(data);
});


app.post('/editItem', (req, res) => {


    var data;

    //start try
    try {
        var oldName = req.body.oldName;
        var newName = req.body.newName;
        var oldManufacturer = req.body.oldManufacturer;
        var newManufacturer = req.body.newManufacturer;
        var serialNumber = parseInt(req.body.serialNumber);
        today = new Date();
        time = formatTime(today.getHours(), today.getMinutes(), today.getSeconds());
        var item = Database.getItem(oldName, oldManufacturer);

        //if there is no item with the name and manufacturer
        if (item == null) {
            data = {
                oldName: oldName,
                newName: newName,
                oldManufacturer: oldManufacturer,
                newManufacturer: newManufacturer,
                serialNumber: serialNumber,
                status: 403,
                time: time
            };
            //return an error 
        }//end if

        //if the item does not contain the serial number, error
        else if (Database.containsSerialNumber(item, serialNumber) == false) {
            //return error code

            data = {
                oldName: oldName,
                newName: newName,
                oldManufacturer: oldManufacturer,
                newManufacturer: newManufacturer,
                serialNumber: serialNumber,
                status: 402,
                time: time
            };
        }//end if

        //if the new name and new manufacturer are the same as the old name and old manufacturer, erro
        else if (Database.sameItem(oldName, newName, oldManufacturer, newManufacturer) == true) {
            data = {
                oldName: oldName,
                newName: newName,
                oldManufacturer: oldManufacturer,
                newManufacturer: newManufacturer,
                serialNumber: serialNumber,
                status: 401,
                time: time
            };
        }//end if

        //else a valid request
        else {
            //edit the item. return success
            data = {
                status: 200,
                oldName: oldName,
                newName: newName,
                oldManufacturer: oldManufacturer,
                newManufacturer: newManufacturer,
                serialNumber: serialNumber,
                time: time
            };
            Database.editItem(oldName, newName, oldManufacturer, newManufacturer, serialNumber);

        }//end else
    } //end try
    catch (e) {
        data = {
            status: 404,
            time: time
        }
    }//end catch
    res.send(data);


});//end endpoint



//delete endpoints


//delete board enpoint
app.get('/deleteBoard', (req, res) => {

    var data;

    try {

        data = {
            status: 200,
            items: []
        };
        var items = Database.getItemsForDeleteTable();
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            data.items.push(item);
        }

    } catch (e) {
        data = {
            status: 404
        }
    }

    res.send(data);
});//end endpoint


//delete item endpoint
app.post('/deleteItem', (req, res) => {

    var data;

    //start try
    try {
        var name = req.body.name;
        var manufacturer = req.body.manufacturer;
        var amount = parseInt(req.body.amount);
        console.log(name, manufacturer, amount);
        today = new Date();
        time = formatTime(today.getHours(), today.getMinutes(), today.getSeconds());

        var item = Database.getItem(name, manufacturer);
        if (item == null) {
            data = {
                status: 400,
                time: time
            }
        } //invalid condition
        else if (amount <= 0 || Number.isInteger(amount) == false) {
            data = {
                status: 401,
                time: time
            }
        }//invalid condition

        else {
            if (amount > item.amount) amount = item.amount;
            Database.deleteItem(name, manufacturer, amount);

            data = {
                status: 200,
                name: name,
                manufacturer: manufacturer,
                amount: amount,
                time: time
            }
        }//valid

    }//end try
    catch (e) {
        data = {
            status: 404,
        };
    }//end catch
    console.log(data);
    res.send(data);
});//end endpoint







//view items endpoints

app.post('/viewItems', (req, res) => {

    var mode = parseInt(req.body.mode);
    var info = req.body.info;
    var data;
    date = new Date();
    time = formatTime(date.getHours(), date.getMinutes(), date.getSeconds());
    try {

        var items = Database.viewItems(mode, info);
        if (items.length == 0) {
            data = {
                status: 404,
                items: items,
                time: time
            }
        } else {
            data = {
                status: 200,
                items: items,
                time: time
            }
        }

    } catch (e) {
        data = {
            status: 404,
            time: time
        }
    }

    res.send(data);
});


//csv enpoint
app.post('/toCsv', (req, res) => {

    var data;
    try {
        date = new Date();
        time = formatTime(date.getHours(), date.getMinutes(), date.getSeconds());
        var contentArray = Database.toCsvArray();
        var content = toCsvString(contentArray);
        fs.writeFileSync('csv/inventory.csv', content);
        data = {
            status: 200,
            time: time
        }
        //file written successfully
    } catch (err) {
        data = {
            status: 404,
            time: time
        }
    }

    res.send(data);
});

app.get('/download', function (req, res) {

    //if file does not exist, error
    if (fs.existsSync("csv/inventory.csv") == false) {
        res.sendStatus(404);
    } 
    //file exists, send to client
    else {
        try {
            var file = `${__dirname}/csv/inventory.csv`;
            res.download(file, function (err) {
                if (err) {
                    res.send(err);
                }
            }); // Set disposition and send it.
        } catch (error) {
            res.send(404);
        }
    }

});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});//end endpoint







//helper functions


function formatTime(hours, minutes, seconds) {
    var t = "";
    if (parseInt(hours) < 10) {
        t += "0";
    }

    t += String(hours);
    t += ":"
    if (parseInt(minutes) < 10) {
        t += "0";
    }
    t += minutes;
    t += ":";
    if (parseInt(seconds) < 10) {
        t += "0";
    }
    t += seconds;
    return t;

}//end function

//convert array to csv string

function toCsvString(csvArray) {
    var s = "";
    var headers = csvArray[0];
    for (var i = 0; i < headers.length; i++) {
        s += headers[i];
        if (i < headers.length - 1) s += ",";
    }
    s += "\n";
    for (var i = 1; i < csvArray.length; i++) {
        var obj = csvArray[i];
        s += obj.name;
        s += ",";
        s += obj.manufacturer;
        s += ",";
        s += obj.serialNumber;
        s += "\n";
    }
    return s;

}