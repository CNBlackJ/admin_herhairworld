<template>
	<div class="table-container">
		<el-table
			:data="products"
			style="width: 100%">
			<el-table-column type="expand">
				<template slot-scope="props">
					<addProdForm
						:isEdit=true
						:prodId="props.row._id"
						:categories="categories"></addProdForm>
				</template>
			</el-table-column>
			<el-table-column
			  sortable
        prop="name"
        label="名称">
			</el-table-column>
			<el-table-column
			sortable
        prop="color"
        label="颜色">
			</el-table-column>
			<el-table-column
			  sortable
        :formatter="formatPrice"
        label="价格 ($)">
			</el-table-column>
			<el-table-column
			  sortable
        prop="quantity"
        label="库存数 (件)">
			</el-table-column>
			<el-table-column
			  :formatter="formatLen"
        label="长度 (cm)">
			</el-table-column>
      <el-table-column
        :formatter="formatCategory"
        label="类别">
			</el-table-column>
			<el-table-column label="状态">
				<template slot-scope="props">
					<el-tag size="small" :type="props.row.online ? 'default' : 'warning'">
						{{ props.row.online ? '上线' : '下线'  }}
					</el-tag>
					<el-tag size="small" :type="props.row.quantity > 10 ? 'success' : 'danger'">
						{{ props.row.quantity > 10 ? '库存充足' : '库存不足'  }}
					</el-tag>
				</template>
			</el-table-column>
		</el-table>
	</div>
</template>

<script>
	import { mapState } from 'vuex'
	import _ from 'lodash'

	import product from '@/apis/product'
	import category from '@/apis/category'

	import addProdForm from '@/components/admin/addProdForm'

	export default {
		components: {
			addProdForm
		},
		computed: mapState({
			products: state => state.product.products
		}),
		data() {
			return {
				categories: []
			}
		},
		async created () {
			await this.$store.dispatch('product/listProducts')
			this.categories = await category.list({})
		},
		methods: {
			formatWeight (row, column) {
				return `${row.minWeight} - ${row.maxWeight}`
			},
			formatLen (row, column) {
				let length = ''
				if (row.lengths.length) {
					const allLengths = [...row.lengths].map(ele => ele.len).sort()
					length = `${allLengths[0]} - ${allLengths.pop()}`
				}
				return length
			},
			formatCategory (row, column) {
				return row.category.name
			},
			formatPrice (row, column) {
				const { lengths } = row
				let price = ''
				if (lengths.length) {
					const allPrice =  _.sortedUniq([...lengths].map(ele => ele.price))
					price = `${allPrice[0].toFixed(2)} - ${allPrice.pop().toFixed(2)}`
				}
				return price
			}
		}
	}
</script>

<style>
	.table-container {
		width: 100%;
	}

  .prod-table-expand label {
    width: 90px;
    color: #99a9bf;
  }

  /* .prod-table-expand {
    font-size: 0;
  }

  .prod-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  } */
</style>