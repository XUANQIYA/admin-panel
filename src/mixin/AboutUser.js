import { sampleUsers } from "@/data/data";
import { userDataRuquest } from "@/api/dataRequest";
const userDataMixin = {
  data() {
    return {
      users: sampleUsers(),
    };
  },
  methods: {
    async fetchUserData() {
      try {
        await userDataRuquest().then((response1) => {
          this.users = response1;
          console.log("add userData success!");
        });
      } catch (e) {
        console.log(e);
      }
    },
  },
  created() {
    this.fetchUserData();
  },
};
export { userDataMixin };
