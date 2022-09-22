<template>
  <authenticator :form-fields="formFields">
    <template v-slot:header>
      <div style="padding: var(--amplify-space-large); text-align: center; margin-bottom: -100px; margin-top: -100px">
        <img class="amplify-image" alt="Amplify logo" src="logo.png" />
      </div>
    </template>

    <template v-slot:sign-in-header>
      <h3 class="amplify-heading" style="padding: var(--amplify-space-xl) 0 0 var(--amplify-space-xl)">Sign in to your Kudos Calendar</h3>
    </template>

    <template v-slot:sign-up-header>
      <h3 class="amplify-heading" style="padding: var(--amplify-space-xl) 0 0 var(--amplify-space-xl)">Create a new Kudos Member</h3>
    </template>

    <template v-slot:footer>
      <div style="padding: var(--amplify-space-large); text-align: center">
        <p class="amplify-text" style="color: var(--amplify-colors-neutral-80)">© All Rights Reserved 2022</p>
      </div>
    </template>
  </authenticator>
</template>

<script>
const formFields = {
  signIn: {
    username: {
      labelHidden: false,
      placeholder: "Enter your email",
    },
  },
  signUp: {},
  forceNewPassword: {
    password: {
      labelHidden: false,
      placeholder: "Enter your Password:",
    },
  },
  resetPassword: {
    username: {
      labelHidden: false,
      placeholder: "Enter your email:",
    },
  },
  confirmResetPassword: {
    confirmation_code: {
      labelHidden: false,
      placeholder: "Enter your Confirmation Code:",
      label: "New Label",
      isRequired: false,
    },
    confirm_password: {
      labelHidden: false,
      placeholder: "Enter your Password Please:",
    },
  },

  confirmSignIn: {
    confirmation_code: {
      labelHidden: false,
      label: "New Label",
      placeholder: "Enter your Confirmation Code:",
      isRequired: false,
    },
  },
};
export default {
  setup() {
    return {
      formFields,
    };
  },
};
</script>

<style>
</style>