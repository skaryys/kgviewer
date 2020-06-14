const { Router } = require('express');
const puppeteer = require("puppeteer");
const neo4j = require("neo4j-driver");
const process = require("./functions");

const router = Router();

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

  const imageUrl = (typeof(req.body.image) === "undefined") ? null : req.body.image.contentUrl;
  const description = (typeof(req.body.description) === "undefined") ? null : req.body.description.replace(/"/g, "'");
  const entityUrl = (typeof(req.body.url) === "undefined") ? null : req.body.url;
  const detailedDescription = (typeof(req.body.detailedDescription) === "undefined") ? null : req.body.detailedDescription.articleBody.replace(/"/g, "").replace(/\n/g, " ");

  session.run(
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
    let url = 'https://www.google.cz/search?q='+searchstring;

    (async () => {
        try {
          let browser = await puppeteer.launch({headless: true});
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

module.exports = router;
