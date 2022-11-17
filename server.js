var express = require("express");
var server = express();

bodyParser = require("body-parser");
server.use(bodyParser.urlencoded({ extended: true }));

let voteTotals = {}; //empty object

server.post("/vote", function (req, res) {
    //Establish the variable for this candidate, if needed, then increment their total.
    if (!voteTotals[req.body.candidate]) voteTotals[req.body.candidate] = 0;
    voteTotals[req.body.candidate]++;

    res.write("You just voted for " + req.body.candidate + "\n");
    //Print out all the candidates' totals.
    for (let person in voteTotals) {
        res.write(person + " has " + voteTotals[person] + "\n");
    }

    res.end();
});

server.post("/reset", function (req, res) {
    if (req.body.pass == "pass123") {
        res.write("Password Correct, votes have been reset");
        for (var x in voteTotals) delete voteTotals[x];
    } else {
        res.write("Incorrect Password");
    }
    res.end();
});

server.get("/numberOfCandidates", function (req, res) {
    res.set("Content-Type", "text/plain"); //Tells the browser what kind of content this will be
    res.set("Cache-Control", "no-cache");  //Tells the browser: "don't use a cached response; ask the server every time".

    let counter = 0;
    for (let person in voteTotals) {
        counter++;
    }
    res.write("Total number of candidates: " + counter.toString());
    res.end(); //done with the response to the client
});

server.get("/sumVote", function (req, res) {
    res.set("Content-Type", "text/plain");
    res.set("Cache-Control", "no-cache");
    let sum = 0;
    for (let votes in voteTotals) {
        sum += voteTotals[votes];
    }
    res.write("Total number of votes: " + sum.toString());

    res.end();
});

server.get("/canTotal", function (req, res) {
    res.set("Content-Type", "text/plain");
    res.set("Cache-Control", "no-cache");

    if ((voteTotals[req.query.candidate]) == undefined) {
        res.write("Candidate, " + req.query.candidate + ", has not been voted for.");
    } else {
        res.write(req.query.candidate + " has " + voteTotals[req.query.candidate] + " votes.");
    }
    res.end();
});

server.use(express.static("./pub"));

server.listen(80, function () {
    console.log("Server is now running on port 80."); //This callback happens once the server is ready.
});