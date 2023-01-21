const inputSearch = document.querySelector("input");
const inputMenu = document.querySelector(".menu");
const repositorieslist = document.querySelector(".repositories");

function removePredictions() {
    inputMenu.innerHTML = "";
}

function showPredictions(repositories) {
    removePredictions();
    for (let repositoryIndex = 0; repositoryIndex < 5; repositoryIndex++) {
	let name = repositories.items[repositoryIndex].name;
    let owner = repositories.items[repositoryIndex].owner.login;
    let stars = repositories.items[repositoryIndex].stargazers_count;
	inputMenu.insertAdjacentHTML("afterbegin", `<div class="menu__item" data-owner="${owner}" data-stars="${stars}">${name}</div>`);
    }
}

async function getPredictions() {
    const urlSearchRepositories = new URL("https://api.github.com/search/repositories");
    if (inputSearch.value == "") {
	removePredictions();
    }
    urlSearchRepositories.searchParams.append("q", inputSearch.value)
    try {
	let response = await fetch(urlSearchRepositories);
	if (response.ok) {
	    let repositories = await response.json();
	    showPredictions(repositories);
	}
    } catch(error) {
		alert("Ошибка HTTP: " + response.status);
    }
}

repositorieslist.addEventListener("click", function(event) {
    let target = event.target;
    target.parentElement.remove();
});


function addChosen(target) {
    let name = target.textContent;
    let owner = target.dataset.owner;
    let stars = target.dataset.stars;
    
	repositorieslist.insertAdjacentHTML("afterbegin",`<div class="repository__item ">Name: ${name}<br>Owner: ${owner}<br>Stars: ${stars} <button class="closebutton"></button></div>`); 
}

inputMenu.addEventListener("click", function(event) {
    let target = event.target;
    addChosen(target);
    inputSearch.value = "";
    removePredictions();
});

function debounce(fn, timeout) {
    let timer = null;

    return (...args) => {
	clearTimeout(timer);
	return new Promise((resolve) => {
	    timer = setTimeout(
		() => resolve(fn(...args)),
		timeout,
	    );
	});
    };
}

inputSearch.addEventListener("input", debounce(getPredictions, 400));