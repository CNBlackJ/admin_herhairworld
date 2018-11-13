<template>
  <div class="error-container">
    <img src="~/assets/404.gif">
  </div>
</template>

<script>
export default {
  props: ['error'],
  layout: 'blog' // 你可以为错误页面指定自定义的布局
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
</style>