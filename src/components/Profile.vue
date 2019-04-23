<template>
  <v-container :fluid="true" :fill-height="false">
    <v-layout align-center justify-center>

      <v-dialog v-model="dialog" persistent max-width="290">
        <v-card>
          <v-card-title class="headline">Update Profile ?</v-card-title>
          <v-card-text>After performing this action, you will be unable to update your profile.</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" flat @click="dialog = false">Disagree</v-btn>
            <v-btn color="green darken-1" flat @click="submit">Agree</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-flex xs10>
        <v-breadcrumbs divider="/">
          <v-breadcrumbs-item
            :to="{ name: _UCFIRST(route) }"
            active-class="is-white"
            ripple
            v-for="route in $route.path.split('/').filter(r => r)"
            :key="route"
            class="capitalize"
          >
            {{ route }}
          </v-breadcrumbs-item>
        </v-breadcrumbs>
        <v-card>
          <v-card-title class="card-gradient">
            <h3 class="headline m-10">PROFILE</h3>
          </v-card-title>
          <v-card-text>
            <v-layout row wrap md12 xs12>

              <v-flex xs12 md5 p20>
                <v-text-field
                  v-model="user.username"
                  :disabled="!!user.locked_profile"
                  label="Username"
                  :rules="[rules.required]"
                  regular
                  clearable
                  hint="e.g mazinoukah"
                ></v-text-field>
                <v-text-field
                  v-model="user.firstname"
                  :disabled="!!user.locked_profile"
                  label="First Name"
                  :rules="[rules.required]"
                  regular
                  clearable
                  hint="e.g mazino"
                ></v-text-field>
                <v-text-field
                  label="Phone"
                  :rules="[rules.required]"
                  :disabled="!!user.locked_profile"
                  v-model="user.phone"
                  return-masked-value
                  mask="(+###) ### ### ####"
                  regular
                  hint="e.g 234-233-454-45"
                  clearable
                ></v-text-field>
                <v-text-field
                  v-model="user.address"
                  :disabled="!!user.locked_profile"
                  :rules="[rules.required]"
                  label="Address"
                  regular
                  hint="e.g no 10, oyekan street, nitel estate, lagos"
                  clearable
                ></v-text-field>
                <v-text-field
                  :rules="[rules.required]"
                  :disabled="!!user.locked_profile"
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
                  :disabled="!!user.locked_profile"
                  v-model="user.email"
                  label="Email"
                  regular
                  hint="e.g ewomaukah@yahoo.com"
                  clearable
                ></v-text-field>
                <v-text-field
                  :rules="[rules.required]"
                  :disabled="!!user.locked_profile"
                  v-model="user.lastname"
                  label="Last Name"
                  regular
                  clearable
                  hint="e.g ukah"
                ></v-text-field>
                <v-text-field
                  :rules="[rules.required]"
                  :disabled="!!user.locked_profile"
                  v-model="user.city"
                  label="city"
                  regular
                  clearable
                  hint="e.g satellite"
                ></v-text-field>
                <v-text-field
                  v-model="user.state"
                  :disabled="!!user.locked_profile"
                  label="state"
                  regular
                  clearable
                  hint="e.g lagos"
                ></v-text-field>
                <v-text-field
                  v-model="user.date_of_birth"
                  :disabled="!!user.locked_profile"
                  label="Date Of Birth"
                  type="date"
                  regular
                  clearable
                  hint="e.g 02/34/1211"
                ></v-text-field>
              </v-flex>

              <v-flex xs12 md2 p20>
                <v-cloudinary-upload
                  @error="(e) => showError('Unable to upload image, please try another')"
                  v-model="image"
                  upload-preset="qddsi9lo"
                  cloud-name="dpisximfc"
                  ref="cloudinaryUpload"
                  class="cloudinaryUpload"
                />
              </v-flex>

            </v-layout>

          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <!-- <v-btn >Cancel</v-btn> -->
            <v-btn :disabled="!!user.locked_profile" :loading="saving" @click="dialog=true">Update Profile</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>

    </v-layout>
  </v-container>
</template>

<script lang="ts">
  import { Vue, Component, Watch } from 'vue-property-decorator'
  import { namespace } from 'vuex-class'
  import VCloudinaryUpload from 'vuetify-cloudinary-upload'
  import _ from 'lodash'
  import { UCFIRST } from '../utils/helpers'
  import { clBaseURL } from '../constants'

  const user = namespace('user')
  const app = namespace('app')

  @Component({
    components: {
      VCloudinaryUpload
    }
  })
  export default class Profile extends Vue {

    saving: boolean = false
    init: boolean = false
    dialog: boolean = false
    user: any = {}
    image: any = null
    rules: any = {
      required: value => !!value || 'Required.',
      min: v => v.length >= 8 || 'Min 8 characters',
    }

    @user.State('user') init_user: any
    @user.Action('updateUser') updateUser
    @app.Mutation('TOGGLE_SNACKBAR') TOGGLE_SNACKBAR

    @Watch ('init_user', { immediate: true })
    initUserHandler (newVal) {
      if (newVal && typeof newVal === 'object') {
        this.user = newVal
        this.image = newVal.avatar && newVal.avatar.split(clBaseURL)[1]
        this.init = true
      }
    }

    @Watch ('image')
    imageHandler (newVal) {
      if (this.init === true) {
        this.user.avatar = newVal ? `${clBaseURL}${newVal}` : '/'
        this.submit()
      }
    }

    _UCFIRST (word) {
      return UCFIRST(word)
    }

    showError (err) {
      // console.log(err);
      this.TOGGLE_SNACKBAR({
        msg: err,
        color: 'error',
        position: 'top',
        multiLine: false
      })
    }

    submit () {
      this.dialog = false;
      this.saving = true
      this.updateUser(
        _.pickBy({
          ...this.user,
          confirmed: null,
          roles: null
        }, (value) => value)
      )
      .then(() => {
        this.saving = false
        this.TOGGLE_SNACKBAR({
          msg: 'Successfully updated profile !',
          color: 'success'
        });
      })
      .catch((err) => {
        this.saving = false
        if (err.response.status === 401) {
          this.showError(`${err.response.data.message}`);
          // this.TOGGLE_SNACKBAR({
          //   msg: `${err.response.data.message}`,
          //   color: 'error',
          //   position: 'top',
          //   multiLine: false
          // })
        }
      })
    }

  }
</script>

<style scoped>
  .avatar {
    height: 150px;
    width: 150px;
  }
</style>

<style>
  .cloudinaryUpload {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .cloudinaryUpload img {
    border-radius: 100%;
    margin-bottom: 10px
  }

  .cloudinaryUpload {
    text-align: center;
  }
</style>

