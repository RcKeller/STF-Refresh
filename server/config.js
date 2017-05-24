const config = {
  env: process.env.NODE_ENV,
  mongoURL: process.env.MONGO_URL || 'mongodb://localhost:27017/uw',
  port: process.env.PORT || 8000,
  host: process.env.CONTAINER_IP || 'localhost',
  api: (typeof window === 'undefined' || process.env.NODE_ENV === 'test')
    ? process.env.BASE_URL || (`http://localhost:${process.env.PORT || 8000}/api`)
    : '/api'
}

export default config
