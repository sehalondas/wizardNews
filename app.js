const express = require("express");
const morgan = require("morgan");
const app = express();
const postBank = require("./postBank");
const timeAgo = require("node-time-ago");

app.use(morgan("dev"));
app.use(express.static("public"));

const postDetails = app.get('/posts/:id', (req, res) => {
  const id = req.params.id;
  const post = postBank.find(id);
  if (!post.id) {
    throw new Error('Not Found')
  }
  res.send(`<!DOCTYPE html>
  <html>
  <head>
    <title>Wizard News</title>
    <link rel="stylesheet" href="/style.css" />
  </head>
  <body>
    <div class="news-list">
      <header><img src="/logo.png"/>Wizard News</header>
        <div class='news-item'>
          <p>
            <span class="news-position">${post.id}. ▲</span>
            ${post.title}
            <small>(by ${post.name})</small>
          </p>
          <small class="news-info">
            ${post.upvotes} upvotes | ${post.date}
          </small>
          <div>${post.content}</div>
        </div>
    </div>
  </body>
</html>`
)});

const postList = app.get("/", (req, res) => {
  const posts = postBank.list();
  const html =`<!DOCTYPE html>
  <html>
  <head>
    <title>Wizard News</title>
    <link rel="stylesheet" href="/style.css" />
  </head>
  <body>
    <div class="news-list">
      <header><img src="/logo.png"/>Wizard News</header>
      ${posts.map(post => `
        <div class='news-item'>
          <p>
            <span class="news-position">${post.id}. ▲</span>
            <a href="/posts/${post.id}">${post.title}</a>
            <small>(by ${post.name})</small>
          </p>
          <small class="news-info">
            ${post.upvotes} upvotes | ${timeAgo(post.date)}
          </small>
        </div>`
      ).join('')}
    </div>
  </body>
</html>`;

  res.send(html);
});

app.get("/", (req, res) => {
  const posts = postBank.list();
  res.send(postList(posts));
});

app.get("/posts/:id", (req, res) => {
  const id = req.params.id;
  const post = postBank.find(id);
  res.send(postDetails(post));
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).send(`${err}`);
});

const { PORT = 1337 } = process.env;

app.listen(PORT, () => {
  console.log(`App listening in port ${PORT}`);
});