const { Router } = require('express');
const puppeteer = require("puppeteer");
const axios = require("axios");
const neo4j = require("neo4j-driver");
const driver = neo4j.driver("bolt://localhost:7687", neo4j.auth.basic("neo4j", "'3{L+ZCp<<m8.n-n"));

const router = Router();

router.get('/add/single', function (req, res, next) {
  let id = req.param("q");

  res.json({"ahoj": id});
});

/* TODO - nehotové - přidat příbuzné nodes */
router.get('/add/relatives', function (req, res, next) {
    req.setTimeout(500000);
    let searchstring = req.param("q");
    let url = 'https://www.google.cz/search?q='+searchstring;

    (async () => {
      try {
        let results = {"nodes":[], "relations":[]};
        let browser = await puppeteer.launch({ headless: true, defaultViewport: null});
        let page = await browser.newPage();
        await page.goto(url, {waitUntil: 'load', timeout: 0});
        if (await page.$(".knowledge-panel") !== null) {
          let kpp = await page.evaluate(() => Array.from(document.querySelectorAll('.knowledge-panel .kno-fv a[data-ved]'), element => [element.getAttribute("href"), element.closest("[data-attrid]").getAttribute("data-attrid")]));

          async function processArray(array) {
            for (const link of array) {
              let browser_processArray = await puppeteer.launch({headless: true, defaultViewport: null});
              let page_processArray = await browser_processArray.newPage();
              await page_processArray.goto("https://google.cz" + link[0], {waitUntil: 'load', timeout: 0});
              if (await page.$(".knowledge-panel") !== null) {
                let kgid = await page_processArray.evaluate(() => Array.from(document.querySelectorAll("kno-share-button g-dialog a"), element => element.getAttribute("href")));
                let i = 0;
                for (const first of kgid) {
                  if (i === 0) {
                    let regex = /(mid%3D)(.+?)(%26)/;
                    let match_first = regex.exec(first);
                    let match_id = match_first[2].toString().replace("%2F", "/");
                    let match_id2 = match_id.replace("%2F", "/");
                    await axios.get('https://kgsearch.googleapis.com/v1/entities:search', {
                      params: {
                        'ids': match_id2,
                        'limit': 1,
                        'indent': true,
                        "key": "AIzaSyA94kim18rne3X5gzh7Gpl8Gt4SXz5yzuc",
                        "languages": "cs"
                      }
                    }).then(function (response) {
                      if (typeof response.data.itemListElement[0] !== 'undefined' && response.data.itemListElement[0]) {
                        let item = response.data.itemListElement[0].result;
                        if (item.name !== 'undefined' && item.name) {
                          let graphitem = {
                            id: item["@id"],
                            label: item.name,
                            title: JSON.stringify(item, null, 4)
                          };
                          results["nodes"].push(graphitem);
                          results["relations"].push(link[1]);
                        }
                      }
                    }).catch(function (error) {
                      console.log(error);
                    });
                    i++;
                  }
                }
                if (kgid.length < 1) {
                  let kgid2 = await page_processArray.evaluate(() => Array.from(document.querySelectorAll(".knowledge-panel a.bia"), element => element.getAttribute("href")));
                  let y = 0;
                  for (const first of kgid2) {
                    if (y === 0) {
                      console.log(first);
                      let regex = /(%252C)(%252F.+?)(&)/;
                      let match_first = regex.exec(first);
                      let match_id = match_first[2].toString().replace("%252F", "/");
                      let match_id2 = match_id.replace("%252F", "/");
                      console.log(match_id2);
                      await axios.get('https://kgsearch.googleapis.com/v1/entities:search', {
                        params: {
                          'ids': match_id2,
                          'limit': 1,
                          'indent': true,
                          "key": "AIzaSyA94kim18rne3X5gzh7Gpl8Gt4SXz5yzuc",
                          "languages": "cs"
                        }
                      }).then(function (response) {
                        if (typeof response.data.itemListElement[0] !== 'undefined' && response.data.itemListElement[0]) {
                          let item = response.data.itemListElement[0].result;
                          if (item.name !== 'undefined' && item.name) {
                            let graphitem = {
                              id: item["@id"],
                              label: item.name,
                              title: JSON.stringify(item, null, 4)
                            };
                            results["nodes"].push(graphitem);
                            results["relations"].push(link[1]);
                          }
                        }
                      }).catch(function (error) {
                        console.log(error);
                      });
                      y++;
                    }
                  }
                }
              }
              await browser_processArray.close();
            }
          }

          await processArray(kpp);
          let kpp_2 = await page.evaluate(() => Array.from(document.querySelectorAll('.knowledge-panel [data-rentity^="/"]'), element => [element.getAttribute("data-rentity"), element.closest("[data-attrid]").getAttribute("data-attrid")]));

          async function processArray2(array) {
            for (const link of array) {
              console.log(link[0]);
              await axios.get('https://kgsearch.googleapis.com/v1/entities:search', {
                params: {
                  'ids': link[0],
                  'limit': 1,
                  'indent': true,
                  "key": "AIzaSyA94kim18rne3X5gzh7Gpl8Gt4SXz5yzuc",
                  "languages": "cs"
                }
              }).then(function (response) {
                if (typeof response.data.itemListElement[0] !== 'undefined' && response.data.itemListElement[0]) {
                  let item = response.data.itemListElement[0].result;
                  if (item.name !== 'undefined' && item.name) {
                    let graphitem = {
                      id: item["@id"],
                      label: item.name,
                      title: JSON.stringify(item, null, 4)
                    };
                    results["nodes"].push(graphitem);
                    results["relations"].push(link[1]);
                  }
                }
              }).catch(function (error) {
                console.log(error);
              });
            }
          }

          await processArray2(kpp_2);
          let kpp_3 = await page.evaluate(() => Array.from(document.querySelectorAll('.knowledge-panel [data-rentity=""] > a'), element => [element.getAttribute("href"), element.closest("[data-attrid]").getAttribute("data-attrid")]));
          await processArray(kpp_3);
          await browser.close();

          const session = driver.session();

          const personName = 'Alice';
          const resultPromise = session.run(
            'CREATE (a:Person {name: $name}) RETURN a',
            {name: personName}
          );

          resultPromise.then(result => {
            session.close();
            driver.close();
            res.json(results);
          });
        }
      } catch (err) {
        console.log(err);
        await browser.close();
        console.log(error("Browser Closed"));
      }
    })();
});

module.exports = router;
