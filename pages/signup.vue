<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="5">
        <v-card class="elevation-12">
          <v-card-title>
            <v-spacer></v-spacer>
            <v-btn tile dark color="#4885ed" href="/api/auth/google"
              ><v-icon left light>mdi-google</v-icon>
              <v-divider class="mr-2" vertical dark></v-divider>Signup with
              Google</v-btn
            >
            <v-spacer></v-spacer>
          </v-card-title>
          <div class="flex-grow-1"></div>
          <div class="separator">OR</div>

          <div class="flex-grow-1"></div>
          <v-card-text>
            <v-form @submit.prevent="register" method="post">
              <v-text-field
                v-model="username"
                :error-messages="nameErrors"
                :loading="loadingUsername"
                @input="$v.username.$touch()"
                @blur="$v.username.$touch()"
                label="Username"
                autofocus
                required
                outlined
              ></v-text-field>
              <v-text-field
                v-model="displayName"
                :error-messages="displayNameErrors"
                @input="$v.displayName.$touch()"
                @blur="$v.displayName.$touch()"
                label="Display Name"
                required
                outlined
              ></v-text-field>
              <v-text-field
                v-model="email"
                :error-messages="emailErrors"
                @input="$v.email.$touch()"
                @blur="$v.email.$touch()"
                label="E-mail"
                required
                outlined
              ></v-text-field>
              <v-text-field
                v-model="password"
                :error-messages="passwordErrors"
                :type="'Password'"
                @input="$v.password.$touch()"
                @blur="$v.password.$touch()"
                label="Password"
                required
                outlined
              ></v-text-field>
              <v-text-field
                v-model="confirmPassword"
                :error-messages="confirmPasswordErrors"
                :type="'Password'"
                @input="$v.confirmPassword.$touch()"
                @blur="$v.confirmPassword.$touch()"
                label="Confirm Password"
                required
                outlined
              ></v-text-field>
              <v-btn
                :loading="loadingRegister"
                :disabled="this.$v.$invalid"
                rounded
                block
                color="green"
                type="submit"
                >Create an Account</v-btn
              >
            </v-form>
          </v-card-text>
          <v-card-text>
            <p class="text-center">
              <nuxt-link to="/login">Already got an account? Login</nuxt-link>
            </p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { validationMixin } from 'vuelidate';
import {
  required,
  minLength,
  email,
  sameAs,
  alphaNum
} from 'vuelidate/lib/validators';
import axios from 'axios';

export default {
  mixins: [validationMixin],
  middleware: 'guest',
  validations: {
    username: {
      required,
      minLength: minLength(4),
      alphaNum,
      async isUnique(value) {
        this.loadingUsername = true;
        const xhr = await axios.post(`/api/auth/uniqueUsername`, {
          username: value.trim().toLowerCase()
        });
        this.loadingUsername = false;
        return xhr.data.isUnique;
      }
    },
    displayName: { required },
    email: { required, email },
    password: { required, minLength: minLength(6) },
    confirmPassword: {
      sameAsPassword: sameAs('password'),
      required
    }
  },
  head() {
    return {
      titleTemplate: '%s - Signup'
    };
  },

  data: () => ({
    username: '',
    displayName: '',
    email: '',
    password: '',
    confirmPassword: '',
    loadingUsername: false,
    loadingRegister: false
  }),

  computed: {
    nameErrors() {
      const errors = [];
      if (!this.$v.username.$dirty) return errors;
      !this.$v.username.minLength &&
        errors.push('Username must be at least 4 characters long');
      !this.$v.username.alphaNum &&
        errors.push('Usernames can only contain numbers or letters.');
      !this.$v.username.required && errors.push('Username is required.');
      !this.$v.username.isUnique && errors.push('Username is taken.');
      return errors;
    },
    displayNameErrors() {
      const errors = [];
      if (!this.$v.displayName.$dirty) return errors;
      !this.$v.displayName.required && errors.push('Name is required');
      return errors;
    },
    emailErrors() {
      const errors = [];
      if (!this.$v.email.$dirty) return errors;
      !this.$v.email.email && errors.push('Must be valid e-mail');
      !this.$v.email.required && errors.push('E-mail is required');
      return errors;
    },
    passwordErrors() {
      const errors = [];
      if (!this.$v.password.$dirty) return errors;
      !this.$v.password.minLength &&
        errors.push('Password must be at least 6 characters long');
      !this.$v.password.required && errors.push('Password is required.');
      return errors;
    },
    confirmPasswordErrors() {
      const errors = [];
      if (!this.$v.confirmPassword.$dirty) return errors;
      !this.$v.confirmPassword.sameAsPassword &&
        errors.push('Password confirmation must be identical.');
      !this.$v.confirmPassword.required &&
        errors.push('Password Confirmation is required.');
      return errors;
    }
  },

  methods: {
    async register() {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        this.loadingRegister = true;
        await axios.post('/api/auth/register', {
          username: this.username.trim().toLowerCase(),
          displayName: this.displayName.trim(),
          email: this.email.trim().toLowerCase(),
          password: this.password
        });
        this.loadingRegister = false;
        window.location.href = `/profile`;
      }
    },
    clear() {
      this.$v.$reset();
      this.name = '';
      this.email = '';
      this.password = '';
      this.confirmPassword = '';
    }
  }
};
</script>
