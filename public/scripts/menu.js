async function getblockList() {
    const areablockResponse = await fetch('/data/areablock.json');
    const areablock = await areablockResponse.json();
    return areablock;
  }

function generateMenu() {
    const container = document.getElementById('container');
    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.classList.add('post');
        postElement.innerHTML = `
            <h2>${post.title}</h2>
            <p>${post.content}</p>
            <p><strong>Author:</strong> ${post.author}</p>
        `;
        container.appendChild(postElement);
    });
}

let areablock;
console.log(areablock);
generateMenu(areablock);  