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
          <v-data-table
            v-if='results'
            :headers="headers"
            :items="results"
            hide-actions
            class="elevation-1"
          >
            <template slot="items" slot-scope="props">
              <td>{{ props.item.normination.campaign_position.name }}</td>
              <td>
                <div>
                  <v-avatar
                    :size=30
                    color="grey lighten-4"
                  >
                    <img
                      class="is-rounded-circle"
                      :src="props.item.normination.votee.avatar">
                  </v-avatar>
                </div>
                {{ props.item.normination.votee.username }}
              </td>
            </template>
          </v-data-table>
          <v-stepper v-model="e6" vertical v-if="liveCampaign.id && !results">
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
                        <!-- <h3>{{ normination.votee.username }}</h3> -->
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
                <v-btn v-else @click="submit" color="primary">Submit Vote</v-btn>
                <v-btn @click="e6 = e6 - 1" flat>Back</v-btn>
              </v-stepper-content>
            </div>
          </v-stepper>
          <div v-if="!results && !liveCampaign.id" :style="{ height: '800px'}" class="is-h-centered">
            <div>
              <!-- <v-icon large>not_interested</v-icon> -->
              <h6>No Active campaign</h6>
            </div>
          </div>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { UCFIRST } from "@/utils/helpers"
import { mapActions, mapState } from 'vuex'

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
      submit () {
        this.setVotes({
          // voter_id: this.user.id,
          campaign_id: this.liveCampaign.id,
          votes: this.votes
        })
        .then((res) => {
          console.log(res);
          this.results = res.votes
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
        votes:[],
        results: null,
         headers: [
          {
            text: 'Campaign Position'
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
      this.liveVote()
      .then(res => {
        console.log(res)
        if (res.campaign && !res.votes) {
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
        }
      })
    }
  }
</script>

<style scoped>

</style>
