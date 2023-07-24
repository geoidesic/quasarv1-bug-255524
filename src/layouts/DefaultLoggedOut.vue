<template lang="pug">
q-layout(view="lHh Lpr lFf")
  q-page-container
    router-view
</template>

<script>
import { getBrowserID } from "src/utils";
export default {
  name: "DefaultLoggedOut",
  components: {},
  data() {
    return {
      deviceID:
        window.device === void 0 ? getBrowserID(navigator) : window.device.uuid
    };
  },
  computed: {},
  async created() {},
  methods: {
    ping() {
      this.$API.ping();
    },
    loggedIn() {
      this.$API.loggedIn();
    }
  }
};
</script>
<style lang='stylus'>
.q-banner
  .q-spinner
    margin-right 1rem
</style>