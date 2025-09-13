import { Hono } from 'hono'
import { db } from './db/db.js'
import users from './users.js'
import categories from './categories.js'
import tags from './tags.js'
import posts from './posts.js'

const app = new Hono()

app.route('/users', users)
app.route('/categories', categories)
app.route('/tags', tags)
app.route('/posts', posts)

export default app
