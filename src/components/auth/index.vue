<template>
  <div class="cont is-full-height">
    <div class="overlay is-full-height"></div>
      <div class="signup__container">
        <div class="container__child signup__thumbnail">
          <div class="thumbnail__logo">
            <h1 class="logo__text">Evote</h1>
          </div>
          <div class="thumbnail__content text-center">
            <img
                height="150"
                width="150"
                src="../../../public/img/logo.png"
              >
            <h5 class="is-h-centered mt-20">E-Voting System</h5>
          </div>
          <div class="thumbnail__links">
            <ul class="list-inline m-b-0 text-center">
              <li><a href="http://alexdevero.com/" target="_blank"><i class="fa fa-globe"></i></a></li>
              <li><a href="https://www.behance.net/alexdevero" target="_blank"><i class="fa fa-behance"></i></a></li>
              <li><a href="https://github.com/alexdevero" target="_blank"><i class="fa fa-github"></i></a></li>
              <li><a href="https://twitter.com/alexdevero" target="_blank"><i class="fa fa-twitter"></i></a></li>
            </ul>
          </div>
          <div class="signup__overlay"></div>
        </div>
        <router-view></router-view>
      </div>
  </div>
</template>

<script>

export default {
  components: {},
  name: 'Index'
}
</script>

<style rel="stylesheet/scss" lang="scss">
$bg:#2d3a4b;
$light_gray:#eee;

.cont {
  background-image: url('../../../public/img/bg1.jpg');
  background-size: cover;
  color: white;
}

// .signup-form {
//   background: white;
//   color: black !important;
//   border-radius: 2px;
//   padding: 20px
// }

.overlay {
  background-color: #000000e6
}

/* reset element-ui css */
.signup-container {
  // background-image: url('../../../static/img/bg.jpg');
  background: black;
  background-size: cover;
  background-repeat: no-repeat;
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      &:-webkit-autofill {
        -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: #fff !important;
      }
    }
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.signup__container {
  height: 34rem;
}

.signup-container {
  // position: fixed;
  // height: 100%;
  // width: 100%;
  background-color: $bg;
  .signup-form {
    position: absolute;
    left: 0;
    right: 0;
    width: 520px;
    padding: 35px 35px 15px 35px;
    margin: 120px auto;
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
    &_signup {
      font-size: 20px;
    }
  }
  .title-container {
    position: relative;
    .title {
      font-size: 26px;
      font-weight: 400;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
    .set-language {
      color: #fff;
      position: absolute;
      top: 5px;
      right: 0px;
    }
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
  .thirdparty-button {
    position: absolute;
    right: 35px;
    bottom: 28px;
  }
}
</style>

<style>
  .el-row {
    margin-right: 0px !important;
    margin-left: 0px !important;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
</style>
