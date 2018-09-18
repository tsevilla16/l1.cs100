const API_KEY = "65a62630-b77e-11e8-a4d1-69890776a30b";

//checks to see if DOMContentLoaded, then loads all galleries based on api call
document.addEventListener("DOMContentLoaded", () => {
    const url = `https://api.harvardartmuseums.org/gallery?apikey=${API_KEY}`;
    showGalleries(url);
});

//allows for hash navigation in the URL field
['DOMContentLoaded', 'hashchange'].forEach((e) => {
    window.addEventListener(e, () => {
        //checks if nav id is an object id (more than 4 chars)
        let navid = window.location.hash.slice(1)
        if (navid.length > 4) {
            let objectid = window.location.hash.slice(1);
            showObjectInfo(objectid);
        }
        //checks if nav id is a gallery id (4 chars)
        else if (navid.length == 4){
            let galleryid = window.location.hash.slice(1);
            showObjectsTable(galleryid);
        }
    });
});

//Generates a list of all galleries based on an API-specific URL
function showGalleries(url) {
    fetch(url)
    .then(response => response.json())
    .then(data => {
        data.records.forEach(gallery => {
            document.querySelector("#galleries").innerHTML += `
                <li>
                    <a href="#${gallery.id}" onclick="showObjectsTable(${gallery.id})">
                        Gallery #${gallery.id}: ${gallery.name} (Floor ${gallery.floor})
                    </a>
                </li>
            `;
        });
    //ensures that all pages of galleries are added to the list
    if (data.info.next) {
        showGalleries(data.info.next);
    }
    })
    //ensures that upon navigation to this page, navigation buttons are hidden
    document.querySelector("#galleriesback").style.display = "none";
    document.querySelector("#objectsback").style.display = "none";
}

//Generates a list of all objects in a given gallery id
function showObjectsTable(id) {
  //Clears object list from past galleries naviagated to
  document.querySelector("#objectlist").innerHTML += ``
  //generates an API call for all objects in a certain gallery ID
  const url2 =  `https://api.harvardartmuseums.org/object?gallery=${id}&apikey=${API_KEY}`
  document.querySelector("#objectlist").style.display = "block";
  document.querySelector("#all-galleries").style.display = "none";
  document.querySelector("#object-info").style.display = "none";
  //Populates the objects table with all objects in the gallery given a api call url
  function populateTable(url){
      fetch(url)
      .then(response => response.json())
      .then(data => {
          //Loads the table with object data for each object
          data.records.forEach(object => {
            document.querySelector("#all-objects").innerHTML += `
                <tr>
                  <td>
                    <a href="#${object.id}" onclick="showObjectInfo(${object.id})">
                      ${object.id}: ${object.title}
                    </a>
                  </td>
                  <td>
                    <a href="#${object.id}" onclick="showObjectInfo(${object.id})">
                      <img src="${object.primaryimageurl}" class=gallery-image></img>
                    </a>
                  </td>
                  <td>
                    ${
                      object.people.map(el => el.name).join(", ")
                      }
                  </td>
                  <td>
                    <a href="#${object.id}" onclick="showObjectInfo(${object.id})">
                      ${object.url}
                    </a>
                  </td>
                </tr>
            `;
          })
          //If there are multiple pages of objects, ensures that all are loaded in
          if (data.info.next) {
              populateTable(data.info.next)
          }
      })
}
    //Calls the populatetable function using the previously set custom gallery ID url
    populateTable(url2)
    //Generates back button which returns user to overall view of galleries
    document.querySelector("#galleriesback").innerHTML = `
        <button type="button" onclick="back2galleries()">
            Return to Galleries View
        </button>
    `
    //Shows back button, hides back button from other page if it was previously visible
    document.querySelector("#galleriesback").style.display = "block";
    document.querySelector("#objectsback").style.display = "none";
    }

//Displays information for a particular object in the Museum given the object's ID
function showObjectInfo(id2) {
  //Clears object info tag of any previously held information from past pages
  document.querySelector("#object-info").innerHTML += ``
  //Generates API call for information based on object's ID
  const url2 =  `https://api.harvardartmuseums.org/object/${id2}?apikey=${API_KEY}`
  //Shows only the object information block
  document.querySelector("#objectlist").style.display = "none";
  document.querySelector("#all-galleries").style.display = "none";
  document.querySelector("#object-info").style.display = "block";
  //Makes call to API for object information
  fetch(url2)
  .then(response => response.json())
  .then(data => {
      //Creates page with essential object information
      document.querySelector("#object-info").innerHTML += `
          <div id="objecttitle">
            ${data.title}
          </div id="primeimage">
          <img src="${data.primaryimageurl}" style="height:450px;">
          </img>
          <div id="objectinfo">
            Description: ${data.description}
          </div>
          <div id="objectinfo">
            Accession: ${data.accessionyear}
          </div>
          <div id="objectinfo">
            Provenance:${data.provenance}
          </div>
      `;
    });
    //Creates back button to return to the all objects in gallery view
    document.querySelector("#objectsback").innerHTML = `
        <button type="button" onclick="back2objects()">
            Return to Objects View
        </button>
    `
    //Hides back button to gallery view if it previously was present 
    document.querySelector("#galleriesback").style.display = "none";
    document.querySelector("#objectsback").style.display = "block";
    }

//Changes visibility of html elements so that only the objects list is visible, effectively a back button
function back2objects() {
  document.querySelector("#objectlist").style.display = "block";
  document.querySelector("#all-galleries").style.display = "none";
  document.querySelector("#object-info").style.display = "none";
  document.querySelector("#galleriesback").style.display = "block";
  document.querySelector("#objectsback").style.display = "none";
}
//Changes visibility of html elements so that only the galleries list is visible, effectively a back button
function back2galleries() {
  document.querySelector("#objectlist").style.display = "none";
  document.querySelector("#all-galleries").style.display = "block";
  document.querySelector("#object-info").style.display = "none";
  document.querySelector("#galleriesback").style.display = "none";
  document.querySelector("#objectsback").style.display = "none";
}
