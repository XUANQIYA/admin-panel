<template>
  <div class="modal-backdrop" @click.self="close">
    <!-- 添加v-if判断post是否已经赋值再显示，否则报错没找到report_id -->
    <div class="modal" v-if="post">
      <div class="flex-between">
        <h3>帖子审核 / 编辑 - ID {{ post?.post_id }}</h3>
        <div class="small">作者：{{ findUserById(post.user_id)?.username || "已删除用户" }}</div>
      </div>

      <div style="margin-top: 10px">
        <label><strong>标题</strong></label>
        <input v-model="post.title" type="text" />
      </div>

      <div style="margin-top: 10px">
        <label><strong>内容</strong></label>
        <textarea v-model="post.content" rows="6"></textarea>
      </div>

      <div style="margin-top: 10px">
        <label><strong>状态</strong></label>
        <select v-model="post.status">
          <option value="pending">pending</option>
          <option value="approved">approved</option>
          <option value="rejected">rejected</option>
        </select>
      </div>

      <div style="margin-top: 12px; text-align: right">
        <button class="ghost" @click="close" style="margin-right: 6px">取消</button>
        <button @click="save">保存并更新状态</button>
      </div>
    </div>
  </div>
</template>

<script>
import { updatePostStatus } from "@/api/dataRequest";
export default {
  name: "PostPopup",
  props: {
    id: { type: Number, required: true },
    users: { type: Array, required: true },
    posts: { type: Array, required: true },
  },
  data() {
    return {
      post: null,
    };
  },
  methods: {
    findUserById(id) {
      return this.users.find((u) => u.user_id === id);
    },
    // 切换回父组件路由路径
    close() {
      this.$router.replace({ name: "PostManagePage" });
    },
    async save() {
      const result = await updatePostStatus(this.post.post_id, this.post.status);
      if (result.success) {
        alert("保存成功！");
        // 调用父组件状态更新
        this.$emit("postUpdatedForChildren", this.post);
        this.close();
      } else {
        alert("更新失败：" + result.message);
      }
    },
  },
  // 使用watch监听父组件加载，避免弹窗刷新时出现空数据
  watch: {
    posts: {
      immediate: true,
      handler(newVal) {
        if (!newVal || newVal.length === 0) return;
        const found = newVal.find((p) => p.post_id === this.id);
        // 深拷贝，避免直接引用更新状态时使父组件直接更新
        if (found) this.post = JSON.parse(JSON.stringify(found));
      },
    },
  },
};
</script>

<style></style>
