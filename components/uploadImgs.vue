<template>
	<div class="upload-imgs-conatiner">
		<el-card class="upload-imgs">
			<div
				v-loading="isUploading"
				element-loading-text="拼命加载中"
				element-loading-spinner="el-icon-loading"
				element-loading-background="hsla(0,0%,100%,.9)">
				<el-upload
					class="upload-demo"
					:action="apiUrl + '/api/qiniu/upload'"
					list-type="picture"
					:file-list="this.type === 'details' ? detailImgs : imgs"
					:multiple="true"
					:auto-upload="false"
					:http-request="uploadImgs"
					:on-remove="removeImg"
					drag
					ref="upload">
					<i class="el-icon-upload"></i>
					<div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
				</el-upload>
				<el-button
					@click="submitImgs"
					size="small"
					type="warning">
					点击立即上传
				</el-button>
				<el-button
					@click="sortImgs"
					size="small"
					type="primary">
					排序
				</el-button>
			</div>
		</el-card>

		<el-dialog
			v-loading="isLoading"
			element-loading-text="拼命加载中"
			element-loading-spinner="el-icon-loading"
			element-loading-background="hsla(0,0%,100%,.9)"
			title="图片排序"
			:visible.sync="dialogVisible"
			width="60%"
			:before-close="handleClose">
			
			<div>
				<el-row type="flex" align="middle">
					<draggable :list="imgList" @end="moveImgs">
						<el-col
							class="img-con"
							v-for="img in imgList"
							:key="img.name"
							:span="4">
							<img :src="img.url" class="img-gallery">
						</el-col>
					</draggable>
				</el-row>
			</div>

			<span slot="footer" class="dialog-footer">
				<span style="float: left">
					<i class="el-icon-info"></i>
					tips: 拖动图片进行排序，确认顺序后点击确定
				</span>
				<el-button @click="handleClose">取 消</el-button>
				<el-button type="primary" @click="confirmMove">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
	import { mapState, mapGetters } from 'vuex'
	import axios from 'axios'

	import draggable from 'vuedraggable'

	export default {
		props: [
			'type'
		],
		components: {
			draggable
		},
		computed: {
			...mapGetters ({
				imgs: 'product/imgs',
				detailImgs: 'product/detailImgs'
			}),
			...mapState({
				apiUrl: state => state.apiUrl,
				isEdit: state => state.product.isEdit,
				editProduct: state => state.product.editProduct
			})
		},
		data() {
			return {
				isUploading: false,
				isLoading: false,
				dialogVisible: false,
				formData: '',
				fileNames: [],
				config: {
					headers: {
						'Content-Type': 'multipart/form-data'
					}
				},
				imgList: []
			}
		},
		methods: {
			uploadImgs (file) {
				const fileName = file.file.name
				if (fileName) this.fileNames.push(fileName)
				this.formData.append('file', file.file);
			},
			async submitImgs () {
				if (this.fileNames.length) {
					this.isUploading = true
					this.formData = new FormData()
					this.$refs.upload.submit();
					await this.$store.dispatch('uploadImgs/uploadImgs', {
						formData: this.formData, config: this.config, type: this.type
					})
					await this.$store.dispatch('uploadImgs/upadteProduct', this.type)
					await this.$store.dispatch('product/setEditProduct')
					this.isUploading = false
				} else {
					this.$message('没有需要上传的图片')
				}
			},
			async removeImg (file, fileList) {
				this.isUploading = true
				const files = fileList.map(ele => { return { name: ele.name, url: ele.url } })
				if (this.type === 'details') {
					this.$store.commit('uploadImgs/STE_NEW_DETAIL_IMGS', files)
				} else if (this.type === 'products') {
					this.$store.commit('uploadImgs/SET_NEW_IMGS', files)
				}
				await this.$store.dispatch('uploadImgs/upadteProduct', this.type)
				await this.$store.dispatch('product/setEditProduct')
				this.isUploading = false
			},
			sortImgs () {
				const imgs = JSON.parse(JSON.stringify(this.imgs.map(ele => { return { name: ele.name, url: ele.url } })))
				const detailImgs = JSON.parse(JSON.stringify(this.detailImgs.map(ele => { return { name: ele.name, url: ele.url } })))
				this.imgList = this.type === 'details' ? detailImgs : imgs
				if (this.imgList.length) {
					this.dialogVisible = true
				} else {
					this.$message('没有可排序的图片')
				}
			},
			moveImgs () {
				console.log(this.imgList)
			},
			async confirmMove () {
				this.isLoading = true
				const type = this.type
				const imgList = this.imgList
				await this.$store.dispatch('uploadImgs/updateProductImgIndex', { type, imgList })
				await this.$store.dispatch('product/setEditProduct')
				this.isLoading = false
				this.dialogVisible = false
			},
			handleClose (done) {
				this.$confirm('确认关闭？').then(_ => {
					this.dialogVisible = false
					done()
				}).catch(_ => {})
			}
		}
	}
</script>

<style>
	.upload-imgs .el-card__header {
		padding: 0 8px;
	}

	.upload-imgs .el-card__body {
		padding: 10px;
	}

	.el-upload--picture {
		width: 100%;
	}

	.el-upload-dragger {
		align-items: center;
		width: 100%;
	}

	.img-gallery {
		width: auto;
		height: auto;
		max-width: 100%;
		max-height: 100%;	
	}

	.img-con {
		padding: 5px;
		margin-right: 5px;
		border: 1px solid #efefef;
		border-radius: 10px;
	}
</style>