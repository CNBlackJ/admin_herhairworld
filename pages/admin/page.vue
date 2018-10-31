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
				<div
					v-loading="isLoading"
					element-loading-text="拼命加载中"
					element-loading-spinner="el-icon-loading"
					element-loading-background="rgba(0, 0, 0, 0.8)">
					<el-row>
						<el-col :span="24">
							<el-card>
								<div slot="header">
									<span>Banner</span>
									<el-button style="float: right; padding: 3px 0" type="text">+ 添加</el-button>
								</div>
								<div>
									<draggable :list="bannerIndex" @end="moveBanner">
										<el-col
											v-for="item in bannerIndex"
											:key="item._id"
											:span="6">
											<div class="setting-slide-img-con">
												<div class="banner-redirect-url">
													<div v-if="item._id === editBannerId">
														<el-input
															v-model="bannerPath"
															clearable
															size="small">
														</el-input>
													</div>
													<div v-else>
														<el-input
															v-model="item.path"
															disabled
															size="small">
														</el-input>
													</div>
													<div v-if="item._id === editBannerId">
														<el-button
															@click="updateBannerPath(item._id)"
															type="primary"
															size="small">更新</el-button>	
													</div>
													<div v-else>
														<el-button
															@click="editBannerPath(item)"
															size="small">编辑</el-button>	
													</div>
												</div>
												<img
													@click="changeBannerImg(item._id)"
													class="setting-slide-img"
													:src="item.img">
											</div>
										</el-col>
									</draggable>
								</div>
							</el-card>
						</el-col>
					</el-row>

					<el-row class="setting-service-con">
						<el-card class="setting-service-card">
							<div slot="header">
								<span>Services</span>
								<el-button style="float: right; padding: 3px 0" type="text">+ 添加</el-button>
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
	import draggable from 'vuedraggable'

	import uploadDialog from '@/components/uploadDialog'
	import pageConfigApi from '@/apis/pageConfig'

	export default {
		layout: 'admin',
		components: {
			uploadDialog,
			draggable
		},
		computed: mapState({
			pageConfig: state => state.page.pageConfig
		}),
		data () {
			return {
				isLoading: true,
				pageConfigForm: {
					index: {
						banner: [],
						services: []
					}
				},
				editServiceId: '',
				editBannerId: '',
				serviceDescription: '',
				serviceTitle: '',
				bannerPath: '',
				bannerIndex: []
			}
		},
		async created () {
			await this.$store.dispatch('page/setPageConfig')
			this.bannerIndex = JSON.parse(JSON.stringify(this.pageConfig.index.banner))
			this.isLoading = false
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
			},
			editBannerPath ({ _id, path }) {
				this.editBannerId = _id
				this.bannerPath = path
			},
			async updateBannerPath (bannerId) {
				const payload = JSON.parse(JSON.stringify(this.pageConfig))
				payload.index.banner.map(ele => {
					if (ele._id === bannerId) {
						ele.path = this.bannerPath
					}
				})
				await this.$store.dispatch('page/updatePageConfig', payload)
				this.bannerIndex = JSON.parse(JSON.stringify(this.pageConfig.index.banner))
				this.bannerPath = ''
				this.editBannerId = ''
			},
			moveBanner () {
				const payload = JSON.parse(JSON.stringify(this.pageConfig))
				payload.index.banner = this.bannerIndex
				if (this.bannerIndex.length) this.$store.dispatch('page/updatePageConfig', payload)
			}
		}
	}
</script>

<style>
	.admin-index-con .el-row {
		margin-bottom: 10px;
	}

	.setting-slide-img {
    width: 100%;
    display: block;
	}

	.setting-slide-img-con {
		padding: 0 10px 5px 10px;
		text-align: center;
	}

	.banner-redirect-url {
		display: flex;
		flex-direction: row;
		align-items: center;
		padding-bottom: 20px;
	}

	.banner-redirect-url div {
		padding-right: 5px;
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