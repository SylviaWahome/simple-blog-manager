// src/index.js
const BASE_URL = 'http://localhost:3000/posts';

let currentPostId = null;

function displayPosts() {
  fetch(BASE_URL)
    .then((res) => res.json())
    .then((posts) => {
      const postList = document.getElementById('post-list');
      postList.innerHTML = '';

      posts.forEach((post) => {
        const div = document.createElement('div');
        div.textContent = post.title;
        div.addEventListener('click', () => handlePostClick(post));
        div.dataset.id = post.id;
        postList.appendChild(div);
      });
    });
}

function handlePostClick(post) {
  currentPostId = post.id;
  
  // Remove selected from all
  document.querySelectorAll('#post-list div').forEach(div => div.classList.remove('selected'));

  // Highlight selected
  const selectedDiv = document.querySelector(`#post-list div[data-id='${post.id}']`);
  if (selectedDiv) selectedDiv.classList.add('selected');

  document.getElementById('post-title').textContent = post.title;
  document.getElementById('post-content').textContent = post.content;
  document.getElementById('post-author').textContent = `By ${post.author}`;

  document.getElementById('edit-title').value = post.title;
  document.getElementById('edit-content').value = post.content;

  document.getElementById('edit-post-form').classList.remove('hidden');
}

function addNewPostListener() {
  const form = document.getElementById('new-post-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const title = document.getElementById('new-title').value;
    const content = document.getElementById('new-content').value;
    const author = document.getElementById('new-author').value;

    fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content, author })
    })
      .then((res) => res.json())
      .then(() => {
        form.reset();
        displayPosts();
      });
  });
}

function setupEditListener() {
  const editForm = document.getElementById('edit-post-form');
  editForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const updatedTitle = document.getElementById('edit-title').value;
    const updatedContent = document.getElementById('edit-content').value;

    fetch(`${BASE_URL}/${currentPostId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: updatedTitle, content: updatedContent })
    })
      .then((res) => res.json())
      .then((updatedPost) => {
        displayPosts();
        handlePostClick(updatedPost);
      });
  });

  document.getElementById('cancel-edit').addEventListener('click', () => {
    editForm.classList.add('hidden');
  });
}

function setupDeleteListener() {
  document.getElementById('delete-button').addEventListener('click', () => {
    if (!currentPostId) return;
    if (!confirm('Are you sure you want to delete this post?')) return;

    fetch(`${BASE_URL}/${currentPostId}`, { method: 'DELETE' })
      .then(() => {
        currentPostId = null;
        displayPosts();
        document.getElementById('post-title').textContent = 'Select a post to view details';
        document.getElementById('post-content').textContent = '';
        document.getElementById('post-author').textContent = '';
        document.getElementById('edit-post-form').classList.add('hidden');
      });
  });
}

function main() {
  displayPosts();
  addNewPostListener();
  setupEditListener();
  setupDeleteListener();
}

document.addEventListener('DOMContentLoaded', main);