const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

const posts = [];

app.post('/api/posts', (req, res) => {
  const { name, role, avatar, text, image, categories } = req.body;
  const newPost = {
    id: posts.length + 1,
    name,
    role,
    avatar,
    text,
    image,
    categories,
  };

  posts.push(newPost);
  res.status(201).json(newPost); 
});

app.get('/api/posts', (req, res) => {
  res.json(posts);
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
