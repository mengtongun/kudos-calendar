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
.amplify-button--primary {
  background-color: #395b64;
  color: #fff;
  border: none;
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  &:hover {
    background-color: #395b64;
    color: #fff;
    opacity: 0.8;
  }
}
</style>
