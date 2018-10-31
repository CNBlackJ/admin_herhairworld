<template>
	<div class="coupon-container">
		<el-card>
			<div slot="header">
				<span>优惠券管理</span>
				<el-button
					style="float: right; padding: 3px 0"
					type="text">
					<span
						v-if="!showForm"
						@click="showForm = true">
						<i class="el-icon-plus"></i> 新增
					</span>
					<span
					  v-else
						@click="showForm = false">
						<i class="el-icon-close"></i> 取消
					</span>
				</el-button>
			</div>
			<div
			  v-show="showForm"
				class="coupon-form">
				<el-form
					:model="couponForm"
					:rules="couponFormRules"
					inline
					size="small">
					<el-form-item
						prop="discount"
						label="折扣">
						<el-input-number
							v-model="couponForm.discount"
							:precision="2"
							:step="0.1"
							:min="0"
							:max="10">
						</el-input-number>
					</el-form-item>
					<el-form-item
						prop="count"
						label="数量">
						<el-input-number
							v-model="couponForm.count"
							:precision="2"
							:step="1"
							:min="1"
							:max="10000">
						</el-input-number>
					</el-form-item>
					<el-form-item>
						<el-button @click="cancel">取 消</el-button>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="confirm">确 定</el-button>
					</el-form-item>
				</el-form>
			</div>

			<div>
				<el-table
					v-loading="isLoading"
					element-loading-text="拼命加载中"
					element-loading-spinner="el-icon-loading"
					element-loading-background="rgba(0, 0, 0, 0.8)"
					:data="coupons"
					style="width: 100%">
					<el-table-column
						type="index"
						width="50">
					</el-table-column>
					<el-table-column
						sortable
						prop="code"
						label="优惠码">
					</el-table-column>
					<el-table-column
						sortable
						prop="count"
						label="数量">
					</el-table-column>
					<el-table-column
						sortable
						prop="surplus"
						label="剩余">
					</el-table-column>
					<el-table-column
						sortable
						:formatter="formatDiscount"
						label="折扣">
					</el-table-column>
					<el-table-column
						sortable
						:formatter="formatDate"
						label="创建时间">
					</el-table-column>
					<el-table-column
						label="标签">
						<template slot-scope="scope">
							<el-tag
								:type="scope.row.isForbid ? 'danger' : 'success'"
								size="small">
								<span
									v-if="scope.row.isForbid">
									失效
								</span>
								<span
									v-else>
								  使用中
								</span>
							</el-tag>
						</template>
					</el-table-column>
					<el-table-column
						fixed="right"
						label="操作"
						width="120">
						<template slot-scope="scope">
							<el-button
								@click.native.prevent="deleteCoupon(scope.row)"
								type="text"
								size="small">
								删除
							</el-button>
							<el-button
								@click.native.prevent="forbidCoupon(scope.row)"
								type="text"
								size="small">
								禁用
							</el-button>
						</template>
					</el-table-column>
				</el-table>
			</div>
		</el-card>
	</div>
</template>

<script>
	import coupon from '@/apis/coupon'
	import moment from 'moment'

	export default {
		layout: 'admin',
		data () {
			return {
				isLoading: true,
				coupons: [],
				showForm: false,
				couponForm: {
					discount: 1,
					count: 10,
				},
				couponFormRules: {
					count: [
						{ required: true, message: '请输入数量', trigger: 'blur' }
					],
					discount: [
						{ required: true, message: '请输入折扣金额', trigger: 'blur' }
					]
				}
			}
		},
		async created () {
			this.coupons = await coupon.list({})
			this.isLoading = false
		},
    methods: {
			cancel () {
				this.showForm = false
			},
			async confirm () {
				await coupon.create({ coupon: this.couponForm })
				this.showForm = false
				await this.listCoupon()
			},
			async listCoupon () {
				this.coupons = await coupon.list({})
			},
			async forbidCoupon (row) {
				row.isForbid = true
				await coupon.update({ coupon: row })
				await this.listCoupon()
			},
			async deleteCoupon (row) {
				await coupon.delete(row._id)
				await this.listCoupon()
			},
			formatDiscount (row, column) {
				if (row.discount > 0) {
					return `$ ${row.discount.toFixed(2)}`
				} else {
					return `$ ${row.discount}`
				}
			},
			formatDate (row, column) {
				return moment(row.createdAt).format('YYYY-MM-DD HH:hh:ss')
			}
    }
	}
</script>

<style>
	.coupon-form {
		border-bottom: 1px solid #efefef;
	}
</style>