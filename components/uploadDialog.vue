<template>
	<div class="upload-dialog-container">
		<el-dialog
			title="上传图片"
			:visible.sync="isShow"
			:before-close="handleClose"
			width="30%">
			<div class="upload-dialog-img-con">
				<el-upload
					class="avatar-uploader"
					:action="apiUrl + '/api/qiniu/upload'"
					:show-file-list="false"
					:on-success="handleImgSuccess"
					:before-upload="beforeImgUpload">
					<img v-if="imageUrl" :src="imageUrl" class="avatar">
					<i v-else class="el-icon-plus avatar-uploader-icon"></i>
				</el-upload>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="cancel">取 消</el-button>
				<el-button type="primary" @click="confirm">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
	import { mapState, mapGetters } from 'vuex'

	export default {
		computed: {
			...mapState({
				isShow: state => state.uploadDialog.isShow,
				imgUrl: state => state.uploadDialog.imgUrl,
				pageConfig: state => state.page.pageConfig,
				changeOptions: state => state.page.changeOptions,
				apiUrl: state => state.apiUrl
			})
		},
		data() {
			return {
				imageUrl: ''
			};
		},
		methods: {
			cancel () {
				this.$store.commit('uploadDialog/SET_IS_SHOW')
			},
			confirm () {
				const pageConfig = JSON.parse(JSON.stringify(this.pageConfig))
				const { position, _id } = this.changeOptions
				if (position.toLowerCase() === 'banner') {
					pageConfig.index.banner.map(ele => {
						if (ele._id === _id)  ele.img = this.imgUrl
						return ele
					})
				} else if (position.toLowerCase() === 'service') {
					const { imgUrl } = this.changeOptions
					pageConfig.index.services.map(ele => {
						if (ele._id === _id) {
							ele.img[ele.img.indexOf(imgUrl)] = this.imgUrl
						}
						return ele
					})
				} else if (position.toLowerCase() === 'categories') {
					pageConfig.index.categories.map(ele => {
						if (ele.index === _id) ele.img = this.imgUrl
						delete ele._id
						return ele
					})
				} else {
					console.log('cannot found category')
				}
				this.$store.dispatch('page/updatePageConfig', pageConfig)
				this.$store.commit('uploadDialog/SET_IS_SHOW')
				this.imageUrl = ''
			},
			handleClose () {
				this.$store.commit('uploadDialog/SET_IS_SHOW')
			},
      handleImgSuccess(res, file) {
				this.imageUrl = res.data[0].url
				if (this.imageUrl) {
					this.$store.dispatch('uploadDialog/setImgUrl', this.imageUrl)
				}
      },
      beforeImgUpload(file) {
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
	};
</script>

<style>
	.avatar-uploader .el-upload {
		border: 1px dashed #d9d9d9;
		border-radius: 6px;
		cursor: pointer;
		position: relative;
		overflow: hidden;
	}
	.avatar-uploader .el-upload:hover {
		border-color: #409EFF;
	}
	.avatar-uploader-icon {
		font-size: 28px;
		color: #8c939d;
		width: 178px;
		height: 178px;
		line-height: 178px;
		text-align: center;
	}
	.avatar {
		width: 178px;
		height: 178px;
		display: block;
	}

	.upload-dialog-img-con {
		text-align: center;
	}
</style>