<template>
  <div>
    <div class="panel">
      <div class="flex-between">
        <div>
          <strong>举报管理</strong>
          <div class="small">按举报理由或目标ID搜索；不输入则显示全部。</div>
        </div>
        <div class="controls">
          <input type="text" v-model="reportQuery" placeholder="输入理由/目标ID搜索" @keyup.enter="searchReports" />
          <button @click="searchReports">搜索</button>
          <button class="ghost" @click="resetReportSearch">重置</button>
          <select v-model.number="reportPageSize">
            <option :value="5">每页5</option>
            <option :value="10">每页10</option>
            <option :value="20">每页20</option>
          </select>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>举报人</th>
            <th>目标类型/ID</th>
            <th>理由</th>
            <th>状态</th>
            <th>时间</th>
            <th style="width: 200px">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in pagedReports" :key="r.report_id">
            <td>#{{ r.report_id }}</td>
            <td>
              <div>{{ findUserById(r.reporter_id)?.username || "已删除用户" }}</div>
              <div class="meta">#{{ r.reporter_id }}</div>
            </td>
            <td>{{ r.target_type }} - {{ r.target_id }}</td>
            <td style="max-width: 260px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis">{{ r.reason }}</td>
            <td>
              <span :class="'status ' + (r.status || 'pending')">{{ r.status }}</span>
            </td>
            <td>{{ formatDate(r.created_at) }}</td>
            <td>
              <button @click="openReportModal(r.report_id)" style="margin-right: 6px">处理</button>
              <button class="danger" @click="deleteReport(r.report_id)">删除</button>
            </td>
          </tr>
          <tr v-if="filteredReports.length === 0">
            <td colspan="7" class="meta">没有匹配的举报记录。</td>
          </tr>
        </tbody>
      </table>

      <div style="margin-top: 12px; display: flex; justify-content: space-between; align-items: center">
        <div class="meta">共 {{ filteredReports.length }} 条</div>
        <div class="controls">
          <button @click="reportPrevPage" :disabled="reportPage <= 1" class="ghost">上一页</button>
          <div class="meta">第 {{ reportPage }} / {{ reportTotalPages }} 页</div>
          <button @click="reportNextPage" :disabled="reportPage >= reportTotalPages" class="ghost">下一页</button>
        </div>
      </div>
    </div>
    <!-- 举报审核弹窗 -->
    <router-view :users="users" :reports="reports" @reportUpdatedForChildren="reportUpdatedForChildren"></router-view>
  </div>
</template>

<script>
import { sampleReports } from "@/data/data";
import { reportDataRuquest, deleteReportById } from "@/api/dataRequest";
import { userDataMixin } from "@/mixin/AboutUser";
import { dateMethods } from "@/mixin/AboutDate";
export default {
  name: "ReportManagePage",
  mixins: [userDataMixin, dateMethods],
  data() {
    return {
      // 举报搜索
      reportQuery: "",
      reports: sampleReports(),

      //举报列表展示页数与数量
      reportPage: 1,
      reportPageSize: 10,
    };
  },
  computed: {
    filteredReports() {
      let q = (this.reportQuery || "").trim().toLowerCase();
      if (!q) return this.reports;
      return this.reports.filter((r) => r.reason.toLowerCase().includes(q) || String(r.target_id).includes(q));
    },
    reportTotalPages() {
      return Math.ceil(this.filteredReports.length / this.reportPageSize) || 1;
    },
    pagedReports() {
      const start = (this.reportPage - 1) * this.reportPageSize;
      return this.filteredReports.slice(start, start + this.reportPageSize);
    },
  },
  methods: {
    async fetchReportData() {
      try {
        await reportDataRuquest().then((response1) => {
          this.reports = response1;
          console.log("add reportsData success!");
        });
      } catch (e) {
        console.log(e);
      }
    },
    findUserById(id) {
      return this.users.find((u) => u.user_id === id) || null;
    },
    searchReports() {
      this.reportPage = 1;
    },
    resetReportSearch() {
      this.reportQuery = "";
      this.reportPage = 1;
    },
    reportPrevPage() {
      if (this.reportPage > 1) this.reportPage--;
    },
    reportNextPage() {
      if (this.reportPage < this.reportTotalPages) this.reportPage++;
    },
    //路由进行弹窗切换，同时传参
    openReportModal(report_id) {
      this.$router.replace({
        name: "ReportPopup",
        params: { id: report_id },
      });
    },
    // 给子组件掉用的父组件更新方法
    reportUpdatedForChildren(updateReport) {
      const reportIndex = this.reports.findIndex((r) => r.report_id === updateReport.report_id);
      if (reportIndex !== -1) this.$set(this.reports, reportIndex, updateReport);
    },
    async deleteReport(report_id) {
      if (!confirm("确定要删除举报记录 ID " + report_id + " 吗？此操作不可逆。")) return;
      const result = await deleteReportById(report_id);
      if (result.success) {
        alert("删除成功！");
        this.reports = this.reports.filter((r) => r.report_id !== report_id);
      } else {
        alert("删除失败：" + result.message);
      }
    },
  },
  mounted() {
    this.fetchReportData();
  },
};
</script>

<style></style>
