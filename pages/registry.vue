<template>
	<div class="admin-registry-container">
		<el-row>
			<el-col :span="6" :offset="8">
				<div class="form-title">
					注 册
				</div>
				<el-form label-position="left" :model="adminRegistryForm" :rules="adminRegistryFormRules" ref="adminRegistryForm">
					<el-form-item label="用户名" prop="username">
						<el-input
							v-model="adminRegistryForm.username"></el-input>
					</el-form-item>
					<el-form-item label="密码" prop="password">
						<el-input
							type="password"
							v-model="adminRegistryForm.password"></el-input>
					</el-form-item>
					<el-form-item label="确认密码" prop="checkPass">
						<el-input type="password" v-model="adminRegistryForm.checkPass" autocomplete="off"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="adminRegistry">立即注册</el-button>
					</el-form-item>
				</el-form>
			</el-col>
		</el-row>
	</div>
</template>

<script>
	import adminUser from '@/apis/adminUser'

	export default {
		data () {
			const validatePsw = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.adminRegistryForm.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      }
			return {
				adminRegistryForm: {
					username: '',
					password: '',
					checkPass: ''
				},
				adminRegistryFormRules:{
					username: [
						{ required: true, message: '请输入用户名', trigger: 'blur' },
					],
					password: [
						{ required: true, message: '请输入密码', trigger: 'blur' }
					],
          checkPass: [
            { validator: validatePsw, trigger: 'blur' }
          ],
				}
			}
		},
		methods: {
			async adminRegistry () {
				this.$refs['adminRegistryForm'].validate(async (valid) => {
          if (valid) {
						const { username, password } = this.adminRegistryForm
						const newUser = { username, password }
						await adminUser.create(newUser)
						this.$router.push('/login')
          } else {
            console.log('error submit!!')
            return false
          }
        })
			}
		}
	}
</script>

<style>
	.admin-registry-container {
		position: absolute;
		width: 100%;
		top: 50%;
		left: 50%;
		-webkit-transform: translate(-50%, -50%);
		-moz-transform: translate(-50%, -50%);
		-ms-transform: translate(-50%, -50%);
		-o-transform: translate(-50%, -50%);
		transform: translate(-50%, -50%);
	}
	
	body {
		background-color: #909399;
	}

	.form-title {
		color: #606266;
		text-align: center;
		width: 100%;
		font-size: 32px;
	}
</style>