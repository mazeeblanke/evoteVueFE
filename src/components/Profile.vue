<template>
  <v-container :fluid="true" :fill-height="false">
    <v-layout align-center justify-center>

      <v-flex xs10>
        <v-card>
          <h3 class="headline m-10">PROFILE</h3>
          <v-card-title>
            <v-layout row wrap md12 xs12>

              <v-flex xs12 md5 p20>
                <v-text-field
                  v-model="user.username"
                  label="Username"
                  :rules="[rules.required]"
                  regular
                  clearable
                  hint="e.g mazinoukah"
                ></v-text-field>
                <v-text-field
                  v-model="user.firstname"
                  label="First Name"
                  :rules="[rules.required]"
                  regular
                  clearable
                  hint="e.g mazino"
                ></v-text-field>
                <v-text-field
                  label="Phone"
                  :rules="[rules.required]"
                  v-model="user.phone"
                  return-masked-value
                  mask="phone"
                  regular
                  hint="e.g 234-233-454-45"
                  clearable
                ></v-text-field>
                <v-text-field
                  v-model="user.address"
                  :rules="[rules.required]"
                  label="Address"
                  regular
                  hint="e.g no 10, oyekan street, nitel estate, lagos"
                  clearable
                ></v-text-field>
                <v-text-field
                  :rules="[rules.required]"
                  v-model="user.country"
                  label="Country"
                  regular
                  hint="e.g nigeria"
                  clearable
                ></v-text-field>
              </v-flex>

              <v-flex xs12 md5 p20>
                <v-text-field
                  :rules="[rules.required]"
                  v-model="user.email"
                  label="Email"
                  regular
                  hint="e.g ewomaukah@yahoo.com"
                  clearable
                ></v-text-field>
                <v-text-field
                  :rules="[rules.required]"
                  v-model="user.lastname"
                  label="Last Name"
                  regular
                  clearable
                  hint="e.g ukah"
                ></v-text-field>
                <v-text-field
                  :rules="[rules.required]"
                  v-model="user.city"
                  label="city"
                  regular
                  clearable
                  hint="e.g satellite"
                ></v-text-field>
                <v-text-field
                  v-model="user.state"
                  label="state"
                  regular
                  clearable
                  hint="e.g lagos"
                ></v-text-field>
                <v-text-field
                  v-model="user.date_of_birth"
                  label="Date Of Birth"
                  type="date"
                  regular
                  clearable
                  hint="e.g 02/34/1211"
                ></v-text-field>
              </v-flex>

              <v-flex xs12 md2 p20>
                <!-- <v-avatar :tile="false" :size=150 color="grey lighten-4">
                  <img class="is-rounded-circle avatar" src="http://via.placeholder.com/50x50" alt="avatar">
                </v-avatar> -->
                <v-cloudinary-upload
                  v-model="image"
                  upload-preset="qddsi9lo"
                  cloud-name="dpisximfc"
                  ref="cloudinaryUpload"
                />
                <!-- <vue-core-image-upload
                  crop-ratio="1:1"
                  class="btn btn-primary"
                  resize="local"
                  url="http://101.198.151.190/api/upload.php"
                  extensions="png,jpeg,jpg"
                  text="Resize Image"
                  compress="20"
                  @imageuploaded="resizeLocalImageUploaded">
                </vue-core-image-upload> -->
              </v-flex>

            </v-layout>

          </v-card-title>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn >Cancel</v-btn>
            <v-btn :loading="saving" @click="submit">Update Profile</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>

    </v-layout>
  </v-container>
</template>

<script>
  import { mapState, mapActions, mapMutations } from 'vuex'
  import VCloudinaryUpload from 'vuetify-cloudinary-upload'
  import _ from 'lodash'

  export default {
    data () {
      return {
        saving: false,
        init: false,
        user: {},
        image: null,
        rules: {
          required: value => !!value || 'Required.',
          min: v => v.length >= 8 || 'Min 8 characters',
        }
      }
    },

    components: {
      // VueCoreImageUpload,
      VCloudinaryUpload
    },

    computed: {
      ...mapState('user', {'init_user': 'user'}),
    },

    methods: {
      ...mapActions('user', ['updateUser']),

      ...mapMutations('app', ['TOGGLE_SNACKBAR']),

      submit () {
        this.saving = true
        this.updateUser(_.pickBy(this.user, (u) => u))
        // this.updateUser(this.user)
        .then(() => {
          this.saving = false
          this.TOGGLE_SNACKBAR({
            msg: 'Successfully updated profile !',
            color: 'success'
          });
        })
        .catch(() => {
          this.saving = false
        })
      }
    },

    watch: {
      init_user: {
        immediate: true,
        handler(newVal) {
          if (newVal && typeof newVal === 'object') {
            this.user = newVal
            this.image = newVal.avatar && newVal.avatar.split(clBaseURL)[1]
            this.init = true
          }
        }
      },

      image (newVal) {
        if (this.init === true) {
          // this.user = {
          //   ...this.user,
          //   avatar: newVal ? `${clBaseURL}${newVal}` : ''
          // }
          this.user.avatar = newVal ? `${clBaseURL}${newVal}` : '/'
          console.log(this.user)
          this.submit()
        }
      }
    }
  }
</script>

<style scoped>
  .avatar {

    height: 150px;

    width: 150px;

  }
</style>
