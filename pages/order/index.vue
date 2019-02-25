<template>
	<div class="admin-order-con">
		<el-card shadow="hover">
			<div class="order-summary">
				<div class="os-item">
					<div>
						今日订单
					</div>
					<div>
						{{orderSummary.todayOrders}}
					</div>
				</div>
				<div class="os-item os-item-border">
					<div>
						已发货订单
					</div>
					<div>
						{{orderSummary.dispatchedOrders}}
					</div>
				</div>
				<div class="os-item">
					<div>
						待处理订单
					</div>
					<div>
						{{orderSummary.dispatchingOrders}}
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
			v-on:row-click="showOrderDetail"
      :data="orderDetails"
			style="width: 100%">
			<el-table-column
				type="index"
				width="50">
			</el-table-column>
      <el-table-column
        prop="_id"
        label="订单号">
			</el-table-column>
      <el-table-column
        prop="userId"
        label="用户">
			</el-table-column>
      <el-table-column
        prop="price"
        label="订单总金额">
			</el-table-column>
      <el-table-column
        prop="status"
        label="订单状态">
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

		<el-dialog
			title="订单详情"
			:visible.sync="dialogVisible"
			width="80%">
			<detail :order="selectedOrder"/>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="dialogVisible = false">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
	import { mapState, mapGetters } from 'vuex'
	import moment from 'moment'

	import detail from './detail'

	export default {
		layout: 'admin',
		components: {
			detail
		},
		computed: {
			...mapState({
				orders: state => state.order.orders,
				count: state => state.order.count,
				orderSummary: state => state.order.orderSummary
			}),
			...mapGetters({
				orderDetails: 'order/orderDetails'
			})
		},
		data () {
			return {
				isLoading: false,
				dialogVisible: false,
				selectedOrder: {}
			}
		},
		async created () {
			this.isLoading = true
			await this.$store.dispatch('order/setOrders', {})
			await this.$store.dispatch('order/getOrderSummary')
			this.isLoading = false
		},
		methods: {
			formatDate (row) {
				return moment(row.createdAt).format('YYYY-MM-DD HH:mm')
			},
			async currentChange (currentPage) {
				this.isLoading = true
				const pageSize = 10
				await this.$store.dispatch('order/setOrders', { skip: (currentPage-1) * pageSize, limit: pageSize })
				this.isLoading = false
			},
			showOrderDetail (row) {
				this.selectedOrder = row
				this.dialogVisible = true
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