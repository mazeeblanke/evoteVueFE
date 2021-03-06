<template>
  <v-container v-if="userHasAdminRole" :fluid="true" :fill-height="false">
    <v-layout align-center justify-center>
      <v-flex xs12>
        <v-breadcrumbs divider="/">
          <v-breadcrumbs-item
            :to="{ name: _UCFIRST(route) }"
            active-class="is-white"
            ripple
            v-for="route in $route.path.split('/').filter(r => r)"
            :key="route"
            class="capitalize"
          >
            {{ route }}
          </v-breadcrumbs-item>
        </v-breadcrumbs>
        <v-card raised :height=800>
          <v-card-title class="card-gradient">
            <div class="is-flex">
              <v-icon @click="$router.back()">arrow_left</v-icon>
              <h3 class="headline">USERS</h3>
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
            :total-items="users.total"
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
                <td class="has-truncated-text">{{ props.item.id }}</td>
                <td class="has-truncated-text">{{ props.item.username }}</td>
                <td class="has-truncated-text">{{ props.item.email }}</td>
                <td class="has-truncated-text">{{ props.item.phone }}</td>
                <td class="has-truncated-text" ><span v-if="props.item.id">{{ props.item.confirmed ? true : false }}</span></td>
                <td class="has-truncated-text">{{ props.item.created_at }}</td>
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
                        <v-select
                          :items="[{ text: 'Locked', name: 1 }, { text: 'Unlocked', name: 0 }]"
                          v-model="editedItem.locked_profile"
                          item-text="text"
                          item-value="name"
                          label="Lock Status"
                          box
                        ></v-select>
                      </v-flex>
                      <v-flex xs12 sm6 md4>
                        <v-select
                          :items="confirmation_statuses"
                          v-model="editedItem.confirmed"
                          item-text="text"
                          item-value="value"
                          label="Verification status"
                          box
                          clearable
                        ></v-select>
                      </v-flex>
                      <v-flex xs12 sm6 md4>
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
                      </v-flex>
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
      </v-flex>
    </v-layout>
    <v-snackbar
      v-model="snackbar"
      :timeout="4000"
      right
    >
      {{ snackbarText }}
      <v-btn
        dark
        flat
        @click="snackbar = false"
      >
        Close
      </v-btn>
    </v-snackbar>
  </v-container>
</template>

<script lang="ts">

  import _ from 'lodash'
  import { UCFIRST } from '../utils/helpers'
  import { namespace } from 'vuex-class'
  import { Vue, Component, Watch } from 'vue-property-decorator'

  const user = namespace('user')
  const app = namespace('app')

  @Component
  export default class Users extends Vue {

    loading: boolean = false
    verifying: boolean = false
    snackbar: boolean = false
    dialog: boolean = false
    total: number = 0
    snackbarText: any = null
    editedIndex: any = null
    editedItem: any = {}
    perPageValues: any = [10]
    search:any = null
    confirmation_statuses: Array<{ value: number, text: string }> = [
      {
        value: 1,
        text: 'Verified'
      },
      {
        value: 0,
        text: 'Unverified'
      },
    ]
    pagination: any = {}

    filter: any = {

      limit: 10,

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
    @user.State('users') users: any

    @user.Mutation('app') TOGGLE_SNACKBAR: any

    @user.Getter('userHasAdminRole') userHasAdminRole

    @user.Action('loadUsers') loadUsers: any
    @user.Action('verifyUser') verifyUser: any
    @user.Action('updateUser') updateUser: any
    @user.Action('me') me: any

    @Watch('$route', { deep: true })
    handler() {
      this.me();
    }

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
      }

      this.loadUsers(this.filter)
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
      let length = this.users.data.length
      let pageSize = this.pagination.rowsPerPage || 0
      let emptyRowsLength = Math.abs(pageSize - length)
      return [
        ...this.users.data,
        ...Array(emptyRowsLength).fill({})
      ].slice(0, pageSize)
    }

    _UCFIRST (word) {
      return UCFIRST(word)
    }

    editItem(item) {
      this.editedIndex = this.users.data.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    }

    updateSearchQuery (e) {
      _.debounce(() => {
        this.search = e.target.value
      }, 500)()
    }

    deleteItem(item) {
      const index = this.users.data.indexOf(item)
      confirm('Are you sure you want to delete this item?') && this.users.data.splice(index, 1)
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
      let payload = {
        isAdminAction: true,
        ..._.pickBy(this.editedItem, i => i !== null),
        roles: this.editedItem.roles.map((r) => {
          if (typeof r === 'object') {
            return r.name;
          }
          return r;
        })
      }
      this.updateUser(payload)
      .then(() => {
        this.close()
        this.snackbarText = "Succesfully updated user!"
        this.snackbar = true
        this.verifying = false
      })
      .catch((err) => {
        this.verifying = false
      })
    }


    mounted () {
      if (this.users.data.length) return
      this.loading = true
      this.loadUsers(this.filter)
        .then(() => {
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    }



  }
</script>

<style scoped>

</style>
