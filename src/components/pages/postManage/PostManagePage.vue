<template>
  <div>
    <div class="panel">
      <div class="flex-between">
        <div>
          <strong>帖子管理</strong>
          <div class="small">基于标题/内容的全文检索（空则显示全部）。</div>
        </div>
        <div class="controls">
          <input type="text" v-model="postQuery" placeholder="输入关键字（空格分词，多词需同时包含）" @keyup.enter="searchPosts" />
          <button @click="searchPosts">搜索</button>
          <button class="ghost" @click="resetPostSearch">重置</button>
          <select v-model.number="postPageSize">
            <option :value="5">每页5</option>
            <option :value="10">每页10</option>
            <option :value="20">每页20</option>
          </select>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>标题</th>
            <th>作者</th>
            <th>版块</th>
            <th>浏览 / 点赞 / 评论</th>
            <th>创建时间</th>
            <th style="width: 220px">状态 / 操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in pagedPosts" :key="p.post_id">
            <td>
              <div>
                <strong>{{ p.title }}</strong>
              </div>
              <div class="meta" style="max-width: 460px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis">{{ p.content }}</div>
            </td>
            <td>
              <div>{{ findUserById(p.user_id)?.username || "已删除用户" }}</div>
              <div class="meta">#{{ p.user_id }}</div>
            </td>
            <td>版块-{{ p.section_id }}</td>
            <td>{{ p.view_count }} / {{ p.like_count }} / {{ p.comment_count }}</td>
            <td>{{ formatDate(p.created_at) }}</td>
            <td>
              <div :class="'status ' + (p.status || 'pending')">{{ (p.status || "pending").toUpperCase() }}</div>
              <div style="margin-top: 8px">
                <button @click="openReviewModal(p)" style="margin-right: 6px">审核/编辑</button>
                <button class="danger" @click="deletePost(p.post_id)">删除</button>
              </div>
            </td>
          </tr>
          <tr v-if="filteredPosts.length === 0">
            <td colspan="6" class="meta">没有匹配的帖子。</td>
          </tr>
        </tbody>
      </table>

      <div style="margin-top: 12px; display: flex; justify-content: space-between; align-items: center">
        <div class="meta">共 {{ filteredPosts.length }} 条</div>
        <div class="controls">
          <button @click="postPrevPage" :disabled="postPage <= 1" class="ghost">上一页</button>
          <div class="meta">第 {{ postPage }} / {{ postTotalPages }} 页</div>
          <button @click="postNextPage" :disabled="postPage >= postTotalPages" class="ghost">下一页</button>
        </div>
      </div>
    </div>
    <!-- 帖子审核弹窗 -->
    <router-view :users="users" :posts="posts" @postUpdatedForChildren="postUpdatedForChildren"></router-view>
  </div>
</template>

<script>
import { samplePosts } from "@/data/data";
import { postDataRuquest, deletePostById } from "@/api/dataRequest";

import { userDataMixin } from "@/mixin/AboutUser";
import { dateMethods } from "@/mixin/AboutDate";
export default {
  name: "PostManagePage",
  mixins: [userDataMixin, dateMethods],
  data() {
    return {
      postQuery: "", //搜索关键词
      posts: samplePosts(), //帖子json对象

      // 帖子列表展示页数与数量
      postPage: 1,
      postPageSize: 10,
    };
  },
  computed: {
    filteredPosts() {
      const q = (this.postQuery || "").trim().toLowerCase();
      if (!q) return this.posts.slice().sort((a, b) => b.created_at.localeCompare(a.created_at));
      const terms = q.split(/\s+/).filter(Boolean);
      return this.posts
        .filter((p) => {
          const hay = ((p.title || "") + " " + (p.content || "")).toLowerCase();
          return terms.every((t) => hay.includes(t));
        })
        .sort((a, b) => b.created_at.localeCompare(a.created_at));
    },
    postTotalPages() {
      return Math.max(1, Math.ceil(this.filteredPosts.length / this.postPageSize));
    },
    pagedPosts() {
      const s = (this.postPage - 1) * this.postPageSize;
      return this.filteredPosts.slice(s, s + this.postPageSize);
    },
  },

  methods: {
    async fetchPostData() {
      try {
        await postDataRuquest().then((response1) => {
          this.posts = response1;
          console.log("add postData success!");
        });
      } catch (e) {
        console.log(e);
      }
    },
    searchPosts() {
      this.postPage = 1;
    },
    resetPostSearch() {
      this.postQuery = "";
      this.postPage = 1;
    },
    findUserById(id) {
      return this.users.find((u) => u.user_id === id) || null;
    },
    //路由进行弹窗切换，同时传参
    openReviewModal(p) {
      this.$router.replace({
        name: "PostPopup",
        params: {
          id: p.post_id,
        },
      });
    },
    // 给子组件掉用的父组件更新方法
    postUpdatedForChildren(updatePost) {
      const postIndex = this.posts.findIndex((p) => p.post_id === updatePost.post_id);
      if (postIndex !== -1) this.$set(this.posts, postIndex, updatePost);
    },
    async deletePost(post_id) {
      if (!confirm("确定要删除帖子 ID " + post_id + " 吗？此操作不可逆。")) return;
      const result = await deletePostById(post_id);
      if (result.success) {
        alert("删除成功！");
        this.posts = this.posts.filter((p) => p.post_id !== post_id);
      } else {
        alert("删除失败：" + result.message);
      }
    },
    postPrevPage() {
      if (this.postPage > 1) this.postPage--;
    },
    postNextPage() {
      if (this.postPage < this.postTotalPages) this.postPage++;
    },
    nowIso() {
      const d = new Date();
      const pad = (n) => String(n).padStart(2, "0");
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    },
  },
  mounted() {
    this.fetchPostData();
  },
};
</script>

<style></style>
