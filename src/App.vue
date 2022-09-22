<template>
  <!-- <nav>
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link>
  </nav> -->
  <main>
    <template v-if="auth.route === 'authenticated'">
      <router-view />
    </template>
    <template v-else>
      <authenticator :form-fields="formFields">
        <template v-slot="{ user, signOut }">
          <h1>Hello {{ user.username }}!</h1>
          <button @click="signOut">Sign Out</button>
        </template>
      </authenticator>
    </template>
  </main>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { Authenticator, useAuthenticator } from "@aws-amplify/ui-vue";
import "@aws-amplify/ui-vue/styles.css";
import "@fontsource/inter/variable.css";

export default defineComponent({
  setup() {
    const auth = useAuthenticator();

    return {
      auth,
      Authenticator,
      formFields: {
        signIn: {
          username: {
            labelHidden: false,
            placeholder: "Enter Your Email Here",
            isRequired: true,
            label: "Email:",
          },
        },
      },
    };
  },
});
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
