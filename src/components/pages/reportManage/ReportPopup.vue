<template>
  <div class="modal-backdrop" @click.self="close">
    <!-- 添加v-if判断report是否已经赋值再显示，否则报错没找到report_id -->
    <div class="modal" v-if="report">
      <div class="flex-between">
        <h3>举报处理 - ID {{ report?.report_id }}</h3>
        <div class="small">举报人：{{ findUserById(report.reporter_id)?.username || "已删除用户" }}</div>
      </div>

      <div style="margin-top: 10px">
        <label><strong>目标</strong></label>
        <div class="meta">{{ report?.target_type }} - {{ report?.target_id }}</div>
      </div>

      <div style="margin-top: 10px">
        <label><strong>理由</strong></label>
        <div class="meta">{{ report?.reason }}</div>
      </div>

      <div style="margin-top: 10px">
        <label><strong>状态</strong></label>
        <select v-model="report.status">
          <option value="pending">pending</option>
          <option value="processed">processed</option>
          <option value="rejected">rejected</option>
        </select>
      </div>

      <div style="margin-top: 12px; text-align: right">
        <button class="ghost" @click="close" style="margin-right: 6px">取消</button>
        <button @click="save">保存</button>
      </div>
    </div>
  </div>
</template>

<script>
import { updateReportStatus } from "@/api/dataRequest";
export default {
  name: "ReportPopup",
  props: {
    id: { type: Number, required: true },
    users: { type: Array, required: true },
    reports: { type: Array, required: true },
  },
  data() {
    return {
      report: null,
    };
  },
  methods: {
    findUserById(id) {
      return this.users.find((u) => u.user_id === id) || null;
    },
    async save() {
      const result = await updateReportStatus(this.report.report_id, this.report.status);
      if (result.success) {
        alert("举报状态已更新。");
        // 调用父组件状态更新
        this.$emit("reportUpdatedForChildren", this.report);
        this.close();
      } else {
        alert("更新失败：" + result.message);
      }
    },
    // 切换回父组件路由路径
    close() {
      this.$router.replace({ name: "ReportManagePage" });
    },
  },
  // 使用watch监听父组件加载，避免弹窗刷新时出现空数据
  watch: {
    reports: {
      immediate: true,
      handler(newVal) {
        if (!newVal || newVal.length === 0) return;
        const found = newVal.find((r) => r.report_id === this.id);
        // 深拷贝，避免直接引用更新状态时使父组件直接更新
        if (found) this.report = JSON.parse(JSON.stringify(found));
      },
    },
  },
};
</script>

<style></style>
