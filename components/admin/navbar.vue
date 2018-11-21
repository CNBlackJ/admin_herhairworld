<template>
	<div class="admin-nav-con">
		<div class="ad-nav-left">
				<!-- @click="goLogin" -->
		</div>
		<div class="ad-nav-right">
			<el-dropdown>
				<el-button style="padding: 0;" type="primary" size="small">
					<img
						class="navbar-icon icon-user"
						src="https://herhairword-1255936829.cos.ap-guangzhou.myqcloud.com/user.png">
				</el-button>
				<el-dropdown-menu slot="dropdown">
					<el-dropdown-item>修改密码</el-dropdown-item>
					<el-dropdown-item>退出登陆</el-dropdown-item>
				</el-dropdown-menu>
			</el-dropdown>
		</div>
	</div>
</template>

<script>
	export default {
		methods: {
			goLogin () {
				if (this.$store.getters['admin/isAuthenticated']) return
				this.$router.push({ path: '/login' })
			}
		}
	}
</script>

<style>
	.ad-nav-right {
		margin-right: 20px;
	}

	.admin-nav-con {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		background-color: #409eff;
	}

	.navbar-icon {
		width: 24px;
		height: 24px;;
		-webkit-filter: invert(1);
		filter: invert(1);
		padding: 10px;
	}
</style>