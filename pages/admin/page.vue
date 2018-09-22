<template>
	<div class="admin-index-con">
		<el-row>
			<el-card>
				<div slot="header">
					<span>
						首页设置
					</span>
					<i class="el-icon-info" style="float: right; padding: 3px 0"></i>
				</div>
				<div>
					<el-row>
						<el-col :span="24">
							<el-card>
								<div slot="header">
									<span>Banner</span>
								</div>
								<div>
									<el-col
										v-for="item in pageConfig.index.banner"
										:key="item._id"
										:span="6">
										<div class="setting-slide-img-con">
											<img
												class="setting-slide-img"
												:src="item.img">
										</div>
									</el-col>
								</div>
							</el-card>
						</el-col>
					</el-row>

					<el-row class="setting-service-con">
						<el-card class="setting-service-card">
							<div slot="header">
								<span>Services</span>
							</div>
							<el-row class="setting-service-content-con">

								<el-col
									v-for="service in pageConfig.index.services"
									:key="service._id"
									:span="6">
									<div class="setting-service-text">
										<span>{{service.description}}</span>
									</div>
									<div class="setting-service-img">
										<el-row v-if="service.index === 1">
											<el-col
												v-for="(item, i) in pageConfig.index.services[0].img"
												:key="i"
												:span="12">
												<img
													style="padding: 3px"
													:src="item">
											</el-col>
										</el-row>
										<img
											v-else 
											:src="service.img[0]">
									</div>
								</el-col>
							</el-row>
						</el-card>
					</el-row>
				</div>
			</el-card>
		</el-row>

		<el-row>
			<el-card>
				<div slot="header">
					<span>
						产品详情页设置
					</span>
					<i class="el-icon-info" style="float: right; padding: 3px 0"></i>
				</div>
				<div>
				</div>
			</el-card>
		</el-row>
	</div>
</template>

<script>
	import { mapState } from 'vuex'

	import pageConfig from '@/apis/pageConfig'

	export default {
		layout: 'admin',
		computed: mapState({
			pageConfig: state => state.page.pageConfig
		}),
		created () {
			this.$store.dispatch('page/setPageConfig')
		},
		methods: {
			async createPageConfig () {
				const bannerImg = 'https://herhairword-1255936829.cos.ap-guangzhou.myqcloud.com/banner.jpg'
				const bsImg = 'https://herhairword-1255936829.cos.ap-guangzhou.myqcloud.com/business_1.jpg'
				const page = {
					index: {
						banner: [
							{ img: bannerImg, path: 'path: 1' },
							{ img: bannerImg, path: 'path: 2' },
							{ img: bannerImg, path: 'path: 3' },
							{ img: bannerImg, path: 'path: 4' }
						],
						services: [
							{
								title: 'business solution',
								description: 'Growing your business is our target and we provide solutions to make you successful!',
								img: [ bsImg, bsImg, bsImg, bsImg ],
								index: 1
							},
							{ 
								title: 'factory direct price',
								description: 'Lowest factory direct prices with Premuim quality product help makebig profit',
								img: [ 'https://herhairword-1255936829.cos.ap-guangzhou.myqcloud.com/plant.jpg' ],
								index: 2
							},
							{ 
								title: 'secret of hair market',
								description: 'Are you still buying the hair as Brazilian Hair? 12A Grade? More secret of hair market are waiting for you!!',
								img: [ 'https://herhairword-1255936829.cos.ap-guangzhou.myqcloud.com/market.jpg' ],
								index: 3
							},
							{ 
								title: 'hair branding',
								description: 'Are you still buying the hair as Brazilian Hair? 12A Grade? More secret of hair market are waiting for you!!',
								img: [ 'https://herhairword-1255936829.cos.ap-guangzhou.myqcloud.com/branding.jpg' ],
								index: 4
							}
						]
					},
					detail: [
						{ index: 1, title: 'Product' },
						{ index: 2, title: 'Wholesale' },
						{ index: 3, title: 'Shipping' },
						{ index: 4, title: 'FAQ' }
					]
				}
				const resp = await pageConfig.create(page)
				console.log(resp)
			}
		}
	}
</script>

<style>
	.admin-index-con .el-row {
		margin-bottom: 10px;
	}

	.setting-slide-img {
		width: auto;
		height: auto;
		max-width: 100%;
		max-height: 100%;
	}

	.setting-slide-img-con {
		padding: 0 10px 5px 10px;
	}

	.setting-service-img {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.setting-service-con {
		margin-top: 10px;
	}

	.setting-service-card img {
		width: auto;
		height: auto;
		max-width: 100%;
		max-height: 100%;	
	}

	.setting-service-content-con .el-col {
		padding: 0 10px;
	}

	.setting-service-text {
		font-size: 12px;
		padding: 12px 0;
		text-align: center;
	}
</style>