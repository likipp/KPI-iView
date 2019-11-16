<template>
  <div class='menu'>
    <Card>
      <Row>
        <Button @click='addMenu' type='primary' icon='md-add' style='margin-right: 6px'>添加子节点</Button>
        <Button @click='addRootMenu' type='primary' icon='md-add' style='margin-right: 6px'>添加顶部菜单</Button>
        <Button @click='delAll' type='error' icon='md-trash'>批量删除</Button>
      </Row>
      <tree-table :data="this.tableData" :columns="columns" :expand-type="props.expandType"></tree-table>
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
        // stripe: false,
        // border: false,
        // showHeader: true,
        // showSummary: false,
        // showRowHover: true,
        // showIndex: false,
        // treeType: true,
        // isFold: true,
        expandType: false
        // selectionType: false,
      },
      tableData: [],
      //
      // tableData: [
      //   {
      //     title: '部门管理',
      //     icon: 'ios-analytics',
      //     order: 100,
      //     path: '/main',
      //     component: '/component/main',
      //     show: true
      //   }
      // ],
      columns: [
        {
          title: '名称',
          key: 'name',
          minWidth: '200px',
          // render: (h, { row }) => {
          //   return h('Span', {}, row.label)
          // }
          render: (h, { row }) => {
            return h('Span', {}, row.name + '1')
          }
        },
        {
          title: '图标',
          key: 'icon',
          minWidth: '200px',
          render: (h, { row }) => {
            console.log(row, 234234)
            return h('span', { props: { icon: row.icon } }, '测试')
          }
        },
        {
          title: '排序',
          key: 'sort'
        },
        {
          title: '链接地址',
          key: 'path',
          minWidth: '200px'
        },
        {
          title: '组件路径',
          key: 'component'
        },
        {
          title: '是否显示',
          key: 'is_show',
          render: (h, { row }) => {
            return h('span', '是')
          }
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
