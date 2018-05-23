require('dotenv').config()

import { GraphQLServer } from 'graphql-yoga'
import helmet from 'helmet'
import compression from 'compression'
import resolvers from './resolvers'
import typeDefs from './types'
import db from './db'

const port = parseInt(process.env.PORT, 10) || 4000

const initDB = async () => await db()

const server = new GraphQLServer({
  typeDefs,
  resolvers,
  context: async req => ({ ...req, db: await initDB() })
})

server.express.use(compression())
server.express.use(helmet())
server.express.set('trust proxy', true)

const options = {
  port
}

server.start(options, ({ port }) =>
  console.log(
    `Server started, listening on port ${port} for incoming requests.`
  )
)