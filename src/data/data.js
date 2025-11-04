function sampleUsers() {
  return [
    {
      user_id: 1,
      username: "example1",
      email: "example1@example.com",
      password_hash: "$hash1",
      avatar_url: "https://i.pravatar.cc/80?img=10",
      bio: "example1。",
      role: "1",
      created_at: "2024-06-01 10:12:00",
      updated_at: null,
      phone: "example1PhoneNumber",
      Creator: "1",
    },
  ];
}
function samplePosts() {
  return [
    {
      post_id: 101,
      title: "example1",
      content: "example1",
      user_id: 1,
      section_id: 1,
      view_count: 1200,
      like_count: 84,
      comment_count: 23,
      created_at: "2024-07-10 10:00:00",
      updated_at: null,
      status: "approved",
    },
  ];
}
function sampleReports() {
  return [
    {
      report_id: 1,
      reporter_id: 1,
      target_type: "example1",
      target_id: 205,
      reason: "example1",
      status: "pending",
      admin_id: null,
      processed_at: null,
      created_at: "2025-09-05 08:40:00",
    },
  ];
}

export { sampleUsers, samplePosts, sampleReports };
