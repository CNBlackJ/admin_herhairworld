<template>
	<div class="products-container">
		<el-table
			v-loading="isLoading"
			element-loading-text="拼命加载中"
			element-loading-spinner="el-icon-loading"
			element-loading-background="hsla(0,0%,100%,.9)"
      :data="inquiryList"
			style="width: 100%">
			<el-table-column
				type="index"
				width="50">
			</el-table-column>
      <el-table-column
        prop="name"
				label="姓名">
      </el-table-column>
      <el-table-column
        prop="email"
        label="邮箱">
			</el-table-column>
      <el-table-column
        prop="country"
        label="国家">
			</el-table-column>
      <el-table-column
        prop="mobile"
        label="手机">
			</el-table-column>
			<el-table-column
				prop="businessType"
				label="业务类型">
			</el-table-column>
      <el-table-column
        prop="comment"
        label="留言内容">
			</el-table-column>
			<el-table-column
			  sortable
        :formatter="formatDate"
        label="时间">
			</el-table-column>
			<el-table-column
				fixed="right"
				label="操作"
				width="100">
				<template slot-scope="scope">
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
	import inquiry from '@/apis/inquiry'
	import moment from 'moment'

	export default {
		layout: 'admin',
		data () {
			return {
				isLoading: true,
				inquiryList: []
			}
		},
		created () {
			this.listInquiries()
		},
		methods: {
			async listInquiries () {
				const resp = await inquiry.list({})
				this.inquiryList = resp.data
				this.isLoading = false
			},
			deleteInquiryUser (inquiryInfo) {
				inquiry.delete({ id: inquiryInfo._id }).then(() => {
					this.listInquiries()
				}).catch(err => {
					console.log(`deleteInquiryUser: ${JSON.stringify(err)}`)
				})
			},
			formatDate (row, col) {
				return moment(row.createdAt).format('YYYY-MM-DD HH:mm')
			}
		}
	}
</script>

<style>
	.products-container {
		width: 100%;
	}
</style>