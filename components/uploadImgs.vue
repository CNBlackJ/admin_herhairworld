<template>
	<div class="upload-imgs-conatiner">
		<el-card class="upload-imgs">
			<div
				v-loading="isUploading"
				element-loading-text="拼命加载中"
				element-loading-spinner="el-icon-loading"
				element-loading-background="hsla(0,0%,100%,.9)">
				<el-row>
					<el-col :span="5">
						<el-upload
							:action="apiUrl + '/api/qiniu/upload'"
							list-type="picture"
							:multiple="true"
							:show-file-list="false"
							:on-success="handleImgSuccess"
							drag>
							<i class="el-icon-upload"></i>
							<div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
						</el-upload>
					</el-col>
					<el-col :span="18" :offset="1">
						<div>
							<el-row type="flex" align="middle">
								<draggable :list="imgList" @end="moveImgs">
									<el-col
										class="img-con"
										v-for="(img, i) in imgList"
										:key="img.name"
										:span="4">
										<div
											@mouseover="deleteBtnId=i"
											@mouseout="deleteBtnId=''">
											<i
												v-if="deleteBtnId===i"
												@click="removeImg(i)"
												class="el-icon-delete img-layer">
											</i>
											<img
												:src="img.url"
												class="img-gallery">
										</div>
									</el-col>
								</draggable>
							</el-row>
						</div>
					</el-col>
				</el-row>
			</div>
		</el-card>
	</div>
</template>

<script>
	import { mapState, mapGetters } from 'vuex'
	import axios from 'axios'
	import _ from 'lodash'

	import draggable from 'vuedraggable'

	export default {
		props: [
			'type'
		],
		components: {
			draggable
		},
		computed: {
			...mapState({
				apiUrl: state => state.apiUrl,
				isEdit: state => state.product.isEdit,
				editProduct: state => state.product.editProduct,
				imgs: state => state.uploadImgs.imgs,
				detailImgs: state => state.uploadImgs.detailImgs
			})
		},
		data() {
			return {
				isUploading: false,
				isLoading: false,
				deleteBtnId: '',
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
		created () {
			this.getImgsList()
		},
		methods: {
			getImgsList () {
				const type = this.type
				if (type === 'products') {
					this.imgList = JSON.parse(JSON.stringify(this.imgs.map(ele => { return { name: ele.name, url: ele.url } })))
				} else if (type === 'details') {
					this.imgList = JSON.parse(JSON.stringify(this.detailImgs.map(ele => { return { name: ele.name, url: ele.url } })))
				}
			},
			async handleImgSuccess (response, file, fileList) {
				const type = this.type
				if (this.isEdit) {
					if (type === 'details') {
						this.$store.dispatch('uploadImgs/pushIntoDetailImgs', response.data[0])
					} else if (type === 'products') {
						this.$store.dispatch('uploadImgs/pushIntoImgs', response.data[0])
					}
				} else {
					const files = []
					fileList.forEach(ele => {
						if (ele.response && ele.response.data[0]) {
							files.push(ele.response.data[0]) 
						}
					})
					if (type === 'details') {
						this.$store.commit('uploadImgs/STE_DETAIL_IMGS', files)
					} else if (type === 'products') {
						this.$store.commit('uploadImgs/SET_IMGS', files)
					}
				}
				this.getImgsList()
			},
			removeImg (index) {
				const type = this.type
				const imgList = JSON.parse(JSON.stringify(this.imgList))
				_.remove(imgList, (ele, i) => i === index)
				if (type === 'details') {
					this.$store.commit('uploadImgs/STE_DETAIL_IMGS', imgList)
				} else if (type === 'products') {
					this.$store.commit('uploadImgs/SET_IMGS', imgList)
				}
				this.getImgsList()
			},
			moveImgs () {
				const type = this.type
				if (type === 'details') {
					this.$store.commit('uploadImgs/STE_DETAIL_IMGS', JSON.parse(JSON.stringify(this.imgList)))
				} else if (type === 'products') {
					this.$store.commit('uploadImgs/SET_IMGS', JSON.parse(JSON.stringify(this.imgList)))
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

	.img-gallery {
		width: auto;
		height: auto;
		max-width: 100%;
		max-height: 100%;	
	}

	.img-con {
		margin-right: 5px;
		position: relative;
	}

	.img-layer {
		text-align: center;
    position: absolute;
    height: auto;
    width: auto;
		background-color: #F56C6C;
		padding: 5px;
    top: -8px;
		right: -6px;
    z-index: 1;
		color: white;
		border-radius: 50%;
	}
</style>