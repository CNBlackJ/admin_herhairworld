<template>
	<div class="sidebar-container">
		<div class="admin-logo">
			<img class="admin-logo-img" src="https://herhairword-1255936829.cos.ap-guangzhou.myqcloud.com/logo.png">
		</div>
		<div class="btn-group">
			<div
				v-for="sidebar in adminSidebars"
				:key="sidebar.index"
				class="sidebar-btn"
				@click="sidebarClick(sidebar)"
				:class="{'sidebar-selected': sidebar.index === selectedSidebar}"
			>
				<i class="sidebar-icon" :class="sidebar.icon"></i>
				<span>
					{{ sidebar.text }}
				</span>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		data () {
			return {
				adminSidebars: [
					{ index: 0, text: '控制面板', url: '/', icon: 'el-icon-setting' },
					{ index: 1, text: '页面编辑', url: '/page', icon: 'el-icon-edit' },
					{ index: 3, text: '产品列表', url: '/product', icon: 'el-icon-goods' },
					{ index: 4, text: '询盘用户', url: '/inquiry', icon: 'el-icon-service' },
					{ index: 8, text: '分类管理', url: '/category', icon: 'el-icon-document' },
					{ index: 9, text: '优惠券管理', url: '/coupon', icon: 'el-icon-news' },
					{ index: 2, text: '订单管理', url: '/order', icon: 'el-icon-tickets' },
					{ index: 5, text: '用户信息', url: '/user', icon: 'el-icon-circle-plus-outline' },
					{ index: 6, text: '支付信息', url: '/payment', icon: 'el-icon-success' },
					{ index: 7, text: '数据导入', url: '/data', icon: 'el-icon-refresh' },
					{ index: 10, text: '定价管理', url: '/price', icon: 'el-icon-goods' }
				],
				selectedSidebar: 0
			}
		},
		created(){
			const currentSidebar = this.adminSidebars.find(ele => ele.url === this.$route.path)
			this.sidebarClick(currentSidebar)
		},
		methods: {
			sidebarClick (sidebar) {
				this.selectedSidebar = sidebar.index
				this.$router.push({ path: sidebar.url })
			}
		}
	}
</script>

<style>
	.sidebar-container {
		border-right: 1px solid #efefef;
		background-color: #001529;
		color: white;
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 10px 0;
	}

	.admi-logo {
		background-color: #1890ff;
	}

	.admin-logo-img {
		width: 100%;
	}

	.sidebar-btn {
		padding: 10px;
		width: 100%;
	}

	.sidebar-btn:hover {
		background-color: white;
		color: black;
		width: 90%;
	}

	.sidebar-selected {
		background-color: white;
		color: black;
		width: 90%;
	}

	.sidebar-icon {
		padding: 0 20px;
	}

	.btn-group {
		font-size: 14px;
		width: 100%;
	}
</style>