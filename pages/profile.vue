<template>
  <v-container>
    <section>
      <v-card tile flat color="transparent">
        <v-card-title
          class="text-left headline font-weight-bold blue--text text--accent-3"
          >Account</v-card-title
        >
      </v-card>

      <v-progress-linear buffer-value="0" stream color=""></v-progress-linear>

      <v-row class="ma-1">
        <v-col class="mt-4" cols="12" xl="5" lg="5" md="6">
          <v-card tile flat color="transparent">
            <p class="title">Username</p>
          </v-card>
        </v-col>
        <v-col class="mt-3" cols="12" xl="7" lg="7" md="6">
          <v-card tile flat color="transparent">
            <v-text-field
              disabled
              solo
              dense
              flat
              rounded
              :value="this.$store.state.profile.username"
            ></v-text-field>
          </v-card>
        </v-col>
        <v-col class="mt-2" cols="12" xl="5" lg="5" md="6">
          <v-card tile flat color="transparent">
            <p class="title">Email</p>
          </v-card>
        </v-col>
        <v-col cols="12" xl="7" lg="7" md="6">
          <v-card tile flat color="transparent">
            <v-text-field
              v-model="email"
              dense
              solo
              flat
              rounded
              :disabled="this.$store.state.profile.oauth"
              :error-messages="emailErrors"
              :readonly="!emailEnabled"
              @input="$v.email.$touch()"
              @blur="$v.email.$touch()"
            >
              <div v-if="!this.$store.state.profile.oauth" slot="append">
                <v-btn v-if="emailEnabled" icon @click="saveBttn">
                  <v-icon color="green">{{
                    emailEnabled ? 'fas fa-check' : undefined
                  }}</v-icon>
                </v-btn>
                <v-btn icon @click="editResetEmail">
                  <v-icon :color="emailEnabled ? 'red' : undefined">{{
                    emailEnabled ? 'fas fa-times' : 'fas fa-pen'
                  }}</v-icon>
                </v-btn>
              </div>
            </v-text-field>
          </v-card>
        </v-col>
      </v-row>
      <v-snackbar
        v-model="showSnackbar"
        :timeout="2000"
        top
        right
        :color="snackBarColor"
      >
        {{ snackBarText }}
        <v-btn text @click="showSnackbar = false">Close</v-btn>
      </v-snackbar>
    </section>

    <v-progress-linear buffer-value="0" stream color=""></v-progress-linear>

    <section v-if="!this.$store.state.profile.oauth">
      <v-row class="ma-1">
        <v-col cols="12" xl="5" lg="5" md="6">
          <v-card tile flat color="transparent">
            <p class="title">Password</p>
            <p class="subtitle-2 red--text">
              Changing your password will require you to login again.
            </p>
          </v-card>
        </v-col>
        <v-col class="text-left" cols="12" xl="7" lg="7" md="6">
          <v-card tile flat color="transparent">
            <v-form method="post" @submit.prevent="changePasswordConfirmation">
              <div>
                <v-text-field
                  v-model="oldPassword"
                  outlined
                  dense
                  rounded
                  :type="showOldPass ? 'text' : 'password'"
                  label="Current Password"
                  :append-icon="showOldPass ? 'far fa-eye-slash' : 'far fa-eye'"
                  @click:append="showOldPass = !showOldPass"
                ></v-text-field>
              </div>
              <v-divider></v-divider>
              <div class="pt-4">
                <v-text-field
                  v-model="newPassword"
                  :error-messages="newPasswordErrors"
                  outlined
                  dense
                  :type="showNewPass ? 'text' : 'password'"
                  rounded
                  label="New Password"
                  :append-icon="showNewPass ? 'far fa-eye-slash' : 'far fa-eye'"
                  @click:append="showNewPass = !showNewPass"
                  @input="$v.newPassword.$touch()"
                  @blur="$v.newPassword.$touch()"
                ></v-text-field>
                <v-text-field
                  v-model="confirmNewPassword"
                  :error-messages="confirmPasswordErrors"
                  outlined
                  rounded
                  dense
                  type="password"
                  label="Confirm New Password"
                  @input="$v.confirmNewPassword.$touch()"
                  @blur="$v.confirmNewPassword.$touch()"
                ></v-text-field>
              </div>
              <v-btn :disabled="this.$v.$invalid" type="submit"
                >Change Password</v-btn
              >
              <v-dialog
                v-model="dialog"
                :max-width="
                  this.$vuetify.breakpoint.name === 'xs' ? '100%' : '40%'
                "
                transition="scale-transition"
                origin="center center"
                hide-overlay
              >
                <v-card>
                  <v-card-title class="headline">Confirmation</v-card-title>

                  <v-card-text
                    >Are you sure that you would like to change your
                    password?</v-card-text
                  >

                  <v-card-actions>
                    <v-spacer></v-spacer>

                    <v-btn color="red darken-1" text @click="dialog = false"
                      >No</v-btn
                    >

                    <v-btn color="green darken-1" text @click="changePassword"
                      >Yes</v-btn
                    >
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-form>
          </v-card>
        </v-col>
      </v-row>
      <v-progress-linear buffer-value="0" stream color=""></v-progress-linear>
    </section>

    <section>
      <v-row class="ma-1">
        <v-col cols="12" xl="5" lg="5" md="6">
          <v-card tile flat color="transparent">
            <p class="title red--text">Delete your account</p>
            <p class="subtitle-2">
              <em>Warning:</em> Deleting your account is irreversible.
            </p>
          </v-card>
        </v-col>
        <v-col align-self="center" cols="12" xl="7" lg="7" md="6">
          <v-card tile flat color="transparent">
            <v-btn
              outlined
              color="red"
              @click="deleteAccountConfirmation = true"
              >Delete this account...</v-btn
            >

            <v-dialog
              v-model="deleteAccountConfirmation"
              :max-width="
                this.$vuetify.breakpoint.name === 'xs' ? '100%' : '33%'
              "
              transition="scale-transition"
              origin="center center"
              hide-overlay
            >
              <v-card>
                <v-card-title class="headline">Confirmation</v-card-title>

                <v-card-text
                  >Are you sure that you would like to delete your account? This
                  account will be lost <em>forever.</em></v-card-text
                >

                <v-card-actions>
                  <v-spacer></v-spacer>

                  <v-btn
                    color="red darken-1"
                    text
                    @click="deleteAccountConfirmation = false"
                    >No</v-btn
                  >

                  <v-btn color="green darken-1" text @click="deleteAccount"
                    >Yes</v-btn
                  >
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-card>
        </v-col>
      </v-row>
    </section>
  </v-container>
</template>

<script>
import { validationMixin } from 'vuelidate';
import { required, email, sameAs, minLength } from 'vuelidate/lib/validators';
import axios from 'axios';

export default {
  mixins: [validationMixin],
  middleware: 'authenticated',
  data: () => ({
    loading: false,
    emailEnabled: false,
    email: '',
    showOldPass: false,
    oldPassword: '',
    showNewPass: false,
    newPassword: '',
    confirmNewPassword: '',
    dialog: false,
    showSnackbar: false,
    snackBarText: 'Test',
    snackBarColor: undefined,
    deleteAccountConfirmation: false
  }),
  head() {
    return {
      titleTemplate: '%s - Profile'
    };
  },
  validations: {
    email: { required, email },
    newPassword: {
      required,
      minLength: minLength(6)
    },
    confirmNewPassword: {
      sameAsPassword: sameAs('newPassword'),
      required
    }
  },
  computed: {
    emailErrors() {
      const errors = [];
      if (!this.$v.email.$dirty) return errors;
      !this.$v.email.email && errors.push('Must be valid e-mail.');
      !this.$v.email.required && errors.push('E-mail is required.');
      return errors;
    },
    newPasswordErrors() {
      const errors = [];
      if (!this.$v.newPassword.$dirty) return errors;
      !this.$v.newPassword.minLength &&
        errors.push('Password must be at least 6 characters long.');
      !this.$v.newPassword.required && errors.push('Password is required.');
      return errors;
    },
    confirmPasswordErrors() {
      const errors = [];
      if (!this.$v.confirmNewPassword.$dirty) return errors;
      !this.$v.confirmNewPassword.sameAsPassword &&
        errors.push('Password confirmation must be identical.');
      !this.$v.confirmNewPassword.required &&
        errors.push('Password Confirmation is required.');
      return errors;
    }
  },
  asyncData({ req, res }) {
    if (process.server && req.isAuthenticated()) {
      return { email: req.user.data.email };
    }

    return {};
  },
  methods: {
    editResetEmail() {
      if (this.emailEnabled) {
        // reset
        this.email = this.$store.state.profile.email;
        this.emailEnabled = false;
      } else {
        // edit
        this.emailEnabled = true;
      }
    },
    async saveBttn() {
      if (this.emailEnabled) {
        // save new email to account
        this.$v.email.$touch();
        if (!this.$v.email.$invalid) {
          if (this.email !== this.$store.state.profile.email) {
            const response = await axios.post('/api/auth/updateEmail', {
              email: this.email
            });
            if (response.data.success) {
              this.showSnackbar = true;
              this.snackBarText = 'Email Successfully Updated';
              this.snackBarColor = 'success';
              this.$store.commit('profile/updateEmail', this.email);
            } else {
              this.showSnackbar = true;
              this.snackBarText = 'Email Update Failed';
              this.snackBarColor = 'error';
            }
          } else {
            this.showSnackbar = true;
            this.snackBarText = 'No Change to Email Detected';
            this.snackBarColor = 'error';
          }
        }
      }
      this.emailEnabled = false;
    },
    changePasswordConfirmation() {
      this.dialog = true;
    },
    async changePassword() {
      this.dialog = false;
      // actually change password
      const xhr = await axios.post('/api/auth/changePassword', {
        currentPassword: this.oldPassword,
        newPassword: this.newPassword
      });
      this.showSnackbar = true;
      this.snackBarText = xhr.data.message;
      if (xhr.data.success) {
        this.snackBarColor = 'success';
        window.location.href = `/api/auth/logout?redirect=login`;
      } else {
        this.snackBarColor = 'error';
      }
    },
    async deleteAccount() {
      await axios.delete('/api/auth/deleteUser');
      window.location.href = `/`;
    }
  }
};
</script>
