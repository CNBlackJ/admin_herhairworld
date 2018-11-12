<template>
	<div class="admin-inquiry-con">
		<div class="prod-sub-menu">
			<el-row style="margin-bottom: 20px;">
				<el-col :xl="2" :lg="3">
					<el-button
						type="success" 
						plain
						@click="addProduct">
						<i class="el-icon-circle-plus el-icon--right"></i>
						添加产品
					</el-button>
				</el-col>
				<el-col :xl="3" :lg="3">
					<el-button
						type="primary" 
						plain
						@click="uploadDialogVisible = true">
						<i class="el-icon-upload el-icon--right"></i>
						产品数据导入
					</el-button>
				</el-col>
			</el-row>

			<el-row>
				<el-col :xl="24" :lg="24">
					<el-form :inline="true" :model="searchCondition" class="demo-form-inline">
						<el-form-item label="产品名称">
							<el-input v-model="searchCondition.name" placeholder="产品名称"></el-input>
						</el-form-item>
						<el-form-item label="产品类型">
							<el-select v-model="searchCondition.categoryId" placeholder="产品类型">
								<el-option
									v-for="category in categories"
									v-if="category.name !== 'All'"
									:key="category._id"
									:label="category.name"
									:value="category._id">
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="价格范围">
							<el-col :span="10">
								<el-input-number
									:precision="2"
									v-model="searchCondition.minPrice"
									:min="0"
									size="small">
								</el-input-number>
							</el-col>
							<el-col style="text-align:center" :span="1" :offset="2">-</el-col>
							<el-col :span="10">
								<el-input-number
									:precision="2"
									v-model="searchCondition.maxPrice"
									:min="0"
									size="small">
								</el-input-number>
							</el-col>
						</el-form-item>
						<el-form-item label="库存状态" prop="delivery">
							<el-switch v-model="searchCondition.stock"></el-switch>
						</el-form-item>
						<el-form-item>
							<el-button size="small" type="primary" @click="searchProd">查询</el-button>
						</el-form-item>
					</el-form>
				</el-col>
			</el-row>
		</div>

		<productTable
			v-loading="isLoading"
			element-loading-text="拼命加载中"
			element-loading-spinner="el-icon-loading"
			element-loading-background="hsla(0,0%,100%,.9)"
			></productTable>

		<div class="products-pagination">
			<el-pagination
				background
				layout="prev, pager, next"
				:total="count"
				@current-change="currentChange">
			</el-pagination>
		</div>

		<el-dialog
			title="添加产品"
			:visible.sync="addProdDialogVisible"
			:before-close="handleClose"
			width="80%">
			<addProdForm v-on:closeAddProdForm="addProdDialogVisible = false"></addProdForm>
		</el-dialog>

		<el-dialog
			title="导入产品数据"
			:visible.sync="uploadDialogVisible"
			:before-close="handleClose"
			width="30%">
			<el-upload
				class="upload-demo"
				drag
				action="https://jsonplaceholder.typicode.com/posts/"
				accept=".xls,.xlsx"
				multiple>
				<i class="el-icon-upload"></i>
				<div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
				<div class="el-upload__tip" slot="tip">只能上传xls/xlsx文件，且不超过5M</div>
			</el-upload>
		</el-dialog>
	</div>
</template>

<script>
	import { mapState } from 'vuex'

	import productTable from '@/components/admin/productTable'
	import addProdForm from '@/components/admin/addProdForm'

	export default {
		layout: 'admin',
		components: {
			productTable,
			addProdForm
		},
		computed: {
			...mapState({
				count: state => state.product.count,
				categories: state => state.category.categories
			})
		},
		data () {
			return {
				isLoading: false,
				uploadDialogVisible: false,
				addProdDialogVisible: false,
				searchCondition: {
					name: '',
					categoryId: '',
					minPrice: 0,
					maxPrice: 20,
					stock: true
				}
			}
		},
		async created () {
			await this.$store.dispatch('category/setCategories', { sort: 'index' })
		},
		methods: {
			addProduct () {
				this.$store.commit('product/SET_IS_EDIT', false)
				this.$store.commit('product/SET_EDIT_PRODUCT_ID', '')
				this.$store.commit('product/SET_EDIT_PRODUCT', {})
				this.$store.commit('uploadImgs/STE_DETAIL_IMGS', [])
				this.$store.commit('uploadImgs/SET_IMGS', [])
				this.addProdDialogVisible = true
			},
			async searchProd () {
				this.isLoading = true
				await this.$store.dispatch('product/searchProducts', this.searchCondition)
				this.isLoading = false
			},
      handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
			},
			async currentChange (currentPage) {
				this.isLoading = true
				const pageSize = 10
				await this.$store.dispatch('product/listProducts', { skip: (currentPage-1) * pageSize, limit: pageSize })
				this.isLoading = false
			}
		}
	}
</script>

<style>
	.admin-inquiry-con {
		width: 100%;
		padding: 10px;
	}

	.prod-sub-menu {
		border-bottom: 1px solid #efefef;
	}

	.products-pagination {
		padding: 10px;
		text-align: center;
	}
</style>