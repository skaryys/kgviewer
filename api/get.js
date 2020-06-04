const { Router } = require('express');
const neo4j = require("neo4j-driver");
const jp = require("jsonpath");

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

module.exports = router;
