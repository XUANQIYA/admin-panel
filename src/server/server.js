const express = require("express");
const mysql = require("mysql2");
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "你的MySQL数据库密码",
  database: "你的MySQL数据库",
  charset: "utf8mb4",
  port: 25565, //改为你自己的端口
});

const app = express();
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "*");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

app.use(express.json());
// ====== 用户数据操作相关 ======
app.get("/usersData", (req, res) => {
  const sql = "SELECT * FROM users";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("查询 users 失败:", err);
      res.status(500).send("数据库查询错误");
      return;
    }
    res.json(results);
  });
});

app.delete("/deleteUser/:user_id", (req, res) => {
  const userId = req.params.user_id;
  db.query("DELETE FROM users WHERE user_id = ?", [userId], (err, result) => {
    if (err) {
      console.error("删除用户失败:", err);
      return res.status(500).json({ success: false, message: "数据库删除失败" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "用户不存在" });
    }
    res.json({ success: true, message: "用户删除成功" });
  });
});

app.put("/banUser/:id", (req, res) => {
  const userId = req.params.id;
  const sql = 'UPDATE users SET role = "0" WHERE user_id = ?';

  db.query(sql, [userId], (err, result) => {
    if (err) {
      console.error("封禁用户失败:", err);
      return res.status(500).json({ success: false, message: "数据库错误" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "用户不存在" });
    }

    res.json({ success: true, message: "封禁成功" });
  });
});

app.put("/unbanUser/:id", (req, res) => {
  const userId = req.params.id;
  const sql = 'UPDATE users SET role = "1" WHERE user_id = ?';

  db.query(sql, [userId], (err, result) => {
    if (err) {
      console.error("解封用户失败:", err);
      return res.status(500).json({ success: false, message: "数据库错误" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "用户不存在" });
    }
    res.json({ success: true, message: "解封成功" });
  });
});
// ====== 帖子数据操作相关 ======
app.get("/postsData", (req, res) => {
  const sql = "SELECT * FROM posts";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("查询 posts 失败:", err);
      res.status(500).send("数据库查询错误");
      return;
    }
    res.json(results);
  });
});

app.delete("/deletePost/:post_id", (req, res) => {
  const postId = req.params.post_id;
  db.query("DELETE FROM posts WHERE post_id = ?", [postId], (err, result) => {
    if (err) {
      console.error("删除帖子失败:", err);
      return res.status(500).json({ success: false, message: "数据库删除失败" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "帖子不存在" });
    }
    res.json({ success: true, message: "帖子删除成功" });
  });
});

app.put("/updatePostStatus/:post_id", (req, res) => {
  const postId = req.params.post_id;
  const { status } = req.body;

  const validStatuses = ["pending", "approved", "rejected"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ success: false, message: "无效的状态值" });
  }

  const sql = "UPDATE posts SET status = ?, updated_at = NOW() WHERE post_id = ?";
  db.query(sql, [status, postId], (err, result) => {
    if (err) {
      console.error("数据库更新失败:", err);
      return res.status(500).json({ success: false, message: "数据库错误" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "未找到对应帖子ID" });
    }
    res.json({ success: true, message: "帖子状态更新成功" });
  });
});

// ====== 举报数据操作相关 ======
app.get("/reportsData", (req, res) => {
  const sql = "SELECT * FROM reports";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("查询 reports 失败:", err);
      res.status(500).send("数据库查询错误");
      return;
    }
    res.json(results);
  });
});

app.delete("/deleteReport/:report_id", (req, res) => {
  const reportId = req.params.report_id;
  db.query("DELETE FROM reports WHERE report_id = ?", [reportId], (err, result) => {
    if (err) {
      console.error("删除举报记录失败:", err);
      return res.status(500).json({ success: false, message: "数据库删除失败" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "该记录不存在" });
    }
    res.json({ success: true, message: "举报记录删除成功" });
  });
});

app.put("/updateReportStatus/:report_id", (req, res) => {
  const reportId = req.params.report_id;
  const { status } = req.body;

  const validStatuses = ["pending", "processed", "rejected"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ success: false, message: "无效的状态值" });
  }

  const sql = "UPDATE reports SET status = ? WHERE report_id = ?";
  db.query(sql, [status, reportId], (err, result) => {
    if (err) {
      console.error("数据库更新失败:", err);
      return res.status(500).json({ success: false, message: "数据库错误" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "未找到对应举报记录ID" });
    }
    res.json({ success: true, message: "举报记录状态更新成功" });
  });
});

app.listen(8000, () => {
  console.log("Server start...");
});
