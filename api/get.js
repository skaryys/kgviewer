const { Router } = require('express');
const neo4j = require("neo4j-driver");
const jp = require("jsonpath");
const fs = require('fs');
const axios = require("axios");

const router = Router();

router.get('/get/labels', async function (req, res, next) {
  const driver = neo4j.driver("bolt://localhost:7687", neo4j.auth.basic("neo4j", "kgviewer"));
  const session = driver.session();

  session.run(
    "CALL db.labels"
  ).then(function(result) {
    session.close();
    driver.close();
    res.json(jp.query(result.records, "$.._fields").toString().split(","));
  });
});

router.get("/get/node", async function (req, res, next) {
  const driver = neo4j.driver("bolt://localhost:7687", neo4j.auth.basic("neo4j", "kgviewer"));
  const session = driver.session();
  session.run(
    "MATCH (n) WHERE id(n)=" + req.query.id + " RETURN (n)"
  ).then(function(result) {
    session.close();
    driver.close();
    res.json(jp.query(result.records, "$.._fields")[0][0]);
  });
});

router.get("/get/all/json", function (req, res, next) {
  const driver = neo4j.driver("bolt://localhost:7687", neo4j.auth.basic("neo4j", "kgviewer"));
  const session = driver.session();
  session.run(
    'CALL apoc.export.json.all(null,{useTypes:true, stream: true})\n' +
    'YIELD data\n' +
    'RETURN data'
  ).then(function(result) {
    res.charset = 'utf-8';
    res.set({"Content-Disposition":"attachment; filename=\"graph.json\""});
    session.close();
    driver.close();
    let finalGraph = { "graph": [] };
    let graphVar = result.records[0]._fields[0].replace(/\\"/g, '"').split(/\r?\n/);
    graphVar.map((row) => {
      let graphObjectObject = JSON.parse(row);
      finalGraph["graph"].push(graphObjectObject);
    });
    res.send(finalGraph);
  });
});

router.get("/get/all/csv", function (req, res, next) {
  const driver = neo4j.driver("bolt://localhost:7687", neo4j.auth.basic("neo4j", "kgviewer"));
  const session = driver.session();
  session.run(
    'CALL apoc.export.csv.all(null, {stream:true}) YIELD data RETURN data'
  ).then(function(result) {
    res.charset = 'utf-8';
    res.set({"Content-Disposition":"attachment; filename=\"graph.csv\""});
    session.close();
    driver.close();
    console.log(result.records[0]._fields[0]);
    res.send(result.records[0]._fields[0]);
  });
});

router.get("/get/all/rdf", function (req, res, next) {
  axios.post('http://neo4j:kgviewer@localhost:7474/rdf/neo4j/cypher', {
    cypher: "MATCH path = (n)-[r]->(m) RETURN path",
    format: "RDF/XML"
    }
  ).then(function (response) {
    res.charset = 'utf-8';
    res.set({"Content-Disposition":"attachment; filename=\"graph.rdf\""});
    res.send(response.data);
  })
  .catch(function (error) {
    console.log('Error ' + error.message)
  });
});

module.exports = router;
