<template>
  <v-container>
    <section>
      <v-card tile flat color="transparent">
        <v-card-text>
          <v-row justify="center">
            <v-avatar
              @mouseenter="showAvatarOverlay = true"
              @mouseleave="showAvatarOverlay = false"
              size="250"
            >
              <v-img
                :src="this.$store.state.profile.avatarURL"
                alt="Avatar"
                lazy-src="/imageNotFound.jpg"
              ></v-img>
              <v-overlay :value="showAvatarOverlay" absolute>
                <v-btn @click="changeAvatarDialog = true" large>
                  Edit Avatar
                </v-btn>
              </v-overlay>
            </v-avatar>
          </v-row>
        </v-card-text>
        <v-card-title
          class="text-left headline font-weight-bold blue--text text--accent-3"
          >Account</v-card-title
        >
      </v-card>
    </section>
    <v-progress-linear buffer-value="0" stream color=""></v-progress-linear>
    <section>
      <v-row class="ma-1">
        <v-col
          v-if="!this.$store.state.profile.oauth"
          class="mt-4"
          cols="12"
          xl="5"
          lg="5"
          md="6"
        >
          <v-card tile flat color="transparent">
            <p class="title">Username</p>
          </v-card>
        </v-col>
        <v-col
          v-if="!this.$store.state.profile.oauth"
          class="mt-3"
          cols="12"
          xl="7"
          lg="7"
          md="6"
        >
          <v-card tile flat color="transparent">
            <v-text-field
              :value="this.$store.state.profile.username"
              disabled
              solo
              dense
              flat
              rounded
            ></v-text-field>
          </v-card>
        </v-col>
        <!--Display Name-->
        <v-col class="mt-2" cols="12" xl="5" lg="5" md="6">
          <v-card tile flat color="transparent">
            <p class="title">Name</p>
          </v-card>
        </v-col>
        <v-col cols="12" xl="7" lg="7" md="6">
          <v-card tile flat color="transparent">
            <v-text-field
              v-model="displayName"
              :error-messages="displayNameErrors"
              :readonly="!displayNameEnabled"
              @input="$v.displayName.$touch()"
              @blur="$v.displayName.$touch()"
              dense
              solo
              flat
              rounded
            >
              <div slot="append">
                <v-tooltip v-if="displayNameEnabled" bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn v-on="on" @click="saveDisplayNameBtn" icon>
                      <v-icon color="green">{{
                        displayNameEnabled ? 'mdi-check-bold' : undefined
                      }}</v-icon>
                    </v-btn>
                  </template>
                  <span>Save</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn v-on="on" @click="editResetDisplayName" icon>
                      <v-icon :color="displayNameEnabled ? 'red' : undefined">{{
                        displayNameEnabled ? 'mdi-close-circle' : 'mdi-pencil'
                      }}</v-icon>
                    </v-btn>
                  </template>
                  <span>{{ displayNameEnabled ? 'Exit' : 'Edit' }}</span>
                </v-tooltip>
              </div>
            </v-text-field>
          </v-card>
        </v-col>
        <!-- Email-->
        <v-col class="mt-2" cols="12" xl="5" lg="5" md="6">
          <v-card tile flat color="transparent">
            <p class="title">Email</p>
          </v-card>
        </v-col>
        <v-col cols="12" xl="7" lg="7" md="6">
          <v-card tile flat color="transparent">
            <v-text-field
              v-model="email"
              :disabled="this.$store.state.profile.oauth"
              :error-messages="emailErrors"
              :readonly="!emailEnabled"
              @input="$v.email.$touch()"
              @blur="$v.email.$touch()"
              dense
              solo
              flat
              rounded
            >
              <div slot="append" v-if="!this.$store.state.profile.oauth">
                <v-tooltip v-if="emailEnabled" bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn v-on="on" @click="saveEmailBttn" icon>
                      <v-icon color="green">{{
                        emailEnabled ? 'mdi-check-bold' : undefined
                      }}</v-icon>
                    </v-btn>
                  </template>
                  <span>Save</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn v-on="on" @click="editResetEmail" icon>
                      <v-icon :color="emailEnabled ? 'red' : undefined">{{
                        emailEnabled ? 'mdi-close-circle' : 'mdi-pencil'
                      }}</v-icon>
                    </v-btn>
                  </template>
                  <span>{{ emailEnabled ? 'Exit' : 'Edit' }}</span>
                </v-tooltip>
              </div>
            </v-text-field>
          </v-card>
        </v-col>
      </v-row>
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
            <v-form @submit.prevent="changePasswordConfirmation" method="post">
              <div>
                <v-text-field
                  v-model="oldPassword"
                  :type="showOldPass ? 'text' : 'password'"
                  :append-icon="showOldPass ? 'mdi-eye-off' : 'mdi-eye'"
                  @click:append="showOldPass = !showOldPass"
                  outlined
                  dense
                  rounded
                  label="Current Password"
                ></v-text-field>
              </div>
              <v-divider></v-divider>
              <div class="pt-4">
                <v-text-field
                  v-model="newPassword"
                  :error-messages="newPasswordErrors"
                  :type="showNewPass ? 'text' : 'password'"
                  :append-icon="showNewPass ? 'mdi-eye-off' : 'mdi-eye'"
                  @click:append="showNewPass = !showNewPass"
                  @input="$v.newPassword.$touch()"
                  @blur="$v.newPassword.$touch()"
                  outlined
                  dense
                  rounded
                  label="New Password"
                ></v-text-field>
                <v-text-field
                  v-model="confirmNewPassword"
                  :error-messages="confirmPasswordErrors"
                  @input="$v.confirmNewPassword.$touch()"
                  @blur="$v.confirmNewPassword.$touch()"
                  outlined
                  rounded
                  dense
                  type="password"
                  label="Confirm New Password"
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

                    <v-btn @click="dialog = false" color="red darken-1" text
                      >No</v-btn
                    >

                    <v-btn @click="changePassword" color="green darken-1" text
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
              @click="deleteAccountConfirmation = true"
              outlined
              color="red"
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
                    @click="deleteAccountConfirmation = false"
                    color="red darken-1"
                    text
                    >No</v-btn
                  >

                  <v-btn @click="deleteAccount" color="green darken-1" text
                    >Yes</v-btn
                  >
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-card>
        </v-col>
      </v-row>
    </section>
    <section>
      <v-snackbar
        v-model="showSnackbar"
        :timeout="2000"
        :color="snackBarColor"
        top
        right
      >
        {{ snackBarText }}
        <v-btn @click="showSnackbar = false" text>Close</v-btn>
      </v-snackbar>
      <v-dialog
        v-model="changeAvatarDialog"
        :max-width="this.$vuetify.breakpoint.name === 'xs' ? '100%' : '40%'"
      >
        <v-card>
          <v-card-title>
            Update Avatar
          </v-card-title>
          <v-tabs v-model="avatarTabIndex" centered grow>
            <v-tab>File Upload</v-tab>
            <v-tab>URL</v-tab>
            <!-- File Upload TAB -->
            <v-tab-item>
              <v-card-text>
                <v-row justify="center">
                  <v-avatar
                    v-if="avatarImgFile && !refreshFilePreview"
                    tile
                    size="150"
                  >
                    <v-img
                      :src="convertFileToURL()"
                      lazy-src="/imageNotFound.jpg"
                    >
                      <template v-slot:placeholder>
                        <v-row
                          class="fill-height ma-0"
                          align="center"
                          justify="center"
                        >
                          <v-progress-circular
                            indeterminate
                            color="grey lighten-5"
                          ></v-progress-circular>
                        </v-row> </template
                    ></v-img>
                  </v-avatar>
                </v-row>
                <v-file-input
                  v-model="avatarImgFile"
                  :rules="avatarRules"
                  @change="refreshFileImgPreview"
                  accept="image/*"
                  show-size
                  counter
                  placeholder="Pick an avatar"
                  prepend-icon="mdi-camera"
                  label="Avatar"
                ></v-file-input>
              </v-card-text>
            </v-tab-item>
            <!-- URL TAB -->
            <v-tab-item>
              <v-card-text>
                <v-row justify="center">
                  <v-avatar v-if="newAvatarURL" tile size="150">
                    <v-img :src="newAvatarURL" lazy-src="/imageNotFound.jpg">
                      <template v-slot:placeholder>
                        <v-row
                          class="fill-height ma-0"
                          align="center"
                          justify="center"
                        >
                          <v-progress-circular
                            indeterminate
                            color="grey lighten-5"
                          ></v-progress-circular>
                        </v-row> </template
                    ></v-img>
                  </v-avatar>
                </v-row>
                <v-text-field
                  v-model="newAvatarURL"
                  :error-messages="avatarURLErrors"
                  @keyup.enter="updateAvatar"
                  @input="$v.newAvatarURL.$touch()"
                  @blur="$v.newAvatarURL.$touch()"
                  @focus="$event.target.select()"
                  placeholder="https://icon-library.net/images/guest-icon-png/guest-icon-png-18.jpg"
                >
                  <v-tooltip slot="append-outer" right>
                    <template v-slot:activator="{ on }">
                      <v-btn
                        v-on="on"
                        @click="refreshImage"
                        bottom
                        color="primary"
                        x-small
                        fab
                        ><v-icon dark>mdi-refresh</v-icon></v-btn
                      >
                    </template>
                    <span>Refresh Preview</span>
                  </v-tooltip>
                </v-text-field>
              </v-card-text>
            </v-tab-item>
          </v-tabs>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              @click="changeAvatarDialog = false"
              color="blue darken-1"
              text
              >Close</v-btn
            >
            <v-btn @click="updateAvatar" color="blue darken-1" text>Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </section>
  </v-container>
</template>

<script>
import { validationMixin } from 'vuelidate';
import {
  required,
  email,
  sameAs,
  minLength,
  url
} from 'vuelidate/lib/validators';
import axios from 'axios';

export default {
  mixins: [validationMixin],
  middleware: 'authenticated',
  data: () => ({
    showAvatarOverlay: false,
    changeAvatarDialog: false,
    avatarTabIndex: 0,
    newAvatarURL: '',
    avatarImgFile: null,
    refreshFilePreview: false,
    avatarRules: [
      (value) =>
        !value ||
        value.size < 3000000 ||
        'Avatar size should be less than 3 MB!'
    ],
    emailEnabled: false,
    email: '',
    displayNameEnabled: false,
    displayName: 'Guest',
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
    },
    newAvatarURL: {
      url
    },
    displayName: { required }
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
    },
    avatarURLErrors() {
      const errors = [];
      if (!this.$v.newAvatarURL.$dirty) return errors;
      !this.$v.newAvatarURL.url &&
        errors.push('Must be valid url that starts with http:// or https://');
      return errors;
    },
    displayNameErrors() {
      const errors = [];
      if (!this.$v.displayName.$dirty) return errors;
      !this.$v.displayName.required && errors.push('Name is required.');
      return errors;
    }
  },
  asyncData({ req, store }) {
    if (process.server && req.isAuthenticated()) {
      let avatarURL = req.user.data.avatar;
      if (avatarURL === '/defaultProfilePic.png') avatarURL = '';
      return {
        email: req.user.data.email,
        newAvatarURL: avatarURL,
        displayName: req.user.data.displayName
      };
    }

    let avatarURL = store.state.profile.avatarURL;
    if (avatarURL === '/defaultProfilePic.png') avatarURL = '';
    return {
      displayName: store.state.profile.displayName,
      email: store.state.profile.email,
      newAvatarURL: avatarURL
    };
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
    async saveEmailBttn() {
      if (this.emailEnabled) {
        // save new email to account
        this.$v.email.$touch();
        if (!this.$v.email.$invalid) {
          if (this.email !== this.$store.state.profile.email) {
            const response = await axios.post('/api/profile/updateEmail', {
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
    editResetDisplayName() {
      if (this.displayNameEnabled) {
        // reset
        this.displayName = this.$store.state.profile.displayName;
        this.displayNameEnabled = false;
      } else {
        // edit
        this.displayNameEnabled = true;
      }
    },
    async saveDisplayNameBtn() {
      if (this.displayNameEnabled) {
        this.$v.displayName.$touch();
        if (!this.$v.displayName.$invalid) {
          if (this.displayName !== this.$store.state.profile.displayName) {
            const response = await axios.post(
              '/api/profile/updateDisplayName',
              {
                displayName: this.displayName
              }
            );
            if (response.data.success) {
              this.showSnackbar = true;
              this.snackBarText = 'Name Successfully Updated';
              this.snackBarColor = 'success';
              this.$store.commit('profile/updateDisplayName', this.displayName);
            } else {
              this.showSnackbar = true;
              this.snackBarText = 'Name Update Failed';
              this.snackBarColor = 'error';
            }
          } else {
            this.showSnackbar = true;
            this.snackBarText = 'No Change to Name Detected';
            this.snackBarColor = 'error';
          }
        }
      }
      this.displayNameEnabled = false;
    },
    changePasswordConfirmation() {
      this.dialog = true;
    },
    async changePassword() {
      this.dialog = false;
      // actually change password
      const xhr = await axios.post('/api/profile/changePassword', {
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
      await axios.delete('/api/profile/deleteUser');
      location.replace('/');
    },
    async updateAvatar() {
      const isURL = this.avatarTabIndex === 1;
      this.$nuxt.$loading.start();
      if (isURL) {
        this.$v.newAvatarURL.$touch();
        if (
          !this.$v.newAvatarURL.$invalid &&
          this.newAvatarURL !== this.$store.state.profile.avatarURL
        ) {
          const response = await axios.post('/api/profile/updateAvatarURL', {
            avatarURL: this.newAvatarURL
          });
          if (response.data.success) {
            this.$store.commit('profile/updateAvatarURL', response.data.url);
            this.$router.go();
            this.showSnackbar = true;
            this.snackBarText = 'Avatar Successfully Updated';
            this.snackBarColor = 'success';
            this.changeAvatarDialog = false;
          } else {
            this.showSnackbar = true;
            this.snackBarText = response.data.message;
            this.snackBarColor = 'error';
          }
        } else this.changeAvatarDialog = false;
      } else if (this.avatarImgFile) {
        const fd = new FormData();
        fd.append('image', this.avatarImgFile);
        const response = await axios({
          // headers: { 'Content-Type': 'multipart/form-data' },
          method: 'post',
          url: '/api/profile/updateAvatarFile',
          data: fd
        });
        if (response.data.success) {
          this.$store.commit('profile/updateAvatarURL', response.data.url);
          this.$router.go();
          this.showSnackbar = true;
          this.snackBarText = 'Avatar Successfully Updated';
          this.snackBarColor = 'success';
          this.changeAvatarDialog = false;
        } else {
          this.showSnackbar = true;
          this.snackBarText = response.data.message;
          this.snackBarColor = 'error';
        }
      } else this.changeAvatarDialog = false;
      this.$nuxt.$loading.finish();
    },
    refreshImage() {
      const url = this.newAvatarURL;
      this.newAvatarURL = '';
      this.$nextTick(function() {
        this.newAvatarURL = url;
      });
    },
    convertFileToURL() {
      const fileData = this.avatarImgFile;
      if (fileData) {
        const url = URL.createObjectURL(fileData);
        return url;
      }
      return '';
    },
    refreshFileImgPreview() {
      if (this.avatarImgFile) {
        this.refreshFilePreview = true;
        this.$nextTick(function() {
          this.refreshFilePreview = false;
        });
      }
    }
  }
};
</script>
