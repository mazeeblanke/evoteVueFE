<template>
  <div class="campaign-view">
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
              <h3 class="headline">CAMPAIGN POSITIONS</h3>
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
                <v-btn slot="activator" @click="showCampaignFormPosition" dark>New Position</v-btn>
              </v-flex>
            </v-layout>
          </v-card-title>
          <v-container fill-height class="campaign-position-table">
          <v-layout d-flex row wrap>
          <v-flex xs9 sm9 md9>
            <v-data-table
              :headers="headers"
              :items="campaignPositions"
              :search="search"
              :rows-per-page-items="perPageValues"
              :pagination.sync="pagination"
              :total-items="selectedCampaign.campaign_positions.length"
              :loading="loading"
              :headers-length=8
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
                <tr class="capitalize" @click="campaignPositionUnderReview = props.item">
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
                    <div class="has-truncated-text" :style="{ 'width': '230px !important' }">
                      {{ props.item.description }}
                    </div>
                  </td>
                  <td>{{ props.item.created_at }}</td>
                  <td>
                    <template v-if="props.item.id && !props.item.deleting">
                      <v-menu transition="slide-x-transition" offset-y offset-x>
                        <v-icon slot="activator">more_horiz</v-icon>
                        <v-list>
                          <v-list-tile @click.stop.prevent="editItem(props.item)">
                            <v-list-tile-title>Edit</v-list-tile-title>
                          </v-list-tile>
                          <v-list-tile @click.stop.prevent="_deleteCampaign(props.item)">
                            <v-list-tile-title>Delete</v-list-tile-title>
                          </v-list-tile>
                        </v-list>
                      </v-menu>
                    </template>
                    <v-progress-linear
                      v-if="props.item.deleting"
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
          </v-flex>
          <v-flex xs3 sm3 md3 class="detail">
            <template v-if="campaignPositionUnderReview">
              <div>
                <h6 class="headline has-text-centered mt-20">Norminees for {{ campaignPositionUnderReview.name }}</h6>
                <v-icon :style="{'margin-left': '15px'}" @click="normineeDialog = true " color="grey darken-1">
                  add_circle_outline
                </v-icon>
              </div>
              <VuePerfectScrollbar
                v-if="campaignPositionUnderReview.norminations.length"
                class="scroll-area"
                :settings="settings"
              >
                <v-list>
                  <template v-for="(item) in campaignPositionUnderReview.norminations">
                    <v-list-tile
                      :key="item.id"
                      avatar
                      ripple
                    >
                      <v-list-tile-avatar>
                        <img :src="item.votee.avatar">
                      </v-list-tile-avatar>
                      <v-list-tile-content>
                        <v-list-tile-title>{{ item.votee.username }}</v-list-tile-title>
                        <v-list-tile-sub-title
                          v-if="item.votee.firstname && item.votee.lastname"
                          class="text--primary">
                            {{ item.votee.firstname + ' ' + item.votee.lastname }}
                        </v-list-tile-sub-title>
                        <!-- <v-list-tile-sub-title>{{ item.subtitle }}</v-list-tile-sub-title> -->
                      </v-list-tile-content>
                      <v-list-tile-action>
                        <v-icon
                          v-if="!item.deleting"
                          @click="_deleteNorminee(item)"
                          :style="{ cursor: 'pointer' }"
                        >delete</v-icon>
                        <v-progress-linear v-else :indeterminate="true"></v-progress-linear>
                      </v-list-tile-action>
                    </v-list-tile>
                  </template>
                </v-list>
              </VuePerfectScrollbar>
              <EmptyState v-else :style="{ height: '100%'}" empty-text="No norminees yet!"></EmptyState>
            </template>
            <EmptyState v-else :style="{ height: '100%'}" empty-text="No norminees yet!"></EmptyState>
          </v-flex>
          </v-layout>
          </v-container>
          <CampaignFormPosition
            :errors="errors"
            :edited-item="editedItem"
            @change="(newValue) => this.editedItem = editedItem"
            :save="save"
            :close="close"
            :dialog.sync="dialog"
            :saving="saving"
            v-if="dialog"
          ></CampaignFormPosition>
          <CampaignPositionNorminationForm
            :errors="errors"
            :norminees="norminees"
            :campaign-id="campaignPositionUnderReview.campaign_id"
            :save="saveNorminees"
            @change="(newValue) => this.norminees = newValue"
            :close="close"
            :dialog.sync="normineeDialog"
            :saving="saving"
            v-if="normineeDialog"
          ></CampaignPositionNorminationForm>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
  </div>
</template>


<script>
import CampaignFormPosition from '@/components/campaigns/CampaignPositionForm'
import VuePerfectScrollbar from 'vue-perfect-scrollbar'
import CampaignPositionNorminationForm from '@/components/campaigns/CampaignPositionNorminationForm'
import EmptyState from '@/components/shared/EmptyState'
import _ from 'lodash'
import { UCFIRST } from '@/utils/helpers'

import {
    mapState,
    mapActions,
    mapMutations
  } from 'vuex'

export default {

  computed: {
    ...mapState ('campaign', ['selectedCampaign']),

    campaignPositions () {
      let length = this.selectedCampaign.campaign_positions.length
      let pageSize = this.pagination.rowsPerPage || 0
      let page = this.pagination.page
      let emptyRowsLength = Math.abs(pageSize - length)

      return [
        ...this.selectedCampaign.campaign_positions,
        ...Array(emptyRowsLength).fill({})
      ].slice(((pageSize * page) - pageSize) , pageSize * page)
    }
  },

  components: {
    CampaignPositionNorminationForm,
    CampaignFormPosition,
    VuePerfectScrollbar,
    EmptyState
  },

  methods: {
    ...mapActions ('campaign', [
      'loadCampaign',
      'updateCampaignPosition',
      'createCampaignPosition',
      'addCampaignPositionNorminees',
      'deleteNorminee',
      'deleteCampaignPosition'
    ]),

    ...mapMutations ('campaign', [
      'CLEAR_SELECTED_CAMPAIGN'
    ]),

    ...mapMutations('app', [
      'TOGGLE_SNACKBAR'
    ]),

    ...{
      UCFIRST
    },

    _deleteNorminee (norminationItem) {
      this.$swal({
        title: 'Are you sure?',
        text: "You want to delete this norminee (s)!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes'
      }).then((result) => {
        if (result.value) {
          this.$set(
            norminationItem,
            'deleting',
            true
          )
          let campaign_id = this.campaignPositionUnderReview.campaign_id
          this.deleteNorminee({
            'campaign_position_id': norminationItem.campaign_position_id,
            'votee_id' : norminationItem.votee_id,
            'campaign_id' : this.campaignPositionUnderReview.campaign_id
          })
          .then((res) => {
            let norminations = this.campaignPositionUnderReview.norminations;
            let index = norminations.findIndex(n => n.votee_id === norminationItem.votee_id);

            if (index) {
              this.campaignPositionUnderReview.norminations.splice(
                index,
                1
              )
            }
          })
          .catch(() => {

          })
        }
      })
    },

    editItem (item) {
      this.editedIndex = this.selectedCampaign.campaign_positions.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    showCampaignFormPosition () {
      this.editedItem = {}
      this.dialog = true
    },

    updateSearchQuery (e) {
      _.debounce(() => {
        this.search = e.target.value
      }, 500)()
    },

    _deleteCampaignPosition (campaignPosition) {
      this.$swal({
        title: 'Are you sure?',
        text: "You want to delete this campaign position (s)!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes'
      }).then((result) => {
        if (result.value) {
          this.$set(campaignPosition, 'deleting', true)
          this.deleteCampaignPosition({ id: campaignPosition.id })
          .then((res) => {
            let campaignPositions = this.campaignPositions;
            let index = campaignPositions.findIndex(c => c.id === campaignPosition.id);

            if (index) {
              this.campaignPositions.splice(index, 1)
            }

            this.TOGGLE_SNACKBAR({
              msg: res.message,
              color: 'success'
            })
          })
          .catch(() => {
           this.TOGGLE_SNACKBAR({
              msg: 'An error occured !',
              color: 'error'
            })
          })
        }
})
    },

    close () {
      this.dialog = false
      this.normineeDialog = false
      setTimeout(() => {
        this.editedItem = {}
        this.editedIndex = -1
      }, 300)
    },

    save () {
      this.saving = true
      let payload = this.editedItem

      if (!this.editedItem.created_at) {
        payload = {
          campaign_id: this.selectedCampaign.id,
          positions: [this.editedItem]
        }
      }

      const doAction = this.editedItem.created_at
        ? this.updateCampaignPosition
        : this.createCampaignPosition

      doAction(payload)
      .then(() => {
        this.close()
        this.snackbarText = this.editedItem.created_at
          ? "Succesfully updated campaign position!"
          : "Succesfully created campaign position!"
        // this.snackbar = true
        this.TOGGLE_SNACKBAR({
          msg: this.snackbarText,
          color: 'success'
        })
        this.saving = false
        this.errors = []
      })
      .catch((err) => {
        console.log(err)
        this.saving = false
        console.log(err.response.data)
        this.errors = err.response.data.message
        this.TOGGLE_SNACKBAR({
          msg: this.errors[0],
          color: 'error'
        })
      })
    },

    saveNorminees () {
      this.saving = true
      let payload = {
        campaign_position_id: this.campaignPositionUnderReview.id,
        norminations: this.norminees.map(norminee_id => ({
          votee_id: norminee_id,
          campaign_id: this.campaignPositionUnderReview.campaign_id
        }))
      }

      this.addCampaignPositionNorminees(payload)
      .then((res) => {
        this.close()
        // this.snackbar = true
        this.saving = false
        this.errors = []
        this.norminees = []
        console.log(res)
        this.campaignPositionUnderReview.norminations = [
          ...this.campaignPositionUnderReview.norminations,
          ...res
        ]

        this.TOGGLE_SNACKBAR({
          msg: "Succesfully added norminees!",
          color: 'success'
        })

      })
      .catch((err) => {
        console.log(err)
        this.saving = false
        console.log(err.response.data)
        this.errors = err.response.data.message
        this.TOGGLE_SNACKBAR({
          msg: "An error occured!",
          color: 'error'
        })
      })
    }
  },

  watch: {
    pagination: {
      handler () {
        this.loading = true
        if (this.selectedCampaign.id !== parseInt(this.$route.params.id, 10)) {
          this.CLEAR_SELECTED_CAMPAIGN()
        }
        const {
          page,
          rowsPerPage,
          confirmed
        } = this.pagination

        console.log(this.$route.params)
        this.filter = {
          limit: rowsPerPage,
          page,
          search: this.search || null,
          confirmed,
          id: this.$route.params.id
        }

        this.loadCampaign (this.filter)
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

  data () {
    return {
      errors: [],
      norminees: [],
      loading: false,
      saving: false,
      snackbar: false,
      snackbarText: null,
      editedIndex: null,
      editedItem: {},
      dialog: false,
      normineeDialog: false,
      campaignPositionUnderReview: null,
      perPageValues: [10],
      search: null,
      total: 0,
      pagination: {},
      filter: {
        limit: 10,
        page: 1
      },
      settings: {
        maxScrollbarLength: 60
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
          text: 'Created At',
        }
      ]
    }
  }

}
</script>

<style lang="sass">
.campaign-view
  .detail
    .v-list
      // height: 480px
      // overflow-y: scroll
  // .v-breadcrumbs__item
  //   color: white !important
</style>



<style scoped>
.campaign-position-table {
  border-top: 1px solid #6d6d6d !important;
  padding-top: 0px !important;
  padding-left: 15px;
  padding-right: 15px;
  height: 90%;
}

.scroll-area {
  position: relative;
  margin: auto;
  height: 480px;
}

.detail {
  /* background: #4a4a4ac4; */
  border-left: 1px solid #6d6d6d
}


/* .fill-height {
  height: 80% !important
} */
</style>
