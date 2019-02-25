<template>
	<div
		class="inquiry-container"
		v-loading="isExportDataLoading"
		element-loading-text="拼命加载中"
		element-loading-spinner="el-icon-loading"
		element-loading-background="hsla(0,0%,100%,.9)">

		<div class="inquiry-sub-menu">
			<el-row style="margin-bottom: 10px;">
				<el-col :xl="2" :lg="3">
					<el-button
						type="success"
						@click="exportData"
						plain>
						<i class="el-icon-circle-plus el-icon--right"></i>
						导出数据
					</el-button>
				</el-col>
			</el-row>
		</div>

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
				show-overflow-tooltip
        prop="country"
        label="国家">
			</el-table-column>
      <el-table-column
        prop="mobile"
        label="手机">
			</el-table-column>
			<el-table-column
				:formatter="formatBusinessTypes"
				label="业务类型">
			</el-table-column>
			<el-table-column
				show-overflow-tooltip
				:formatter="formatSendPage"
				label="询盘入口">
			</el-table-column>
			<el-table-column
				show-overflow-tooltip
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
	import XLSX from 'xlsx'

	export default {
		layout: 'admin',
		data () {
			return {
				isLoading: true,
				isExportDataLoading: false,
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
			formatBusinessTypes (row) {
				const businessTypes = row.businessTypes || []
				let result = ''
				businessTypes.forEach((ele, index) => {
					result = result + (index === 0 ? '' : '、') + ele
				})
				return result
			},
			formatSendPage (row) {
				const sendPage = row.sendPage || {}
				if (!sendPage.path && !sendPage.additional) return ' - '
				return `路径: ${sendPage.path}; 备注: ${sendPage.additional}`
			},
			async currentChange (currentPage) {
				this.isLoading = true
				const pageSize = 10
				await this.listInquiries({ skip: (currentPage-1) * pageSize, limit: pageSize })
				this.isLoading = false
			},
			async exportData () {
				const { rows } = (await inquiry.list({ limit: this.count, skip: 0 }))
				const data = rows.map(row => {
					row.businessTypes = this.formatBusinessTypes(row)
					row.sendPage = this.formatSendPage(row)
					delete row.__v
					return row
				})
				const inquiryData = XLSX.utils.json_to_sheet(data) 
				const wb = XLSX.utils.book_new()
				XLSX.utils.book_append_sheet(wb, inquiryData, 'inquiry list')
				const filename = `inquiry_list(${moment().format('YYYY-MM-DD')}).xlsx`
				XLSX.writeFile(wb, filename)
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

	.inquiry-sub-menu {
		border-bottom: 1px solid #efefef;
	}
</style>