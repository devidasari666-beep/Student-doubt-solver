# Student Doubt Solver

A full stack web app where students post doubts anonymously and others answer them — a clean alternative to chaotic WhatsApp groups.

## Live Demo
🔗 Coming soon

## GitHub
🔗 github.com/devidasari666-beep/Student-doubt-solver

## Features
- Post doubts anonymously — no login required
- Answer others' doubts
- Filter doubts by subject (Maths, Programming, Physics)
- Search doubts by keyword
- Real-time answer count on each card
- Delete doubts
- Unanswered doubts shown first

## Tech Stack
| Layer | Technology |
|---|---|
| Frontend | HTML, CSS, JavaScript |
| Backend | Node.js + Express |
| Database | MySQL |

## API Endpoints
| Method | Route | Description |
|---|---|---|
| GET | /api/doubts | Get all doubts |
| POST | /api/doubts | Post a new doubt |
| GET | /api/doubts/:id | Get single doubt |
| DELETE | /api/doubts/:id | Delete a doubt |
| POST | /api/doubts/:id/answers | Submit an answer |
| GET | /api/doubts/:id/answers | Get all answers |

## Database Schema
```sql
doubts (id, question, subject, created_at)
answers (id, doubt_id, answer_text, created_at)
```

## Project Structure