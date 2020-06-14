const axios = require("axios");
const neo4j = require("neo4j-driver");
const puppeteer = require("puppeteer");

const processRelationEntities = async function (array, origin) {
  const driver = neo4j.driver("bolt://localhost:7687", neo4j.auth.basic("neo4j", "kgviewer"));

  const promises =  array.map((link) => {
    axios.get('https://kgsearch.googleapis.com/v1/entities:search', {
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
          const description = (typeof(item.description) === "undefined") ? null : item.description.replace(/"/g, "'");
          const entityUrl = (typeof(item.url) === "undefined") ? null : item.url;
          const detailedDescription = (typeof(item.detailedDescription) === "undefined") ? null : item.detailedDescription.articleBody.replace(/"/g, "'").replace(/\n/g, " ");
          const relationType = link[1].toUpperCase().substring(4).replace(/\/|:/g, "_").replace(/ /g, "_");

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
            ).then(async function() {
              await processLabelNode(types, item["@id"]);
              await session.close();
            });
          });
        }
      }
    }).catch(function (error) {
      console.log(error);
      return true;
    });
    return true;
  });
  await Promise.all(promises);
  driver.close();
};

const processRelationLinks = async function (array, origin) {
  const driver = neo4j.driver("bolt://localhost:7687", neo4j.auth.basic("neo4j", "kgviewer"));
  for (const link of array) {
    let browserRelationLinks = await puppeteer.launch({headless: true});
    let pageRelationsLinks = await browserRelationLinks.newPage();
    await pageRelationsLinks.setViewport({ width: 1920, height: 1080 });
    await pageRelationsLinks.goto("https://google.cz" + link[0], {waitUntil: 'load', timeout: 0});
    if (await pageRelationsLinks.$("#xfoot") !== null) {
      let kgIdArray;
      let finalId;
      let regex;
      let regexMatch;
      let matchedId;

      kgIdArray = await pageRelationsLinks.evaluate(() => Array.from(document.querySelectorAll("#xfoot script"), element => element.innerHTML));

      if (kgIdArray.length > 0 && kgIdArray[0] !== null) {
        regex = /(\\x22)(\/.?\/.+?)(\\x22)/;
        regexMatch = regex.exec(kgIdArray[0]);
        if (regexMatch !== null) {
          matchedId = regexMatch[2].toString();
          finalId = matchedId;
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
              const description = (typeof(item.description) === "undefined") ? null : item.description.replace(/"/g, "'");
              const entityUrl = (typeof(item.url) === "undefined") ? null : item.url;
              const detailedDescription = (typeof(item.detailedDescription) === "undefined") ? null : item.detailedDescription.articleBody.replace(/"/g, "'").replace(/\n/g, " ");
              const relationType = link[1].toUpperCase().substring(4).replace(/\/|:/g, "_").replace(/ /g, "_");

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
                ).then(async function() {
                  await processLabelNode(types, item["@id"]);
                  await session.close();
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

const processLabelNode = async function (labels, node) {
  const driver = neo4j.driver("bolt://localhost:7687", neo4j.auth.basic("neo4j", "kgviewer"));

  let i;
  for (i = 0; i < labels.length; i++) {
    const session = driver.session();
    await session.run(
      "MERGE (a:Class {name: $label}) set a = {name: $label}",
      {
        label: labels[i]
      }
    ).then(async function() {
      await session.run(
        'MATCH (a),(b) WHERE a.id = $firstArg AND b.name = $secondArg MERGE (a)-[r:IS]->(b) RETURN(r)',
        {
          firstArg: node,
          secondArg: labels[i],
        }
      ).then(async function() {
        await session.close();
      });
    });
  }
};

module.exports = {
  entities: processRelationEntities,
  links: processRelationLinks,
  node: processLabelNode
};
