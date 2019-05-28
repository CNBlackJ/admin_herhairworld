<template>
	<div class="category-container">
		<el-row
			v-loading="isLoading"
			element-loading-text="拼命加载中"
			element-loading-spinner="el-icon-loading"
			element-loading-background="hsla(0,0%,100%,.9)">
			<el-col :span="16">
				<el-card>
					<div slot="header">
						<span>分类名称</span>
						<el-button 
							@click="addCategoryVisible = true"
							style="float: right; padding: 8px"
							type="primary">
							立即添加
						</el-button>
						<el-dialog
							:title="isEdit ? '更新分类' : '添加分类'"
							:visible.sync="addCategoryVisible"
							width="30%">

							<div class="category-uploader-con">
								<el-upload
									class="category-uploader"
									:action="apiUrl + '/api/qiniu/upload'"
									:show-file-list="false"
									:on-success="handleCatImgSuccess"
									:before-upload="beforeImgUpload">
									<img v-if="categoryObj.img" :src="categoryObj.img.url" class="avatar">
									<i v-else class="el-icon-plus category-uploader-icon"></i>
								</el-upload>
								<el-form>
									<el-row>
										<el-col :span="3">
											<el-form-item label="排序">
												<el-input
													v-model="categoryObj.index"
													placeholder="排序">
												</el-input>
											</el-form-item>
										</el-col>
										<el-col :span="18" :offset="3">
											<el-form-item label="名称">
												<el-input
													v-model="categoryObj.name"
													placeholder="输入新添加类别的名称">
												</el-input>
											</el-form-item>
										</el-col>
									</el-row>
								</el-form>
							</div>

							<span slot="footer" class="dialog-footer">
								<el-button @click="addCategoryVisible = false">取 消</el-button>
								<el-button v-if="!isEdit" type="primary" @click="createCategory">确 定</el-button>
								<el-button v-if="isEdit" type="primary" @click="updateCategory">确 定</el-button>
							</span>
						</el-dialog>
					</div>
					<div>
						<el-table
							:data="categories"
							stripe
							style="width: 100%">
							<el-table-column
								sortable
								prop="index"
								label="序号"
								width="80">
							</el-table-column>
							<el-table-column
								label="图片"
								width="180">
								<template slot-scope="scope">
									<img class="category-img" :src="scope.row.img">
								</template>
							</el-table-column>
							<el-table-column
								sortable
								prop="name"
								label="类别"
								width="180">
							</el-table-column>
							<el-table-column
							  sortable
								prop="createdAt"
								label="创建日期"
								:formatter="formatDate"
								width="180">
							</el-table-column>
							<el-table-column
								label="操作"
								width="180">
								<template slot-scope="scope">
									<el-button
										size="mini"
										@click="editCategory(scope.row)">编辑</el-button>
									<el-button
										size="mini"
										type="danger"
										@click="deleteCategory(scope.row)">删除</el-button>
								</template>
							</el-table-column>
						</el-table>
					</div>
				</el-card>
			</el-col>
		</el-row>
	</div>
</template>

<script>
	import category from '@/apis/category'	
	import formatters from '@/utils/formatters'

	import { mapState } from 'vuex'

	export default {
		layout: 'admin',
		computed: {
			...mapState({
				apiUrl: state => state.apiUrl,
				categories: state => state.category.categories
			})
		},
		data() {
			return {
				isLoading: true,
				addCategoryVisible: false,
				isEdit: false,
				categoryObj: {
					name: '',
					img: '',
					index: 0
				}
			}
		},
		async created () {
			await this.$store.dispatch('category/setCategories', { sort: 'index' })
			this.isLoading = false
		},
		methods: {
			async createCategory () {
				this.isLoading = true
				await category.create({ category: this.categoryObj })
				await this.$store.dispatch('category/setCategories', { sort: 'index' })
				this.addCategoryVisible = false
				this.isLoading = false
			},
			async updateCategory () {
				await category.update({ category: this.categoryObj })
				await this.$store.dispatch('category/setCategories', { sort: 'index' })
				this.addCategoryVisible = false
				this.isEdit = false
				this.isLoading = false
			},
			async deleteCategory (row) {
				await category.delete({ category: row })
				await this.$store.dispatch('category/setCategories', { sort: 'index' })
			},
			editCategory (row) {
				this.addCategoryVisible = true
				this.isEdit = true
				const { name, img, _id, index } = row
				this.categoryObj._id = _id
				this.categoryObj.name = name
				this.categoryObj.img = img
				this.categoryObj.index = index
			},
			formatDate (row) {
				return formatters.formatDate({ date: row.createdAt })
			},
      handleCatImgSuccess(res, file) {
				this.categoryObj.img = res.data[0].url
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
	}
</script>

<style>
	.category-container {
		width: 100%;
		padding: 20px 20px;
	}

	.category-img {
		width: 50px;
		height: 50px;
	}

	.category-uploader-con {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

  .category-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .category-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .category-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 80px;
    height: 80px;
    line-height: 80px;
    text-align: center;
  }
  .avatar {
    width: 80px;
    height: 80px;
    display: block;
  }
</style>