<template>
  <v-container grid-list-md class="analytics" :fluid="true" :fill-height="false">
    <v-layout align-center justify-center>
      <v-flex xs12>
        <v-card>
          <v-card-title>
            <h3 class="headline m-10">Analytics</h3>
          </v-card-title>
          <v-card-text>
            <v-layout row wrap md12 xs12 p20>
              <v-flex xs12 md3 p5>
                <v-card ripple raised class="card1"  height=200>
                  <v-layout d-flex row wrap fill-height class="m0">
                    <v-flex d-flex align-center justify-center xs12>
                      <div>
                        <h1 class="m0 text-center f120 fw900">4000</h1>
                        <h5 class="text-center is-white">Users</h5>
                      </div>
                    </v-flex>
                  </v-layout>
                </v-card>
              </v-flex>

              <v-flex xs12 md3 p5 >
                <v-card ripple raised class="card2" height=200>
                  <v-layout row wrap fill-height class="m0">
                    <v-flex d-flex align-center justify-center xs12>
                      <div>
                        <h1 class="m0 text-center f120 fw900">300</h1>
                        <h5 class="text-center is-white">Campaigns</h5>
                      </div>
                    </v-flex>
                  </v-layout>
                </v-card>
              </v-flex>

              <v-flex xs12 md3 p5>
                <v-card ripple raised class="card3" height=200>
                  <v-layout row wrap fill-height class="m0">
                    <v-flex d-flex align-center justify-center xs12>
                      <div>
                        <h1 class="m0 text-center f120 fw900">10</h1>
                        <h5 class="text-center is-white">Admins</h5>
                      </div>
                    </v-flex>
                  </v-layout>
                </v-card>
              </v-flex>

              <v-flex xs12 md3 p5>
                <v-card ripple raised class="card4" height=200>
                  <v-layout row wrap fill-height class="m0">
                    <v-flex d-flex align-center justify-center xs12>
                      <div>
                        <h1 class="m0 text-center f120 fw900">3</h1>
                        <h5 class="text-center is-white">Devs</h5>
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
          <v-card height=250>
          </v-card>
        </v-flex>
        <v-flex xs12 md12>
          <v-card height=250>
          </v-card>
        </v-flex>
      </v-flex>

      <v-flex xs12 md6>
        <v-card height=508>
          <v-card-title>
            <h3 class="headline m-10">Latest Users</h3>
          </v-card-title>
          <v-card-text>
            <v-data-table
              :headers="headers"
              :items="users.data.slice(0, 7)"
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
                  <td>{{ props.item.confirmed }}</td>
                  <td>{{ props.item.created_at }}</td>
                </tr>
              </template>
            </v-data-table>
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

export default {
  computed: {
    ...mapState('user', ['users']),
  },

  data() {
    return {
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
   box-shadow: 0px 2px 1px 0px #b9b9b9
 }

 .analytics .v-card-text {
   background-color: #f3f3f3
 }

 .analytics .card4 {
   background-color: #E91E63
 }

 .analytics .card3 {
   background-color: #03A9F4 !important
 }

 .analytics .card2 {
   background-color: #607D8B !important
 }

 .analytics .card1 {
   background-color: #9E9E9E !important
 }
</style>
