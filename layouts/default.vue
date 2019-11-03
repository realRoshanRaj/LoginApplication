<template>
  <v-app>
    <v-navigation-drawer
      v-if="this.$store.state.login.isAuthenticated"
      v-model="drawer"
      fixed
      temporary
    >
      <v-list-item>
        <v-list-item-avatar>
          <v-img src="/defaultProfilePic.png"></v-img>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title>
            {{ this.$store.state.profile.username }}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list dense>
        <v-list-item
          v-for="item in items"
          :key="item.title"
          :to="!item.isHref ? item.link : undefined"
          :href="item.isHref ? item.link : undefined"
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <div>
        <div v-if="!this.$store.state.login.isAuthenticated" class="pa-2">
          <v-btn block color="light-blue darken-4" to="/login">Login</v-btn>
        </div>
        <div
          v-if="!this.$store.state.login.isAuthenticated"
          class="pb-3 pt-2 px-2"
        >
          <v-btn block color="light-green darken-3" to="/signup">Signup</v-btn>
        </div>
        <div class="flex-grow-1"></div>
        <div v-if="this.$store.state.login.isAuthenticated" class="pa-2">
          <v-btn block color="light-blue darken-5" href="/api/auth/logout"
            >Logout</v-btn
          >
        </div>
      </div>
    </v-navigation-drawer>

    <v-app-bar app dense :collapse="drawer">
      <v-app-bar-nav-icon
        v-if="this.$store.state.login.isAuthenticated"
        @click="drawer = !drawer"
      ></v-app-bar-nav-icon>
      <div class="flex-grow-1"></div>

      <v-toolbar-items v-if="!drawer">
        <div
          v-if="!this.$store.state.login.isAuthenticated"
          class="ma-auto pa-2"
        >
          <v-btn color="light-green darken-3" to="/signup">Signup</v-btn>
        </div>
        <div
          v-if="!this.$store.state.login.isAuthenticated"
          class="ma-auto pa-2"
        >
          <v-btn color="light-blue darken-4" to="/login">Login</v-btn>
        </div>
        <div
          v-if="this.$store.state.login.isAuthenticated"
          class="ma-auto pa-2"
        >
          <v-btn color="light-blue darken-5" href="/api/auth/logout"
            >Logout</v-btn
          >
        </div>
      </v-toolbar-items>
    </v-app-bar>

    <v-content>
      <nuxt />
    </v-content>
    <v-footer :fixed="fixed" app>
      <span>&copy; {{ new Date().getFullYear() }} Roshan Raj</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      collapsed: true,
      items: [
        { title: 'Home', icon: 'home', link: '/', isHref: false },
        {
          title: 'Profile',
          icon: 'account_circle',
          link: '/profile',
          isHref: true
        }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Vuetify.js',
      showNavbar: true
    };
  }
};
</script>
