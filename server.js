import jsonServer from 'json-server'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const server = jsonServer.create()
const router = jsonServer.router(join(__dirname, 'db.json'))
const middlewares = jsonServer.defaults()

const SECRET_KEY = 'your-secret-key'
const expiresIn = '1h'

server.use(middlewares)
server.use(jsonServer.bodyParser)

// Create a token
function createToken(payload) {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: expiresIn })
}
// Verify the token
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header missing' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Token not provided' });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    req.user = decoded;
    next();
  });
}

// Register endpoint
server.post('/register', (req, res) => {
  const { name, email, password } = req.body

  if (router.db.get('users').find({ email }).value()) {
    return res.status(400).json({ message: 'Email már használatban van' })
  }

  const hashedPassword = bcrypt.hashSync(password, 8)
  const user = {
    id: Date.now(),
    name,
    email,
    password: hashedPassword,
  }

  router.db.get('users').push(user).write()

  const accessToken = createToken({ email, name })
  res.status(200).json({ token: accessToken, user: { id: user.id, name, email } })
})

// Login endpoint
server.post('/login', (req, res) => {
  const { email, password } = req.body
  const user = router.db.get('users').find({ email }).value()

  if (!user) {
    return res.status(400).json({ message: 'Felhasználó nem található' })
  }

  const validPassword = bcrypt.compareSync(password, user.password)
  if (!validPassword) {
    return res.status(400).json({ message: 'Hibás jelszó' })
  }

  const accessToken = createToken({ email, name: user.name })
  res.status(200).json({ token: accessToken, user: { id: user.id, name: user.name, email } })
})

// Profil frissítése endpoint
server.put('/profile/update',verifyToken, (req, res) => {
  const { id, name, email } = req.body

  const user = router.db
    .get('users')
    .find({ id: parseInt(id) })
    .value()

  if (!user) {
    return res.status(400).json({ message: 'Felhasználó nem található' })
  }


  if (email !== user.email) {
    const existingUser = router.db.get('users').find({ email }).value()
    if (existingUser) {
      return res.status(400).json({ message: 'Ez az email cím már használatban van' })
    }
  }


  router.db
    .get('users')
    .find({ id: parseInt(id) })
    .assign({ name, email })
    .write()

  res.status(200).json({ message: 'Profil sikeresen frissítve', user: { id, name, email } })
})


server.put('/profile/change-password', (req, res) => {
  const { id, currentPassword, newPassword } = req.body

  const user = router.db
    .get('users')
    .find({ id: parseInt(id) })
    .value()

  if (!user) {
    return res.status(400).json({ message: 'Felhasználó nem található' })
  }


  const validPassword = bcrypt.compareSync(currentPassword, user.password)
  if (!validPassword) {
    return res.status(400).json({ message: 'A jelenlegi jelszó helytelen' })
  }


  const hashedPassword = bcrypt.hashSync(newPassword, 8)
  router.db
    .get('users')
    .find({ id: parseInt(id) })
    .assign({ password: hashedPassword })
    .write()

  res.status(200).json({ message: 'Jelszó sikeresen megváltoztatva' })
})


// server.use(/^(?!\/auth).*$/, (req, res, next) => {
//   if (
//     req.headers.authorization === undefined ||
//     req.headers.authorization.split(' ')[0] !== 'Bearer'
//   ) {
//     return res.status(401).json({ message: 'Hiányzó token' })
//   }
//   try {
//     verifyToken(req.headers.authorization.split(' ')[1])
//     next()
//   } catch (err) {
//     res.status(401).json({ message: 'Érvénytelen vagy lejárt token' })
//   }
// })

server.use(router)
server.listen(3000, () => {
  console.log('JSON Server is running on port 3000')
})


// Protected POST endpoint to create a new post
server.post('/posts', verifyToken, (req, res) => {
  const { title, subtitle, description, content, picture, category, author, email } = req.body

  if (!title || !content) {
    return res.status(400).json({ message: 'Title and content are required' })
  }


  const post = {
    id: Date.now(), // simple unique ID generation; consider a more robust solution if needed
    title,
    subtitle,
    description,
    content,
    picture,
    category,
    author,
    email
  }

  router.db.get('posts').push(post).write()

  res.status(200).json(post)
})

// Retrieve all blog posts
server.get('/posts', (req, res) => {
  const posts = router.db.get('posts').value();
  res.status(200).json(posts);
});

// Retrieve a single blog post by id
server.get('/posts/:id', (req, res) => {
  const postId = parseInt(req.params.id, 10);
  const post = router.db.get('posts').find({ id: postId }).value();

  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }

  res.status(200).json(post);
});


server.put('/posts/:id', verifyToken, (req, res) => {
  const postId = parseInt(req.params.id, 10)
  const existingPost = router.db.get('posts').find({ id: postId }).value()

  if (!existingPost) {
    return res.status(404).json({ message: 'Post not found' })
  }

  // Check if the logged-in user (decoded in req.user) is the creator
  if (existingPost.email !== req.user.email) {
    return res.status(403).json({ message: 'Unauthorized: Only the creator can modify this post' })
  }

  // Merge the existing post with the new data
  const updatedPost = { ...existingPost, ...req.body }
  router.db.get('posts').find({ id: postId }).assign(updatedPost).write()

  res.status(200).json(updatedPost)
})

server.delete('/posts/:id', verifyToken, (req, res) => {
  const postId = parseInt(req.params.id, 10)
  const existingPost = router.db.get('posts').find({ id: postId }).value()

  if (!existingPost) {
    return res.status(404).json({ message: 'Post not found' })
  }

  // Verify that the user trying to delete the post is its creator
  console.log(`${existingPost.email} - ${req.user.email}`)
  if (existingPost.email !== req.user.email) {
    return res.status(403).json({ message: 'Unauthorized: Only the creator can delete this post' })
  }

  router.db.get('posts').remove({ id: postId }).write()
  res.status(200).json({ message: 'Post deleted successfully' })
})
