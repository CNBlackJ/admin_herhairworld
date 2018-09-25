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
										<div
											@click="changeBannerImg(item._id)"
											class="setting-slide-img-con">
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
									<el-row>
										<div class="setting-service-img">
											<el-row v-if="service.index === 1">
												<el-col
													v-for="(item, i) in pageConfig.index.services[0].img"
													:key="i"
													:span="12">
													<div
														@click="chengeServiceImg(service._id, item)"
														class="service1-img-con">
														<img class="service1-img" :src="item">
													</div>
												</el-col>
											</el-row>
											<img
												v-else 
												@click="chengeServiceImg(service._id, service.img[0])"
												:src="service.img[0]">
										</div>
									</el-row>
									<el-row>
										<div class="setting-service-text">
											<el-form v-if="editServiceId === service._id" :inline="true">
												<el-form-item
													size="small"
													label="标题">
													<el-input v-model="serviceTitle" type="text"></el-input>
												</el-form-item>
												<el-form-item
													label="描述">
													<el-input
														:rows="4"
														v-model="serviceDescription"
														type="textarea">
													</el-input>
												</el-form-item>
												<el-form-item>
													<el-button
														@click='editServiceId = null '
														size="small">
														取消
													</el-button>
													<el-button
														@click="updateService(service._id)"
														size="small">
														更新
													</el-button>
												</el-form-item>
											</el-form>
											<div v-else>
												<div class="setting-service-title">
														{{service.title}}
												</div>
												<span>
													{{service.description}}
												</span>
											</div>
										</div>
									</el-row>
									<el-row>
										<div
											v-show="editServiceId !== service._id"
											class="setting-service-btns">
											<el-button
												@click="editService(service._id)"
												size="small">
												编辑
											</el-button>
											<el-button
												v-if="service.isHide"
												@click="showService(service._id)"
												size="small">
											  展示
											</el-button>
											<el-button
												v-else
												@click="hideService(service._id)"
												size="small"
												type="danger">
												隐藏
											</el-button>
										</div>
									</el-row>
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

		<no-ssr>
			<uploadDialog></uploadDialog>
		</no-ssr>
	</div>
</template>

<script>
	import { mapState } from 'vuex'
	import _ from 'lodash'

	import uploadDialog from '@/components/uploadDialog'
	import pageConfigApi from '@/apis/pageConfig'

	export default {
		layout: 'admin',
		components: {
			uploadDialog
		},
		computed: mapState({
			pageConfig: state => state.page.pageConfig
		}),
		data () {
			return {
				pageConfigForm: {
					index: {
						banner: [],
						services: []
					}
				},
				editServiceId: '',
				serviceDescription: '',
				serviceTitle: ''
			}
		},
		created () {
			this.$store.dispatch('page/setPageConfig')	
		},
		methods: {
			async changeBannerImg (imgId) {
				this.$store.commit('uploadDialog/SET_IS_SHOW')
				const changeOptions = {
					position: 'banner',
					_id: imgId
				}
				this.$store.dispatch('page/setChangeOptions', changeOptions)
			},
			async chengeServiceImg (imgId, imgUrl) {
				this.$store.commit('uploadDialog/SET_IS_SHOW')
				const changeOptions = {
					position: 'service',
					_id: imgId,
					imgUrl
				}
				this.$store.dispatch('page/setChangeOptions', changeOptions)
			},
			async editService (serviceId) {
				const services = this.pageConfig.index.services
				const service = _.find(services, service => service._id === serviceId)
				this.serviceDescription = service.description
				this.serviceTitle = service.title
				this.editServiceId = serviceId
			},
			async hideService (serviceId) {
				const pageConfig = JSON.parse(JSON.stringify(this.pageConfig))
				pageConfig.index.services.map(ele => {
					if (ele._id === serviceId) ele.isHide = true
					return ele
				})
				this.$store.dispatch('page/updatePageConfig', pageConfig)
			},
			async showService (serviceId) {
				const pageConfig = JSON.parse(JSON.stringify(this.pageConfig))
				pageConfig.index.services.map(ele => {
					if (ele._id === serviceId) ele.isHide = false
					return ele
				})
				this.$store.dispatch('page/updatePageConfig', pageConfig)
			},
			async updateService (serviceId) {
				const pageConfig = JSON.parse(JSON.stringify(this.pageConfig))
				pageConfig.index.services.map(ele => {
					if (ele._id === serviceId) {
						ele.title = this.serviceTitle
						ele.description = this.serviceDescription
					}
					return ele
				})
				this.$store.dispatch('page/updatePageConfig', pageConfig)
				this.editServiceId = null
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
		height: 190px;
	}

	.setting-service-con {
		margin-top: 10px;
	}

	.setting-service-card .el-card__body {
		padding-top: 0px;
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
		text-align: center;
		height: 100px;
	}

	.setting-service-title {
		font-size: 18px;
		padding-bottom: 10px;
	}

	.setting-service-btns {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		padding-bottom: 10px;
		padding-right: 20px;
	}

	.service1-img-con {
		width: 80px;
		height: 80px;
	}
	
	.service1-img {
		padding: 3px
	}
</style>