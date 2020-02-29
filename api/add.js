const { Router } = require('express');
const puppeteer = require("puppeteer");
const axios = require("axios");
const neo4j = require("neo4j-driver");

const processRelationEntities = async function (array, origin) {
  console.log(origin);
  const driver = neo4j.driver("bolt://localhost:7687", neo4j.auth.basic("neo4j", "kgviewer"));
  for (const link of array) {
    await axios.get('https://kgsearch.googleapis.com/v1/entities:search', {
      params: {
        'ids': link[0],
        'limit': 1,
        'indent': true,
        "key": "AIzaSyA94kim18rne3X5gzh7Gpl8Gt4SXz5yzuc",
        "languages": "cs"
      }
    }).then(async function (response) {
      if (typeof response.data.itemListElement[0] !== 'undefined' && response.data.itemListElement[0]) {
        let item = response.data.itemListElement[0].result;
        if (item.name !== 'undefined' && item.name) {
          console.log("přidán příbuzný node "+item.name);
          const session = driver.session();
          let typeString = "";
          const types = item["@type"];
          let i;
          for (i = 0; i < types.length; i++) {
            typeString += ":" + types[i];
          }
          const imageUrl = (typeof(item.image) === "undefined") ? null : item.image.contentUrl;
          const description = (typeof(item.description) === "undefined") ? null : item.description;
          const entityUrl = (typeof(item.url) === "undefined") ? null : item.url;
          const detailedDescription = (typeof(item.detailedDescription) === "undefined") ? null : item.detailedDescription.articleBody;
          const relationType = link[1].toUpperCase().substring(4).replace(/\/|:/g, "_");
          console.log(relationType);

          await session.run(
            "MERGE (a"+typeString+" {id: $id})" +
            "set a = {name: $name, id: $id, description: $description, detailedDescription: $detailedDescription, image: $image, url: $url}",
            {
              name: item.name,
              id: item["@id"],
              description: description,
              detailedDescription: detailedDescription,
              image: imageUrl,
              url: entityUrl,
            }
          ).then(async function() {
            await session.run(
              'MATCH (a),(b) WHERE a.id = $firstArg AND b.id = $secondArg MERGE (a)-[r:'+relationType+']->(b) RETURN(r)',
              {
                firstArg: origin,
                secondArg: item["@id"],
              }
            ).then(() => {
              session.close();
            });
          });
        }
      }
    }).catch(function (error) {
      console.log(error);
      return true;
    });
  }
};

const processRelationLinks = async function (array, origin) {
  console.log(origin);
  const driver = neo4j.driver("bolt://localhost:7687", neo4j.auth.basic("neo4j", "kgviewer"));
  for (const link of array) {
    let browserRelationLinks = await puppeteer.launch({headless: true});
    let pageRelationsLinks = await browserRelationLinks.newPage();
    await pageRelationsLinks.setViewport({ width: 1920, height: 1080 });
    await pageRelationsLinks.goto("https://google.cz" + link[0], {waitUntil: 'load', timeout: 0});
    if (await pageRelationsLinks.$(".knowledge-panel") !== null) {
      let kgIdArray;
      let finalId;
      let regex;
      let regexMatch;
      let matchedId;
      kgIdArray = await pageRelationsLinks.evaluate(() => Array.from(document.querySelectorAll("kno-share-button g-dialog a"), element => element.getAttribute("href")));

      if (kgIdArray.length > 0 && kgIdArray[0] !== null) {
        regex = /(mid%3D)(.+?)(%26)/;
        regexMatch = regex.exec(kgIdArray[0]);
        if (regexMatch !== null) {
          matchedId = regexMatch[2].toString().replace("%2F", "/");
          finalId = matchedId.replace("%2F", "/");
        }
      }

      if (kgIdArray.length < 1) {
        kgIdArray = await pageRelationsLinks.evaluate(() => Array.from(document.querySelectorAll(".knowledge-panel a.bia"), element => element.getAttribute("href")));
        if (kgIdArray.length > 0 && kgIdArray[0] !== null) {
          regex = /(%252C)(%252F.+?)(&)/;
          regexMatch = regex.exec(kgIdArray[0]);
          if (regexMatch !== null) {
            matchedId = regexMatch[2].toString().replace("%252F", "/");
            finalId = matchedId.replace("%252F", "/");
          }
        }
      }

      if (typeof(finalId) !== "undefined") {
        await axios.get('https://kgsearch.googleapis.com/v1/entities:search', {
          params: {
            'ids': finalId,
            'limit': 1,
            'indent': true,
            "key": "AIzaSyA94kim18rne3X5gzh7Gpl8Gt4SXz5yzuc",
            "languages": "cs"
          }
        }).then(async function (response) {
          if (typeof response.data.itemListElement[0] !== 'undefined' && response.data.itemListElement[0]) {
            let item = response.data.itemListElement[0].result;

            if (item.name !== 'undefined' && item.name) {
              console.log("přidán příbuzný node "+item.name);
              const session = driver.session();
              let typeString = "";
              const types = item["@type"];
              let i;
              for (i = 0; i < types.length; i++) {
                typeString += ":" + types[i];
              }
              const imageUrl = (typeof(item.image) === "undefined") ? null : item.image.contentUrl;
              const description = (typeof(item.description) === "undefined") ? null : item.description;
              const entityUrl = (typeof(item.url) === "undefined") ? null : item.url;
              const detailedDescription = (typeof(item.detailedDescription) === "undefined") ? null : item.detailedDescription.articleBody;
              const relationType = link[1].toUpperCase().substring(4).replace(/\/|:/g, "_");
              console.log(relationType);

              await session.run(
                "MERGE (a"+typeString+" {id: $id})" +
                "set a = {name: $name, id: $id, description: $description, detailedDescription: $detailedDescription, image: $image, url: $url}",
                {
                  name: item.name,
                  id: item["@id"],
                  description: description,
                  detailedDescription: detailedDescription,
                  image: imageUrl,
                  url: entityUrl,
                }
              ).then(async function() {
                await session.run(
                  'MATCH (a),(b) WHERE a.id = $firstArg AND b.id = $secondArg MERGE (a)-[r:'+relationType+']->(b) RETURN(r)',
                  {
                    firstArg: origin,
                    secondArg: item["@id"],
                  }
                ).then(() => {
                  session.close();
                });
              });
            }
          }
        }).catch(function (error) {
          console.log(error);
          return true;
        });
      }
    }

    await browserRelationLinks.close();
  }
  driver.close();
};

const router = Router();

router.post('/add/single', function (req, res, next) {
  req.setTimeout(500000);
  const driver = neo4j.driver("bolt://localhost:7687", neo4j.auth.basic("neo4j", "kgviewer"));
  const session = driver.session();

  let typeString = "";
  const types = req.body["@type"];
  let i;
  for (i = 0; i < types.length; i++) {
    typeString += ":" + types[i];
  }

  const imageUrl = (typeof(req.body.image) === "undefined") ? null : req.body.image.contentUrl;
  const description = (typeof(req.body.description) === "undefined") ? null : req.body.description;
  const entityUrl = (typeof(req.body.url) === "undefined") ? null : req.body.url;
  const detailedDescription = (typeof(req.body.detailedDescription) === "undefined") ? null : req.body.detailedDescription.articleBody;

  const resultPromise = session.run(
    "MERGE (n"+typeString+" {id: $id})" +
    "set n = {name: $name, id: $id, description: $description, detailedDescription: $detailedDescription, image: $image, url: $url}",
    {
      name: req.body.name,
      id: req.body["@id"],
      description: description,
      detailedDescription: detailedDescription,
      image: imageUrl,
      url: entityUrl
    }
  );

  resultPromise.then(result => {
    session.close();
    driver.close();
    res.json({});
  });
});

router.post('/add/relatives', function (req, res, next) {
    req.setTimeout(500000);
    let searchstring = req.body.name;
    let url = 'https://www.google.cz/search?q='+searchstring;

    (async () => {
        try {
          let browser = await puppeteer.launch({headless: true});
          let page = await browser.newPage();
          await page.setViewport({width: 1920, height: 1080});
          await page.goto(url, {waitUntil: 'load', timeout: 0});

          if (await page.$(".knowledge-panel") !== null) {
            let kgIdArray;
            let finalId;
            let regex;
            let regexMatch;
            let matchedId;
            kgIdArray = await page.evaluate(() => Array.from(document.querySelectorAll("kno-share-button g-dialog a"), element => element.getAttribute("href")));

            if (kgIdArray.length > 0 && kgIdArray[0] !== null) {
              regex = /(mid%3D)(.+?)(%26)/;
              regexMatch = regex.exec(kgIdArray[0]);
              matchedId = regexMatch[2].toString().replace("%2F", "/");
              finalId = matchedId.replace("%2F", "/");
            }

            if (kgIdArray.length < 1) {
              kgIdArray = await page.evaluate(() => Array.from(document.querySelectorAll(".knowledge-panel a.bia"), element => element.getAttribute("href")));
              if (kgIdArray.length > 0 && kgIdArray[0] !== null) {
                regex = /(%252C)(%252F.+?)(&)/;
                regexMatch = regex.exec(kgIdArray[0]);
                matchedId = regexMatch[2].toString().replace("%252F", "/");
                finalId = matchedId.replace("%252F", "/");
              }
            }

            if (("kg:" + finalId) === req.body["@id"]) {
              let relationEntities = await page.evaluate(() => Array.from(document.querySelectorAll('.knowledge-panel [data-rentity^="/"]'), element => [element.getAttribute("data-rentity"), element.closest("[data-attrid]").getAttribute("data-attrid")]));
              await processRelationEntities(relationEntities, "kg:" + finalId);
              let relationsLinks = await page.evaluate(() => Array.from(document.querySelectorAll('.knowledge-panel .kno-fv a[data-ved]'), element => [element.getAttribute("href"), element.closest("[data-attrid]").getAttribute("data-attrid")]));
              await processRelationLinks(relationsLinks, "kg:" + finalId);
              let alsosearchedLinks = await page.evaluate(() => Array.from(document.querySelectorAll('.knowledge-panel [data-rentity=""] > a'), element => [element.getAttribute("href"), element.closest("[data-attrid]").getAttribute("data-attrid")]));
              await processRelationLinks(alsosearchedLinks, "kg:" + finalId);
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

router.get('/graph', function (req, res, next) {
  req.setTimeout(500000);
  const driver = neo4j.driver("bolt://localhost:7687", neo4j.auth.basic("neo4j", "kgviewer"));
  const session = driver.session();

  let typeString = "";
  const types = req.body["@type"];
  let i;
  for (i = 0; i < types.length; i++) {
    typeString += ":" + types[i];
  }

  const imageUrl = (typeof(req.body.image) === "undefined") ? null : req.body.image.contentUrl;
  const description = (typeof(req.body.description) === "undefined") ? null : req.body.description;
  const entityUrl = (typeof(req.body.url) === "undefined") ? null : req.body.url;
  const detailedDescription = (typeof(req.body.detailedDescription) === "undefined") ? null : req.body.detailedDescription.articleBody;

  const resultPromise = session.run(
    "MERGE (n"+typeString+" {id: $id})" +
    "set n = {name: $name, id: $id, description: $description, detailedDescription: $detailedDescription, image: $image, url: $url}",
    {
      name: req.body.name,
      id: req.body["@id"],
      description: description,
      detailedDescription: detailedDescription,
      image: imageUrl,
      url: entityUrl
    }
  );

  resultPromise.then(result => {
    session.close();
    driver.close();
    res.json({});
  });
});

module.exports = router;
