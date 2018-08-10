<template>
  <v-app class="dashboard" :dark="darkMode? true : false" id="inspire">
    <Sidebar></Sidebar>
    <Navbar></Navbar>
    <v-content>
        <router-view></router-view>
        <v-snackbar
          v-model="snackbarActive"
          :color="snackbarColor"
          :timeout="timeout"
          auto-height
          :multi-line="multiLine"
          :right="position === 'right'"
          :top="position === 'top'"
        >
          {{ snackbarText }}
          <v-btn flat @click="TOGGLE_SNACKBAR">
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
        'snackbar',
        'timeout',
        'position',
        'multiLine'
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

<style>
  .v-content__wrap {
      background: url(/img/seperator-hipstertech.png);
      background-repeat: no-repeat;
      /* background-blend-mode: soft-light; */
      background-blend-mode: color;
      background-color: #282828;
      /* background-color: darkcyan; */
  }
</style>

