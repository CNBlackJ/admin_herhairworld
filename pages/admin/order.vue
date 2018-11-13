<template>
	<div class="admin-order-con">
		<el-table
      :data="orders"
			style="width: 100%">
			<el-table-column
				type="index"
				width="50">
			</el-table-column>
			<el-table-column
				prop="userId"
				label="用户Id">
			</el-table-column>
      <el-table-column
        prop="name"
				label="用户名">
      </el-table-column>
      <el-table-column
        prop="email"
        label="邮箱">
			</el-table-column>
      <el-table-column
        prop="mobile"
        label="手机">
			</el-table-column>
      <el-table-column
        prop="products"
        label="产品">
			</el-table-column>
			<el-table-column
			  sortable
        prop="createdAt"
        label="时间">
			</el-table-column>
			<el-table-column
				fixed="right"
				label="操作"
				width="100">
				<template slot-scope="scope">
					<el-button
						@click="tagInquiryUser(scope.row)"
						type="text"
						size="small">标记</el-button>
					<el-button
						@click="deleteInquiryUser(scope.row)"
						type="text"
						size="small">
						删除
					</el-button>
				</template>
			</el-table-column>
    </el-table>
	</div>
</template>

<script>
	import { mapState } from 'vuex'

	export default {
		layout: 'admin',
		computed: {
			...mapState({
				orders: state => state.order.orders
			})
		},
		created () {
			// this.$store.dispatch('order/setOrders')
		}
	}
</script>