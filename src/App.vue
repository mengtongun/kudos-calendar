<template>
  <main>
    <MainView v-if="route === 'authenticated'" />
    <UnAuthView v-else />
  </main>
</template>
<script setup lang='ts'>
import { useAuthenticator } from "@aws-amplify/ui-vue";
import "@aws-amplify/ui-vue/styles.css";
import "@fontsource/inter/variable.css";
import Amplify from "aws-amplify";
import awsmobile from "./aws-exports";
// @ts-ignore
import MainView from "@/views/MainView.vue";
// @ts-ignore
import UnAuthView from "./views/UnAuthView.vue";
Amplify.configure(awsmobile);
const auth = useAuthenticator();
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
