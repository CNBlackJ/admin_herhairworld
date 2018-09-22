<template>
	<div class="admin-index-con">
		<el-row>
			<el-col
				v-for="(showCard, i) in showCardInfos"
				:key="showCard.title"
				:span="7"
				:offset="i > 0 ? 1 : 0">
				<showCard :showCardInfo="showCard">
				</showCard>
			</el-col>
		</el-row>

		<el-row>
			<el-col :span="11">
				<el-card>
					<div slot="header">
						<span>
							一周销量图
						</span>
						<i class="el-icon-info" style="float: right; padding: 3px 0"></i>
					</div>
					<barChart
						:data="barChartData"
						:options="{ maintainAspectRatio: false }">
					</barChart>
				</el-card>
			</el-col>
			<el-col :span="11" :offset="1">
				<el-card>
					<div slot="header">
						<span>
							产品分类占比
						</span>
						<i class="el-icon-info" style="float: right; padding: 3px 0"></i>
					</div>
					<doughnutChart
						:data="doughnutChartData"
						:options="{ legend: { display: false }, maintainAspectRatio: false }">
					</doughnutChart>
				</el-card>
			</el-col>
		</el-row>
	</div>
</template>

<script>
	import showCard from '@/components/showCard'
	import barChart from '~/components/charts/barChart'
	import doughnutChart from '~/components/charts/doughnutChart'

	import axios from 'axios'
	import moment from 'moment'

	export default {
		layout: 'admin',
		components: {
			showCard,
			barChart,
			doughnutChart
		},
		async asyncData({ env }) {
			return {
				barChartData: {
					labels: [ '09-01', '09-02', '09-03', '09-04', '09-05', '09-06', '09-07' ],
					datasets: [
						{
							label: '过去七天销量',
							backgroundColor: '#dd127b',
							data: [ 100, 300, 600, 300, 250, 180, 333 ]
						}
					]
				},
				doughnutChartData: {
					labels: [ 'Lace Wigs', 'Closure', 'Frontal', 'Hair Extension' ],
					datasets: [
						{
							label: '产品分类占比',
							backgroundColor: ['#dd127b', 'red', 'blue', 'hotPink'],
							data: [ 200, 300, 500, 240 ]
						}
					]
				}
			}
		},
		data () {
			return {
				showCardInfos: [
					{ title: '总销售额', center: '$ 999,999.00' },
					{ title: '总订单数', center: '999' },
					{ title: '总访问量', center: '99999' }
				]
			}
		}
	}
</script>

<style>
	.admin-index-con .el-row {
		margin-bottom: 20px;
	}
</style>