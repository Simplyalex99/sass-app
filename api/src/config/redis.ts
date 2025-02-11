import { createClient } from 'redis'
import 'dotenv/config'
const REDIS_CLOUD_URL = process.env.REDIS_CLOUD_URL || ''
const redisClient = createClient({
  url: REDIS_CLOUD_URL,
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
