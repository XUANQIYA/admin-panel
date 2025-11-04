// ====== 用户相关请求 ======
var userDataRuquest = async () => {
  let userData = null;
  await fetch("http://127.0.0.1:8000/usersData", {
    method: "GET",
  })
    .then((response1) => {
      console.log("request userData ok!");
      return response1.json();
    })
    .then((response2) => {
      userData = response2;
    })
    .catch((e) => console.log(e));
  return userData;
};

var deleteUserById = async (user_id) => {
  try {
    const res = await fetch(`http://127.0.0.1:8000/deleteUser/${user_id}`, {
      method: "DELETE",
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("删除用户请求失败：", err);
    return { success: false, message: "请求异常" };
  }
};

var banUserById = async (user_id) => {
  try {
    const res = await fetch(`http://127.0.0.1:8000/banUser/${user_id}`, {
      method: "PUT",
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("封禁用户请求失败：", err);
    return { success: false, message: "请求异常" };
  }
};

var unbanUserById = async (user_id) => {
  try {
    const res = await fetch(`http://127.0.0.1:8000/unbanUser/${user_id}`, {
      method: "PUT",
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("解封用户请求失败：", err);
    return { success: false, message: "请求异常" };
  }
};

// ====== 帖子相关请求 ======
var postDataRuquest = async () => {
  let userData = null;
  await fetch("http://127.0.0.1:8000/postsData", {
    method: "GET",
  })
    .then((response1) => {
      console.log("request postData ok!");
      return response1.json();
    })
    .then((response2) => {
      userData = response2;
    })
    .catch((e) => console.log(e));
  return userData;
};

var deletePostById = async (post_id) => {
  try {
    const res = await fetch(`http://127.0.0.1:8000/deletePost/${post_id}`, {
      method: "DELETE",
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("删除帖子请求失败：", err);
    return { success: false, message: "请求异常" };
  }
};

var updatePostStatus = async (post_id, newStatus) => {
  try {
    const response = await fetch(`http://127.0.0.1:8000/updatePostStatus/${post_id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    return await response.json();
  } catch (error) {
    console.error("更新帖子状态失败:", error);
    return { success: false, message: error.message };
  }
};

// ====== 举报相关请求 ======
var reportDataRuquest = async () => {
  let userData = null;
  await fetch("http://127.0.0.1:8000/reportsData", {
    method: "GET",
  })
    .then((response1) => {
      console.log("request reportData ok!");
      return response1.json();
    })
    .then((response2) => {
      userData = response2;
    })
    .catch((e) => console.log(e));
  return userData;
};

var deleteReportById = async (report_id) => {
  try {
    const res = await fetch(`http://127.0.0.1:8000/deleteReport/${report_id}`, {
      method: "DELETE",
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("删除举报记录请求失败：", err);
    return { success: false, message: "请求异常" };
  }
};

var updateReportStatus = async (report_id, newStatus) => {
  try {
    const response = await fetch(`http://127.0.0.1:8000/updateReportStatus/${report_id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    return await response.json();
  } catch (error) {
    console.error("更新举报记录状态失败:", error);
    return { success: false, message: error.message };
  }
};

export {
  userDataRuquest,
  deleteUserById,
  banUserById,
  unbanUserById,
  postDataRuquest,
  deletePostById,
  updatePostStatus,
  reportDataRuquest,
  deleteReportById,
  updateReportStatus,
};
