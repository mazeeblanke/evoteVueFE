<template>
    <div class="container__child signup__form">
    <!-- <div class="h20">
      <template v-if="error">
          <strong class="text-danger">{{ error }}</strong>
      </template>
    </div> -->
    <form action="#">
      <div class="form-group">
        <label for="email">Email</label>
        <input
          class="form-control"
          v-model="loginform.email"
          type="text"
          name="email"
          id="email"
          @input="$v.loginform.email.$touch()"
          placeholder="james.bond@spectre.com"
          required />
        <div class="h20">
          <template v-if="$v.loginform.email.$error">
            <small v-if="!$v.loginform.email.email" class="text-danger">
              <strong>You must enter an email!</strong>
            </small>
            <small v-if="!$v.loginform.email.required" class="text-danger">
              <strong>Email is required</strong>
            </small>
          </template>
          <template v-if="error">
            <strong class="text-danger">{{ error }}</strong>
          </template>
        </div>
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input
          class="form-control"
          v-model="loginform.password"
          type="password"
          name="password"
          id="password"
          @input="$v.loginform.password.$touch()"
          placeholder="********"
          required />
        <div class="h20">
          <template v-if="$v.loginform.password.$error">
            <small v-if="!$v.loginform.password.required" class="text-danger">
              <strong> Password is required </strong>
            </small>
          </template>
        </div>
      </div>
      <div class="m-t-lg">
        <ul class="list-inline">
          <li>
            <input
              :disabled="$v.loginform.$invalid || loggingIn"
              @click.prevent="submit"
              class="btn btn--form"
              type="submit"
              :value="loggingIn !== true ? 'Login' : 'logging in....'" />
          </li>
          <li>
            <router-link
              class="signup__link"
              to="/auth/register">
              Not Registered ?
            </router-link>
          </li>
        </ul>
      </div>
    </form>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { validationMixin } from 'vuelidate'
import { required, email } from 'vuelidate/lib/validators'

  export default {
    name: 'login',
    mixins: [validationMixin],
    validations: {
      loginform: {
        email: { required, email },
        password: { required }
      }
    },
    data() {
      return {
        loggingIn: false,
        error: null,
        loginform: {
          email: null,
          password: null
        }
      }
    },
    methods: {
      ...mapActions('auth', [
        'login'
      ]),

      submit() {
        this.loggingIn = true
        this.login(this.loginform).then(() => {
          this.$router.push({
            name: 'Profile'
          })
          this.loggingIn = false
        })
        .catch((err) => {
          let error;
          if (err.message == 'Network Error') {
            error = err.message
          } else {
            error = err.response.data.message
          }
          this.error = error
          this.loggingIn = false
        })
      }
    }
  }
</script>

<style scoped>
 .text-danger {
    font-weight: 100 !important;
    font-size: 11px !important;
 }
</style>
