<template>
  <div class='menu'>
    <Card>
      <Row style='padding-bottom: 12px'>
        <Button @click='addMenu' type='primary' icon='md-add' style='margin-right: 6px'>添加子节点</Button>
        <Button @click='addRootMenu' type='primary' icon='md-add' style='margin-right: 6px'>添加顶部菜单</Button>
        <Button @click='delAll' type='error' icon='md-trash'>批量删除</Button>
      </Row>
      <tree-table :data='this.tableData' :columns='columns'
        :border='props.border'
        :stripe='props.stripe'
        :show-header='props.showHeader'
        :show-row-hover='props.showRowHover'
        :show-index='props.showIndex'
        :is-fold='props.isFold'
        :treeType='props.treeType'
        :expand-type='props.expandType'
        :selection-type='props.selectionType'>
      >
        <template slot-scope='{ row }' slot='icon'>
          <Icon :type='row.icon' size='20'></Icon>
        </template>
        <template slot-scope='{ row }' slot='is_show'>
          <Badge status='success' text='显示' v-if='row.is_show'></Badge>
          <Badge status='error' text='隐藏' v-else></Badge>
        </template>
        <template slot-scope='{ row }' slot='is_frame'>
          <Badge status='success' text='是' v-if='row.is_frame'></Badge>
          <Badge status='error' text='否' v-else></Badge>
        </template>
        <template slot='action' slot-scope='scope'>
          <Button size='small' type='primary' @click='handleCreateSub(scope.row)' icon='ios-create-outline'>添加子节点</Button>
          <Button size='small' type='info' @click='handleEditSub(scope.row)' icon='md-list-box' style='margin-left: 5px'>编辑</Button>
          <Button size='small' type='error' @click='(scope.row)' icon='md-trash' style='margin-left: 5px'>删除</Button>
        </template>
      </tree-table>
<!--      <tree-table :data='data' :expand-all='true' :columns='columns' border></tree-table>-->
    </Card>
    <Modal draggable :mask-closable='false' :width='500' v-model='menuModal' :title='modalTitle' @on-cancel='menuCancel'>
      <Form ref='menuForm' :model='menuForm' :label-width='120' :rules='ruleMenu' label-colon>
<!--        <div v-if='showParent'>-->
<!--          <FormItem label='上级节点:'>{{ parentTitle }}</FormItem>-->
<!--        </div>-->
<!--        <FormItem label="父组件" prop="parent" v-if="this.pid !== null">-->
          <!--          <Input v-model="menuForm.parent"></Input>-->
          <!--        </FormItem>-->
        <FormItem label="父组件" prop="pid" v-if="this.modalTitle === '添加菜单'">
          <Icon :type='this.pidIcon' size='20' style="margin-right: 5px"></Icon>{{ pidName }}
          <InputNumber v-model="menuForm.pid" style="display: none"></InputNumber>
        </FormItem>
        <FormItem label="父组件" prop="pid" v-else>
          <treeselect v-model="menuForm.pid" :options="menuTree" :expand-all="true" placeholder="请选择上级菜单"></treeselect>
        </FormItem>
        <FormItem label='名称' prop='name'>
          <Input v-model='menuForm.name'></Input>
        </FormItem>
        <FormItem label='路径' prop='path'>
          <Tooltip placement="right" :max-width="230" transfer content="填写后台请求URL, 如:system">
            <Input v-model='menuForm.path' />
          </Tooltip>
        </FormItem>
        <FormItem label='组件地址' prop='component'>
          <Tooltip placement="right" :max-width="200" transfer content="填写组件所在路径, 如:view/personnel/user">
            <Input v-model='menuForm.component'></Input>
          </Tooltip>
        </FormItem>
<!--        <FormItem label='图标' prop='icon'>-->
<!--          <Input v-model='menuForm.icon'></Input>-->
<!--        </FormItem>-->
        <FormItem label="图标" prop="icon" >
          <icon-choose v-model="menuForm.icon"></icon-choose>
        </FormItem>
        <FormItem label='排序' prop='sort'>
          <InputNumber v-model='menuForm.sort'></InputNumber>
        </FormItem>
        <Row>
          <Col span='12'>
            <FormItem label='外部链接' prop='outside'>
              <i-switch size='large' :true-value='0' :false-value='-1'>
                <span slot='open'>是</span>
                <span slot='close'>否</span>
              </i-switch>
            </FormItem>
          </Col>
          <Col span='12'>
            <FormItem label='始终显示' prop='showAlways'>
              <i-switch size='large' v-model='menuForm.is_show'>
                <span slot='open'>是</span>
                <span slot='close'>否</span>
              </i-switch>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot='footer'>
        <Button @click='menuCancel'>取消</Button>
        <Button type='primary' @click='handleAddMenu' v-if="modalTitle === '添加菜单'">提交</Button>
        <Button type="primary" @click="handleUpdateMenu" v-else>修改</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import TreeTable from '_c/tree-table/Table/Table'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { getMenuList, getMenuTree, createMenu, updateMenu } from '../../../api/personnel/menu';
import IconChoose from '_c/xboot/icon-choose'

export default {
  name: 'menu_table',
  components: { TreeTable, IconChoose, Treeselect },
  data () {
    return {
      props: {
        stripe: true,
        border: true,
        showHeader: true,
        showRowHover: true,
        showIndex: false,
        treeType: true,
        isFold: true,
        expandType: false,
        selectionType: true
      },
      type: 'create',
      pidName: '',
      pidIcon: '',
      tableData: [],
      menuTree: [],
      modalTitle: '添加菜单',
      menuModal: false,
      showParent: false,
      parentTitle: '',
      menuForm: {
        name: '',
        path: '',
        component: '',
        pid: 0,
        icon: '',
        sort: 0,
        is_show: true
      },
      ruleMenu: {
        name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
        path: [{ required: true, message: '路径不能为空', trigger: 'blur' }],
        component: [{ required: true, message: '前端组件不能为空', trigger: 'blur' }],
        icon: [{ required: true, message: '图标名称不能为空', trigger: 'blur' }],
        sort: [{ required: true, type: 'number', message: '排序号不能为空', trigger: 'blur' }]
      },
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
      ],
      menuAdd: {}
    }
  },
  methods: {
    addMenu () {},
    addRootMenu () {},
    delAll () {},
    handelGetMenuList () {
      getMenuList().then(
        res => {
          this.tableData = res.data.results
        }
      )
    },
    handleCreateSub (row) {
      this.pidName = row.name;
      this.pidIcon = row.icon;
      this.menuForm.pid = row.id;
      this.menuModal = true
    },
    handleEditSub (row) {
      this.modalTitle = '编辑菜单';
      this.menuModal = true;
      // this.menuForm.id = row.id;
      // this.menuForm.icon = row.icon;
      // this.menuForm.component = row.component;
      // this.menuForm.is_show = row.is_show;
      // this.menuForm.path = row.path;
      // this.menuForm.sort = row.sort;
      // this.menuForm.name = row.name;
      this.menuForm = row;
      this.menuForm.pid = parseInt(row.pid)
    },
    menuCancel () {
      this.$refs['menuForm'].resetFields();
      this.pidName = '';
      this.pidIcon = '';
      this.menuModal = false
    },
    handleAddMenu () {
      createMenu(this.menuForm).then(
        res => {
          this.$Message.success({ background: true, content: `新增${this.menuForm.name}成功`, closable: true, duration: 5 });
          this.$refs['menuForm'].resetFields();
          this.handelGetMenuList();
          this.pidName = '';
          this.pidIcon = '';
          this.menuModal = false
        }
      )
    },
    handleGetMenuTree () {
      getMenuTree().then(
        res => {
          this.menuTree = res.data
        }
      )
    },
    handleUpdateMenu () {
      const { id, ...params } = this.menuForm;
      updateMenu(id, params).then(
        res => {
          this.$Message.success({ background: true, content: `修改${params.name}成功`, closable: true, duration: 5 });
          this.$refs['menuForm'].resetFields();
          this.handelGetMenuList();
          this.pidName = '';
          this.pidIcon = '';
          this.menuModal = false
        }
      )
    }
  },
  created () {
    this.handelGetMenuList();
    this.handleGetMenuTree()
  }
}
</script>
<style lang='less'>
  @import './menu.less';
</style>
