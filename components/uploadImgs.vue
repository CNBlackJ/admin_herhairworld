<template>
	<div class="upload-imgs-conatiner">
		<el-card class="upload-imgs">
			<div>
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
				<el-button @click="submitImgs" size="small" type="success">点击上传</el-button>
				<el-button size="small" type="primary">排序</el-button>
			</div>
		</el-card>
	</div>
</template>

<script>
	import { mapState, mapGetters } from 'vuex'
	import axios from 'axios'

	export default {
		props: [
			'type'
		],
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
				formData: '',
				fileNames: [],
				config: {
					headers: {
						'Content-Type': 'multipart/form-data'
					}
				}
			}
		},
		methods: {
			uploadImgs (file) {
				const fileName = file.file.name
				if (fileName) this.fileNames.push(fileName)
				this.formData.append('file', file.file);
			},
			async submitImgs () {
				this.formData = new FormData()
				this.$refs.upload.submit();
				await this.$store.dispatch('uploadImgs/uploadImgs', {
					formData: this.formData, config: this.config, type: this.type
				})
				await this.$store.dispatch('uploadImgs/upadteProduct', this.type)
				await this.$store.dispatch('product/setEditProduct')
			},
			async removeImg (file, fileList) {
				const files = fileList.map(ele => { return { name: ele.name, url: ele.url } })
				if (this.type === 'details') {
					this.$store.commit('uploadImgs/STE_NEW_DETAIL_IMGS', files)
					await this.$store.dispatch('uploadImgs/upadteProduct', this.type)
					await this.$store.dispatch('product/setEditProduct')
				} else if (this.type === 'products') {
					this.$store.commit('uploadImgs/SET_NEW_IMGS', files)
					await this.$store.dispatch('uploadImgs/upadteProduct', this.type)
					await this.$store.dispatch('product/setEditProduct')
				}
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
</style>