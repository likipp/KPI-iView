<template>
  <div class='menu'>
    <Card>
      <Row style="padding-bottom: 12px">
        <Button @click='addMenu' type='primary' icon='md-add' style='margin-right: 6px'>添加子节点</Button>
        <Button @click='addRootMenu' type='primary' icon='md-add' style='margin-right: 6px'>添加顶部菜单</Button>
        <Button @click='delAll' type='error' icon='md-trash'>批量删除</Button>
      </Row>
      <tree-table :data="this.tableData" :columns="columns"
        :border="props.border"
        :stripe="props.stripe"
        :show-header="props.showHeader"
        :show-row-hover="props.showRowHover"
        :show-index="props.showIndex"
        :is-fold="props.isFold"
        :treeType="props.treeType"
        :expand-type="props.expandType"
        :selection-type="props.selectionType">
      >
        <template slot-scope="{ row }" slot="icon">
          <Icon :type="row.icon" size="20"></Icon>
        </template>
        <template slot-scope="{ row }" slot="is_show">
          <Badge status="success" text="显示" v-if="row.is_show"></Badge>
          <Badge status="error" text="隐藏" v-else></Badge>
        </template>
        <template slot-scope="{ row }" slot="is_frame">
          <Badge status="success" text="是" v-if="row.is_frame"></Badge>
          <Badge status="error" text="否" v-else></Badge>
        </template>
        <template slot="action" slot-scope="scope">
          <Button size="small" type="primary" @click="click(scope.row)" icon="ios-create-outline">添加子节点</Button>
          <Button size="small" type="info" @click="click(scope.row)" icon="md-list-box" style="margin-left: 5px">编辑</Button>
          <Button size="small" type="error" @click="click(scope.row)" icon="md-trash" style="margin-left: 5px">删除</Button>
        </template>
      </tree-table>
<!--      <tree-table :data='data' :expand-all='true' :columns='columns' border></tree-table>-->
    </Card>
  </div>
</template>
<script>
import TreeTable from '_c/tree-table/Table/Table'
import { getMenuList } from '../../../api/personnel/menu';

export default {
  name: 'menu_table',
  components: { TreeTable },
  data () {
    return {
      props: {
        stripe: true,
        border: true,
        showHeader: true,
        // showSummary: false,
        showRowHover: true,
        showIndex: false,
        treeType: true,
        isFold: true,
        expandType: false,
        selectionType: true
      },
      tableData: [],
      columns: [
        {
          title: '名称',
          slot: 'name',
          key: 'name',
          minWidth: '200px',
          align: 'center',
          headerAlign: 'center'
        },
        {
          title: '图标',
          type: 'template',
          template: 'icon',
          minWidth: '200px',
          align: 'center',
          headerAlign: 'center'
        },
        {
          title: '排序',
          key: 'sort',
          align: 'center',
          headerAlign: 'center'
        },
        {
          title: '链接地址',
          key: 'path',
          width: '100px',
          align: 'center',
          headerAlign: 'center'
        },
        {
          title: '组件路径',
          key: 'component',
          align: 'center',
          headerAlign: 'center',
          minWidth: '200px',
          width: '300px'
        },
        {
          title: '是否显示',
          type: 'template',
          template: 'is_show',
          align: 'center',
          headerAlign: 'center'
        },
        {
          title: '是否外部链接',
          type: 'template',
          template: 'is_frame',
          align: 'center',
          headerAlign: 'center',
          width: '100px'
        },
        {
          title: '操作',
          fixed: 'right',
          align: 'center',
          headerAlign: 'center',
          type: 'template',
          template: 'action',
          width: '450px'
        }
      ]
    }
  },
  methods: {
    addMenu () {},
    addRootMenu () {},
    delAll () {},
    handelGetMenuList () {
      getMenuList().then(
        res => {
          console.log(res.data.results)
          this.tableData = res.data.results
          // console.log(this.tableData, 6666)
        }
      )
    }
  },
  created () {
    this.handelGetMenuList()
  }
}
</script>
<style lang='less'>
  @import './menu.less';
</style>
