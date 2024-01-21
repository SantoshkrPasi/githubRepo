const API = "https://api.github.com/users/";
let url = null;
let currentPage = 1;
let perPage = 10;
let repoArr = [];
let cnt = 0;
let particular_page = null;
let totalpages = null;
let repositoriesContainer = document.getElementById("repositories");

// states for tabs
let activeTab = 1;

  const prev_button = document.getElementById("prev");
  const next_button = document.getElementById("next");
  prev_button.addEventListener("click", () => {
    currentPage = currentPage > 1 ? currentPage - 1 : 1;
    getUser(currentPage);
    if(activeTab == 1)
    return;
    const prevtab = document.getElementById('list-' + activeTab)
    prevtab.style.backgroundColor = "white"
    activeTab--;
    const nextTab = document.getElementById('list-' + activeTab)
    nextTab.style.backgroundColor = "#ADD8E6";
   console.log(tab)

});

next_button.addEventListener('click', () => {
    currentPage = currentPage < totalpages ? currentPage + 1 : totalpages;
    getUser(currentPage);
    if(activeTab == totalpages)
    return;
    const prevtab = document.getElementById('list-' + activeTab)
    prevtab.style.backgroundColor = "white"
    activeTab++;
    const nextTab = document.getElementById('list-' + activeTab)
    nextTab.style.backgroundColor = "#ADD8E6";
   console.log(tab)

  });

 
  const searchUser = async (current) => {
   document.getElementById("repo-count").style.display='block';
    repositoriesContainer.innerHTML = "";
    const load = document.createElement('div');
    load.classList.add("loader");
    repositoriesContainer.appendChild(load);

    // const loader= document.getElementById("loader-container")
    // console.log("loader:",loader)
    // loader.classList.add('loaderActive')
    
    const user = document.getElementById("input").value;
    const fetchRepo = await fetch(API + user);
    if (!fetchRepo.ok) {
      document.getElementById("main").innerHTML = "<h1>User not found</h1>";
      document.getElementById("main").style.textAlign = "center";    
      return;
    }
  
   
    const totalRepo = await fetchRepo.json();
    totalpages = Math.ceil(totalRepo.public_repos / perPage);


    document.getElementById("url").innerHTML =`<img src="./hyperlink.png" alt="image"> <a href="${totalRepo.html_url}" target="_blank">${totalRepo.html_url}</a>`
    const image = document.getElementById("image");
    image.innerHTML = `<img src=${totalRepo.avatar_url}/>`;
    const detail = document.getElementById("details");
    detail.innerHTML = `<h1>${totalRepo.name}</h1>
          <p>${totalRepo.bio}</p>
          <section><img src="./map.png" alt="image"><p>${totalRepo.location}</p></section>
          ${totalRepo.twitter_username !== null ? `<p>Twitter : https://twitter.com/${totalRepo.twitter_username}</p>` : ''}`;
          const Repo = await fetch( API + user + "/repos" + `?per_page=${perPage}&page=${current}`

          );
    
    
    var pageContainer = document.getElementById('page-containers');
    if (!pageContainer.classList.contains('show-children')) {
        pageContainer.classList.add('show-children');
    }
    

    const data = await Repo.json();

    if (data.message === "Not Found") {
      repositoriesContainer.innerHTML = "No repositories found for the user";
      return;
    }

    repositoriesContainer.removeChild(load);

    displayRepositories(data);
    const repo_tabs_container = document.getElementById("page-shift-container"); 
    repo_tabs_container.innerHTML = "";
    cnt=0;
    createRequiredPage(totalpages);
  };
  
  
const getUser = async (current) => {
  const user = document.getElementById("input").value;
  
  repositoriesContainer.innerHTML = "";
    const load = document.createElement('div');
    load.classList.add("loader");
    repositoriesContainer.appendChild(load);
  
  const fetchRepo = await fetch(API + user);
  if (!fetchRepo.ok) {
    document.getElementById("main").innerHTML = "<h1>User not found</h1>";
    document.getElementById("main").style.textAlign = "center";    
    return;
  }
  


  const totalRepo = await fetchRepo.json();
  totalpages = Math.ceil(totalRepo.public_repos / perPage);
  document.getElementById("url").innerHTML =`<img src="./hyperlink.png" alt="image"> <a href="${totalRepo.html_url}" target="_blank">${totalRepo.html_url}</a>`
  const image = document.getElementById("image");
  image.innerHTML = `<img src=${totalRepo.avatar_url}/>`;
  const detail = document.getElementById("details");
  detail.innerHTML = `<h1>${totalRepo.name}</h1>
        <p>${totalRepo.bio}</p>
        <section><img src="./map.png" alt="image"><p>${totalRepo.location}</p></section>
        ${totalRepo.twitter_username !== null ? `<p>Twitter : https://twitter.com/${totalRepo.twitter_username}</p>` : ''}`;
  const Repo = await fetch(
    API + user + "/repos" + `?per_page=${perPage}&page=${current}`
  );
  
  var pageContainer = document.getElementById('page-containers');
  if (!pageContainer.classList.contains('show-children')) {
      pageContainer.classList.add('show-children');
  }
  
  const data = await Repo.json();
  if (data.message === "Not Found") {
    repositoriesContainer.innerHTML = "No repositories found for the user";
    return;
  }
  repositoriesContainer.removeChild(load);
  displayRepositories(data);


  // const repo_tabs_container = document.getElementById("page-shift-container"); 
  // repo_tabs_container.innerHTML = "";
  createRequiredPage(totalpages);
};



async function displayRepositories(repositories) {
  // repositoriesContainer.innerHTML = "";
  // repositories.
  
  for(let i = 0 ; i <repositories.length ; ++i)
  {
    const repo = repositories[i];
    const repoLink = document.createElement("a");
    repoLink.href = repo.html_url;
    repoLink.target = "_blank";
    repoLink.innerHTML = `<h3>${repo.name}</h3>`;

    const repoElement = document.createElement("div");
    repoElement.classList.add("repository");
    repoElement.appendChild(repoLink);

    const descriptionElement = document.createElement("p");
    // descriptionElement.classList.add("repo_description");
    descriptionElement.textContent =
      repo.description || "No description available.";
    repoElement.appendChild(descriptionElement);
      
   
    const langData = await fetch(repo.languages_url);
    const langArr = await langData.json()
    Object.keys(langArr).forEach(lang =>{
    const languageButton = document.createElement("button");
    languageButton.textContent = lang || "Not specified";
    repoElement.appendChild(languageButton);
    })
    repositoriesContainer.appendChild(repoElement);
    repoArr.push(repoElement);
    // console.log(Object.keys(langData));
  }
}

function createRequiredPage(totalpages) {
  const pageShiftContainer = document.getElementById("page-shift-container");
  let num = parseInt(totalpages);
  console.log(cnt)
  if (cnt == 0) {
    for (let i = 1; i <= num; ++i) {
      const listItem = document.createElement("li");
      listItem.id = `list-${i}`
      listItem.classList.add(`list`);
      listItem.textContent = i;
      pageShiftContainer.appendChild(listItem);
      listItem.addEventListener("click", handleListItemClick);
    }
  }
  cnt++;
  console.log("test:",pageShiftContainer)
}

function handleListItemClick(event) {
  activeTab = parseInt(event.target.id.slice(5,));

  const innertext = event.target.innerText;
  getUser(innertext);
  currentPage = innertext;
  document.querySelectorAll(".list").forEach(function (item) {
    item.style.backgroundColor = "white";
  });
  event.target.style.backgroundColor = "#ADD8E6";
}




document.getElementById("repo-count-change").addEventListener("input", function(event) {
   perPage = event.target.value;

  if (perPage > 100) {
      perPage = 100;
      event.target.value = "100";
  }
  if(perPage < 1)
  {
    perPage = 1;
    event.target.value = "1";
  }
  searchUser();  
});

