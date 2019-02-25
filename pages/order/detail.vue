<template>
	<div>
		<div class="order-userinfo">
			<el-row style="padding-bottom: 10px;">
					<el-steps :space="200" :active="order.status + 1" finish-status="success" align-center>
						<el-step v-for="(item, i) in Object.values(orderStatusMap)" :key="i" :title="item"></el-step>
					</el-steps>
			</el-row>
			<el-row style="padding-bottom: 10px;">
				<el-col>
					<el-card>
						<div class="detail-card-title">
							<span>商品详情:</span>
							<span @click="onOpenCollapse" style="float: right;" class="detail-btn">
								<span v-if="activeNames.length === 0">
									<i class="el-icon-arrow-down"></i>展开所有
								</span>
								<span v-else>
									<i class="el-icon-arrow-up"></i>折叠所有
								</span>
							</span>
						</div>
						<div>
							<el-collapse v-model="activeNames" @change="handleChange">
								<el-collapse-item :title="`${item.productId.name} ---- ${item.key} x ${item.count}`" :name="item._id" v-for="(item, i) in order.carts" :key="i">
									<el-row :gutter="10">
										<el-col :span="3" class="detail-img">
											<img :src="item.productId.mainImg" alt="">
										</el-col>
										<el-col :span="8">
											<div>
												<span>数量:</span> {{item.count}}
											</div>
											<div>
												<span>单价:</span> {{item.price.toFixed(2)}}
											</div>
											<div>
												<span>尺寸:</span> {{item.key}}
											</div>
										</el-col>
									</el-row>
								</el-collapse-item>
							</el-collapse>
						</div>
					</el-card>
				</el-col>
			</el-row>

			<el-row :gutter="20">
				<el-col :span="8">
					<el-card>
						<div class="detail-card-title">用户信息:</div>
						<div>
							<div class="detail-item">
								<span>姓名: </span> {{payerInfo.first_name + ' ' + payerInfo.last_name}}
							</div>
							<div class="detail-item">
								<span>手机: </span> {{ payerInfo.phone }}
							</div>
							<div class="detail-item">
								<span>邮箱: </span> {{ payerInfo.email }}
							</div>
						</div>
					</el-card>
				</el-col>

				<el-col :span="8">
					<el-card>
						<div class="detail-card-title">邮寄地址:</div>
						<div>
							<div class="detail-item" v-for="(item, i) in Object.keys(payerInfo.shipping_address || [])" :key="i">
								<span>{{item}}:</span> {{payerInfo.shipping_address[item]}}
							</div>
						</div>
					</el-card>
				</el-col>
				<el-col :span="8">
					<el-card>
						<div class="detail-card-title">账单地址:</div>
						<div>
							<div class="detail-item" v-for="(item, i) in Object.keys(payerInfo.billing_address || [])" :key="i">
								<span>{{item}}:</span> {{payerInfo.billing_address[item]}}
							</div>
						</div>
					</el-card>
				</el-col>
			</el-row>
		</div>
	</div>
</template>

<script>
	import { mapState } from 'vuex'
	export default {
		props: ['order'],
		data () {
			return {
				payerInfo: {
					shipping_address: {},
					billing_address: {}
				},
				activeNames: [],
				orderStatusMap: {
					0: '待付款',
					1: '已付款',
					2: '待发货',
					3: '已发货',
					4: '已完成'
				}
			}
		},
		created () {
			this.getPayerInfo()
		},
		watch: {
			order () {
				this.getPayerInfo()
			}
		},
		methods: {
			getPayerInfo () {
				const paymentInfo = JSON.parse(this.order.paymentInfo)
				this.payerInfo = paymentInfo.payer.payer_info
			},
      handleChange(val) {
        console.log(val)
			},
			onOpenCollapse () {
				if (this.activeNames.length) {
					this.activeNames = []
				} else {
					this.activeNames = this.order.carts.map(ele => ele._id)
				}
			}
		}
	}
</script>

<style>
	.detail-card-title {
		font-weight: bold;
		padding-bottom: 10px;
	}
	.detail-item {
		padding-bottom: 5px;
	}
	.detail-item span {
		padding-right: 5px;
	}
	.detail-img img{
		width: 100%;
		height: 100%;
	}
	.detail-btn {
		float: right;
		font-weight: initial;
		color: #409EFF;
	}
</style>