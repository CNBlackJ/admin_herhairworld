<template>
	<div class="admin-order-con">
		<el-card shadow="hover">
			<div class="order-summary">
				<div class="os-item">
					<div>
						今日订单
					</div>
					<div>
						100
					</div>
				</div>
				<div class="os-item os-item-border">
					<div>
						已发货订单
					</div>
					<div>
						100
					</div>
				</div>
				<div class="os-item">
					<div>
						待处理订单
					</div>
					<div>
						100
					</div>
				</div>
			</div>
		</el-card>

		<el-table
			v-loading="isLoading"
			element-loading-text="拼命加载中"
			element-loading-spinner="el-icon-loading"
			element-loading-background="hsla(0,0%,100%,.9)"
			class="order-table"
			v-on:cell-click="showOrderDetail"
      :data="orderDetails"
			style="width: 100%">
			<el-table-column
				type="index"
				width="50">
			</el-table-column>
      <el-table-column
        prop="email"
        label="邮箱">
			</el-table-column>
      <el-table-column
        prop="mobile"
        label="联系电话">
			</el-table-column>
      <el-table-column
				:formatter="formatProduct"
				show-overflow-tooltip
        label="产品">
			</el-table-column>
			<el-table-column
        :formatter="formatDate"
        label="时间">
			</el-table-column>
		</el-table>
		
		<div class="orders-pagination">
			<el-pagination
				background
				layout="prev, pager, next"
				:total="count"
				@current-change="currentChange">
			</el-pagination>
		</div>
	</div>
</template>

<script>
	import { mapState, mapGetters } from 'vuex'

	import moment from 'moment'

	export default {
		layout: 'admin',
		computed: {
			...mapState({
				orders: state => state.order.orders,
				count: state => state.order.count
			}),
			...mapGetters({
				orderDetails: 'order/orderDetails'
			})
		},
		data () {
			return {
				isLoading: false
			}
		},
		async created () {
			this.isLoading = true
			await this.$store.dispatch('order/setOrders', {})
			this.isLoading = false
		},
		methods: {
			formatDate (row) {
				return moment(row.createdAt).format('YYYY-MM-DD HH:mm')
			},
			formatProduct (row) {
				const names = row.products.map((ele, index) => {
					return (index ? '、' : '') + ele.productId.name
				})
				return names
			},
			async currentChange (currentPage) {
				this.isLoading = true
				const pageSize = 10
				await this.$store.dispatch('order/setOrders', { skip: (currentPage-1) * pageSize, limit: pageSize })
				this.isLoading = false
			},
			showOrderDetail (row) {
				console.log(row)
			}
		}
	}
</script>

<style>
	.order-summary {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-around;
	}

	.order-table {
		padding-top: 20px
	}

	.os-item {
		width: 100%;
		padding: 20px;
		text-align: center;
	}

	.os-item-border {
		border-right: 1px solid #efefef;
		border-left: 1px solid #efefef;
	}

	.orders-pagination {
		padding: 10px;
		text-align: center;
	}
</style>