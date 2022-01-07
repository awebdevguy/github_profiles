const API_URL = 'http://api.github.com/users/';
const main = document.getElementById('main');
const form = document.getElementById('form');
const search = document.getElementById('search');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const user = search.value;

  if(user) {
    getUser(user);
    search.value = '';
  }
});

async function getUser(username) {
  
  try {
    const {data} = await axios(API_URL + username);
    createUserCard(data);
    getRepos(username);
    console.log(data);
  } catch(err) {
    if(err.response.status == 404) {
      createErrorCard('Username not found.');
    } else {
      console.log(err);
    }
  }
}

async function getRepos(username) {

  try {
    const {data} = await axios(API_URL + username + '/repos?sort=created');
    addReposToCard(data);
    console.log(data);
  } catch(err) {
    if(err.response.status == 404) {
      createErrorCard('Problem fetching repos.');
    } else {
      console.log(err);
    }
  }
}

function createUserCard(user) {
  const cardHTML = 
    `
      <div class="card">
        <div>
          <img src="${user.avatar_url}" alt="" class="avatar">
        </div>
        <div class="user-info">
          <h2>${user.name}</h2>
          <p>${user.bio}</p>

          <ul>
            <li>${user.followers} <strong>followers</strong></li>
            <li>${user.following} <strong>following</strong></li>
            <li>${user.public_repos} <strong>repos</strong></li>
          </ul>

          <div id="repos"></div>
        </div>
      </div>
    `
  main.innerHTML = cardHTML;
}

function createErrorCard(msg) {
  const cardHTML =
  `
    <div class="card">
      <h1>${msg}</h1>
    </div>
  `
  main.innerHTML = cardHTML;
}

function addReposToCard(repos) {
  const reposEl = document.getElementById('repos');
  
  repos.slice(0, 10).forEach(repo => {
    const repoEl = document.createElement('a');
    repoEl.classList.add('repo');
    repoEl.href = repo.html_url;
    repoEl.target = '_blank';
    repoEl.innerText = repo.name;
    reposEl.appendChild(repoEl);
  });
}

// function getUser(username) {
//   axios(API_URL + username)
//     .then(response => console.log(response.data))
//     .catch(err => console.log(err));
// }
