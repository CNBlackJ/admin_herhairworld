<template>
	<div class="inquiry-container">
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
		
		<div class="inquiry-pagination">
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
	import inquiry from '@/apis/inquiry'
	import moment from 'moment'

	export default {
		layout: 'admin',
		data () {
			return {
				isLoading: true,
				inquiryList: [],
				count: 0
			}
		},
		async created () {
			await this.listInquiries({})
		},
		methods: {
			async listInquiries ({ limit = 10, skip = 0 }) {
				const resp = await inquiry.list({ limit, skip })
				const { count, rows } = resp
				this.inquiryList = rows
				this.count = count
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
			},
			async currentChange (currentPage) {
				const pageSize = 10
				await this.listInquiries({ skip: (currentPage-1) * pageSize, limit: pageSize })
			}
		}
	}
</script>

<style>
	.inquiry-container {
		width: 100%;
	}

	.inquiry-pagination {
		padding: 10px;
		text-align: center;
	}
</style>