<template>
  <div class="modal-backdrop" @click.self="close">
    <div class="modal">
      <div class="flex-between">
        <h3>用户详情 - {{ user.username }}</h3>
        <div class="small">ID: {{ user.user_id }}</div>
      </div>
      <div class="row" style="margin-top: 12px">
        <img :src="user.avatar_url || placeholderAvatar(user.username)" class="avatar" style="width: 72px; height: 72px" />
        <div style="flex: 1">
          <div>
            <strong>{{ user.username }}</strong> <span class="meta">({{ user.email }})</span>
          </div>
          <div class="meta">角色: {{ user.role === "2" ? "管理员" : "普通用户" }}</div>
          <div class="meta">创作者: {{ user.Creator === "2" ? "是" : "否" }}</div>
          <div style="margin-top: 8px">
            简介：
            <div class="meta">{{ user.bio || "—" }}</div>
          </div>
        </div>
      </div>
      <div style="margin-top: 12px; text-align: right">
        <button class="ghost" @click="close" style="margin-right: 6px">关闭</button>
        <button class="danger" @click="deleteUser(user.user_id)">删除用户</button>
      </div>
    </div>
  </div>
</template>

<script>
import { deleteUserById } from "@/api/dataRequest";
import { dateMethods } from "@/mixin/AboutDate";
export default {
  name: "UserPopup",
  mixins: [dateMethods],
  props: {
    id: { type: Number, required: true },
    users: { type: Array, required: true },
  },
  computed: {
    user() {
      return this.users.find((u) => u.user_id === this.id) || {};
    },
  },
  methods: {
    placeholderAvatar(name) {
      const initial = name && name[0] ? name[0].toUpperCase() : "?";
      const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80'>
        <rect width='100%' height='100%' fill='#E6EEF9'/>
        <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-size='34' fill='#1E293B' font-family='Arial'>${initial}</text>
      </svg>`;
      return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
    },
    async deleteUser(user_id) {
      if (!confirm("确定要删除用户 ID " + user_id + " 吗？")) return;
      const result = await deleteUserById(user_id);
      if (result.success) {
        alert("删除成功！");
        this.close();
        // 直接通过父组件数据更新
        this.$parent.users = this.$parent.users.filter((u) => u.user_id !== user_id);
      } else {
        alert("删除失败：" + result.message);
      }
    },
    // 切换回父组件路由路径
    close() {
      this.$router.replace("/UserManagePage");
    },
  },
};
</script>

<style></style>
