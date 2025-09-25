import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from typing import List
from pymongo import MongoClient
from bson.objectid import ObjectId
from fastapi.middleware.cors import CORSMiddleware
import redis

MONGO_URI = os.getenv("MONGO_URI", "mongodb://mongo:27017")
REDIS_HOST = os.getenv("REDIS_HOST", "redis")
REDIS_PORT = int(os.getenv("REDIS_PORT", 6379))

client = MongoClient(MONGO_URI)
db = client["oms_db"]
orders_col = db["orders"]

r = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, db=0, decode_responses=True)

app = FastAPI(title="OMS - Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class OrderCreate(BaseModel):
    item_name: str = Field(..., min_length=1)
    quantity: int = Field(..., gt=0)

class OrderOut(BaseModel):
    id: str
    item_name: str
    quantity: int
    status: str

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/orders", status_code=201)
def create_order(order: OrderCreate):
    doc = order.dict()
    doc["status"] = "pending"
    result = orders_col.insert_one(doc)
    order_id = str(result.inserted_id)
    r.rpush("order_queue", order_id)
    return {"id": order_id, **doc}

@app.get("/orders", response_model=List[OrderOut])
def list_orders():
    docs = list(orders_col.find().sort("_id", -1))
    out = []
    for d in docs:
        out.append(OrderOut(
            id=str(d["_id"]),
            item_name=d.get("item_name"),
            quantity=d.get("quantity"),
            status=d.get("status", "unknown")
        ))
    return out

@app.get("/orders/{order_id}", response_model=OrderOut)
def get_order(order_id: str):
    try:
        oid = ObjectId(order_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid order id")
    d = orders_col.find_one({"_id": oid})
    if not d:
        raise HTTPException(status_code=404, detail="Order not found")
    return OrderOut(
        id=str(d["_id"]),
        item_name=d.get("item_name"),
        quantity=d.get("quantity"),
        status=d.get("status", "unknown")
    )

@app.get("/")
def root():
    return {"message": "OMS Backend is running!"}
