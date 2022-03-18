import { FetchWrapper } from "./fetchData.js";
let formInput = document.querySelector("#inputData");
let resultTable = document.querySelector(".result");
let searchInput = document.querySelector("#search");
let resetInput = document.querySelector("input[type=reset]");
let addButton = document.querySelector("#add-button");
let inputContainer = document.querySelector(".input-container");
let backButton = document.querySelector("#back-button");

const API = new FetchWrapper(
  "https://firestore.googleapis.com/v1/projects/programmingjs-90a13/databases/(default)/documents/"
);

API.get("CarLicence").then((data) => makeTable(data.documents));

let carArray = ["licence", "maker", "model", "owner", "price", "color"];

// const reloadPage = () => {
//   window.location.reload();
// };

const addCar = (event) => {
  event.preventDefault();
  let licence = document.querySelector("#licence").value;
  let maker = document.querySelector("#maker").value;
  let model = document.querySelector("#model").value;
  let owner = document.querySelector("#owner").value;
  let price = Number(document.querySelector("#price").value);
  let color = document.querySelector("#color").value;

  if (licence && maker && model && owner && price && color) {
    API.post("CarLicence", {
      fields: {
        licence: {
          stringValue: licence,
        },
        maker: {
          stringValue: maker,
        },
        model: {
          stringValue: model,
        },
        owner: {
          stringValue: owner,
        },
        price: {
          integerValue: price,
        },
        color: {
          stringValue: color,
        },
      },
    });
  }
  formInput.submit();
  // reloadPage();
};

const makeTable = (items) => {
  let result = "<table border=1 >";
  result += "<tr>";
  for (const key of carArray) {
    result += "<th>" + key + "</th>";
  }
  result += "</tr>";
  if (items) {
    for (const item of items) {
      const carItem = item.fields;
      result += "<tr>";
      for (const key of carArray) {
        for (const car of Object.keys(item.fields)) {
          if (car === key) {
            result += "<td>" + Object.values(item.fields[key]) + "</td>";
          }
        }
      }
      result += "</tr>";
    }

    result += "</table>";
    resultTable.innerHTML = result;
  }
};

const searchLicence = (e) => {
  const carList = [];
  API.get("CarLicence").then((data) => {
    data.documents.forEach((item, i) => {
      const licence = item.fields.licence.stringValue;
      if (licence.toLowerCase().indexOf(e.target.value.toLowerCase()) !== -1) {
        carList.push(data.documents[i]);
      }
    });
    makeTable(carList);
  });
};

const resetForm = (e) => {
  e.preventDefault();
  API.get("CarLicence").then((data) => {
    if (data) {
      data.documents.forEach((item) => {
        const getEndpoint = item.name.slice(59);
        API.delete(getEndpoint);
      });
    }
  });
  resultTable.textContent = "";
};

const addForm = (e) => {
  inputContainer.style.visibility = "visible";
};

const backPage = (e) => {
  inputContainer.style.visibility = "hidden";
};

formInput.addEventListener("submit", addCar);
searchInput.addEventListener("change", searchLicence);
resetInput.addEventListener("click", resetForm);
addButton.addEventListener("click", addForm);
backButton.addEventListener("click", backPage);
