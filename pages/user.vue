<template>
	<div class="user-con">
			<el-table
			v-loading="isLoading"
			element-loading-text="拼命加载中"
			element-loading-spinner="el-icon-loading"
			element-loading-background="hsla(0,0%,100%,.9)"
      :data="adminUsers"
			style="width: 100%">
			<el-table-column
				type="index"
				width="50">
			</el-table-column>
      <el-table-column
        prop="username"
        label="用户名">
			</el-table-column>
			<el-table-column
				:formatter="formatRole"
        label="角色">
			</el-table-column>
			<el-table-column
        :formatter="formatDate"
        label="创建时间">
			</el-table-column>
			<el-table-column label="操作">
				<template slot-scope="scope">
					<el-button
						@click="editAdminUser(scope.$index, adminUsers)"
						size="mini">
						编辑
					</el-button>
					<el-button
						:disabled="true"
						@click="deleteAdminUser(scope.$index, adminUsers)"
						size="mini"
						type="danger">
						删除
					</el-button>
				</template>
			</el-table-column>
		</el-table>

		<el-dialog
			title="更新用户信息"
			:visible.sync="dialogVisible"
			width="30%">
			<div
				v-loading="isLoadingEdit"
				element-loading-text="拼命加载中"
				element-loading-spinner="el-icon-loading"
				element-loading-background="hsla(0,0%,100%,.9)">
				<el-form
					:inline="true"
					label-position="right"
					:model="adminUserForm"
					:rules="adminUserRules"
					ref="adminUserForm"
					label-width="80px">
					<el-form-item label="用户名" prop="username">
						<el-input :disabled="true" :value="editAdminUserInfo.username"></el-input>
					</el-form-item>
					<el-form-item label="角色" prop="role">
						<el-select v-model="adminUserForm.role" placeholder="请选择数据类型">
							<el-option label="超级管理员" value="1"></el-option>
							<el-option label="管理员" value="2"></el-option>
						</el-select>
					</el-form-item>
				</el-form>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button
					@click="dialogVisible = false">
					取 消
				</el-button>
				<el-button
					type="primary"
					@click="updateAdminUser">
					确 定
				</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
	import { mapState } from 'vuex'
	import moment from 'moment'

	export default {
		layout: 'admin',
		data () {
			return {
				isEdit: false,
				dialogVisible: false,
				isLoading: false,
				isLoadingEdit: false,
				editAdminUserInfo: {},
				roles: {
					1: '超级管理员',
					2: '管理员'
				},
				adminUserForm: {
					role: '',
					username: ''
				},
				adminUserRules: {
					username: [],
					role: [
						{ required: true, message: '请选择新的角色', trigger: 'blur' }
					]
				}
			}
		},
		computed: {
			...mapState({
				adminUsers: state => state.user.adminUserList
			})
		},
		async created () {
			this.isLoading = true
			await this.$store.dispatch('user/setAdminUserList')
			this.isLoading = false
		},
		methods: {
			formatRole (row) {
				return this.roles[row.role]
			},
			formatDate (row) {
				return moment(row.createdAt).format('YYYY-MM-DD HH:mm')
			},
			editAdminUser (index, rows) {
				const row = rows[index]
				this.isEdit = true
				this.dialogVisible = true
				this.editAdminUserInfo = row
			},
			async updateAdminUser () {
				this.isLoadingEdit = true
				this.dialogVisible = false
				const newAdminUser = {
					_id: this.editAdminUserInfo._id,
					role: this.adminUserForm.role
				}
				await this.$store.dispatch('user/updateAdminUser', newAdminUser)
				await this.$store.dispatch('user/setAdminUserList')
				this.isLoadingEdit = false
			},
			deleteAdminUser () {

			}
		}
	}
</script>