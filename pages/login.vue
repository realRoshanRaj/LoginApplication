<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="5">
        <v-card class="elevation-12">
          <v-card-title>
            <v-spacer></v-spacer>
            <v-btn tile dark color="#4885ed" href="/api/auth/google"
              ><v-icon left light>fab fa-google</v-icon>
              <v-divider class="mr-2" vertical dark></v-divider>Sign in with
              Google</v-btn
            >
            <v-spacer></v-spacer>
          </v-card-title>
          <div class="flex-grow-1"></div>
          <div class="separator">OR</div>
          <div class="flex-grow-1"></div>
          <v-card-text>
            <v-form method="post" @submit.prevent="login">
              <v-text-field
                v-model="name"
                :error-messages="nameErrors"
                label="Username"
                required
                outlined
                autofocus
                @input="$v.name.$touch()"
                @blur="$v.name.$touch()"
                @keydown="updateFieldEvent"
              ></v-text-field>
              <v-text-field
                v-model="password"
                :error-messages="passwordErrors"
                label="Password"
                :type="showPassword ? 'text' : 'password'"
                :append-icon="showPassword ? 'far fa-eye-slash' : 'far fa-eye'"
                outlined
                @click:append="showPassword = !showPassword"
                @input="$v.password.$touch()"
                @blur="$v.password.$touch()"
                @keydown="updateFieldEvent"
              ></v-text-field>
              <v-btn
                :loading="loading"
                rounded
                block
                color="green"
                type="submit"
                >Login</v-btn
              >
            </v-form>
          </v-card-text>
          <v-card-text>
            <v-alert
              v-if="validationError"
              type="error"
              dismissible
              elevation="2"
              >{{ validationError }}</v-alert
            >
            <p class="text-center">
              <nuxt-link to="/signup"
                >Don't have an account? Create one</nuxt-link
              >
            </p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { validationMixin } from 'vuelidate';
import { required } from 'vuelidate/lib/validators';
import axios from 'axios';

export default {
  mixins: [validationMixin],
  middleware: 'guest',
  validations: {
    name: {
      required
    },
    password: { required }
  },
  data: () => ({
    name: '',
    password: '',
    validationError: '',
    loading: false,
    showPassword: false
  }),
  head() {
    return {
      titleTemplate: '%s - Login'
    };
  },
  computed: {
    nameErrors() {
      const errors = [];
      if (!this.$v.name.$dirty) return errors;
      !this.$v.name.required && errors.push('Username is required.');
      return errors;
    },
    passwordErrors() {
      const errors = [];
      if (!this.$v.password.$dirty) return errors;
      !this.$v.password.required && errors.push('Password is required.');
      return errors;
    }
  },

  methods: {
    async login() {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        this.loading = true;
        const xhr = await axios.post('/api/auth/login', {
          username: this.name.trim().toLowerCase(),
          password: this.password
        });
        this.loading = false;

        if (xhr.data.loggedIn) {
          this.validationError = '';
          window.location.href = `/profile`;
        } else {
          this.validationError = 'Invalid Login Credentials';
        }
      }
    },
    updateFieldEvent() {
      this.validationError = '';
    },
    clear() {
      this.$v.$reset();
      this.name = '';
      this.password = '';
    }
  }
};
</script>
