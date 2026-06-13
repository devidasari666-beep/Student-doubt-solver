const express = require("express");
const db = require("../db");

const router = express.Router();

// GET all doubts
router.get("/", (req, res) => {
  const sql = `
    SELECT 
      doubts.*,
      COUNT(answers.id) AS answers_count
    FROM doubts
    LEFT JOIN answers 
      ON answers.doubt_id = doubts.id
    GROUP BY doubts.id
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error" });
    }

    res.json(results);
  });
});
router.post("/", (req, res) => {
  const { question, subject } = req.body;

  const sql = "INSERT INTO doubts (question, subject) VALUES (?, ?)";

  db.query(sql, [question, subject], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error" });
    }

    res.json({ message: "Doubt inserted successfully" });
  });
});
router.get('/:id',(req,res)=>{
  const id=req.params.id;
  const sql="SELECT * FROM doubts WHERE id=?";
  db.query(sql,[id],(err,result)=>{
    if(err){
      console.log(err);
       return res.status(500).json({ error: "Database error" });
    }
     res.json(result);
  });
});
router.post('/:id/answers',(req,res)=>{
  const doubt_id=req.params.id;
  const answer_text=req.body.answer_text;
  const sql="INSERT INTO answers (doubt_id,answer_text) VALUES (?,?)";
  db.query(sql,[doubt_id,answer_text],(err,result)=>{
     if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error" });
    }

    res.json({ message: "Doubt inserted successfully" });
  });
});
// GET all answers for a specific doubt
router.get('/:id/answers', (req, res) => {
  const doubt_id = req.params.id;
  const sql = "SELECT * FROM answers WHERE doubt_id = ?";

  db.query(sql, [doubt_id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});
module.exports = router;