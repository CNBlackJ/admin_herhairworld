<template>
	<div class="table-container">
		<el-table
			v-loading="isLoading"
			element-loading-text="拼命加载中"
			element-loading-spinner="el-icon-loading"
			element-loading-background="hsla(0,0%,100%,.9)"
			:data="products"
			@expand-change="handleExpand"
			style="width: 100%">
			<el-table-column type="expand">
				<template slot-scope="props">
					<addProdForm></addProdForm>
				</template>
			</el-table-column>
			<el-table-column
				type="index"
				width="50">
			</el-table-column>
			<el-table-column
				show-overflow-tooltip
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
				:formatter="formatPrice"
				label="价格 ($)">
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
	import { mapGetters, mapState } from 'vuex'
	import _ from 'lodash'

	import product from '@/apis/product'
	import category from '@/apis/category'

	import addProdForm from '@/components/admin/addProdForm'

	export default {
		components: {
			addProdForm
		},
		computed: {
			...mapGetters ({
				imgs: 'product/imgs',
				detailImgs: 'product/detailImgs'
			}),
			...mapState({
				products: state => state.product.products,
				isSort: state => state.product.isSort,
				categories: state => state.category.categories
			})
		},
		data() {
			return {
				isLoading: false
			}
		},
		async created () {
			this.isLoading = true
			await this.$store.dispatch('product/listProducts', { sort: 'index' })
			this.isLoading = false
		},
		methods: {
			async handleExpand (row, expandedRows) {
				this.$store.commit('product/SET_IS_EDIT', true)
				this.$store.commit('product/SET_EDIT_PRODUCT_ID', row._id)
				this.$store.commit('uploadImgs/SET_IMGS', row.imgs)
				this.$store.commit('uploadImgs/STE_DETAIL_IMGS', row.detailImgs.product)
				await this.$store.dispatch('category/setCategories', { sort: 'index' })
				if(expandedRows.length > 1){
          expandedRows.shift()
        }
			},
			formatCategory (row, column) {
				return row.category.name
			},
			formatPrice (row, column) {
				const { customizePrice } = row
				let price = ''
				if (customizePrice.length) {
					const allPrice =  _.orderBy([...customizePrice].map(ele => ele.price))
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