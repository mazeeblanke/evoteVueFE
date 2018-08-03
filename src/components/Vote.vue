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
        <v-card raised>
          <v-card-title class="card-gradient">
            <div class="is-flex">
              <v-icon @click="$router.back()">arrow_left</v-icon>
              <h3 v-if='hasVoted && !loading' class="headline">My {{ liveCampaign.name }} Campaign Votes</h3>
              <div v-if='!hasVoted && !loading'>
                <h3 class="headline">{{ liveCampaign.name }} Campaign</h3>
                <!-- <p>{{ liveCampaign.description }}</p> -->
              </div>
            </div>
          </v-card-title>
          <div :style="{ height: '500px'}" v-if='results && !loading'>
            <v-data-table
              :headers="headers"
              :items="results"
              hide-actions
              class="elevation-1"
            >
              <template slot="items" slot-scope="props">
                <td class="capitalize">{{ props.item.id && props.index + 1 }}</td>
                <td class="capitalize">{{ props.item.id && props.item.normination.campaign_position.name }}</td>
                <td>
                  <v-avatar
                      v-if="props.item.id"
                      :size=30
                      color="grey lighten-4"
                    >
                      <img
                        class="is-rounded-circle"
                        :src="props.item.normination.votee.avatar">
                    </v-avatar>
                </td>
                <td class="capitalize">
                  {{ props.item.id && props.item.normination.votee.username }}
                </td>
              </template>
            </v-data-table>
          </div>
          <v-stepper v-model="e6" vertical v-if="liveCampaign.id && !results && !loading">
            <div v-for="(position, i) in liveCampaign.campaign_positions" :key="i">
              <v-stepper-step @click.native="e6 = i + 1" :complete="e6 > (i + 1)" :step="i + 1">
                {{ position.name }}
                <small>{{ position.description }}</small>
              </v-stepper-step>
              <v-stepper-content :step="i + 1" >
                  <el-carousel class="p10" :interval="4000" type="card" height="220px">
                    <el-carousel-item
                      v-for="normination in position.norminations"
                      :key="normination.id">
                      <div class="is-v-centered p10">
                        <el-radio v-model="votes[i].normination_id" :label="normination.id">
                          {{ normination.votee.username }}
                        </el-radio>
                        <v-avatar
                          :size=150
                          color="grey lighten-4"
                        >
                          <img
                            class="is-rounded-circle"
                            :src="normination.votee.avatar">
                        </v-avatar>
                      </div>
                    </el-carousel-item>
                  </el-carousel>
                <v-btn v-if="i !== liveCampaign.campaign_positions.length - 1" color="primary" @click="e6 = i + 2">Continue</v-btn>
                <v-btn v-else :loading="voting" @click="submit" color="primary">Submit Vote</v-btn>
                <v-btn @click="e6 = e6 - 1" flat>Back</v-btn>
              </v-stepper-content>
            </div>
          </v-stepper>
          <div>
            <div :style="{ height: '600px'}" class="is-h-centered" v-if="!results && !liveCampaign.id && !loading">
              <h6>No Active campaign</h6>
            </div>
            <div :style="{ height: '600px'}" class="is-v-centered" v-if="loading">
              <v-progress-circular
                :size="70"
                :width="1"
                color="white"
                indeterminate
              ></v-progress-circular>
              <p class="mt-20 is-h-centered" :style="{ color: 'white' }">Loading....</p>
            </div>
          </div>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { UCFIRST } from "@/utils/helpers"
import { mapActions, mapState, mapMutations } from 'vuex'

  export default {
    methods: {

      ...{
        UCFIRST
      },

      ...mapActions('campaign', [
        'loadCampaign'
      ]),

      ...mapActions('vote', [
        'setVotes',
        'liveVote'
      ]),

      ...mapMutations('app', [
        'TOGGLE_SNACKBAR'
      ]),

      submit () {
        this.voting = true
        this.setVotes({
          campaign_id: this.liveCampaign.id,
          votes: this.votes
        })
        .then((res) => {
          this.voting = false
          this.results = res.data.votes
          this.hasVoted = true
          if (this.results.length < 10) {
            this.results = [
              ...this.results,
              ...Array(10 - this.results.length).fill({})
            ]
          }

          this.TOGGLE_SNACKBAR({
            msg: 'Successfully voted !!',
            color: 'success'
          })

        })
        .catch((err) => {
          console.log(err)
          this.voting = false
          this.TOGGLE_SNACKBAR({
            msg: 'An error occured!',
            color: 'error'
          })
        })
      },
      vote (normination_id, index) {
        this.$set(
          this.votes,
          index,
          {
            ...this.votes[index],
            normination_id
          }
        )
      }
    },
    data () {
      return {
        liveCampaign: {},
        e6: 0,
        loading: false,
        voting: false,
        votes:[],
        results: null,
        hasVoted: false,
        headers: [
          {
            text: 'ID'
          },
          {
            text: 'Campaign Position'
          },
          {
            text: 'Avatar'
          },
          {
            text: 'Your Vote'
          }
        ]
      }
    },

    computed: {
      ...mapState('user', ['user']),
    },

    mounted () {
      this.loading = true
      this.liveVote()
      .then(res => {
        console.log(res)
        if (res.campaign) {
          // this.votes = []
          this.liveCampaign = res.campaign
          if (this.liveCampaign.campaign_positions.length) {
            this.liveCampaign.campaign_positions.forEach((p, i) => {
              this.$set(this.votes, i, {
                // voter_id: null,
                normination_id: null
              })
            })
          }
        }

        if (res.votes)
        {
          this.results = res.votes
          this.hasVoted = true
          if (this.results.length < 10) {
            this.results = [
              ...this.results,
              ...Array(10 - this.results.length).fill({})
            ]
            console.log(this.results)
          }
        }
        this.loading = false
      })
      .catch((err) => {
        this.loading = false
      })
    }
  }
</script>

<style scoped>

</style>
