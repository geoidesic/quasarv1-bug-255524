<template>
  <q-page class="window-height window-width row justify-center items-center">
    <div class="column">
      <div class="row">
        <h5 class="text-h5 text-white q-my-md">Login</h5>
      </div>
      <div class="row">
        <q-card square bordered class="q-pa-lg shadow-1">
          <q-card-section>
            <q-form class="q-gutter-md" ref="loginForm">
              <q-input
                filled
                clearable
                v-model="email"
                type="email"
                label="Email"
                :rules="[(val) => !!val || 'Email is missing', isValidEmail]"
              />
              <q-input
                filled
                clearable
                v-model="password"
                type="password"
                label="Password"
                :rules="[(val) => !!val || 'Password is missing']"
                @keydown.enter.prevent="submitLogin"
              />
            </q-form>
          </q-card-section>
          <q-card-actions class="q-px-md">
            <q-btn
              unelevated
              color="light-green-7"
              size="lg"
              class="full-width"
              label="Login"
              @click="submitLogin"
            />
          </q-card-actions>
        
        </q-card>
      </div>
    </div>
    <q-inner-loading :showing="loadingFlag">
      <q-spinner-puff size="50px" color="primary" />
    </q-inner-loading>
  </q-page>
</template>

<script>
import apiService from "../service/service";
import { notify } from "src/utils";
import { getBrowserID } from "src/utils";
export default {
  name: "Login",
  data() {
    return {
      email: "",
      password: "",
      loadingFlag: false,
      deviceID:
        window.device === void 0 ? getBrowserID(navigator) : window.device.uuid,
    };
  },
  methods: {
    submitLogin() {
      this.$refs.loginForm
        .validate()
        .then(async (success) => {
          if (success) {
            this.loadingFlag = true;
            try {
              const res = await apiService.userLogin(
                this.email,
                this.password,
                this.deviceID
              );

              if (res.data.login.valid == true) {
                notify("You are successfully logged in");
                this.$store.commit("shared/setActingAs", res.data.user);
                this.$router.push("/");
              } else {
                notify("LoginError: " + res.data.login.message, "negative");
              }
            } catch (error) {
              notify("LoginError: " + error, "negative");
            }

            this.loadingFlag = false;
          }
        })
        .catch((err) => {});
    },
    isValidEmail(val) {
      const emailPattern =
        /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
      return emailPattern.test(val) || "Invalid email";
    },
  },
};
</script>
<style>
.q-card {
  width: 360px;
}
</style>