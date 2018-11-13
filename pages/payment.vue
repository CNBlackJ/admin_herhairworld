<template>
	<div class="admin-index-con">
		<el-card>
			<div slot="header">
				<span>支付信息管理</span>
				<el-button
					@click="dialogVisible=true"
					style="float: right; padding: 3px 0"
					type="text">
					+添加
				</el-button>
			</div>
			<div>
				<el-table
					highlight-current-row				
					:data="payments"
					style="width: 100%">
					<el-table-column
						type="index"
						width="50">
					</el-table-column>
					<el-table-column
						show-overflow-tooltip
						prop="account"
						label="paypal账户">
					</el-table-column>
					<el-table-column
						show-overflow-tooltip
						prop="sandboxToken"
						label="sandbox token">
					</el-table-column>
					<el-table-column
						show-overflow-tooltip					
						prop="productionToken"
						label="production token">
					</el-table-column>
					<el-table-column
						prop="isUsing"
						label="正在使用">
						<template slot-scope="scope">
							<el-switch
								v-on:change="changeUsing(scope.$index, payments)"
								:active-value="true"
								:inactive-value="false"
								:value="payments[scope.$index].isUsing"
								active-color="#13ce66"
								inactive-color="#ff4949">
							</el-switch>							
						</template>
					</el-table-column>
					<el-table-column label="操作">
						<template slot-scope="scope">
							<el-button
								@click="editPayment(scope.$index, payments)"
								size="mini">
								编辑
							</el-button>
							<el-button
								@click="deletePayment(scope.$index, payments)"
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
			title="添加paypal账户"
			:visible.sync="dialogVisible"
			width="50%">
			<div>
				<el-form
					label-position="top"
					:model="paymentForm"
					:rules="paymentRules"
					ref="paymentForm"
					label-width="180px">
					<el-form-item label="Paypal账户" prop="account">
						<el-input v-model="paymentForm.account"></el-input>
					</el-form-item>
					<el-form-item label="Sanbox Token" prop="sandboxToken">
						<el-input v-model="paymentForm.sandboxToken"></el-input>
					</el-form-item>
					<el-form-item label="Production Token" prop="productionToken">
						<el-input v-model="paymentForm.productionToken"></el-input>
					</el-form-item>
				</el-form>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogVisible = false">取 消</el-button>
				<el-button
					v-if="isEdit"
					type="primary"
					@click="updatePayment">
					确 定
				</el-button>
				<el-button
					v-else
					type="primary"
					@click="createPayment">
					确 定
				</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
	import payment from '@/apis/payment'

	export default {
		layout: 'admin',
		data () {
			return {
				isEdit: false,
				dialogVisible: false,
				paymentForm: {
					account: '',
					sandboxToken: '',
					productionToken: ''
				},
				payments: [],
				paymentRules: {
          sandboxToken: [
            { required: true, message: '请输入sandbox token', trigger: 'blur' }
          ],
          productionToken: [
            { required: true, message: '请输入production token', trigger: 'change' }
          ]
				}
			}
		},
		async created () {
			await this.listPayments()
		},
		methods: {
			async listPayments () {
				const { count, rows } = await payment.list({})
				this.payments = rows
			},
			async createPayment () {
				const formName = 'paymentForm'
				this.$refs[formName].validate(async(valid) => {
          if (valid) {
						await payment.create(this.paymentForm)
						await this.listPayments()
						this.dialogVisible = false
						this.$message({
							message: '添加成功',
							type: 'success'
						});
          } else {
            return false;
          }
        })
			},
			async updatePayment () {
				await payment.update(this.paymentForm)
				await this.listPayments()
				this.dialogVisible = false
				this.$message({
					message: '更新成功',
					type: 'success'
				});
			},
			async editPayment (index, rows) {
				this.isEdit = true
				const row = rows[index]
				this.dialogVisible = true
				this.paymentForm = {
					_id: row._id,
					account: row.account,
					sandboxToken: row.sandboxToken,
					productionToken: row.productionToken
				}
			},
			async deletePayment (index, rows) {
				const row = rows[index]
				await payment.delete(row._id)
				this.$message({
					message: '删除成功',
					type: 'success'
				});
				await this.listPayments()
			},
			async changeUsing (index, rows) {
				const row = rows[index]
				const payload = {
					_id: row._id,
					isUsing: !row.isUsing
				}
				await payment.update(payload)
				await this.listPayments()
			}
		}
	}
</script>