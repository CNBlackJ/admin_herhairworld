<template>
	<div class="addprod-con"
		v-loading="isLoading"
		element-loading-text="拼命加载中"
		element-loading-spinner="el-icon-loading"
		element-loading-background="hsla(0,0%,100%,.9)">
		<el-form
			:model="prod"
			:rules="rules"
			ref="prod"
			label-width="100px">
			<el-row :gutter="20">
				<el-col :span="10">
					<el-form-item label="产品名称" prop="name">
						<el-input v-model="prod.name"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="model" prop="model">
						<el-input v-model="prod.model"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="6">
					<el-form-item label="包装" prop="package">
						<el-input v-model="prod.package"></el-input>
					</el-form-item>
				</el-col>
			</el-row>

			<el-row :gutter="20">
				<el-col :span="6">
					<el-form-item label="颜色" prop="color">
						<el-input v-model="prod.color"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="6">
					<el-form-item label="材料" prop="material">
						<el-input v-model="prod.material"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="6">
					<el-form-item label="邮费" required>
						<el-switch
							v-model="prod.isFreeShipping"
							active-text="免费"
							inactive-text="按重计费">
						</el-switch>
					</el-form-item>
				</el-col>
				<el-col
					v-if="!prod.isFreeShipping"
					:span="6">
					<el-form-item label="重量(g)" required prop="maxWeight">
						<el-input-number
							v-model="prod.maxWeight"
							:min="0"
							label="描述文字">
						</el-input-number>
					</el-form-item>
				</el-col>
			</el-row>

			<el-row>
				<el-col :span="8">
					<el-form-item label="类别" prop="category">
						<el-dropdown>
							<el-button>
								{{selectedCategoryName}}<i class="el-icon-arrow-down el-icon--right"></i>
							</el-button>
							<el-dropdown-menu slot="dropdown">
								<el-dropdown-item
									v-for="category in categories"
									:key="category._id"
									@click.native="selectedCategory(category)">
									{{category.name}}
								</el-dropdown-item>
							</el-dropdown-menu>
						</el-dropdown>
					</el-form-item>
				</el-col>

				<el-col :span="12">
					<el-form-item :label="'排序(总' + sortIndex + ')'" prop="index">
						<el-dropdown disabled>
							<el-button>
								{{prod.index}}<i class="el-icon-arrow-down el-icon--right"></i>
							</el-button>
							<el-dropdown-menu slot="dropdown">
								<el-dropdown-item
									@click.native="prod.index = 0">
									0
								</el-dropdown-item>
								<el-dropdown-item
									v-for="i in sortIndex"
									:key="i"
									:disabled="existSort.indexOf(i) > -1"
									@click.native="prod.index = i">
									{{i}}
								</el-dropdown-item>
							</el-dropdown-menu>
						</el-dropdown>
					</el-form-item>
				</el-col>
			</el-row>

			<el-row>
				<el-col :span="6">
					<el-form-item label="封面图" prop="description">
						<div style="text-align: center">
							<el-upload
								class="mainimg-uploader"
								:action="apiUrl + '/api/qiniu/upload'"
								:show-file-list="false"
								:on-success="handleMainImgSuccess"
								:before-upload="beforeMainImgUpload">
								<img v-if="prod.mainImg" :src="prod.mainImg" class="mainimg">
								<i v-else class="el-icon-plus mainimg-uploader-icon"></i>
							</el-upload>
						</div>
					</el-form-item>
				</el-col>
				<el-col :span="18">
					<el-form-item label="价格">
						<el-select
							size="mini"
							v-model="prod.priceId"
							placeholder="请选择价格类型">
							<el-option
								v-for="price in priceList"
								v-on:click.native="selectPriceType(price._id)"
								:key="price._id"
								:label="price.key"
								:value="price._id">
							</el-option>
						</el-select>
						<el-card>
							<el-tag
								v-for="cusPrice in prod.customizePrice"
								:key="cusPrice.key"
								closable
								:disable-transitions="false"
								@close="removeCusPrice(cusPrice.key)">
								{{cusPrice.key}} - $ {{cusPrice.price}}
							</el-tag>
							<div v-if="priceLenVisible">
								<el-row>
									<el-col :span="3">
										{{selectPrice.key}}: 
									</el-col>

									<el-col
										v-if="selectPrice.dataType === 'number'"
										:span="6">
										<el-input-number
											:precision="2"
											v-model="priceKey"
											controls-position="right"
											:min="0"
											size="small">
										</el-input-number>
									</el-col>

									<el-col
										:span="6"
										v-if="selectPrice.dataType === 'string'">
										<el-input
											size="small"
											v-model="priceKey">
										</el-input>
									</el-col>

									<el-col :span="2" :offset="1">
										Price:
									</el-col>
									<el-col :span="6">
										<el-input-number
											:precision="2"
											v-model="price"
											controls-position="right"
											:min="0"
											size="small">
										</el-input-number>
									</el-col>
									<el-col :span="2" :offset="1">
										<el-button
											@click="cusPriceConfirm"
											size="small"
											type="primary">
										确定</el-button>
									</el-col>
									<el-col :span="2" :offset="1">
										<el-button
											@click="cusPriceCancle"
											size="small">
										取消</el-button>
									</el-col>
								</el-row>
							</div>
							<el-button
								style="margin-left: 10px"
								v-else
								size="small"
								@click="cusPriceAdd">
								+ 添加
							</el-button>
						</el-card>
					</el-form-item>
				</el-col>
			</el-row>
	
			<el-row>
				<el-col :span="24">
					<el-form-item label="产品图">
						<uploadImgs type="products"></uploadImgs>
					</el-form-item>
				</el-col>
			</el-row>

			<el-row>
				<el-col :span="24">
					<el-form-item label="详情图">
						<uploadImgs type="details"></uploadImgs>
					</el-form-item>
				</el-col>
			</el-row>

			<el-form-item label="是否上线" prop="online">
				<el-switch v-model="prod.online"></el-switch>
			</el-form-item>

			<el-form-item>
				<el-alert
					v-if="isSortMode"
					:closable="false"
					show-icon
					title="当前是排序模式，不可执行更新操作。"
					type="warning">
				</el-alert>
				<el-button v-if="!isEdit" type="primary" @click="createProd('prod')">立即创建</el-button>
				<el-button v-if="!isEdit" @click="resetForm('prod')">重置</el-button>
				<el-button :disabled="isSortMode" type="primary" v-if="isEdit" @click="updateProd('prod')">立即更新</el-button>
				<el-button :disabled="isSortMode" type="danger" v-if="isEdit" @click="deleteProd">删除</el-button>
			</el-form-item>
		</el-form>

		<el-dialog
			append-to-body
			title="提示"
			:visible.sync="showClearCusPrice"
			:before-close="cancelClearCusPrice"
			width="30%">
			<span>该操作将会清除已添加的价格信息！</span>
			<span slot="footer" class="dialog-footer">
				<el-button @click="cancelClearCusPrice">取 消</el-button>
				<el-button type="primary" @click="clearCusPrices">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
	import _ from 'lodash'
	import { mapState } from 'vuex'
	import axios from 'axios'

	import product from '@/apis/product'
	import category from '@/apis/category'

	import uploadImgs from '@/components/uploadImgs'

	export default {
		computed: {
			...mapState({
				apiUrl: state => state.apiUrl,
				isEdit: state => state.product.isEdit,
				editProductId: state => state.product.editProductId,
				editProduct: state => state.product.editProduct,
				imgs: state => state.uploadImgs.imgs,
				detailImgs: state => state.uploadImgs.detailImgs,
				categories: state => state.category.categories.filter(ele => ele.isShow),
				priceList: state => state.price.priceList,
				dataTypes: state => state.price.dataTypes,
				isSortMode: state => state.product.isSortMode
			})
		},
		components: {
			uploadImgs
		},
		data() {
			return {
				isLoading: false,
				priceLenVisible: false,
				showClearCusPrice: false,
				price: 0,
				length: 0,
				selectedCategoryName: '请选择类别',
				sortIndex: 0,
				existSort: [],
				prod: {},
				selectPrice: {},
				olderPriceType: '',
				priceKey: '',
				rules: {
					name: [
						{ required: true, message: '请输入产品名称', trigger: 'blur' },
					],
					model: [
						{ required: true, message: '请输入产品model', trigger: 'blur' }
					],
					index: [
						{ type: 'number', required: true, message: '请输入产品数量', trigger: 'blur' },
						{ type: 'number', message: '库存必须为数字', trigger: 'blur' },
					],
					material: [
						{ required: true, message: '请输入产品材料', trigger: 'blur' },
					],
					package: [
						{ required: true, message: '请输入包装内容', trigger: 'blur' }
					],
					price: [
						{ type: 'number', required: true, message: '请输入产品价格', trigger: 'blur' },
						{ type: 'number', message: '产品价格必须为数字', trigger: 'blur' },
					],
					color: [
						{ required: true, message: '请输入产品颜色', trigger: 'blur' }
					],
					maxWeight: [
						{ type: 'number', required: true, message: '请输入产品最大重量', trigger: 'blur' },
						{ type: 'number', message: '产品重量必须为数字', trigger: 'blur' }
					],
					mainImgs: [
						{ required: true, message: '请上传封面图片', trigger: 'change' }
					],
					category: [
						{ required: true, message: '请至少选择一个类别', trigger: 'change' }
					]
				}
			};
		},
		async created () {
			this.isLoading = true
			await this.$store.dispatch('price/setPriceList')
			await this.getProduct()
			this.isLoading = false
		},
		methods: {
			async getProduct () {
				if (this.isEdit) {
					await this.$store.dispatch('product/setEditProduct')
					this.prod = JSON.parse(JSON.stringify(this.editProduct))
					const categoryId = this.prod.category._id
					this.selectedCategoryName = this.categories.find(ele => String(ele._id) === String(categoryId)).name
					await this.getProductIndex(categoryId)
				} else {
					this.prod = {
						model: `test model name ${new Date()}`,
						name: `test product name ${new Date()}`,
						quantity: 999,
						index: 0,
						orderMin: 1,
						material: '100% Human Hair',
						package: '1pcs/lot(100g)',
						originPrice: 199,
						price: 99,
						priceId: this.priceList.find(ele => ele.dataType === 'string')._id,
						color: 'Natural Color',
						mainImg: '',
						category: '',
						imgs: [],
						detailImgs: {
							product: []
						},
						minWeight: 0,
						maxWeight: 0,
						online: true,
						lengths: [],
						customizePrice: [],
						isFreeShipping: false
					}
				}
				this.olderPriceType = this.prod.priceId
			},
      removeCusPrice(key) {
				const customizePrice = [...this.prod.customizePrice]
				_.remove(customizePrice, ele => ele.key === key)
				this.prod.customizePrice = customizePrice
			},
			async cusPriceAdd () {
				this.selectPrice = this.priceList.find(ele => String(ele._id) === String(this.prod.priceId))
				this.priceLenVisible = true
			},
      cusPriceConfirm() {
				const key = this.priceKey
				const price = this.price
				this.prod.customizePrice.push({ key, price })
				this.cusPriceCancle()
			},
			cusPriceCancle () {
        this.priceLenVisible = false;
				this.priceKey = ''
				this.price = 0
			},
			createProd(formName) {
				let isValid = true
				if (!this.prod.customizePrice.length) {
					isValid = false
					this.$message({
						message: '输入价格',
						type: 'warning'
					});
				}
				if (!this.prod.mainImg) {
					isValid = false
					this.$message({
						message: '上传封面图',
						type: 'warning'
					});
				}
				this.$refs[formName].validate(async (valid) => {
					if (valid && isValid) {
						// 更新图片字段
						this.prod.imgs = this.imgs
						this.prod.detailImgs.product = this.detailImgs
						this.isLoading = true
						await product.create(this.prod)
						this.prod = {}
						this.isLoading = false
						this.$emit('closeAddProdForm')
						this.$message({
							message: '新增产品成功',
							type: 'success'
						});
						await this.$store.dispatch('product/listProducts', {})
					} else {
						console.log('error submit!!')
						return false;
					}
				})
			},
			resetForm(formName) {
				this.$refs[formName].resetFields();
			},
			deleteProd () {
				this.$confirm(`确认删除商品：${this.prod.name} ？`)
          .then(_ => {
            product.deleteById({ id: this.prod._id }).then(async () => {
							this.$message({
								message: '删除产品成功',
								type: 'success'
							});
							await this.$store.dispatch('product/listProducts', {})
						}).catch((err) => {
							console.log(`deleteProd: ${JSON.stringify(err)}`)
						})
          })
          .catch(_ => {});
			},
			updateProd (formName) {
				let isValid = true
				if (!this.prod.customizePrice.length) {
					isValid = false
					this.$message({
						message: '输入价格',
						type: 'warning'
					});
				}
				if (!this.prod.mainImg) {
					isValid = false
					this.$message({
						message: '上传封面图',
						type: 'warning'
					});
				}
				this.$refs[formName].validate(async (valid) => {
					if (valid && isValid) {
						this.prod.imgs = this.imgs.map(img => {
							return { name: img.name, url: img.url }
						})
						const detailProductImgs = this.detailImgs.map(img => {
							return { name: img.name, url: img.url }
						})
						this.prod.detailImgs.product = detailProductImgs
						this.prod.category = this.prod.category._id
						await product.update({ prod: this.prod })
						this.$message({
							message: '更新产品成功',
							type: 'success'
						});
						await this.$store.dispatch('product/listProducts', {})
					} else {
						return false;
					}
				});
			},
			handleMainImgSuccess(res, file) {
				this.prod.mainImg = res.data[0].url
			},
      beforeMainImgUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
			},
			async selectedCategory (category) {
				this.prod.category = category._id
				this.selectedCategoryName = category.name
				await this.getProductIndex(category._id)
			},
			async getProductIndex (categoryId) {
				this.existSort = []
				const { rows, count } = await product.list({ categoryId, limit: 10000 })
				rows.map(ele => {
					if (ele.index) {
						this.existSort.push(ele.index)
					}
				})
				this.sortIndex = count + Number(!this.isEdit)
			},
			selectPriceType (priceId) {
				if (this.prod.customizePrice.length) {
					// 弹出警告 清除customizePrice
					this.showClearCusPrice = true
				} else {
					this.selectPrice = this.priceList.find(ele => String(ele._id) === String(priceId))
				}
			},
			clearCusPrices () {
				this.showClearCusPrice = false
				this.prod.customizePrice = []
			},
			cancelClearCusPrice () {
				this.showClearCusPrice = false
				this.prod.priceId = this.olderPriceType
			}
		}
	}
</script>

<style>
  .mainimg-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
		text-align: center;
  }
  .mainimg-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .mainimg-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 80px;
    height: 80x;
    line-height: 80px;
    text-align: center;
  }
  .mainimg {
    width: 80px;
    height: 80px;
    display: block;
  }

	.el-tag + .el-tag {
    margin-left: 10px;
  }
</style>