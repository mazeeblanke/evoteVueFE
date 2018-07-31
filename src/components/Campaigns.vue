<template>
  <v-container :fluid="true" :fill-height="false">
    <v-layout align-center justify-center>
      <v-flex xs12>
        <v-breadcrumbs divider="/">
          <v-breadcrumbs-item
            :to="{ name: UCFIRST(route) }"
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
              <h3 class="headline">CAMPAIGNS</h3>
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
              <v-flex d-flex justify-end align-end md2>
                <v-btn slot="activator" @click="showCampaignForm" dark>New Campaign</v-btn>
              </v-flex>
            </v-layout>
          </v-card-title>
          <v-data-table
            :headers="headers"
            :items="formattedCampaigns"
            :search="search"
            :rows-per-page-items="perPageValues"
            :pagination.sync="pagination"
            :total-items="campaigns.total"
            :loading="loading"
            :headers-length=8
          >
            <template slot="headers" slot-scope="props">
              <tr>
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
                @click.stop.prevent="showCampaign(props.item.id)"
              >
                <td>{{ props.item.id }}</td>
                <td>{{ props.item.name }}</td>
                <td>{{ props.item.description }}</td>
                <td>{{ props.item.active }}</td>
                <td>{{ props.item.start_date }}</td>
                <td>{{ props.item.end_date }}</td>
                <td>{{ props.item.created_at }}</td>
                <td>
                  <template v-if="props.item.id">
                    <v-icon small class="mr-2" @click.stop.prevent="editItem(props.item)">
                      edit
                    </v-icon>
                    <v-icon small @click="deleteItem(props.item)">
                      delete
                    </v-icon>
                  </template>
                </td>
              </tr>
            </template>
            <v-alert class="h480" slot="no-results" :value="true" color="error" icon="warning">
              <div class="h480">
                Your search for "{{ search }}" found no results.
              </div>
            </v-alert>
          </v-data-table>
          <CampaignForm
            :errors="errors"
            :edited-item="editedItem"
            @change="(newValue) => this.editedItem = editedItem"
            :save="save"
            :close="close"
            :dialog.sync="dialog"
            :saving="saving"
            v-if="dialog"
          ></CampaignForm>
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
  import CampaignForm from '@/components/campaigns/CampaignForm'
  import { UCFIRST } from '@/utils/helpers'

  export default {

    computed: {
      ...mapState ('campaign', ['campaigns']),

      formattedCampaigns () {
        let length = this.campaigns.data.length
        let pageSize = this.pagination.rowsPerPage
        let emptyRowsLength = Math.abs(pageSize - length)
        if (emptyRowsLength > 0) {
          return [
            ...this.campaigns.data,
            ...Array(emptyRowsLength).fill({})
          ].slice(0, pageSize)
        }
        return this.campaigns.data
      }

    },

    components: {
      CampaignForm
    },

    methods: {
      ...mapActions ('campaign', [
        'loadCampaigns',
        'updateCampaign',
        'createCampaign'
      ]),

      ...{
        UCFIRST
      },

      showCampaign (id) {
        this.$router.push(`/dashboard/campaigns/${parseInt(id, 10)}`)
        // this.$router.push('dashboard/campaigns')
        // this.$router.push({
        //   params: { id: parseInt(id, 10) },
        //   path: `dashboard/campaigns/${parseInt(id, 10)}`
        // })
      },

      editItem (item) {
        this.editedIndex = this.campaigns.data.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      showCampaignForm () {
        this.editedItem = {
          active: 0
        }
        this.dialog = true
      },

      updateSearchQuery (e) {
        _.debounce(() => {
          this.search = e.target.value
        }, 500)()
      },

      deleteItem (item) {
        // const index = this.campaigns.data.indexOf(item)
        // confirm('Are you sure you want to delete this item?') && this.campaigns.data.splice(index, 1)
      },

      close () {
        this.dialog = false
        setTimeout(() => {
          this.editedItem = {}
          this.editedIndex = -1
        }, 300)
      },

      save () {
        this.saving = true
        const doAction = this.editedItem.created_at
          ? this.updateCampaign
          : this.createCampaign
        doAction(this.editedItem)
        .then(() => {
          this.close()
          this.snackbarText = this.editedItem.created_at
            ? "Succesfully updated campaign!"
            : "Succesfully created campaign!"
          this.snackbar = true
          this.saving = false
          this.errors = []
          this.campaigns.total += 1
        })
        .catch((err) => {
          this.saving = false
          console.log(err.response.data)
          this.errors = err.response.data.message
        })
      }

    },

    watch: {
      pagination: {
        handler () {
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

          this.loadCampaigns (this.filter)
            .then(() => {
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        },
        deep: true
      }
    },

    mounted () {
      if (this.campaigns.data.length) return
      this.loading = true
      this.loadCampaigns(this.filter)
        .then(() => {
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },

    data () {
      return {
        errors: [],
        loading: false,
        saving: false,
        snackbar: false,
        snackbarText: null,
        editedIndex: null,
        editedItem: {},
        dialog: false,
        perPageValues: [10],
        search: null,
        total: 0,
        pagination: {},
        filter: {
          limit: 10,
          page: 1
        },

        headers: [
          {
            text: 'ID'
          },
          {
            text: 'Name'
          },
          {
            text: 'Description'
          },
          {
            text: 'Status'
          },
          {
            text: 'Start Date'
          },
          {
            text: 'End Date'
          },
          {
            text: 'Created At',
          }
        ]
      }
    }
  }
</script>

<style scoped>

</style>
