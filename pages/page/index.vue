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
					element-loading-background="hsla(0,0%,100%,.9)">
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
											<div v-if="editServiceId === service._id">
												<el-form :inline="true">
													<el-form-item
														size="small"
														label="标题">
														<el-input v-model="serviceTitle" type="text"></el-input>
													</el-form-item>
													<el-form-item
														size="small"
														label="按钮">
														<el-input v-model="serviceBtn" type="text"></el-input>
													</el-form-item>
													<el-form-item
														size="small"
														label="描述">
														<el-input
															:rows="4"
															v-model="serviceDescription"
															type="textarea">
														</el-input>
													</el-form-item>
												</el-form>
											</div>
											<div v-else>
												<div class="setting-service-title">
													<b>{{service.title}}</b>
												</div>
												<div>
														{{service.description}}
												</div>
												<div class="setting-service-btntext">
													{{service.btn}}
												</div>
											</div>
										</div>
									</el-row>
									<el-row>
										<div
											v-if="editServiceId !== service._id"
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
										<div
											v-else
											class="setting-service-btns">
											<el-button
												@click='editServiceId = null '
												size="small">
												取消
											</el-button>
											<el-button
												@click="updateService(service._id)"
												type="success"
												size="small">
												更新
											</el-button>
										</div>
									</el-row>
								</el-col>
							</el-row>
						</el-card>
					</el-row>

					<el-row>
						<el-card>
							<div slot="header">
								<span>Why Choose Us</span>
								<el-button style="float: right; padding: 3px 0" type="text">+ 添加</el-button>
							</div>
							<el-row>
								<el-col :span="12">
									<div class="choose-container">
										<div class="choose-img-container" v-for="c in choices" :key="c.id">
											<img class="choose-img" :src="'https://herhairword-1255936829.cos.ap-guangzhou.myqcloud.com/' + c.img"/>
										</div>
									</div>
									<div class="choose-container">
										<div class="choose-img-container" v-for="c in choices" :key="c.id">
											<div class="choose-title">{{c.title}}</div>
										</div>
									</div>
								</el-col>
								<el-col :span="12">
									<div class="social-content">
										<div class="social-left">
											<div class="social-img-con">
												<img class="social-img" src="https://herhairword-1255936829.cos.ap-guangzhou.myqcloud.com/why_choose_us_5.png">
											</div>
											<div class="name">Brittany Hunter</div>
											<div class="address">New York, USA</div>
										</div>
								
										<div class="social-rigth">
											<p>
												I am a hair enthusiast, that love the versatility that hair 
												extensions provide. My goal is to provide my customers 
												with quality hair that they can wear time after time ( with 
												proper care).My business motto is " love the hair you 
												wear".
											</p>
										</div>
									</div>
								</el-col>
							</el-row>
							<el-alert
								title="该模块自定义配置稍后开放"
								type="info"
								show-icon>
							</el-alert>
						</el-card>
					</el-row>
				</div>
			</el-card>
		</el-row>

		<el-row>
			<el-col :span="12">
				<el-card>
					<div slot="header">
						<span>
							分类设置
						</span>
						<i class="el-icon-info" style="float: right; padding: 3px 0"></i>
					</div>
					<div
						v-loading="isLoading"
						element-loading-text="拼命加载中"
						element-loading-spinner="el-icon-loading"
						element-loading-background="hsla(0,0%,100%,.9)"
						class="category-container">
						<el-row>
							<el-col :span="12">
								<el-row>
									<el-col :span="12">
										<el-popover
											placement="top-start"
											trigger="hover">
											<el-select
												v-on:change="updateCategory('a')"
												v-model="selectedCategories.a"
												placeholder="请选择跳转分类">
												<el-option
													v-for="item in categoriesForList"
													:key="item._id"
													:label="item.name"
													:value="item._id">
												</el-option>
											</el-select>
											<div slot="reference" class="img-con" @click="changeCategoryImg(0)">
												<img
													:src="categories[0] ? categories[0].img : ''"
													class="category-image">
											</div>
										</el-popover>
									</el-col>
									<el-col :span="12">
										<el-popover
											placement="top-start"
											trigger="hover">
											<el-select
												v-on:change="updateCategory('b')"
												v-model="selectedCategories.b"
												placeholder="请选择跳转分类">
												<el-option
													v-for="item in categoriesForList"
													:key="item._id"
													:label="item.name"
													:value="item._id">
												</el-option>
											</el-select>
											<div slot="reference" class="img-con" @click="changeCategoryImg(1)">
												<img
													:src="categories[1] ? categories[1].img : ''"
													class="category-image">
											</div>
										</el-popover>
									</el-col>
								</el-row>
							</el-col>
							<el-col :span="12">
								<el-row>
									<el-col :span="24">
										<el-popover
											placement="top-start"
											trigger="hover">
											<el-select
												v-on:change="updateCategory('c')"
												v-model="selectedCategories.c"
												placeholder="请选择跳转分类">
												<el-option
													v-for="item in categoriesForList"
													:key="item._id"
													:label="item.name"
													:value="item._id">
												</el-option>
											</el-select>
											<div slot="reference" class="img-con" @click="changeCategoryImg(2)">
												<img :src="categories[2] ? categories[2].img : ''" class="category-image">
											</div>
										</el-popover>
									</el-col>
									<el-col :span="12">
										<el-popover
											placement="top-start"
											trigger="hover">
											<el-select
												v-on:change="updateCategory('d')"
												v-model="selectedCategories.d"
												placeholder="请选择跳转分类">
												<el-option
													v-for="item in categoriesForList"
													:key="item._id"
													:label="item.name"
													:value="item._id">
												</el-option>
											</el-select>
											<div slot="reference" class="img-con img-small" @click="changeCategoryImg(3)">
												<img :src="categories[3] ? categories[3].img : ''" class="category-image">
											</div>
										</el-popover>
									</el-col>
									<el-col :span="12">
										<el-popover
											placement="top-start"
											trigger="hover">
											<el-select
												v-on:change="updateCategory('e')"
												v-model="selectedCategories.e"
												placeholder="请选择跳转分类">
												<el-option
													v-for="item in categoriesForList"
													:key="item._id"
													:label="item.name"
													:value="item._id">
												</el-option>
											</el-select>
											<div slot="reference" class="img-con img-small" @click="changeCategoryImg(4)">
												<img :src="categories[4] ? categories[4].img : ''" class="category-image">
											</div>
										</el-popover>
									</el-col>
								</el-row>
							</el-col>
						</el-row>
					</div>
				</el-card>
			</el-col>
			<el-col :span="12">
				<el-card>
					<div slot="header">
						<span>
							iMessage & whatsapp
						</span>
					</div>
					<div>
						<el-row type="flex" align="middle">
							<el-col :span="4">
								iMessage:
							</el-col>
							<el-col :span="12">
								<el-input
									size="small"
									placeholder="请输入11位iMessage手机号"
									v-model="floatBtns.iMessage">
								</el-input>
							</el-col>
						</el-row>
						<el-row type="flex" align="middle">
							<el-col :span="4">
								whatsapp:
							</el-col>
							<el-col :span="12">
								<el-input
									size="small"
									placeholder="请输入11位whatsapp手机号"
									v-model="floatBtns.whatsapp">
								</el-input>
							</el-col>
						</el-row>
						<el-row type="flex" align="middle">
							<el-col :span="4" :offset="12">
								<el-button size="small" @click="updateFloatBtns">保存更新</el-button>
							</el-col>
						</el-row>
					</div>
				</el-card>
			</el-col>
		</el-row>

		<no-ssr>
			<uploadDialog></uploadDialog>
		</no-ssr>
	</div>
</template>

<script>
	import { mapState, mapGetters } from 'vuex'
	import _ from 'lodash'
	import draggable from 'vuedraggable'

	import uploadDialog from '@/components/uploadDialog'
	import product from '@/apis/product'

	export default {
		layout: 'admin',
		components: {
			uploadDialog,
			draggable
		},
		computed: {
			...mapGetters({
				categories: 'page/categories',
				categoriesForList: 'page/categoriesForList'
			}),
			...mapState({
				pageConfig: state => state.page.pageConfig
			})
		},
		data () {
			return {
				isLoading: false,
				showFeaturedProdDialog: false,
				pageConfigForm: {
					index: {
						banner: [],
						services: [],
						categories: []
					}
				},
        choices: [
          { id: 1, title: 'High Quality', img: 'why_choose_us_1.jpg' },
          { id: 2, title: 'Hugu Profit', img: 'why_choose_us_2.jpg' },
          { id: 3, title: 'Fast Shipment', img: 'why_choose_us_3.jpg' },
          { id: 4, title: 'Branding', img: 'why_choose_us_4.jpg' }
        ],
				editServiceId: '',
				editBannerId: '',
				serviceDescription: '',
				serviceTitle: '',
				serviceBtn: '',
				bannerPath: '',
				bannerIndex: [],
				selectedCategories: {
					a: '',
					b: '',
					c: '',
					d: '',
					e: ''
				},
				featuredProducts: [],
				featureProductIds: [],
				featuredProductId: '',
				floatBtns: {
					iMessage: '',
					whatsapp: ''
				}
			}
		},
		async created () {
			await this.$store.dispatch('page/setPageConfig')
			this.$store.dispatch('page/setCategories')
			// const { rows } = await product.list({ limit: 4 })
			this.updateSelectedCategories()
			this.bannerIndex = JSON.parse(JSON.stringify(this.pageConfig.index.banner))
			this.floatBtns = JSON.parse(JSON.stringify(this.pageConfig.index.floatBtns))
		},
		methods: {
			async updateFeatureProd(index) {
				const pageConfig = JSON.parse(JSON.stringify(this.pageConfig))
				pageConfig.faeturedProducts = this.featureProductIds
				this.$store.dispatch('page/updatePageConfig', pageConfig)
				await this.$store.dispatch('page/setPageConfig')
			},
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
			async changeCategoryImg (imgId) {
				this.$store.commit('uploadDialog/SET_IS_SHOW')
				const changeOptions = {
					position: 'categories',
					_id: imgId
				}
				this.$store.dispatch('page/setChangeOptions', changeOptions)
			},
			async editService (serviceId) {
				const services = this.pageConfig.index.services
				const service = _.find(services, service => service._id === serviceId)
				this.serviceDescription = service.description
				this.serviceTitle = service.title
				this.serviceBtn = service.btn
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
						ele.btn = this.serviceBtn
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
			},
			async updateCategory (tag) {
				const index = tag.charCodeAt() - 97
				const payload = JSON.parse(JSON.stringify(this.pageConfig))
				payload.index.categories.map(ele => {
					if (ele.index === index) {
						ele.url = this.selectedCategories[tag]
					}
					delete ele._id
				})
				await this.$store.dispatch('page/updatePageConfig', payload)
			},
			updateSelectedCategories () {
				const categories = this.pageConfig.index.categories
				categories.forEach(ele => {
					const key = 97 + Number(ele.index)
					this.selectedCategories[String.fromCharCode(key)] = ele.url
				})
			},
			handleFeaturedProdDialogClose () {
				this.featuredProductId = ''
				this.showFeaturedProdDialog = false
			},
			async addFeaturedProduct () {
				// TODO: faetureproduct
				this.showFeaturedProdDialog = false
				const payload = JSON.parse(JSON.stringify(this.pageConfig))
				payload.faeturedProducts.push(this.featuredProductId)
				await this.$store.dispatch('page/updatePageConfig', payload)
			},
			async updateFloatBtns () {
				const payload = JSON.parse(JSON.stringify(this.pageConfig))
				payload.index.floatBtns = this.floatBtns
				await this.$store.dispatch('page/updatePageConfig', payload)
				this.$message({ message: '更新成功', type: 'success' })
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
		text-align: left;
		height: auto;
	}

	.setting-service-title {
		padding-bottom: 10px;
		text-transform: uppercase;
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.setting-service-btntext {
		text-transform: uppercase;
		margin-top: 10px;
		text-align: center;
		padding: 5px 0;
		color: white;
		background-color: #dd127b;
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

	.category-container {
		padding: 0 5px;
	}

	.category-image {
		width: auto;
		height: auto;
		max-width: 100%;
		max-height: 100%;	
	}

	.img-con {
		padding: 0 2px;
	}

	.img-small {
		margin-top: -2px;
	}

	.fd-img-con {
		padding: 0 2px;
	}

	.fd-img {
		width: auto;
		height: auto;
		max-width: 100%;
		max-height: 100%;	
	}

	.choose-container {
    padding: 0 10px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;
  }

  .choose-img-container {
    padding: 0 5px;
    width: 20%;
  }

  .choose-img {
    border-radius: 50%;
    width: 100%;
  }

  .choose-title {
    font-size: 70%;
    text-align: center;
  }

	.social-content {
		display: flex;
		flex-direction: row;
	}

	.social-left {
		padding: 0 5px;
	}

	.social-img-con {
		width: 84px;
		height: 84px;
	}

	.social-img {
		width: auto;
		height: auto;
		max-width: 100%;
		max-height: 100%;
	}

	.name {
		padding-top: 10px;
		font-size: 70%;
	}

	.address {
		font-size: 70%;
	}

	.social-rigth {
		padding: 0 5px;
		font-size: 14px;
	}
</style>