<template>
	<div class="addprod-con"
		v-loading="isLoading"
		element-loading-text="拼命加载中"
		element-loading-spinner="el-icon-loading"
		element-loading-background="hsla(0,0%,100%,.9)">
		<el-form :model="prod" :rules="rules" ref="prod" label-width="100px">
			<el-row>
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

			<el-row>
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
					<el-form-item label="库存数(件)" prop="quantity">
						<el-input-number v-model.number="prod.quantity"></el-input-number>
					</el-form-item>
				</el-col>
				<el-col :span="6">
					<el-form-item label="重量(g)" required>
						<el-col :span="11">
							<el-form-item prop="minWeight">
								<el-input v-model.number="prod.minWeight"></el-input>
							</el-form-item>
						</el-col>
						<el-col style="text-align:center" :span="2">-</el-col>
						<el-col :span="11">
							<el-form-item prop="maxWeight">
								<el-input v-model.number="prod.maxWeight"></el-input>
							</el-form-item>
						</el-col>
					</el-form-item>
				</el-col>
			</el-row>

			<el-row>
				<el-col :span="24">
					<el-form-item label="类别" prop="category">
						<el-radio
							v-for="category in categories"
							:key="category._id"
							v-model="prod.category"
							:label="category._id">
							{{category.name}}
						</el-radio>
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
					<el-form-item label="长度 / 价格">
						<el-card>
							<el-tag
								v-for="length in prod.lengths"
								:key="length._id"
								closable
								:disable-transitions="false"
								@close="removeLenPrice(length.len)">
								{{length.len}} inch - $ {{length.price}}
							</el-tag>
							<div v-if="priceLenVisible">
								<el-row>
									<el-col :span="3">
										Length: 
									</el-col>
									<el-col :span="6">
										<el-input-number
											:precision="2"
											v-model="length"
											controls-position="right"
											:min="0"
											size="small">
										</el-input-number>
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
											@click="lenPriceConfirm"
											size="small"
											type="primary">
										确定</el-button>
									</el-col>
									<el-col :span="2" :offset="1">
										<el-button
											@click="lenPriceCancle"
											size="small">
										取消</el-button>
									</el-col>
								</el-row>
							</div>
							<el-button
								style="margin-left: 10px"
								v-else
								size="small"
								@click="showInput">
								+ 添加尺寸
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
				<el-button v-if="!isEdit" type="primary" @click="createProd('prod')">立即创建</el-button>
				<el-button v-if="!isEdit" @click="resetForm('prod')">重置</el-button>
				<el-button type="primary" v-if="isEdit" @click="updateProd('prod')">立即更新</el-button>
				<el-button type="danger" v-if="isEdit" @click="deleteProd">删除</el-button>
			</el-form-item>
		</el-form>
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
				imgs: state => state.uploadImgs.imgs,
				detailImgs: state => state.uploadImgs.detailImgs
			})
		},
		components: {
			uploadImgs
		},
		data() {
			return {
				isLoading: true,
				categories: [],
        priceLenVisible: false,
				price: 0,
				length: 0,
				prod: {},
				rules: {
					name: [
						{ required: true, message: '请输入产品名称', trigger: 'blur' },
					],
					model: [
						{ required: true, message: '请输入产品model', trigger: 'blur' }
					],
					quantity: [
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
					minWeight: [
						{ type: 'number', required: true, message: '请输入产品最小重量', trigger: 'blur' },
						{ type: 'number', message: '产品重量必须为数字', trigger: 'blur' }
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
			await this.getProduct()
			const categories = await category.list({})
			this.categories = categories.filter(ele => ele.isShow)
			this.isLoading = false
		},
		methods: {
			async getProduct () {
				if (this.isEdit) {
					this.prod = await product.getById(this.editProductId)
				} else {
					this.prod = {
						model: `test model name ${new Date()}`,
						name: `test product name ${new Date()}`,
						quantity: 999,
						orderMin: 1,
						material: '100% Human Hair',
						package: '1pcs/lot(100g)',
						originPrice: 199,
						price: 99,
						color: 'Natural Color',
						mainImg: '',
						category: '',
						imgs: [],
						detailImgs: {
							product: []
						},
						minWeight: 90,
						maxWeight: 110,
						online: true,
						lengths: []
					}
				}
			},
      removeLenPrice(len) {
				const lengths = [...this.prod.lengths]
				_.remove(lengths, ele => ele.len === len)
				this.prod.lengths = lengths
      },
      showInput() {
        this.priceLenVisible = true
      },
      lenPriceConfirm() {
				const len = this.length
				const price = this.price
        if (len && price) {
					const lenPrice = { len, price }
          this.prod.lengths.push(lenPrice)
				}
				this.lenPriceCancle()
			},
			lenPriceCancle () {
        this.priceLenVisible = false;
				this.length = 0
				this.price = 0
			},
			createProd(formName) {
				let isValid = true
				if (!this.prod.lengths.length) {
					isValid = false
					this.$message({
						message: '输入尺寸和价格',
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
						this.isLoading = true
						// 更新图片字段
						this.prod.imgs = this.imgs
						this.prod.detailImgs.product = this.detailImgs
						await product.create(this.prod)
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
				if (!this.prod.lengths.length) {
					isValid = false
					this.$message({
						message: '输入尺寸和价格',
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