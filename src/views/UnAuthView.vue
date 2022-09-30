<template>
  <authenticator :form-fields="formFields">
    <template #header>
      <div style="padding: var(--amplify-space-large); text-align: center; margin-bottom: -120px; margin-top: -120px">
        <img class="amplify-image" alt="Amplify logo" src="logo.png" style="transform: scale(0.4)" />
      </div>
    </template>

    <template #sign-in-header>
      <h3 class="amplify-heading" style="padding: var(--amplify-space-xl) 0 0 var(--amplify-space-xl); font-weight: bold">Sign in to your Kudos Calendar</h3>
    </template>

    <template #sign-up-header>
      <h3 class="amplify-heading" style="padding: var(--amplify-space-xl) 0 0 var(--amplify-space-xl); font-weight: bold">Create a new Kudos Member</h3>
    </template>

    <template #footer>
      <div style="padding: var(--amplify-space-large); text-align: center">
        <p class="amplify-text" style="color: var(--amplify-colors-neutral-80)">© All Rights Reserved 2022</p>
      </div>
    </template>
  </authenticator>
</template>

<script setup lang='ts'>
const formFields = {
  signIn: {
    username: {
      labelHidden: false,
      placeholder: "Enter your email",
    },
    password: {
      labelHidden: false,
      placeholder: "Enter your password",
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
</script>

<style lang="scss">
.amplify-button--primary {
  background-color: #5271ff;
  color: #fff;
  border: none;
  border-radius: 0.5rem !important;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  &:hover {
    background-color: #5271ff;
    color: #fff;
    opacity: 0.8;
  }
}
.amplify-button--link {
  background-color: transparent;
  color: #5271ff;
  border: none;
  border-radius: 0.5rem !important;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  &:hover {
    color: #5271ff;
    opacity: 0.8;
  }
}
.amplify-input {
  border: 1px solid #5271ff;
  border-radius: 0.5rem !important;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  font-weight: 500;
  width: 100%;
  &:focus {
    outline: none;
    border: 1px solid #5271ff;
  }
  &::placeholder {
    color: #5271ff;
  }
}
[data-amplify-authenticator] [data-amplify-router] {
  background-color: rgb(238, 248, 246);
  border-bottom-left-radius: 1.5rem;
  border-bottom-right-radius: 1.5rem;
}
.amplify-tabs-item[data-state="active"] {
  background-color: #5271ff;
  color: #fff;
  border-color: grey;
}
.amplify-label {
  font-size: 1rem;
  font-weight: 500;
  color: #5271ff;
}
.amplify-icon {
  color: #5271ff;
}
.amplify-authenticator__subtitle {
  color: #5271ff;
}
</style>