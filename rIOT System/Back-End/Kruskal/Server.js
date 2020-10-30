const { solve } = require("./Kruskal.js");
const express = require('express');
const path = require('path');
const parser = require('body-parser');
const app = express();
const jsonParser = parser.json();

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:5000"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname + "/Templates/Canvas.html"));
});

app.post("/mst", jsonParser, (req, res) => {
    res.json(solve(req.body, false));
});

app.post("/solve", jsonParser, (req, res) => {
    res.json(solve(req.body, true));
});

app.get("/solve", (req, res) => {
    console.log(req.params);
    console.log(req.body);
    res.json({example: "hello"});
});

app.listen(8000, () => {
    console.log("Listening on port 8000!");
});