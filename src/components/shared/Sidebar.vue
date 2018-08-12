<template>
    <v-navigation-drawer
      :value="drawer"
      fixed
      clipped
      app
    >
      <v-list>
        <v-list-tile
          ripple
          :to="item.route"
          v-for="item in items"
          :key="item.text"
        >
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>
              {{ item.text }}
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <template v-if="userHasAdminRole">
          <v-subheader class="mt-3 grey--text text--darken-1">ADMIN PANEL</v-subheader>
          <v-list>
            <v-list-tile ripple exact-active-class="active" :to="{ name : 'Dashboard' }">
              <v-list-tile-content>
                <v-list-tile-title>Dashboard</v-list-tile-title>
                <v-list-tile-sub-title>Quick review metrics</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
          <v-list-group
              v-for="item in items2"
              v-model="item.active"
              :key="item.title"
              no-action
            >
              <v-list-tile slot="activator">
                <v-list-tile-content>
                  <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>

              <v-list-tile
                ripple
                :to="subItem.route"
                v-for="subItem in item.items"
                :key="subItem.title"
              >
                <v-list-tile-content>
                  <v-list-tile-title class="fw400">{{ subItem.title }}</v-list-tile-title>
                </v-list-tile-content>

                <v-list-tile-action>
                  <v-icon>{{ subItem.icon }}</v-icon>
                </v-list-tile-action>
              </v-list-tile>
              <v-list-tile ripple @click.native="_disableActiveCampaign">
                <v-list-tile-content>
                  <v-list-tile-title class="fw400 is-clickable">Disable Active Campaign</v-list-tile-title>
                </v-list-tile-content>
                <v-list-tile-action>
                  <v-icon>highlight</v-icon>
                </v-list-tile-action>
              </v-list-tile>
            </v-list-group>
          </template>
        <v-list-tile class="mt-3">
          <v-list-tile-action>
            <v-icon color="grey darken-1">add_circle_outline</v-icon>
          </v-list-tile-action>
          <v-list-tile-title class="grey--text text--darken-1">Browse Channels</v-list-tile-title>
        </v-list-tile>
        <v-list-tile>
          <v-list-tile-action>
            <v-icon color="grey darken-1">settings</v-icon>
          </v-list-tile-action>
          <v-list-tile-title class="grey--text text--darken-1">Manage Subscriptions</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
</template>

<script>
import { mapState, mapActions, mapMutations, mapGetters } from  'vuex'
export default {
  data: () => {
    return {
      items: [
        { icon: 'account_box', text: 'Profile', route: { name: 'Profile' } },
        { icon: 'history', text: 'Vote', route: { name: 'Vote' } },
        { icon: 'history', text: 'Live Vote Results', route: { name: 'VoteResults' }},
      ],
      items2: [
        {
          action: 'local_activity',
          title: 'Users Management',
          items: [
            { title: 'View Users', route: { name: 'Users' } }
          ]
        },
        {
          action: 'restaurant',
          title: 'Vote Management',
          active: true,
          items: [
            // { icon: 'add', title: 'Create Campaigns', route: 'd' },
            { icon: 'visibility', title: 'Campaigns', route: { name: 'Campaigns' }},
            { icon: 'history', title: 'View Vote Results', route: { name: 'VoteResults' }}
          ]
        }
      ]
    }
  },
  computed: {
    ...mapState('app', ['drawer']),
    ...mapGetters('user', ['userHasAdminRole'])
  },
  methods: {
    ...mapActions('campaign', [
      'disableActiveCampaign'
    ]),

    ...mapMutations('app', [
      'TOGGLE_SNACKBAR'
    ]),

    _disableActiveCampaign () {
      this.$swal({
        title: 'Are you sure?',
        text: "You want to disable active campaign",
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes'
      }).then((result) => {
        if (result.value) {
          this.disableActiveCampaign()
          .then((res) => {
            this.TOGGLE_SNACKBAR({
              msg: 'Successfully disabled active campaign!',
              color: 'success'
            })
          })
          .catch((err) => {
           this.TOGGLE_SNACKBAR({
              msg: `${err.response.data.message} Reload page`,
              color: 'error'
            })
          })
        }
      })
    }
  }
}
</script>
