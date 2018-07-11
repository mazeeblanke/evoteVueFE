<template>
    <div class="container__child signup__form">
    <form action="#">
      <div class="form-group">
        <label for="email">Email</label>
        <input class="form-control" type="text" name="email" id="email" placeholder="james.bond@spectre.com" required />
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input class="form-control" type="password" name="password" id="password" placeholder="********" required />
      </div>
      <div class="m-t-lg">
        <ul class="list-inline">
          <li>
            <input class="btn btn--form" type="submit" value="Login" />
          </li>
          <li>
            <router-link class="signup__link" to="/auth/register">Not Registered ?</router-link>
          </li>
        </ul>
      </div>
    </form>  
  </div>
</template>

<script>

  export default {
    name: 'signup',
    data() {
      return {}
    },
    methods: {
    
    }
  }
</script>