<template>
    <v-toolbar
      dense
      fixed
      clipped-left
      app
      prominent
      :height=60
      :color="darkMode? '#00000' : '#f5f5f5'"
    >
      <v-toolbar-side-icon @click.stop="TOGGLE_DRAWER"></v-toolbar-side-icon>
      <v-toolbar-title class="mr-5 align-center">
        <span class="title">EVote</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>

        <v-avatar
          :tile="false"
          :size=35
          color="grey lighten-4"
        >
          <img
            class="is-rounded-circle"
            :style="{ 'text-indent' : user.avatar === '/' ? '-9999px' : '0px' }"
            :src="user.avatar">
        </v-avatar>

        <div class="text-xs-center">
          <v-menu
            v-model="menu"
            :close-on-content-click="false"
            right
            :nudge-width="230"
            :min-width="230"
            offset-x
          >
            <v-btn icon slot="activator">
              <v-icon>more_vert</v-icon>
            </v-btn>

            <v-card style="background-color: #424242 !important">
              <v-list>
                <v-list-tile avatar>
                  <v-list-tile-avatar color="grey lighten-4">
                    <img
                      :src="user.avatar"
                      :style="{ 'text-indent' : user.avatar === '/' ? '-9999px' : '0px' }"
                    >
                  </v-list-tile-avatar>

                  <v-list-tile-content>
                    <v-list-tile-title v-if="user.firstname && user.lastname">{{ user.firstname + " " + user.lastname }}</v-list-tile-title>
                    <v-list-tile-sub-title>{{ user.username }}</v-list-tile-sub-title>
                  </v-list-tile-content>
                </v-list-tile>
              </v-list>

              <v-divider></v-divider>

              <v-list>
                <v-list-tile>
                  <v-list-tile-action>
                    <v-switch @click.native="TOGGLE_DARK_MODE" :value="darkMode" color="indigo"></v-switch>
                  </v-list-tile-action>
                  <v-list-tile-title>Night mode</v-list-tile-title>
                </v-list-tile>
              </v-list>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" flat @click="_logout">Logout</v-btn>
              </v-card-actions>
            </v-card>
          </v-menu>
        </div>
    </v-toolbar>
</template>

<script>
import { mapMutations, mapState, mapActions } from 'vuex'
export default {
  data () {
    return {
      menu: false,
    }
  },
  methods: {
    ...mapMutations('app', [
      'TOGGLE_DRAWER',
      'TOGGLE_DARK_MODE'
    ]),

    ...mapActions('auth', [
      'logout'
    ]),

    _logout () {
      this.logout().then(() => {
        this.$router.push({
          name: 'login'
        })
      })
    }
  },

  computed: {
    ...mapState('app', [
      'darkMode'
    ]),

    ...mapState('user', [
      'user'
    ])
  }
}
</script>

