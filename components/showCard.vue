<template>
	<div class="show-card-container">
		<el-card>
			<div slot="header">
				<span>
					{{showCardInfo.title}}
				</span>
				<i class="el-icon-info" style="float: right; padding: 3px 0"></i>
			</div>
			<div>
				<el-row class="show-card-center">
					{{showCardInfo.center}}
				</el-row>

				<el-row>
					<el-col :span="11">
						<el-date-picker
							v-model="dateScore.start"
							type="date"
							placeholder="选择日期"
							style="width: 100%;">
						</el-date-picker>
					</el-col>
					<el-col style="text-align: center" :span="2">-</el-col>
					<el-col :span="11">
							<el-date-picker
							v-model="dateScore.end"
							type="date"
							placeholder="选择日期"
							style="width: 100%;">
						</el-date-picker>
					</el-col>
				</el-row>
			</div>
		</el-card>
	</div>
</template>

<script>
	export default {
		props: [
			'showCardInfo'
		],
		data () {
			return {
				dateScore: {
					start: '',
					end: ''
				}
			}
		}
	}
</script>

<style>
	.show-card-center {
		margin-bottom: 20px;
		font-size: 24px;
	}
</style>