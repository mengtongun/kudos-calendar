<template>
  <main>
    <router-view v-if="auth.route === 'authenticated'" />
    <un-auth-view v-else />
  </main>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { useAuthenticator } from "@aws-amplify/ui-vue";
import "@aws-amplify/ui-vue/styles.css";
import "@fontsource/inter/variable.css";

import { Amplify } from "aws-amplify";
import awsmobile from "./aws-exports";
import UnAuthView from "./views/UnAuthView.vue";

Amplify.configure(awsmobile);
export default defineComponent({
  components: { UnAuthView },
  setup() {
    const auth = useAuthenticator();

    return {
      auth,
    };
  },
});
</script>

<style lang="scss">
body {
  margin: 0;
  padding: 0;
  font-family: Arial, Helvetica Neue, Helvetica, sans-serif;
  font-size: 14px;
  background-color: #102832;
  border: 2px solid rgb(13, 84, 114);
}
#app {
  background: #102832;
}
</style>
