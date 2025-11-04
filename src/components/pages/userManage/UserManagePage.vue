<template>
  <div>
    <div class="panel">
      <div class="flex-between">
        <div>
          <strong>用户管理</strong>
          <div class="small">按用户名搜索用户；不输入查询则显示全部。</div>
        </div>
        <div class="controls">
          <input type="text" v-model="userQuery" placeholder="输入用户名搜索（回车或点击搜索）" @keyup.enter="searchUsers" />
          <button @click="searchUsers">搜索</button>
          <button class="ghost" @click="resetUserSearch">重置</button>
          <select v-model.number="userPageSize">
            <option :value="5">每页5</option>
            <option :value="10">每页10</option>
            <option :value="20">每页20</option>
          </select>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th style="width: 56px"></th>
            <th>用户名 / 邮箱 / 角色</th>
            <th>手机号</th>
            <th>简介</th>
            <th>注册时间</th>
            <th style="width: 190px">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="u in pagedUsers" :key="u.user_id">
            <td><img :src="u.avatar_url || placeholderAvatar(u.username)" alt="avatar" class="avatar" /></td>
            <td>
              <div>
                <strong>{{ u.username }}</strong> <span class="meta">#{{ u.user_id }}</span>
              </div>
              <div class="meta">{{ u.email }}</div>
              <div style="margin-top: 6px">
                <span class="badge" v-if="u.role === '2'">管理员</span>
                <span class="badge" v-else>普通用户</span>
                <span class="badge warn" v-if="u.Creator === '2'">创作者认证</span>
              </div>
            </td>
            <td>{{ u.phone || "—" }}</td>
            <td style="max-width: 260px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis">{{ u.bio || "—" }}</td>
            <td>{{ formatDate(u.created_at) }}</td>
            <td class="actions">
              <button @click="viewUser(u)">查看</button>
              <button class="warn" @click="banUser(u.user_id)" v-if="u.role !== '0'">封号</button>
              <button class="ghost" @click="unbanUser(u.user_id)" v-else>解封</button>
              <button class="danger" @click="deleteUser(u.user_id)">删除</button>
            </td>
          </tr>
          <tr v-if="filteredUsers.length === 0">
            <td colspan="6" class="meta">没有匹配的用户。</td>
          </tr>
        </tbody>
      </table>

      <div style="margin-top: 12px; display: flex; justify-content: space-between; align-items: center">
        <div class="meta">共 {{ filteredUsers.length }} 条</div>
        <div class="controls">
          <button @click="userPrevPage" :disabled="userPage <= 1" class="ghost">上一页</button>
          <div class="meta">第 {{ userPage }} / {{ userTotalPages }} 页</div>
          <button @click="userNextPage" :disabled="userPage >= userTotalPages" class="ghost">下一页</button>
        </div>
      </div>
    </div>
    <!-- 用户详情弹窗 -->
    <router-view v-if="$route.params.id" :users="users"></router-view>
  </div>
</template>

<script>
import { deleteUserById, banUserById, unbanUserById } from "@/api/dataRequest";
import { userDataMixin } from "@/mixin/AboutUser";
import { dateMethods } from "@/mixin/AboutDate";
export default {
  name: "UserManagePage",
  mixins: [userDataMixin, dateMethods],
  data() {
    return {
      userQuery: "", //搜索关键词

      // 用户列表展示页数与数量
      userPage: 1,
      userPageSize: 10,
    };
  },
  computed: {
    filteredUsers() {
      const q = (this.userQuery || "").trim().toLowerCase();
      if (!q) return this.users.slice().sort((a, b) => a.user_id - b.user_id);
      return this.users.filter((u) => (u.username || "").toLowerCase().includes(q)).sort((a, b) => a.user_id - b.user_id);
    },
    userTotalPages() {
      return Math.max(1, Math.ceil(this.filteredUsers.length / this.userPageSize));
    },
    pagedUsers() {
      const s = (this.userPage - 1) * this.userPageSize;
      return this.filteredUsers.slice(s, s + this.userPageSize);
    },
  },
  methods: {
    placeholderAvatar(name) {
      const initial = name && name[0] ? name[0].toUpperCase() : "?";
      const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80'><rect width='100%' height='100%' fill='#E6EEF9'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-size='34' fill='#1E293B' font-family='Arial'>${initial}</text></svg>`;
      return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
    },
    searchUsers() {
      this.userPage = 1;
    },
    resetUserSearch() {
      this.userQuery = "";
      this.userPage = 1;
    },
    //路由进行弹窗切换，同时传参
    viewUser(u) {
      this.$router.replace({
        name: "UserPopup",
        params: {
          id: u.user_id,
        },
      });
    },
    async banUser(user_id) {
      if (!confirm(`确定要封禁用户 ID ${user_id} 吗？封号后该用户将无法登录。`)) return;
      const result = await banUserById(user_id);
      if (result.success) {
        alert("封禁成功！");
        const user = this.users.find((u) => u.user_id === user_id);
        if (user) user.role = "0";
      } else {
        alert("封禁失败：" + result.message);
      }
    },
    async unbanUser(user_id) {
      if (!confirm(`确定要解封用户 ID ${user_id} 吗？`)) return;
      const result = await unbanUserById(user_id);
      if (result.success) {
        alert("解封成功！");
        const user = this.users.find((u) => u.user_id === user_id);
        if (user) user.role = "1";
      } else {
        alert("解封失败：" + result.message);
      }
    },
    async deleteUser(user_id) {
      if (!confirm("确定要删除用户 ID " + user_id + " 吗？此操作会删除该用户但不会自动删除其帖子")) return;
      const result = await deleteUserById(user_id);
      if (result.success) {
        alert("删除成功！");
        this.users = this.users.filter((u) => u.user_id !== user_id);
      } else {
        alert("删除失败：" + result.message);
      }
    },
    userPrevPage() {
      if (this.userPage > 1) this.userPage--;
    },
    userNextPage() {
      if (this.userPage < this.userTotalPages) this.userPage++;
    },
  },
};
</script>

<style></style>
