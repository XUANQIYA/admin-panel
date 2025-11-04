export const dateMethods = {
  methods: {
    formatDate(dt) {
      if (!dt) return "—";
      return dt.replace("T", " ").slice(0, 16);
    },
  },
};
