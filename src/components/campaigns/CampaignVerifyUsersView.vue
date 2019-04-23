<template>
        <v-card raised :height=700>
          <v-card-title class="card-gradient">
            <div class="is-flex">
              <v-icon @click="$router.back()">arrow_left</v-icon>
              <h3 class="headline" :style="{'text-transform': 'capitalize'}">VERIFY {{selectedCampaign.name}} CAMPAIGN USERS</h3>
            </div>
            <v-spacer></v-spacer>
            <v-layout justify-end>
              <v-flex justify-end align-end md5 p5>
                <v-text-field
                  @keyup.native="updateSearchQuery"
                  append-icon="search"
                  label="Search"
                  single-line hide-details
                ></v-text-field>
              </v-flex>
              <v-flex justify-end align-end md3 p5>
                <v-select
                  v-model="pagination.confirmed"
                  item-text="text"
                  item-value="value"
                  :items="confirmation_statuses"
                  label="Confirmation status"
                  clearable
                ></v-select>
              </v-flex>
            </v-layout>
          </v-card-title>
          <v-data-table
            :headers="headers"
            :items="formattedUsers"
            :search="search"
            :rows-per-page-items="perPageValues"
            :pagination.sync="pagination"
            :total-items="selectedCampaign.users.total"
            :loading="loading"
          >
            <template slot="headers" slot-scope="props">
              <tr>
                <th>
                  <v-checkbox
                    :input-value="props.all"
                    :indeterminate="props.indeterminate"
                    primary
                    hide-details
                    @click.native="toggleAll"
                  ></v-checkbox>
                </th>
                <th
                  v-for="header in props.headers"
                  :key="header.text"
                  v-if="header.text"
                >
                  {{ header.text }}
                </th>
                <th>Actions</th>
              </tr>
            </template>
            <template slot="items" slot-scope="props">
              <tr
                class="capitalize"
                :active="props.selected"
                @click="props.selected = !props.selected"
              >
                <td class="has-truncated-text">
                  <v-checkbox
                    v-if="props.item.id"
                    :input-value="props.selected"
                    primary hide-details
                  ></v-checkbox>
                </td>
                <td class="has-truncated-text">{{ props.item.user_id }}</td>
                <td class="has-truncated-text">{{ (props.item.userdetails || {}).username }}</td>
                <td class="has-truncated-text">{{ (props.item.userdetails || {}).email }}</td>
                <td class="has-truncated-text">{{ (props.item.userdetails || {}).phone }}</td>
                <td class="has-truncated-text">{{ (props.item && props.item.verified !== undefined) ? Boolean(props.item.verified) : null  }}</td>
                <td class="has-truncated-text">{{ (props.item.userdetails || {}).created_at }}</td>
                <td class="has-truncated-text">
                  <v-icon
                    v-if="props.item.id"
                    small
                    class="mr-2"
                    @click="editItem(props.item)"
                  > edit </v-icon>
                </td>
              </tr>
            </template>
            <v-alert class="" slot="no-results" :value="true" color="error" icon="warning">
              <div class="">
                Your search for "{{ search }}" found no results.
              </div>
            </v-alert>
          </v-data-table>
          <v-dialog v-model="dialog" max-width="800px">
            <v-card>
              <v-card-title>
                <span class="headline">Edit User</span>
              </v-card-title>
              <v-card-text>
                <v-container grid-list-md>
                  <v-layout wrap>
                    <v-flex xs12 sm6 md4>
                      <v-text-field
                        v-model="editedItem.firstname"
                        label="First name"
                        box
                        clearable
                        disabled
                      ></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm6 md4>
                      <v-text-field
                        v-model="editedItem.lastname"
                        label="Last name"
                        box
                        clearable
                        disabled
                      ></v-text-field>
                    </v-flex>
                      <v-flex xs12 sm6 md4>
                        <v-text-field
                          v-model="editedItem.username"
                          label="Username"
                          box
                          clearable
                          disabled
                        ></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm6 md4>
                        <v-text-field
                          v-model="editedItem.email"
                          label="Email"
                          box
                          clearable
                          disabled
                        ></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm6 md4>
                        <v-select
                          :items="confirmation_statuses"
                          v-model="editedItem.verified"
                          item-text="text"
                          item-value="value"
                          label="Verification status"
                          box
                          clearable
                        ></v-select>
                      </v-flex>
                      <!-- <v-flex xs12 sm6 md4>
                        <v-select
                          :items="[{ text: 'Regular', name: 'regular' }, { text: 'Admin', name: 'admin' }]"
                          v-model="editedItem.roles"
                          item-text="text"
                          item-value="name"
                          label="Role"
                          box
                          clearable
                          multiple
                        ></v-select>
                      </v-flex> -->
                  </v-layout>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn depressed @click.native="close">Cancel</v-btn>
                <v-btn depressed :loading="verifying"  @click.native="save">Save</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-card>
</template>

<script lang="ts">

  import _ from 'lodash'
  import { UCFIRST } from '../../utils/helpers'
  import { namespace } from 'vuex-class'
  import { Vue, Component, Watch } from 'vue-property-decorator'

  const user = namespace('user')
  const app = namespace('app')
  const campaign = namespace('campaign')

  @Component
  export default class CampaignVerifyUsersView extends Vue {

    loading: boolean = false
    verifying: boolean = false
    snackbar: boolean = false
    dialog: boolean = false
    total: number = 0
    snackbarText: any = null
    editedIndex: any = null
    editedItem: any = {}
    perPageValues: any = [9]
    search:any = null
    confirmation_statuses: Array<{ value: boolean, text: string }> = [
      {
        value: true,
        text: 'Verified'
      },
      {
        value: false,
        text: 'Unverified'
      },
    ]
    pagination: any = {}

    filter: any = {

      limit: 9,

      page: 1

    }
    headers: any = [{

        text: 'ID',

        value: 'calories'

      },

      {

        text: 'Username',

        value: 'fat'

      },

      {

        text: 'Email',

        value: 'carbs'

      },

      {

        text: 'Phone',

        value: 'protein'

      },

      {

        text: 'Confirmed',

        value: 'iron'

      },

      {

        text: 'Created At',

        value: 'iron'

      },

      {},

      {},

    ]

    @user.State('user') user: any
    // @user.State('users') users: any
    @campaign.State('selectedCampaign') selectedCampaign: any

    @app.Mutation TOGGLE_SNACKBAR: any

    @user.Getter('userHasAdminRole') userHasAdminRole :any

    @campaign.Action('loadCampaignUsers') loadCampaignUsers: any
    @campaign.Action('verifyCampaignUser') verifyCampaignUser: any

    @user.Action('verifyUser') verifyUser: any
    // @user.Action('updateUser') updateUser: any

    @Watch('pagination', { deep: true })
    paginationHandler() {
      this.loading = true
      const {
        page,
        rowsPerPage,
        confirmed
      } = this.pagination

      this.filter = {
        limit: rowsPerPage,
        page,
        search: this.search || null,
        confirmed,
        campaignId: this.$route.params.id
      }

      this.loadCampaignUsers(this.filter)
        .then(() => {
          this.loading = false
        })
        .catch((err) => {
          this.loading = false
          if (err.response.status === 401) {
            this.TOGGLE_SNACKBAR({
              msg: `${err.response.data.message}`,
              color: 'error',
              position: 'top',
              multiLine: false
            })
          }
        })
    }

    get formattedUsers () {
      let length = this.selectedCampaign.users.data.length
      let pageSize = this.pagination.rowsPerPage || 0
      let emptyRowsLength = Math.abs(pageSize - length)
      return [
        ...this.selectedCampaign.users.data,
        ...Array(emptyRowsLength).fill({})
      ].slice(0, pageSize)
    }

    _UCFIRST () {
      return UCFIRST
    }

    editItem(item) {
      this.editedIndex = this.selectedCampaign.users.data.indexOf(item)
      // console.log(item);
      this.editedItem = Object.assign({}, item, item.userdetails, { verified: Boolean(item.verified) })
      this.dialog = true
    }

    updateSearchQuery (e) {
      _.debounce(() => {
        this.search = e.target.value
      }, 500)()
    }

    deleteItem(item) {
      const index = this.selectedCampaign.users.data.indexOf(item)
      confirm('Are you sure you want to delete this item?') && this.selectedCampaign.users.data.splice(index, 1)
    }

    close() {
      this.dialog = false
      setTimeout(() => {
        this.editedItem = {}
        this.editedIndex = -1
      }, 300)
    }

    save() {
      this.verifying = true
      // console.log(this.editedItem)
      let payload = {
        verified: this.editedItem.verified,
        userId: this.editedItem.user_id,
        campaignId: this.editedItem.campaign_id
      }
      this.verifyCampaignUser(payload)
      .then(() => {
        this.close()
        // this.snackbarText = "Succesfully updated user!"
        // this.snackbar = true
        this.verifying = false
        this.TOGGLE_SNACKBAR({
          msg: "Succesfully updated user!",
          color: 'success'
        })

      })
      .catch((err) => {
        this.TOGGLE_SNACKBAR({
          msg: `${err.response.data.message}`,
          color: "error"
        });
        this.verifying = false
      })
    }


    // mounted () {
    //   if (this.selectedCampaign.users.data.length) return
    //   this.loading = true
    //   this.loadCampaignUsers({ ...this.filter, campaignId: this.$route.params.id})
    //     .then(() => {
    //       this.loading = false
    //     })
    //     .catch(() => {
    //       this.loading = false
    //     })
    // }



  }
</script>

<style scoped>

</style>
