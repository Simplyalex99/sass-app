import { createClient } from 'redis'
import 'dotenv/config'
const redisClient = createClient({
  username: process.env.REDIS_CLOUD_USERNAME || '',
  password: process.env.REDIS_CLOUD_PASSWORD || '',
  socket: {
    host: process.env.REDIS_CLOUD_HOST || 'localhost',
    port: 18795,
  },
})

redisClient.on('error', (err) => {
  console.error('Redis Client Error:', err)
})

const connectRedis = async (): Promise<void> => {
  try {
    await redisClient.connect()
    if (redisClient.isOpen) {
      console.log('Connected to Redis')
    }
  } catch (error) {
    console.error('Failed to connect to Redis:', error)
  }
}

export { redisClient, connectRedis }
