"use strict";

const input = document.querySelector("input");
const li = document.getElementsByTagName("li");
const completeBox = document.querySelector(".autocomplete-box");
const wrapper = document.querySelector(".wrapper");

function debounce(fn) {
  let interval;
  return function () {
    let callFn = () => fn.apply(this, arguments);

    clearTimeout(interval);

    interval = setTimeout(callFn, 400);
  };
}

input.addEventListener("keyup", debounce(main));

async function main(e) {
  try {
    let userInput = e.target.value;
    let repoArr = await getRepos(userInput);
    let shortArr = await showRepos(repoArr);
    addRepoCard(shortArr);
  } catch (e) {
    completeBox.classList.remove("autocomplete-box--active");
  }
}

function getRepos(userInput) {
  return fetch(
    `https://api.github.com/search/repositories?q=${userInput}+in:name&sort=stars`
  ).then((response) => response.json());
}

async function showRepos(repoArr) {
  try {
    let fiveRepoArr = repoArr.items.slice(0, 5);
    let fiveNames = fiveRepoArr.map(({ name }) => {
      return name;
    });
    fiveNames = fiveNames.map((name) => {
      return (name = `<li>${name}</li>`);
    });
    let listData;

    if (!fiveNames.length) {
    } else {
      listData = fiveNames.join("");
      completeBox.classList.add("autocomplete-box--active1");
    }
    completeBox.innerHTML = listData;
  } catch {
    completeBox.classList.remove("autocomplete-box--active1");
  }

  return repoArr.items.slice(0, 5);
}

function addRepoCard(fiveRepoArr) {
  let myliArr = Array.from(li);
  console.log(fiveRepoArr);
  myliArr.forEach((item) => {
    item.addEventListener("click", addCard);
  });
  async function addCard(e) {
    input.value = "";
    completeBox.classList.remove("autocomplete-box--active1");
    const newCard = document.createElement("div");
    newCard.classList.add("card");
    const name = document.createElement("span");
    name.textContent = `Name: ${fiveRepoArr[myliArr.indexOf(e.target)].name}`;

    const owner = document.createElement("span");
    owner.textContent = `Owner: ${
      fiveRepoArr[myliArr.indexOf(e.target)].owner.login
    }`;

    const stars = document.createElement("span");
    stars.textContent = `Stars: ${
      fiveRepoArr[myliArr.indexOf(e.target)].stargazers_count
    }`;

    const cardField = document.createElement("div");
    cardField.classList.add("card-field");

    const btn = document.createElement("button");
    btn.classList.add("cross");
    const span = document.createElement("span");
    span.classList.add("cross_span");
    const card = document.createElement("div");
    card.classList.add("card");

    cardField.appendChild(name);
    cardField.appendChild(owner);
    cardField.appendChild(stars);
    btn.appendChild(span);
    btn.appendChild(span.cloneNode(true));
    btn.addEventListener("click", () => {
      card.remove();
    });
    card.appendChild(cardField);
    card.appendChild(btn);
    wrapper.appendChild(card);
  }
}
