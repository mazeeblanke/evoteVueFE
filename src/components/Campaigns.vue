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
            :headers-length=9
          >
            <template slot="headers" slot-scope="props">
              <tr>
                <th>
                  <v-checkbox
                    :input-value="props.all"
                    :indeterminate="props.indeterminate"
                    primary
                    hide-details
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
                class="capitalize is-clickable"
                @click.stop="showCampaign(props.item, $event)"
              >
                <td>
                  <v-checkbox
                    v-if="props.item.id"
                    :input-value="props.selected"
                    primary hide-details
                  ></v-checkbox>
                </td>
                <td>{{ props.item.id }}</td>
                <td>{{ props.item.name }}</td>
                <td>
                  <div
                    @click="showCampaign(props.item, $event)"
                    class="has-truncated-text"
                    :style="{ 'width': '230px !important' }"
                  >
                    {{ props.item.description }}
                  </div>
                </td>
                <td>{{ props.item.active }}</td>
                <td>{{ props.item.start_date }}</td>
                <td>{{ props.item.end_date }}</td>
                <td>{{ props.item.created_at }}</td>
                <td>
                  <template v-if="props.item.id && (!props.item.deleting && !props.item.activating)">
                    <v-menu transition="slide-y-transition" offset-y offset-x>
                      <v-icon slot="activator">more_horiz</v-icon>
                      <v-list>
                        <v-list-tile @click="editItem(props.item)">
                          <v-list-tile-title>Edit</v-list-tile-title>
                        </v-list-tile>
                        <v-list-tile @click="activateCampaign(props.item)">
                          <v-list-tile-title>Set As Active Campaign</v-list-tile-title>
                        </v-list-tile>
                        <v-list-tile @click="_deleteCampaign(props.item)">
                          <v-list-tile-title>Delete</v-list-tile-title>
                        </v-list-tile>
                      </v-list>
                    </v-menu>
                  </template>
                  <v-progress-linear
                    v-else-if="props.item.id && (props.item.deleting || props.item.activating)"
                    :indeterminate="true"
                  ></v-progress-linear>
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
  </v-container>
</template>

<script>
  import {
    mapState,
    mapMutations,
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
        let pageSize = this.pagination.rowsPerPage || 0
        let emptyRowsLength = Math.abs(pageSize - length)
        return [
          ...this.campaigns.data,
          ...Array(emptyRowsLength).fill({})
        ].slice(0, pageSize)
      }
    },

    components: {
      CampaignForm
    },

    methods: {
      ...mapActions ('campaign', [
        'loadCampaigns',
        'updateCampaign',
        'createCampaign',
        'deleteCampaign',
        'setActiveCampaign'
      ]),

      ...mapMutations('app', [
        'TOGGLE_SNACKBAR'
      ]),

      ...{
        UCFIRST
      },

      showCampaign (campaign, event) {
        if (campaign.deleting || event.target.localName !== 'td') return
        this.$router.push(`/dashboard/campaigns/${parseInt(campaign.id, 10)}`)
      },

      editItem (campaign) {
        this.editedIndex = this.campaigns.data.indexOf(campaign)
        this.editedItem = Object.assign({}, campaign)
        this.dialog = true
      },

      activateCampaign (campaign) {
        this.$swal({
          // title: 'Are you sure you want to Activate this campaign?',
          title: 'Are you sure ?',
          text: "This would disable any other activate campaign!",
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes'
        }).then((result) => {
          if (result.value) {
            this.$set(campaign, 'activating', true)
            console.log(campaign)
            this.setActiveCampaign({ campaignId: campaign.id})
            .then((res) => {
              this.TOGGLE_SNACKBAR({
                msg: res.message,
                color: 'success'
              })
            })
            .catch((err) => {
              this.$set(campaign, 'activating', false)
              this.TOGGLE_SNACKBAR({
                msg: err.response.data.message,
                color: 'error'
              })
            })
          }
        })
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

      _deleteCampaign (campaign) {
        this.$swal({
          title: 'Are you sure?',
          text: "You want to delete this campaign (s)!",
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes'
        }).then((result) => {
          if (result.value) {
            this.$set(campaign, 'deleting', true)
            this.deleteCampaign({ id: campaign.id})
            .then((res) => {
              this.TOGGLE_SNACKBAR({
                msg: res.message,
                color: 'success'
              })
            })
            .catch(() => {
              this.TOGGLE_SNACKBAR({
                msg: 'An error occured!',
                color: 'error'
              })
            })
          }
        })
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
          this.TOGGLE_SNACKBAR({
            msg: this.snackbarText,
            color: 'success'
          })
          // this.snackbar = true
          this.saving = false
          this.errors = []
          this.campaigns.total += 1
        })
        .catch((err) => {
          this.saving = false
          console.log(err.response.data)
          this.errors = err.response.data.message
          this.TOGGLE_SNACKBAR({
            msg: this.errors[0],
            color: 'success'
          })
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
        deep: true,
        immediate: true
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
