# Order Management System (OMS)

A simple **Order Management System** built using **FastAPI**, **MongoDB**, **Redis**, **Python Worker**, and **React + Vite**. The system allows you to create orders, track their status, and process them asynchronously via a worker.


<img width="1325" height="863" alt="image" src="https://github.com/user-attachments/assets/f4403596-1210-426e-a05c-f4199b25d0dc" />
---

## Features

- Create and list orders with `item_name` and `quantity`.
- Async order processing using **Redis queues** and a Python worker.
- Orders have `status`: `pending`, `processing`, `completed`.
- Frontend dashboard built with **React + Vite**.
- Fully containerized with **Docker** and **docker-compose**.
- CI/CD automation ready via **GitHub Actions**.

---

## Tech Stack

- **Backend**: FastAPI, Uvicorn, Pydantic, PyMongo  
- **Worker**: Python, PyMongo, Redis  
- **Database**: MongoDB  
- **Cache / Queue**: Redis  
- **Frontend**: React + Vite  
- **Containerization**: Docker, Docker Compose  

---

## Project Structure

oms-project/
│
├─ backend/ # FastAPI backend
│ ├─ main.py
│ ├─ requirements.txt
│ └─ Dockerfile
│
├─ worker/ # Python worker for async processing
│ ├─ worker.py
│ ├─ requirements.txt
│ └─ Dockerfile
│
├─ frontend/ # React + Vite frontend
│ ├─ src/
│ ├─ package.json
│ └─ Dockerfile
│
├─ docker-compose.yml
└─ README.md


---

## Prerequisites

- [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/)
- Node.js & npm (optional if you want to run frontend locally)
- Python 3.11+ (optional if running backend locally)

---

## Local Development


```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload


Open http://localhost:8000/docs
 to access FastAPI docs.

Worker
cd worker
pip install -r requirements.txt
python worker.py

Frontend
cd frontend
npm install
npm run dev


Open http://localhost:5173
 (Vite dev server).

Docker & Docker Compose
Build and Run
docker-compose up --build


Backend: http://localhost:8000

Frontend: http://localhost:3000

Stop Services
docker-compose down

Notes

MongoDB credentials are set in docker-compose.yml. Default user: root, password: example.

Order IDs are MongoDB ObjectIds. If you want custom numeric IDs, update the backend logic.

Worker must be running to process pending orders. Otherwise, status stays pending.

Redis is used as a queue for worker to pick up orders.

CI/CD (GitHub Actions)

Workflow: .github/workflows/deploy.yml

On push to main branch, it builds Docker images and runs docker-compose up.

Optional: Push images to Docker Hub or deploy to a server.
