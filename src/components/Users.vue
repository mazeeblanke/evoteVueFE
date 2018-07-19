<template>
  <v-container :fluid="true" :fill-height="false">
    <v-layout align-center justify-center>
      <v-flex xs12>
        <v-card raised>
          <v-card-title>
            <h3 class="headline m-10">USERS</h3>
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
                ></v-select>
              </v-flex>
            </v-layout>
          </v-card-title>
          <v-data-table
            :headers="headers"
            :items="users.data"
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
                :active="props.selected"
                @click="props.selected = !props.selected"
              >
                <td>
                  <v-checkbox
                    :input-value="props.selected"
                    primary hide-details
                  ></v-checkbox>
                </td>
                <td>{{ props.item.id }}</td>
                <td>{{ props.item.username }}</td>
                <td>{{ props.item.email }}</td>
                <td>{{ props.item.phone }}</td>
                <td>{{ props.item.confirmed }}</td>
                <td>{{ props.item.created_at }}</td>
                <td class="justify-center layout px-0">
                  <v-icon small class="mr-2" @click="editItem(props.item)">
                    edit
                  </v-icon>
                  <!-- <v-icon small @click="deleteItem(props.item)">
                    delete
                  </v-icon> -->
                </td>
              </tr>
            </template>
            <v-alert slot="no-results" :value="true" color="error" icon="warning">
              Your search for "{{ search }}" found no results.
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
                          v-model="editedItem.confirmed"
                          item-text="text"
                          item-value="value"
                          label="Verification status"
                          box
                          clearable
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
          <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn flat>Cancel</v-btn>
              <v-btn flat>Submit</v-btn>
          </v-card-actions>
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

<script>
  import {
    mapState,
    mapActions
  } from 'vuex'

  import _ from 'lodash'

  export default {

    computed: {
      ...mapState('user', ['users']),
    },

    methods: {

      ...mapActions('user', ['loadUsers', 'verifyUser']),

      editItem(item) {
        this.editedIndex = this.users.data.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      updateSearchQuery (e) {
        _.debounce(() => {
          this.search = e.target.value
        }, 500)()
      },

      deleteItem(item) {
        const index = this.users.data.indexOf(item)
        confirm('Are you sure you want to delete this item?') && this.users.data.splice(index, 1)
      },

      close() {
        this.dialog = false
        setTimeout(() => {
          this.editedItem = {}
          this.editedIndex = -1
        }, 300)
      },

      save() {
        this.verifying = true
        this.verifyUser({
          confirmed: this.editedItem.confirmed,
          userId: this.editedItem.id
        })
        .then(() => {
          this.close()
          this.snackbarText = "Succesfully updated user!"
          this.snackbar = true
          this.verifying = false
        })
        .catch(() => {
          this.verifying = false
        })
      }

    },

    watch: {

      pagination: {
        handler() {
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
            .catch(() => {
              this.loading = false
            })
        },

        // deep: true
      }

    },

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
    },

    data () {
      return {
        loading: false,
        verifying: false,
        snackbar: false,
        snackbarText: null,
        editedIndex: null,
        editedItem: {},
        dialog: false,
        perPageValues: [10, 15, 20, {
          'text': '$vuetify.dataIterator.rowsPerPageAll',
          'value': -1
        }],
        search: null,
        confirmation_statuses: [
          {
            value: true,
            text: 'Verified'
          },
          {
            value: false,
            text: 'Unverified'
          },
        ],

        total: 0,

        pagination: {},

        filter: {

          limit: 10,

          page: 1

        },

        headers: [{

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

      }

    }

  }
</script>

<style scoped>

</style>
