<template>
  <div class="container__child signup__form">
    <form action="#">
      <div class="form-group">
        <label for="username">Username</label>
        <input
          v-model="signupForm.username"
          @input="$v.signupForm.username.$touch()"
          class="form-control"
          type="text"
          name="username"
          id="username"
          placeholder="james.bond"
          required />
        <div class="h20">
          <template v-if="$v.signupForm.username.$error">
            <small v-if="!$v.signupForm.username.required" class="text-danger">
              <strong>Username is required</strong>
            </small>
          </template>
          <template>
            <small v-if="error.username" class="text-danger">
              <strong>{{ error.username[0] }}</strong>
            </small>
          </template>
        </div>
      </div>
      <div class="form-group">
        <label for="email">Email</label>
        <input
          v-model="signupForm.email"
          @input="$v.signupForm.email.$touch()"
          class="form-control"
          type="text"
          name="email"
          id="email"
          placeholder="james.bond@spectre.com"
          required />
        <div class="h20">
          <template v-if="$v.signupForm.email.$error">
            <small v-if="!$v.signupForm.email.email" class="text-danger">
              <strong>You must enter an email!</strong>
            </small>
            <small v-if="!$v.signupForm.email.required" class="text-danger">
              <strong>Email is required</strong>
            </small>
          </template>
          <template>
            <small v-if="error.email" class="text-danger">
              <strong>{{ error.email[0] }}</strong>
            </small>
          </template>
        </div>
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input
          v-model="signupForm.password"
          @input="$v.signupForm.password.$touch()"
          class="form-control"
          type="password"
          name="password"
          id="password"
          placeholder="********"
          required />
          <div class="h20">
            <template v-if="$v.signupForm.password.$error">
              <small v-if="!$v.signupForm.password.required" class="text-danger">
                <strong> Password is required </strong>
              </small>
            </template>
          </div>
      </div>
      <div class="form-group">
        <label for="passwordRepeat">Repeat Password</label>
        <input
          v-model="signupForm.confirmPassword"
          @input="$v.signupForm.confirmPassword.$touch()"
          class="form-control"
          type="password"
          name="passwordRepeat"
          id="passwordRepeat"
          placeholder="********"
          required />
          <div class="h20">
            <template v-if="$v.signupForm.confirmPassword.$error">
              <small v-if="!$v.signupForm.confirmPassword.required" class="text-danger">
                <strong> Password confirmation is required</strong>
                <br>
              </small>
              <small v-if="!$v.signupForm.confirmPassword.sameAsPassword" class="text-danger">
                <strong> Passwords don't match</strong>
              </small>
            </template>
          </div>
      </div>
      <div class="m-t-lg">
        <ul class="list-inline">
          <li>
            <input
              :disabled="$v.signupForm.$invalid || registering"
              @click.prevent="submit"
              class="btn btn--form"
              type="submit"
              :value="registering !== true ? 'Register' : 'Registering....'"
              />
          </li>
          <li>
            <router-link
              class="signup__link"
              to="/auth/login"
              tag="a">
              I am already a member
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
import { required, email, sameAs } from 'vuelidate/lib/validators'

  export default {
    name: 'signup',
    mixins: [validationMixin],
    data() {
      return {
        error: {},
        registering: false,
        signupForm: {
          confirmPassword: null,
          username: null,
          email: null,
          password: null
        }
      }
    },
    validations: {
      signupForm: {
        email: { required, email },
        password: { required },
        confirmPassword: { required, sameAsPassword: sameAs('password') },
        username: { required }
      }
    },
    methods: {
      ...mapActions('auth', [
        'signup'
      ]),


      submit() {
        this.registering = true
        this.signup(this.signupForm).then(() => {
          this.$router.push({
            name: 'Profile'
          })
          this.registering = false
        })
        .catch((err) => {
          let error;
          if (err.message == 'Network Error') {
            error = err.message
          } else {
            error = err.response.data.message
          }
          this.error = error
          this.registering = false
        })
      }
    }
  }
</script>

<style scoped>
.m-t-lg, .m-y-lg {
  margin-top: 2rem !important
}
</style>

