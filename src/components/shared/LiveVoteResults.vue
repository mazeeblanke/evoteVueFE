<template>
<v-container :fluid="true" :fill-height="false">
    <v-layout align-center justify-center>
      <v-flex xs12>
        <v-breadcrumbs divider="/">
          <v-breadcrumbs-item
            :to="route === 'dashboard' ? { name: UCFIRST(route) } : ''"
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
              <h6 class="headline">Vote Results</h6>
            </div>
            <v-spacer></v-spacer>
            <v-select
              :items="availablePositions"
              v-model="selectedPosition"
              item-text="text"
              item-value="value"
              label="Campaign Position"
              box
              clearable
            ></v-select>
          </v-card-title>
          <v-card-text>
            <vue-highcharts :style="{ height: '600px'}" v-show="!loading" v-if="results && selectedPosition" :options="options" ref="lineCharts"></vue-highcharts>
            <div :style="{ height: '600px'}" class="is-v-centered" v-if="loading && !selectedPosition">
              <v-progress-circular
                :size="70"
                :width="1"
                color="white"
                indeterminate
              ></v-progress-circular>
              <p class="mt-20 is-h-centered" :style="{ color: 'white' }">Loading....</p>
            </div>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
</v-container>
</template>


<script>
import { UCFIRST } from '@/utils/helpers'
import VueHighcharts from 'vue2-highcharts'

import {
  mapActions,
  mapGetters,
  mapState,
  mapMutations
} from 'vuex'

export default {
  data() {
    return {
      results: null,
      selectedPosition: null,
      loading: false
    };
  },

  components: {
    VueHighcharts
  },

  computed: {

    ...mapState('app', ['darkMode']),

    availablePositions () {
      if (this.results) {
        return Object.keys(this.results)
        .map((item, key) => ({
          text: item,
          value: item
        }))
        .filter((position, key) => position.text !== 'campaignName');
      }
      return []
    },
    options() {
      return {
        chart: {
          type: 'bar',
          backgroundColor: this.darkMode ? 'rgba(25, 25, 25, 0.58)' : '#ffffff' ,
        },
        title: {
          text: `${this.results.campaignName} Results`,
          style: {
            color: this.darkMode ? '#f0f8ff5c' : '#383838',
          }
        },
        subtitle: {
          text: 'Source: Database',
          style: {
            color: this.darkMode ? '#f0f8ff5c' : '#383838'
          }
        },
        xAxis: {
          gridLineWidth: 0,
          categories: this.results[this.selectedPosition].contestants
        },
        series: [
          {
            name: 'Vote Counts',
            marker: {
              symbol: 'circle'
            },
            data: this.results[this.selectedPosition].votes_count
         }
        ],
        yAxis: {
          gridLineWidth: 0,
          tickInterval: 5,
          title: {
            text: 'Contestants',
            style: {
              color: this.darkMode ? '#f0f8ff5c' : '#424242'
            }
          },
          labels: {
            formatter: function () {
              return this.value + '°';
            },
            style: {
              color: this.darkMode ? '#f0f8ff5c' : '#424242'
            }
          }
        },
        tooltip: {
          crosshairs: true,
          shared: true
        }
      }
    }
  },

  mounted() {
    this.loading = true
    this.liveVoteResults({ id: this.$route.params.id })
    .then((res) => {
      this.results = res.data
      this.selectedPosition = this.availablePositions[0].value
      this.loading = false
    })
    .catch((err) => {
      this.loading = false
      this.TOGGLE_SNACKBAR({
        msg: 'An error occured!',
        color: 'error'
      })
    })
  },
  methods: {
    ...mapActions('vote', [
      'liveVoteResults'
    ]),

    ...mapMutations('app', [
      'TOGGLE_SNACKBAR'
    ]),

    ...{
      UCFIRST
    }
  }

}
</script>


<style>

</style>
