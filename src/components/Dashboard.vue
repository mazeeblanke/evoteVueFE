<template>
  <v-app :dark="darkMode? true : false" id="inspire">
    <Sidebar></Sidebar>
    <Navbar></Navbar>
    <v-content>
        <router-view></router-view>
        <v-snackbar v-model="snackbarActive" :timeout="4000" right>
          {{ snackbarText }}
          <v-btn :color="snackbarColor" flat @click="TOGGLE_SNACKBAR">
            Close
          </v-btn>
        </v-snackbar>
    </v-content>
  </v-app>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import Navbar from '@/components/shared/Navbar'
import Sidebar from '@/components/shared/Sidebar'

export default {
    components: {
      Navbar,
      Sidebar
    },

    data: () => ({

    }),

    props: {
        source: String
    },

    methods: {
      ...mapMutations('app', [
        'TOGGLE_SNACKBAR'
      ])
    },

    computed: {
      ...mapState('app', [
        'darkMode',
        'snackbarColor',
        'snackbarText',
        'snackbar'
      ]),

      snackbarActive: {
        get() {
          return this.snackbar
        },
        set (val) {
          this.TOGGLE_SNACKBAR()
        }
      }
    }
}
</script>
