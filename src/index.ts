import { Hono } from 'hono'
import { db } from './db/db.js'
import categories from './routes/categories.js'
import tags from './routes/tags.js'
import posts from './routes/posts.js'
import auth from './routes/auth.js'

const app = new Hono()

app.route('/categories', categories)
app.route('/tags', tags)
app.route('/posts', posts)
app.route('/auth', auth)

export default app
