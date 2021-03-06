const { Router } = require('express');
const puppeteer = require("puppeteer");
const neo4j = require("neo4j-driver");
const process = require("./functions");
const wee_db = require('wee-db');
const db = wee_db('static/db.json');
const cron = require("node-cron");
const axios = require("axios");
let cronRunning = false;

const router = Router();

router.post("/add/to/queue", async function (req, res, next) {
  db.insert('objects', req.body);

  await res.json({});
});

router.post('/add/single', async function (req, res, next) {
  req.setTimeout(500000);
  const driver = neo4j.driver("bolt://localhost:7687", neo4j.auth.basic("neo4j", "kgviewer"));
  const session = driver.session();

  let typeString = "";
  const types = req.body["@type"];
  let i;
  for (i = 0; i < types.length; i++) {
      typeString += ":" + types[i];
  }

  const name = req.body.name.replace(/"/g, "");
  const imageUrl = (typeof(req.body.image) === "undefined") ? null : req.body.image.contentUrl;
  const description = (typeof(req.body.description) === "undefined") ? null : req.body.description.replace(/"/g, "'");
  const entityUrl = (typeof(req.body.url) === "undefined") ? null : req.body.url;
  const detailedDescription = (typeof(req.body.detailedDescription) === "undefined") ? null : req.body.detailedDescription.articleBody.replace(/"/g, "").replace(/\n/g, " ");

  session.run(
    "MERGE (n"+typeString+" {id: $id})" +
    "set n = {name: $name, id: $id, description: $description, detailedDescription: $detailedDescription, image: $image, url: $url}",
    {
      name: name,
      id: req.body["@id"],
      description: description,
      detailedDescription: detailedDescription,
      image: imageUrl,
      url: entityUrl
    }
  ).then(async function() {
    await process.node(types, req.body["@id"]);
    await session.close();
    await driver.close();
    res.json({});
  });
});

router.post('/add/relatives', function (req, res, next) {
    req.setTimeout(500000);
    let searchstring = req.body.name;
    let url = 'https://www.google.com/search?q='+searchstring;

    (async () => {
        try {
          let browser = await puppeteer.launch({headless: true, args: ['--no-sandbox']});
          let page = await browser.newPage();
          await page.setViewport({width: 1920, height: 1080});
          await page.goto(url, {waitUntil: 'load', timeout: 0});

          if (await page.$("#xfoot") !== null) {
            let kgIdArray;
            let finalId;
            let regex;
            let regexMatch;
            let matchedId;
            kgIdArray = await page.evaluate(() => Array.from(document.querySelectorAll("#xfoot script"), element => element.innerHTML));

            if (kgIdArray.length > 0 && kgIdArray[0] !== null) {
              regex = /(\\x22)(\/.?\/.+?)(\\x22)/;
              regexMatch = regex.exec(kgIdArray[0]);
              if (regexMatch !== null) {
                matchedId = regexMatch[2].toString();
                finalId = matchedId;
              }
            }

            console.log(finalId + " vs " + req.body["@id"]);
            if (("kg:" + finalId) === req.body["@id"]) {
              let relationEntities = await page.evaluate(() => Array.from(document.querySelectorAll('[data-rentity^="/"]'), element => [element.getAttribute("data-rentity"), element.closest("[data-attrid]").getAttribute("data-attrid")]));
              await process.entities(relationEntities, "kg:" + finalId);
              let relationsLinks = await page.evaluate(() => Array.from(document.querySelectorAll('.kno-fv a[data-ved]'), element => [element.getAttribute("href"), element.closest("[data-attrid]").getAttribute("data-attrid")]));
              await process.links(relationsLinks, "kg:" + finalId);
              let alsosearchedLinks = await page.evaluate(() => Array.from(document.querySelectorAll('[data-rentity=""] > a'), element => [element.getAttribute("href"), element.closest("[data-attrid]").getAttribute("data-attrid")]));
              await process.links(alsosearchedLinks, "kg:" + finalId);
            }
          }

          await browser.close();
        } catch (e) {
          console.error(e);
        } finally {
          res.json({});
        }
    })();
});

cron.schedule("* * * * *", async function() {
  if (!cronRunning) {
    cronRunning = true;

    console.log("cron started in "+new Date().toLocaleString());

    const addingNode = async function() {
      let resultObject = db._find("objects").value()[0];
      if (typeof resultObject != "undefined") {
        console.log("adding from queue - " + resultObject.name);
        await axios.all([
          axios.post('http://localhost:3001/add/single', resultObject),
          axios.post('http://localhost:3001/add/relatives', resultObject)
        ]).then(() => {
          db._find("objects").value().shift();
          addingNode();
        }).catch(error => {
          console.log(error);
          cronRunning = false;
        });
      } else {
        console.log("No nodes in queue");
        cronRunning = false;
      }
    };

    await addingNode();
  }
});

/*cron.schedule("0 22 * * *", async function() {
  console.log("automatic expanding of queue started in "+new Date().toLocaleString());

  const driver = neo4j.driver("bolt://localhost:7687", neo4j.auth.basic("neo4j", "kgviewer"));
  const session = driver.session();

  const result = await session.run(
      'MATCH (n)-[r]->(m)\n' +
      'WITH n, collect(m) AS classes\n' +
      'WHERE ALL (x IN classes WHERE x:Type)\n' +
      'RETURN n.id',
  );

  await result.records.map(async function(record) {
    await axios.get('https://kgsearch.googleapis.com/v1/entities:search', {
      params: {
        "ids": record.get(0).substring(3),
        'limit': 1,
        'indent': true,
        "key": "AIzaSyA94kim18rne3X5gzh7Gpl8Gt4SXz5yzuc",
        "languages": "en"
      }
    }).then(function (response) {
      const foundEntity = response.data.itemListElement[0].result;
      db.insert('objects', foundEntity);
    }).catch(error => {
      console.log(error);
    });
  });

  await session.close();
  await driver.close();
});*/

module.exports = router;
