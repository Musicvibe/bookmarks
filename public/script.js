function addBookmark() {
    const titleInput = document.getElementById("titleInput");
    const urlInput = document.getElementById("bookmarkInput");
    const title = titleInput.value.trim();
    const url = urlInput.value.trim();
    if (url === "" || title === "") return;

    fetch('/bookmarks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, url })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to add bookmark');
        }
        return response.json();
    })
    .then(data => {
        console.log('Bookmark added successfully');
        renderBookmarks();
        titleInput.value = "";
        urlInput.value = "";
    })
    .catch(error => {
        console.error('Error adding bookmark:', error.message);
    });
}

function renderBookmarks() {
    fetch('/bookmarks')
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch bookmarks');
        }
        return response.json();
    })
    .then(bookmarks => {
        const bookmarkList = document.getElementById("bookmarkList");
        bookmarkList.innerHTML = "";

        bookmarks.forEach((bookmark, index) => {
            const row = `
                <tr>
                    <td>${index + 1}</td>
                    <td>${bookmark.title}</td>
                    <td>${bookmark.url}</td>
                    <td>${bookmark.timestamp}</td>
                    <td><button onclick="deleteBookmark(${bookmark.id})">Delete</button></td>
                </tr>
            `;
            bookmarkList.innerHTML += row;
        });
    })
    .catch(error => {
        console.error('Error rendering bookmarks:', error.message);
    });
}

function deleteBookmark(id) {
    fetch(`/bookmarks/${id}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to delete bookmark');
        }
        console.log('Bookmark deleted successfully');
        renderBookmarks();
    })
    .catch(error => {
        console.error('Error deleting bookmark:', error.message);
    });
}

function searchBookmarks() {
    const searchInput = document.getElementById("searchInput");
    const searchTerm = searchInput.value.trim().toLowerCase();

    fetch('/bookmarks/search?q=' + searchTerm)
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to search bookmarks');
        }
        return response.json();
    })
    .then(bookmarks => {
        const bookmarkList = document.getElementById("bookmarkList");
        bookmarkList.innerHTML = "";

        bookmarks.forEach((bookmark, index) => {
            const row = `
                <tr>
                    <td>${index + 1}</td>
                    <td>${bookmark.title}</td>
                    <td>${bookmark.url}</td>
                    <td>${bookmark.timestamp}</td>
                    <td><button onclick="deleteBookmark(${bookmark.id})">Delete</button></td>
                </tr>
            `;
            bookmarkList.innerHTML += row;
        });
    })
    .catch(error => {
        console.error('Error searching bookmarks:', error.message);
    });
}

document.addEventListener('DOMContentLoaded', renderBookmarks);
