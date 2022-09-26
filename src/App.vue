<template>
  <main>
    <router-view v-if="auth.route === 'authenticated'" />
    <un-auth-view v-else />
  </main>
</template>
<script setup lang="ts">
import { useAuthenticator } from "@aws-amplify/ui-vue";
import "@aws-amplify/ui-vue/styles.css";
import "@fontsource/inter/variable.css";
import { Amplify } from "aws-amplify";
import awsmobile from "./aws-exports";
import UnAuthView from "./views/UnAuthView.vue";
const auth = useAuthenticator();
Amplify.configure(awsmobile);
</script>

<style lang="scss">
#app {
  background: #102832;
}
body {
  margin: 0;
  background: #102832;
}
.min-w-10rem {
  min-width: 10rem;
}
</style>
