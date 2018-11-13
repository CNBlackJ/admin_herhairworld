<template>
  <div
    class="error-container">
    <img src="https://herhairword-1255936829.cos.ap-guangzhou.myqcloud.com/404-snow.gif">
    <div class="error-tips">
      You're lost in deep space. <a @click="goHome">Click to go back.</a>
    </div>
  </div>
</template>

<script>
export default {
  props: ['error'],
  methods: {
    goHome () {
      console.log('aa')
      this.$router.push({ path: '/' })
    }
  }
}
</script>

<style>
  .error-container {
    text-align: center;
		position: absolute;
		width: 100%;
		top: 50%;
		left: 50%;
		-webkit-transform: translate(-50%, -50%);
		-moz-transform: translate(-50%, -50%);
		-ms-transform: translate(-50%, -50%);
		-o-transform: translate(-50%, -50%);
		transform: translate(-50%, -50%);
  }

  .error-tips {
    color: #E6A23C;
    font-size: 18px;
  }

  .error-tips a {
    border-bottom: 1px solid #E6A23C;
  }
</style>