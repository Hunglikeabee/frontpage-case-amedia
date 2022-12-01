import config from '../config/config.js';
import manifest from "../manifests/manifests.js"

const servicesHost = config.get('servicesHostname');

const basepath = manifest.component.markup.urlTemplate

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
  let allPublications = "";
  //Check for
  const currentPublication = publication ?  publication : "www.ba.no";
  let urlAddress = `https://services.api.no/api/acpcomposer/v1.1/search/content/?publicationDomain=${currentPublication}&sort=lastPublishedDate&types=story`;
    try {
      const data = await getData(urlAddress)
      const allArticles = data._embedded


      //Filter articles without a image
      const filterArticles = allArticles.filter(article => article._embedded.relations[0].fields.versions !== undefined)

      // Loop throug filtered articles and insert HTML
      for(let i = 0; i < filterArticles.length; i++) {

        //Adding different class to first article in filteredArticles to make headline
        allPublications += `
                <a class="${i === 0 ? "firstArticle-container" : "news-container"}"  href="${"http://" + currentPublication + filterArticles[i].fields.relativeUrl}">
                  <img class="${i === 0 ? "firstArticle-image" : "news-image"}" src="${filterArticles[i]._embedded.relations[0].fields.versions.large.url}" />
                  <h2 class="${i === 0 ? "firstArticle-title" : "news-title"}">${filterArticles[i].title}</h2>
                </a>
        `
      }
    }
    catch(error) {
      return (`
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
          <h1>Something went wrong, try again or contact helpdesk for assistance at +47 555 55 555</h1>
        </body>
      </html>
      `
      )
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