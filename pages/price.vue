<template>
	<div class="admin-index-con">
		<el-card>
			<div slot="header">
				<span>定价标准</span>
				<el-button
					@click="addPrice"
					style="float: right; padding: 3px 0"
					type="text">
					+ 添加
				</el-button>
			</div>
			<div>
				<el-table
					v-loading="isLoading"
					element-loading-text="拼命加载中"
					element-loading-spinner="el-icon-loading"
					element-loading-background="hsla(0,0%,100%,.9)"
					highlight-current-row				
					:data="priceList"
					style="width: 100%">
					<el-table-column
						type="index"
						width="50">
					</el-table-column>
					<el-table-column
						prop="key"
						label="key">
					</el-table-column>
					<el-table-column
						:formatter="formatDataType"
						label="数据类型">
					</el-table-column>
					<el-table-column label="操作">
						<template slot-scope="scope">
							<el-button
								@click="editPrice(scope.$index, priceList)"
								size="mini">
								编辑
							</el-button>
							<el-button
								@click="deletePrice(scope.$index, priceList)"
								size="mini"
								type="danger">
								删除
							</el-button>
						</template>
					</el-table-column>
				</el-table>
			</div>
		</el-card>

		<el-dialog
			title="添加支付种类"
			:visible.sync="dialogVisible"
			width="30%">
			<div
				v-loading="isLoadingEdit"
				element-loading-text="拼命加载中"
				element-loading-spinner="el-icon-loading"
				element-loading-background="hsla(0,0%,100%,.9)">
				<el-form
					:inline="true"
					label-position="top"
					:model="priceForm"
					:rules="priceRules"
					ref="priceForm"
					label-width="180px">
					<el-form-item label="key" prop="key">
						<el-input v-model="priceForm.key"></el-input>
					</el-form-item>
					<el-form-item label="数据类型" prop="dataType">
						<el-select v-model="priceForm.dataType" placeholder="请选择数据类型">
							<el-option
								v-for="item in dataTypes"
								:key="item.value"
								:label="item.label"
								:value="item.value">
							</el-option>
						</el-select>
					</el-form-item>
				</el-form>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button
					@click="dialogVisible = false">
					取 消
				</el-button>
				<el-button
					v-if="isEdit"
					type="primary"
					@click="updatePrice">
					确 定
				</el-button>
				<el-button
					v-else
					type="primary"
					@click="createPrice">
					确 定
				</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
	import { mapState } from 'vuex'

	import price from '@/apis/price'

	export default {
		layout: 'admin',
		computed: {
			...mapState({
				priceList: state => state.price.priceList,
				dataTypes: state => state.price.dataTypes
			})
		},
		data () {
			return {
				isEdit: false,
				isLoading: true,
				isLoadingEdit: false,
				dialogVisible: false,
				priceForm: {
					key: '',
					dataType: ''
				},
				priceRules: {
          key: [
            { required: true, message: '请输入key', trigger: 'blur' }
					],
					dataType: [
					{ required: true, message: '请选择数据类型', trigger: 'blur' }
					]
				}
			}
		},
		async created () {
			await this.listPrice()
		},
		methods: {
			async listPrice () {
				this.isLoading = true
				await this.$store.dispatch('price/setPriceList')
				this.isLoading = false
			},
			formatDataType (row) {
				const dataType = this.dataTypes.find(ele => ele.value === row.dataType)
				return dataType.label
			},
			addPrice () {
				this.priceForm = {
					key: '',
					dataType: ''
				}
				this.dialogVisible = true
			},
			async createPrice () {
				this.isLoading = true
				await price.create(this.priceForm)
				this.dialogVisible = false
				await this.listPrice()
				this.isLoading = false
			},
			editPrice (index, rows) {
				this.isEdit = true
				const row = rows[index]
				this.priceForm = {
					_id: row._id,
					key: row.key,
					dataType: row.dataType
				}
				this.dialogVisible = true
			},
			async updatePrice () {
				this.isLoadingEdit = true
				await price.update(this.priceForm)
				await this.listPrice()
				this.isLoadingEdit = false
				this.dialogVisible = false
				this.$message({
					message: '更新成功',
					type: 'success'
				});
			},
			async deletePrice (index, rows) {
				this.isLoading = true
				const row = rows[index]
				await price.delete(row._id)
				await this.listPrice()
				this.isLoading = false
				this.$message({
					message: '删除成功',
					type: 'success'
				});
			}
		}
	}
</script>