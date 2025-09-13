import { Hono } from 'hono'
import { db } from './db/db.js'
import users from './users.js'

const app = new Hono()

app.route('/users', users)

export default app
