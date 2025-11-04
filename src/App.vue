<template>
  <div id="app" class="layout">
    <div class="sidebar">
      <SidebarBanner></SidebarBanner>
      <button :class="{ active: activeTab === 'users' }" @click="userManageSetActiveTab">
        <router-link to="/UserManagePage" replace>用户管理</router-link>
      </button>
      <button :class="{ active: activeTab === 'posts' }" @click="postManageSetActiveTab">
        <router-link to="/PostManagePage" replace>帖子管理</router-link>
      </button>
      <button :class="{ active: activeTab === 'reports' }" @click="reportManageSetActiveTab">
        <router-link to="/ReportManagePage" replace>举报管理</router-link>
      </button>
    </div>
    <div class="main container">
      <PageBanner></PageBanner>
      <keep-alive :include="['UserManagePage', 'PostManagePage', 'ReportManagePage']">
        <router-view></router-view>
      </keep-alive>
    </div>
  </div>
</template>

<script>
import PageBanner from "./components/PageBanner.vue";
import SidebarBanner from "./components/SidebarBanner.vue";
export default {
  name: "App",
  components: { PageBanner, SidebarBanner },
  data() {
    return {
      activeTab: localStorage.getItem("activeTab"),
    };
  },
  methods: {
    userManageSetActiveTab() {
      localStorage.setItem("activeTab", "users");
      this.activeTab = localStorage.getItem("activeTab");
    },
    postManageSetActiveTab() {
      localStorage.setItem("activeTab", "posts");
      this.activeTab = localStorage.getItem("activeTab");
    },
    reportManageSetActiveTab() {
      localStorage.setItem("activeTab", "reports");
      this.activeTab = localStorage.getItem("activeTab");
    },
  },
  mounted() {
    if (this.$route.path === "/") {
      localStorage.setItem("activeTab", "users");
      this.activeTab = localStorage.getItem("activeTab");
      this.$router.replace("/UserManagePage");
    }
  },
};
</script>
<!-- 未拆分样式，子组件覆盖即可 -->
<style>
body {
  font-family: "Helvetica Neue", Arial, sans-serif;
  background: #f5f7fb;
  color: #222;
  margin: 0;
}
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}
h1 {
  margin: 0 0 18px;
  font-size: 24px;
}
.panel {
  background: white;
  border-radius: 10px;
  padding: 16px;
  box-shadow: 0 6px 18px rgba(20, 30, 50, 0.06);
  margin-bottom: 18px;
}
.row {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}
.col {
  flex: 1;
  min-width: 0;
}
.controls {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
}
input[type="text"],
textarea,
select {
  padding: 8px 10px;
  border: 1px solid #e0e6ef;
  border-radius: 8px;
  width: 100%;
  box-sizing: border-box;
}
button {
  background: #2b8cff;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
}
button a {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  text-decoration: none;
  text-align: left;
  color: #e6eefc;
  padding: 12px 20px;
}
button a:hover,
button a:focus {
  text-decoration: none;
  outline: none;
}
button.ghost {
  background: transparent;
  color: #2b2e3a;
  border: 1px solid #e6eefc;
}
button.danger {
  background: #ff6b6b;
}
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 12px;
}
th,
td {
  text-align: left;
  padding: 10px 8px;
  border-bottom: 1px solid #f0f3f8;
  font-size: 14px;
  vertical-align: middle;
}
th {
  color: #667085;
  font-weight: 600;
  font-size: 13px;
}
.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 1px 4px rgba(16, 24, 40, 0.06);
}
.badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  background: #eef6ff;
  color: #0b66ff;
}
.badge.warn {
  background: #fff7e6;
  color: #b36a00;
}
.meta {
  color: #95a1bf;
  font-size: 12px;
}
.actions button {
  margin-right: 6px;
}
.status.pending {
  color: #d97706;
  font-weight: 600;
}
.status.approved {
  color: #059669;
  font-weight: 600;
}
.status.rejected {
  color: #ef4444;
  font-weight: 600;
}
.modal-backdrop {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: rgba(3, 6, 23, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}
.modal {
  width: 720px;
  max-width: 95%;
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 10px 30px rgba(2, 6, 23, 0.4);
}
.modal h3 {
  margin-top: 0;
}
.flex-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}
.small {
  font-size: 12px;
  color: #6b7280;
}
.layout {
  display: flex;
  min-height: 100vh;
}
.sidebar {
  width: 200px;
  background: #1f2937;
  color: #fff;
  display: flex;
  flex-direction: column;
  padding: 20px 0;
}
.sidebar h2 {
  text-align: center;
  font-size: 18px;
  margin-bottom: 20px;
}
.sidebar button {
  background: transparent;
  border: none;
  color: #d1d5db;
  text-align: left;
  padding: 0px;
  font-size: 14px;
  cursor: pointer;
  border-left: 4px solid transparent;
}
.sidebar button.active {
  color: #fff;
  background: #374151;
  border-left: 4px solid #3b82f6;
}
.main {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
}

@media (max-width: 800px) {
  .layout {
    flex-direction: column;
  }
  .sidebar {
    flex-direction: row;
    width: 100%;
    overflow-x: auto;
  }
  .sidebar button {
    flex: 1;
    text-align: center;
    border-left: none;
    border-bottom: 2px solid transparent;
  }
  .sidebar button.active {
    border-left: none;
    border-bottom: 2px solid #3b82f6;
  }
}
</style>
