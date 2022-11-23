import config from '../config/config.js';

const servicesHost = config.get('servicesHostname');

// Kan dette hentes fra config isteden?
//Ja det kan det :)
const basepath = `http://${config.get("hostName")}:${config.get("httpServerPort")}${config.get("basePath")}`;

async function getData(urlAddress) {
    try {
        const data = await fetch(`${urlAddress}`)
        return await data.json();
    }
    catch(error) {
        console.log(error)
    }
}

export default async function renderPreview({ publication }) {
  const currentPublication = publication ?  publication : "www.ba.no";
  let urlAddress = `https://services.api.no/api/acpcomposer/v1.1/search/content/?publicationDomain=${currentPublication}&sort=lastPublishedDate&types=story`;
    const data = await getData(urlAddress)
    let allPublications = ""
    let firstArticle = 0;
    try {
      for(let i = 0; i < data._embedded.length; i++) {
        if(data._embedded[i]._embedded.relations[0].fields.versions === undefined) {
          continue
        }
        firstArticle = firstArticle + 1;
        allPublications += `
                <a class="${firstArticle === 1 ? "firstArticle-container" : "news-container"}"  href="${"http://" + currentPublication + data._embedded[i].fields.relativeUrl}">
                  <img class="${firstArticle === 1 ? "firstArticle-image" : "news-image"}" src="${data._embedded[i]._embedded.relations[0].fields.versions.large.url}" />
                  <h2 class="${firstArticle === 1 ? "firstArticle-title" : "news-title"}">${data._embedded[i].title}</h2>
                </a>
        `
      }
    }
    catch(error) {
      console.log(error)
    }

    return `
    <!doctype html>
    <html>
    <head>
        <title>Preview</title>
        <script type="module" src="https://assets.acdn.no/pkg/@amedia/include/v3/include.js"></script>
        <link href="assets/style.css" type="text/css" rel="stylesheet" />
        <script src="assets/script.js" defer ></script>
        <meta name="viewport" content="width=device-width,initial-scale=1.0">
    </head>
    <body>
        <!-- Parameter til komponenten sendes inn som attributter med prefix param -->
        <amedia-include param-publication="${currentPublication}" manifest="https://${servicesHost}/api/brandheader/v1/components/header/${currentPublication}/manifest/"></amedia-include>
        <amedia-frontpage>${allPublications}</amedia-frontpage>
        <amedia-include param-publication="${currentPublication}" manifest="${basepath}/manifest"></amedia-include>
    </body>
    </html>
    `;
}