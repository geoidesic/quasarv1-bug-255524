<template lang="pug">
q-page
  .absolute-center
    q-banner.bg-negative.text-white(v-if="isError", inline-actions, rounded) The server is offline and essential data could not be loaded thus the navigation sidebar has been disabled as app cannot start. <br />Please try again later or contact support, providing the following reference:
      template(v-slot:avatar)
        q-icon(name="warning")
    q-banner.bg-orange.text-white(v-if="isError", inline-actions, rounded) {{ lastError }}
    .center(v-if="!isLoaded")
      q-spinner-ios(color="primary", size="2rem")
      p {{ slogan }}...
    .center(v-if="isLoaded")
      q-banner.bg-positive.text-white Welcome! Loading is complete. Please use the menu to navigate.
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
export default {
  name: "PageIndex",
  data() {
    return {
      sloganIdx: 1,
      slogans: [
        "Shuffeling papers",
        "Martialing conditions",
        "Ordering sub-ordinates",
        "Herding cats",
        "Subpoenaing sub-routines",
        "Litigating ligatures",
        "Loading essentials",
        "Invoking imperatives",
        "Vetting venerables",
      ],
    };
  },
  watch: {
    isFlaggedOnline: {
      handler(newVal, oldVal) {
        if (newVal !== oldVal && newVal === true) {
          this.initialise();
        }
      },
    },
  },
  computed: {
    slogan() {
      return this.slogans[this.sloganIdx];
    },
    ...mapGetters("schemas", ["isLoaded", "isError", "lastError"]),
    ...mapGetters("pings", ["isFlaggedOnline"]),
  },

  created() {
    //- check if flagged online. Chances are no, because first load will reset flags.
    if (!this.isFlaggedOnline) {
      this.$API.ping(); //- just ping the server, if online it will flag and then the watch will run
    }
    //- load settings
    this.$store.dispatch("roles/loadAll");
  },
  methods: {
    initialise() {
      if (!this.isLoaded) {
        this.$API
          .fetchSchemas("pages/index.initialise")
          .then(async () => {
            this.setIsLoaded(true);
          })
          .catch((err) => {
            // console.log("watch errors", err);
            this.setError(err);
            // this.error = err;
            this.setIsLoaded(false);
          });
        setInterval(this.randomSlogan, 1000);
      }
    },
    //@why – data needed by various pages, doesn't change often.
    
    randomSlogan() {
      this.sloganIdx = Math.floor(Math.random() * 8);
      if (this.$store.getters["schemas/isLoaded"]) {
        clearInterval();
      }
    },
    ...mapMutations("schemas", ["setIsLoaded", "setError"]),
  },
};
</script>

<style lang="stylus">
.logo {
  max-width: 600;
}

.q-banner {
  margin-top: 1rem;
}

.center {
  .q-spinner {
    display: block;
    width: 100%;
    margin: 2rem 0;
  }

  p {
    display: flex;
    justify-content: center;
  }
}
</style>
