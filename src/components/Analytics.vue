<template>
  <v-container grid-list-md class="analytics" :class="{'dark': this.darkMode}" :fluid="true" :fill-height="false">
    <v-layout align-center justify-center>
      <v-flex xs12>
        <v-card>
          <v-card-title>
            <h3 class="headline m-10">Analytics</h3>
          </v-card-title>
          <v-card-text>
            <v-layout row wrap md12 xs12 p20>
              <v-flex xs12 md3 p5>
                <v-card ripple class="card1"  height=200>
                  <v-layout d-flex row wrap fill-height class="m0">
                    <v-flex d-flex align-center justify-center xs12>
                      <div>
                        <h1 class="m0 text-center f120 fw900">{{ dashboard.users_count || 0}}</h1>
                        <h5 class="text-center is-white">Users</h5>
                      </div>
                    </v-flex>
                  </v-layout>
                </v-card>
              </v-flex>

              <v-flex xs12 md3 p5 >
                <v-card ripple class="card2" height=200>
                  <v-layout row wrap fill-height class="m0">
                    <v-flex d-flex align-center justify-center xs12>
                      <div>
                        <h1 class="m0 text-center f120 fw900">{{ dashboard.campaigns_count || 0 }}</h1>
                        <h5 class="text-center is-white">Campaigns</h5>
                      </div>
                    </v-flex>
                  </v-layout>
                </v-card>
              </v-flex>

              <v-flex xs12 md3 p5>
                <v-card ripple class="card3" height=200>
                  <v-layout row wrap fill-height class="m0">
                    <v-flex d-flex align-center justify-center xs12>
                      <div>
                        <h1 class="m0 text-center f120 fw900">{{ dashboard.admins_count || 0 }}</h1>
                        <h5 class="text-center is-white">Admins</h5>
                      </div>
                    </v-flex>
                  </v-layout>
                </v-card>
              </v-flex>

              <v-flex xs12 md3 p5>
                <v-card ripple class="card4" height=200>
                  <v-layout row wrap fill-height class="m0">
                    <v-flex d-flex align-center justify-center xs12>
                      <div>
                        <h1 class="m0 text-center f120 fw900">{{ dashboard.votes_count || 0 }}</h1>
                        <h5 class="text-center is-white">Votes</h5>
                      </div>
                    </v-flex>
                  </v-layout>
                </v-card>
              </v-flex>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex xs12 md6 p0>
        <v-flex xs12 md12>
          <v-card height=400, width="100%">
            <vue-highcharts :options="options" ref="lineCharts"></vue-highcharts>
          </v-card>
        </v-flex>
        <v-flex xs12 md12>
          <v-card height=100>
          </v-card>
        </v-flex>
      </v-flex>

      <v-flex xs12 md6 class="latestUsers">
        <v-card height=508>
          <v-card-title>
            <h3 class="headline m-10">Latest Users</h3>
          </v-card-title>
          <v-card-text>
            <VuePerfectScrollbar class="wrapper">
              <v-data-table
                :headers="headers"
                :items="dashboard.users"
                hide-actions
              >
                <template slot="items" slot-scope="props">
                  <tr>
                    <td>
                      <v-avatar
                        :tile="false"
                        :size=35
                        color="grey lighten-4"
                      >
                        <img
                          class="is-rounded-circle"
                          :style="{ 'text-indent' : props.item.avatar === '/' ? '-9999px' : '0px' }"
                          :src="props.item.avatar">
                      </v-avatar>
                    </td>
                    <td>{{ props.item.username }}</td>
                    <td>{{ props.item.confirmed ? true : false }}</td>
                    <td>{{ props.item.created_at }}</td>
                  </tr>
                </template>
              </v-data-table>
            </VuePerfectScrollbar>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import {
  mapState,
  mapActions
} from 'vuex'
import VueHighcharts from 'vue2-highcharts'
import VuePerfectScrollbar from 'vue-perfect-scrollbar'

const asyncData = {
  name: 'Months',
  marker: {
    symbol: 'circle'
  },
  data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
}

export default {
  computed: {
    ...mapState('user', ['users']),

    ...mapState('app', ['darkMode']),

    ...mapState('dashboard', ['dashboard']),

    options() {
      return {
        chart: {
          type: 'spline',
          // backgroundColor: this.darkMode ? '#383838' : '#ffffff' ,
          // backgroundColor: this.darkMode ? 'rgba(56, 56, 56, 0.25098)' : '#ffffff' ,
          backgroundColor: this.darkMode ? 'rgba(25, 25, 25, 0.58)' : '#ffffff' ,
        },
        title: {
          text: 'User registration metrics',
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
          categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },
        yAxis: {
          gridLineWidth: 0,
          title: {
            text: 'Number of users',
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

  components: {
    VueHighcharts,
    VuePerfectScrollbar
  },

  mounted () {
    this.loading = true;
    this.load()
    this.loadDashboard().then(() => {
      this.loading = false
    })
  },

  methods: {
    ...mapActions('dashboard', {
      loadDashboard: 'loadDashboard'
    }),
    load(){
      let lineCharts = this.$refs.lineCharts;
      // lineCharts.delegateMethod('showLoading', 'Loading...');
      setTimeout(() => {
          lineCharts.addSeries(asyncData);
          lineCharts.hideLoading();
      }, 2000)
    }
  },

  data() {
    return {
      loading: false,
      headers: [
        {
          text: 'Avatar'
        },
        {
          text: 'Username',
        },
        {
          text: 'Confirmed',
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
 .headline{
   padding: 0px !important
 }
</style>

<style>
 .analytics .v-card__title {
   border-bottom: 1px solid #cacaca;
   /* box-shadow: 0px 2px 1px 0px #b9b9b9 */
 }

 .dark.analytics .v-card__title {
   border-bottom: 1px solid #313131 !important;
 }

 .analytics .v-card-text {
   background-color: #f3f3f3
 }

 .analytics .latestUsers .wrapper {
    /* overflow-y: scroll !important; */
    height: 415px !important
  }

 .analytics .card4 {
   /* background-color: #E91E63  !important */
   background: radial-gradient(#b7004c, #E91E63) !important
 }

 .analytics .card3 {
   /* background-color: #03A9F4 !important */
   background: radial-gradient(#0080bd, #3F51B5) !important
 }

 .analytics .card2 {
   /* background-color: #607D8B !important */
   background: radial-gradient(#607D8B, #4a4a4a) !important
 }

 .analytics .card1 {
   /* background-color: #9E9E9E !important */
   background: radial-gradient(#006596, #673AB7) !important
 }
</style>
