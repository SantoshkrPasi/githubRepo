const API = "https://api.github.com/users/";
let url = null;
let currentPage = 1;
const perPage = 10;
let repositoriesContainer = document.getElementById('repositories');

const getNext = () =>{
repoArr.forEach((item)=>{
  repositoriesContainer.removeChild(item);
  
})
currentPage += 1;
console.log(object)
console.log(repoArr , "check")
}


const getUser = async () => {
    const user = document.getElementById("input").value;
    const fetchRepo = await fetch(API + user);
    const totalRepo = await fetchRepo.json();
    const pages = Math.ceil(totalRepo.public_repos/10); 
    // totalRepo.forEach(repo => {
        document.getElementById("url").innerHTML=`<p>${totalRepo.url}</p>`
        const image = document.getElementById("image");
        image.innerHTML = `<img src=${totalRepo.avatar_url}/>`
        const detail = document.getElementById("details");
        detail.innerHTML = `<h1>${totalRepo.name}</h1>
        <p>${totalRepo.bio}</p>
        <p>${totalRepo.location}</p>
        <p>${totalRepo.twitter_username}</p>`
    // });
 
    const Repo = await fetch(API + user + "/repos" + `?per_page=${perPage}&page=${currentPage}`)
    const data = await Repo.json();
    displayRepositories(data);
}
 

let repoArr = [];
function displayRepositories(repositories) {
   
    repositoriesContainer.innerHTML = '';

    repositories.forEach(repo => {
        const repoLink = document.createElement('a');
        repoLink.href = repo.html_url; 
        repoLink.target = "_blank";
        repoLink.innerHTML = `<h3>${repo.name}</h3>`;

        const repoElement = document.createElement('div');
        repoElement.classList.add('repository');
        repoElement.appendChild(repoLink);

        const descriptionElement = document.createElement('p');
        descriptionElement.textContent = repo.description || "No description available.";
        repoElement.appendChild(descriptionElement);

        const languageButton = document.createElement('button');
        languageButton.textContent = repo.language || "Not specified";
        repoElement.appendChild(languageButton);

        repositoriesContainer.appendChild(repoElement);
        repoArr.push(repoElement);

    });


}

const number_of_page = document.getElementById("page-shift-container");







