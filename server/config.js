const config = {
  mongoURL: process.env.MONGO_URL || 'mongodb://localhost:27017/uw',
  port: process.env.PORT || 8000,
  host: process.env.CONTAINER_IP || 'localhost'
}

export default config
