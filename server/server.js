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

// Delete a specific post
// app.delete('/api/posts/:id', (req, res) => {
//   const { id } = req.params;
//   const postIndex = posts.findIndex(post => post.id === parseInt(id));

//   if (postIndex !== -1) {
//     posts.splice(postIndex, 1);
//     return res.status(200).json({ message: `Post with id ${id} deleted.` });
//   }

//   res.status(404).json({ message: `Post with id ${id} not found.` });
// });

// // Delete all posts
// app.delete('/api/posts', (req, res) => {
//   posts.length = 0; // Clears the posts array
//   res.status(200).json({ message: 'All posts have been deleted.' });
// });

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
