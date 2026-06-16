const express = require("express");
const db = require("../db");

const router = express.Router();

// Get all doubts with answer count
router.get("/", async (req, res) => {
  const sql = `
    SELECT doubts.*, COUNT(answers.id) AS answers_count
    FROM doubts
    LEFT JOIN answers ON answers.doubt_id = doubts.id
    GROUP BY doubts.id
    ORDER BY doubts.created_at DESC
  `;

  try {
    const [results] = await db.query(sql);
    res.json(results);
  } catch (err) {
    console.error("Error fetching doubts:", err);
    res.status(500).json({ error: "Database failure" });
  }
});

// Post a new doubt
router.post("/", async (req, res) => {
  const { question, subject } = req.body;
  const sql = "INSERT INTO doubts (question, subject) VALUES (?, ?)";

  try {
    await db.query(sql, [question, subject]);
    res.json({ message: "Doubt inserted successfully" });
  } catch (err) {
    console.error("Error inserting doubt:", err);
    res.status(500).json({ error: "Database failure" });
  }
});

// Get a single doubt by id
router.get('/:id', async (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM doubts WHERE id = ?";

  try {
    const [result] = await db.query(sql, [id]);
    if (result.length === 0) {
      return res.status(404).json({ error: "Doubt not found" });
    }
    res.json(result[0]); // Send back single object directly
  } catch (err) {
    console.error("Error getting single doubt:", err);
    res.status(500).json({ error: "Database failure" });
  }
});

// Submit an answer for a doubt
router.post('/:id/answers', async (req, res) => {
  const doubt_id = req.params.id;
  const { answer_text } = req.body;
  const sql = "INSERT INTO answers (doubt_id, answer_text) VALUES (?, ?)";

  try {
    await db.query(sql, [doubt_id, answer_text]);
    res.json({ message: "Answer submitted successfully" });
  } catch (err) {
    console.error("Error submitting answer:", err);
    res.status(500).json({ error: "Database failure" });
  }
});

// Get all answers for a single doubt
router.get('/:id/answers', async (req, res) => {
  const doubt_id = req.params.id;
  const sql = "SELECT * FROM answers WHERE doubt_id = ?";

  try {
    const [results] = await db.query(sql, [doubt_id]);
    res.json(results);
  } catch (err) {
    console.error("Error getting answers:", err);
    res.status(500).json({ error: "Database failure" });
  }
});

// Delete a doubt and its replies
router.delete('/:id', async (req, res) => {
  const id = req.params.id;
  const deleteAnswers = "DELETE FROM answers WHERE doubt_id = ?";
  const deleteDoubt = "DELETE FROM doubts WHERE id = ?";

  try {
    // Must clear answers foreign key dependancies first to avoid SQL errors
    await db.query(deleteAnswers, [id]);
    await db.query(deleteDoubt, [id]);

    res.json({ message: "Doubt deleted successfully" });
  } catch (err) {
    console.error("Error deleting doubt:", err);
    res.status(500).json({ error: "Database failure" });
  }
});

module.exports = router;