# EcoTrack Backend 🌿

**Live Frontend:** [EcoTrack Live](https://grand-croissant-b49e65.netlify.app/)

EcoTrack Backend powers the community-driven sustainable living platform, handling challenges, user activities, eco-tips, upcoming events, and live statistics. Built with **Node.js**, **Express**, and **MongoDB**, it provides RESTful APIs for seamless interaction with the frontend.

---

## 🌱 Features

* **Challenges Management**

  * Fetch all challenges with optional category filtering and participant sorting.
  * Fetch limited challenges for homepage and carousel.
  * Create a new challenge or delete an existing challenge.
  * Fetch details of a single challenge by ID.

* **User Activity & Participation**

  * Join a challenge (increments participants count and stores user progress).
  * Prevent joining a challenge multiple times.
  * Update user challenge status (Not Started, In Progress, Completed).
  * Fetch user activity including challenge progress, status, and join date.

* **Recent Tips**

  * Retrieve all eco-friendly tips submitted by users.

* **Upcoming Events**

  * Fetch all upcoming community events.

* **Live Stats**

  * Fetch cumulative statistics like total participants, challenges, and user activities.

* **Error Handling**

  * Proper error messages for invalid requests, missing data, or server errors.

---

## 📂 Project Structure

```
EcoTrack-Backend/
│
├─ server.js                # Main server file
├─ .env                     # Environment variables (MongoDB URI, credentials)
├─ package.json             # Node.js dependencies
├─ routes/                  # API routes (optional, if separated)
├─ controllers/             # Business logic (optional, if separated)
├─ models/                  # MongoDB collections handled in code
└─ README.md
```

**Collections in MongoDB:**

* `challenges` – Stores all sustainability challenges.
* `users` – Stores user info and their joined challenges.
* `recentTips` – Stores eco-friendly tips.
* `upcomingLeft` – Stores upcoming green events.
* `stats` – Stores cumulative statistics for the community.

---

## 🛠 Technology Stack

* **Backend:** Node.js, Express.js
* **Database:** MongoDB (Atlas Cluster)
* **Authentication:** Email-based (via frontend, Firebase optional)
* **Other Tools:** dotenv, cors

---

## 🚀 API Endpoints

### Challenges

| Method | Endpoint               | Description                                                 |
| ------ | ---------------------- | ----------------------------------------------------------- |
| GET    | `/all_challenges`      | Fetch all challenges, supports `category` and `sort` query. |
| GET    | `/challenges`          | Fetch 3 challenges (for homepage).                          |
| GET    | `/carousel_data`       | Fetch 4 challenges for carousel.                            |
| GET    | `/activate_challenges` | Fetch 4 active challenges.                                  |
| GET    | `/challenge/:id`       | Fetch single challenge by ID.                               |
| POST   | `/challenge`           | Create a new challenge.                                     |
| PATCH  | `/challenge/:id`       | Join a challenge (increment participants, add user).        |
| DELETE | `/challenge/:id`       | Delete a challenge.                                         |

### Users

| Method | Endpoint                     | Description                              |
| ------ | ---------------------------- | ---------------------------------------- |
| PATCH  | `/user/:email/update-status` | Update status of a challenge for a user. |
| GET    | `/my_activity`               | Fetch all joined challenges for a user.  |

### Tips & Events

| Method | Endpoint        | Description                      |
| ------ | --------------- | -------------------------------- |
| GET    | `/recent_tips`  | Fetch all community tips.        |
| GET    | `/upcomingLeft` | Fetch all upcoming green events. |

### Stats

| Method | Endpoint | Description                      |
| ------ | -------- | -------------------------------- |
| GET    | `/stats` | Fetch live community statistics. |

---

## ⚡ Installation

1. Clone the repository:

```bash
git clone https://github.com/<your-username>/ecotrack-backend.git
cd ecotrack-backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file with the following variables:

```
DB_USERNAME=<your-mongo-username>
DB_PASS=<your-mongo-password>
PORT=3001
```

4. Start the server:

```bash
npm start
```

5. Backend runs at: `http://localhost:3001`

---

## 👤 Author

**Ant Nose**

* Location: Bangladesh
* GitHub: [https://github.com/yourusername](https://github.com/antnose)

---

This README gives full clarity on **how the backend works**, its **APIs**, and **how it integrates with the frontend**.

---

