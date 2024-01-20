const API = "https://api.github.com/users/";
let url = null;
let currentPage = 1;
const perPage = 10;
let repoArr = [];
let cnt = 0;
let particular_page = null;
let totalpages = null;
let repositoriesContainer = document.getElementById("repositories");

const create_prev_next_button = () => {
  const element = document.getElementById("page-containers");
  element.innerHTML = `<button id="prev">prev</button>
    <ul id="page-shift-container">          
    </ul>
    <button id="next">next</button>`;
  const prev_button = document.getElementById("prev");
  const next_button = document.getElementById("next");
  prev_button.addEventListener("click", () => {
    currentPage = currentPage > 1 ? currentPage - 1 : 1;
    getUser(currentPage);
});
next_button.addEventListener('click', () => {
    currentPage = currentPage < totalpages ? currentPage + 1 : totalpages;
    getUser(currentPage);
  });
};

const getUser = async (current) => {
  // create the div for prev next
  create_prev_next_button();
  // --------------------------
  const user = document.getElementById("input").value;
  const fetchRepo = await fetch(API + user);
  const totalRepo = await fetchRepo.json();
  totalpages = Math.ceil(totalRepo.public_repos / 10);
  document.getElementById("url").innerHTML = `<p>${totalRepo.url}</p>`;
  const image = document.getElementById("image");
  image.innerHTML = `<img src=${totalRepo.avatar_url}/>`;
  const detail = document.getElementById("details");
  detail.innerHTML = `<h1>${totalRepo.name}</h1>
        <p>${totalRepo.bio}</p>
        <p>${totalRepo.location}</p>
        <p>${totalRepo.twitter_username}</p>`;
  const Repo = await fetch(
    API + user + "/repos" + `?per_page=${perPage}&page=${current}`
  );
  const data = await Repo.json();
  displayRepositories(data);
  createRequiredPage(totalpages);
};

function displayRepositories(repositories) {
  repositoriesContainer.innerHTML = "";

  repositories.forEach((repo) => {
    const repoLink = document.createElement("a");
    repoLink.href = repo.html_url;
    repoLink.target = "_blank";
    repoLink.innerHTML = `<h3>${repo.name}</h3>`;

    const repoElement = document.createElement("div");
    repoElement.classList.add("repository");
    repoElement.appendChild(repoLink);

    const descriptionElement = document.createElement("p");
    descriptionElement.textContent =
      repo.description || "No description available.";
    repoElement.appendChild(descriptionElement);

    const languageButton = document.createElement("button");
    languageButton.textContent = repo.language || "Not specified";
    repoElement.appendChild(languageButton);

    repositoriesContainer.appendChild(repoElement);
    repoArr.push(repoElement);
  });
}

function createRequiredPage(totalpages) {
  const pageShiftContainer = document.getElementById("page-shift-container");
  pageShiftContainer.innerHTML = '';
  let num = parseInt(totalpages);
  if (cnt == 0) {
    for (let i = 1; i <= num; ++i) {
      const listItem = document.createElement("li");
      listItem.classList.add(`list`);
      listItem.textContent = i;
      pageShiftContainer.appendChild(listItem);
      listItem.addEventListener("click", handleListItemClick);
    }
  }
  cnt++;
}

function handleListItemClick(event) {
  event.target.style.backgroundColor = "blue";
  const innertext = event.target.innerText;
  getUser(innertext);
  currentPage = innertext;
  document.querySelectorAll(".list").forEach(function (item) {
    item.style.backgroundColor = "";
  });

  const clickedItem = event.target;
  clickedItem.style.backgroundColor = "green";
}
