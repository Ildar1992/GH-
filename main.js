const searchPanel = document.querySelector("input");
const searchList = document.getElementsByTagName("li");
const completeBox = document.querySelector(".autocomplete-box");
const wrapper = document.querySelector(".wrapper");

function debounce(fn) {
  let interval;
  return function () {
    let callableFunction = () => fn.apply(this, arguments);

    clearTimeout(interval);

    interval = setTimeout(callableFunction, 400);
  };
}

searchPanel.addEventListener("input", debounce(main));

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
    `https://api.github.com/search/repositories?q=${userInput}&per_page=5`
  ).then((response) => response.json());
}

async function showRepos(repoArr) {
  try {
    let fiveNames = repoArr.items.map(({ name }) => {
      return name;
    });
    fiveNames = fiveNames.map((name) => {
      return (name = `<li>${name}</li>`);
    });
    let listData = "Репозитория не обнаружено";

    if (!fiveNames.length) {
    } else {
      listData = fiveNames.join("");
      completeBox.classList.add("autocomplete-box--active1");
    }
    completeBox.innerHTML = listData;
  } catch {
    completeBox.classList.remove("autocomplete-box--active1");
  }

  return repoArr.items;
}

function addRepoCard(fiveRepoArr) {
  let listArr = Array.from(searchList);
  listArr.forEach((item) => {
    item.addEventListener("click", addCard);
  });
  async function addCard(e) {
    searchPanel.value = "";
    completeBox.classList.remove("autocomplete-box--active1");
    const newCard = document.createElement("div");
    newCard.classList.add("card");

    const name = document.createElement("span");
    name.textContent = `Name: ${fiveRepoArr[listArr.indexOf(e.target)].name}`;

    const owner = document.createElement("span");
    owner.textContent = `Owner: ${
      fiveRepoArr[listArr.indexOf(e.target)].owner.login
    }`;

    const stars = document.createElement("span");
    stars.textContent = `Stars: ${
      fiveRepoArr[listArr.indexOf(e.target)].stargazers_count
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
    btn.addEventListener("click", function () {
      btn.removeEventListener("click", arguments.callee);
      card.remove();
    });

    card.appendChild(cardField);
    card.appendChild(btn);
    wrapper.appendChild(card);
  }
}
