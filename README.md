# Redis Projects & Hands-on Implementations

A collection of practical Redis implementations using Node.js, Express, and ioredis.

## Project Structure

- **1_Foundation_redis**: Introduction and fundamental Redis data structures & commands.
- **2_setup_local_redis**: Local Redis setup and Docker Compose configuration.
- **3_site_banner_apis**: Caching site banner message with Redis string commands (`SET`, `GET`, `DEL`, `EXISTS`).
- **4_login_otp_with_ttl**: Phone OTP generation and verification with expiration TTL (`SET EX`, `GET`, `TTL`, `DEL`).
- **5_user_profile_cache_redis_json-vs-hash**: User profile caching comparing Redis JSON vs Hash structures.
- **6_email_queue_with_redis_lists**: Asynchronous email task queue using Redis Lists (`LPUSH`, `RPOP`/`BRPOP`).
- **7_order_confirmation_job_with_bullmq**: Robust background job processing using BullMQ and Redis.
- **8_live_admin_notification_pubsub**: Real-time admin notification broadcasting using Redis Pub/Sub (`PUBLISH`, `SUBSCRIBE`).
- **9_quiz_leaderboard_and_counters**: Post view counters (`INCR`) and high-score quiz leaderboard with sorted sets (`ZINCRBY`, `ZREVRANGE`, `ZREVRANK`, `ZSCORE`).

## Prerequisites

- Node.js (v18+)
- Docker & Docker Compose (or local Redis server)

## Running Redis

```bash
docker compose up -d
```
