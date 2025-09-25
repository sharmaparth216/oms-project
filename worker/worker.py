import os
import time
import random
import redis
from pymongo import MongoClient
from bson.objectid import ObjectId
import logging

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")

MONGO_URI = os.getenv("MONGO_URI", "mongodb://mongo:27017")
REDIS_HOST = os.getenv("REDIS_HOST", "redis")
REDIS_PORT = int(os.getenv("REDIS_PORT", 6379))

r = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, db=0, decode_responses=True)
mc = MongoClient(MONGO_URI)
orders_col = mc["oms_db"]["orders"]

logging.info("Worker started. Waiting for orders...")

while True:
    item = r.brpop("order_queue", timeout=0)
    if not item:
        continue
    order_id = item[1]
    logging.info(f"Popped order id {order_id}")
    orders_col.update_one({"_id": ObjectId(order_id)}, {"$set": {"status": "processing"}})
    time.sleep(random.randint(3, 8))
    orders_col.update_one({"_id": ObjectId(order_id)}, {"$set": {"status": "completed"}})
    logging.info(f"Order {order_id} completed")