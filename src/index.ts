import { Hono } from 'hono'
import { db } from './db/db.js'
import categories from './routes/categories.js'
import tags from './routes/tags.js'
import posts from './routes/posts.js'
import auth from './routes/auth.js'
import publicRoutes from './routes/public.js'
import { jwt } from 'hono/jwt'

const app = new Hono()
app.use('/api/admin/*', jwt({ secret: process.env.JWT_SECRET! }))

// Public routes
app.route('/api', publicRoutes)

// Admin routes
app.route('/api/auth', auth)
app.route('/api/admin/categories', categories)
app.route('/api/admin/tags', tags)
app.route('/api/admin/posts', posts)

export default app
