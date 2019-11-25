<template>
  <div>
    <div style="padding-bottom: 10px">
      <Button type="primary" @click="handleCreateRootModal">新增根权限</Button>
    </div>
    <tree-table :data='this.permissionList' :columns='columns'
                :border='props.border'
                :stripe='props.stripe'
                :show-header='props.showHeader'
                :show-row-hover='props.showRowHover'
                :show-index='props.showIndex'
                :is-fold='props.isFold'
                :treeType='props.treeType'
                :expand-type='props.expandType'
                :selectable='props.selectable'>
      >
      <template slot="action" slot-scope="scope">
        <Button size='small' type='primary' icon='ios-create-outline' style='margin-left: 5px' @click="handleCreateModal(scope.row)" v-if="!!scope.row.children || scope.row.pid === null">添加</Button>
        <Button size='small' type='info' icon='md-list-box' style='margin-left: 5px' @click="handleUpdateModal(scope.row)">编辑</Button>
        <Poptip confirm transfer width="250"
            @on-ok="handleDeletePermission(scope.row)"
            @on-cancel="permissionCancel"
            @on-popper-show="showName(scope.row)">
          <div slot="title">你确定要删除方法:{{ deleteName }}吗?</div>
          <Tooltip content="下级权限方法关联时不能删除" placement="top" transfer>
            <Button size='small' type='error'  icon='md-trash' style='margin-left: 5px' :disabled="!!scope.row.children">删除</Button>
          </Tooltip>
        </Poptip>
      </template>
    </tree-table>
    <Modal draggable :mask-closable="false" :width="500" v-model="permissionModal" :title="permissionTitle" @on-cancel="permissionCancel">
      <Form ref="permissionForm" :model="permissionForm" :label-width="85" :rules="rulePermission" label-colon>
        <FormItem label="模块名称" prop="pid" v-if="permissionTitle === '添加权限方法' || type === 'create'">
          <span style="margin-top: 3px">{{ parentName }}</span>
          <Input v-model="permissionForm.pid" style="display: none"></Input>
        </FormItem>
        <FormItem label="模块名称" prop="pid" v-else-if="type === 'edit' && permissionForm.pid !== null">
          <treeselect v-model="permissionForm.pid" :options="permissionTree"
                      :expand-all="true" placeholder="请选择模块名称"></treeselect>
        </FormItem>
        <FormItem label="名称" prop="name">
          <Input v-model="permissionForm.name" placeholder="请输入名称" clearable></Input>
        </FormItem>
        <FormItem label="方法" prop="method">
          <Select v-model="permissionForm.method" clearable placeholder="请选择一个方法">
            <Option v-for="item in nameList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click='permissionCancel'>取消</Button>
        <Button type='primary' @click='handleAddPermission' v-if="permissionTitle === '添加权限方法' || permissionTitle === '添加根权限'">提交</Button>
        <Button type="primary" @click="handleUpdatePermission" v-else>修改</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import TreeTable from '_c/tree-table/Table/Table'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { getPermission, getPermissionTree, createPermission, updatePermission, deletePermission } from '../../../api/personnel/permission';

export default {
  name: 'permission',
  components: { TreeTable, Treeselect },
  data () {
    return {
      props: {
        stripe: false,
        border: true,
        showHeader: true,
        showRowHover: true,
        showIndex: false,
        treeType: true,
        isFold: false,
        expandType: false,
        selectable: false
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
          title: '方法',
          slot: 'method',
          key: 'method',
          minWidth: '200px',
          align: 'center',
          headerAlign: 'center'
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
      nameList: [
        {
          value: 'all',
          label: '顶层目录'
        },
        {
          value: 'view',
          label: '查看'
        },
        {
          value: 'add',
          label: '增加'
        },
        {
          value: 'edit',
          label: '编辑'
        },
        {
          value: 'delete',
          label: '删除'
        }
      ],
      permissionModal: false,
      permissionTitle: '',
      type: 'create',
      deleteName: '',
      parentName: '',
      permissionList: [],
      permissionTree: [],
      permissionForm: {
        name: '',
        method: '',
        pid: null
      },
      rulePermission: {
        name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
        method: [{ required: true, message: '必须选择一项方法', trigger: 'change' }]
      }
    }
  },
  methods: {
    handleGetPermissionList () {
      getPermission().then(
        res => {
          this.permissionList = res.data
        }
      )
    },
    handleGetPermissionTree () {
      getPermissionTree().then(
        res => {
          this.permissionTree = res.data
        }
      )
    },
    handleCreateModal (value) {
      this.type = 'create';
      this.permissionModal = true;
      this.permissionTitle = '添加权限方法';
      this.permissionForm.pid = value.id;
      this.parentName = value.name
    },
    handleUpdateModal (value) {
      this.type = 'edit';
      this.permissionModal = true;
      this.permissionTitle = `编辑${value.name}`;
      this.permissionForm = value;
      this.permissionForm.pid = value.pid
    },
    handleDeletePermission (value) {
      const { id, ...params } = value;
      deletePermission(id, params).then(
        res => {
          this.$Message.success({ background: true, content: `删除${params.name}成功`, closable: true, duration: 5 });
          this.handleGetPermissionList()
        }
      )
    },
    permissionCancel () {
      this.$refs['permissionForm'].resetFields();
      this.permissionModal = false;
      this.permissionTitle = '';
      this.handleGetPermissionList()
    },
    showName (value) {
      this.deleteName = value.name
    },
    handleAddPermission () {
      createPermission(this.permissionForm).then(
        res => {
          this.$Message.success({ background: true, content: `新增${this.permissionForm.name}成功`, closable: true, duration: 5 });
          this.$refs['permissionForm'].resetFields();
          this.permissionTitle = '';
          this.permissionModal = false;
          this.handleGetPermissionList()
        }
      )
    },
    handleUpdatePermission () {
      const { id, ...params } = this.permissionForm;
      updatePermission(id, params).then(
        res => {
          this.$Message.success({ background: true, content: `修改${params.name}成功`, closable: true, duration: 5 });
          this.$refs['permissionForm'].resetFields();
          this.permissionTitle = '';
          this.permissionModal = false;
          this.handleGetPermissionList()
        }
      )
    },
    handleCreateRootModal () {
      this.type = 'createRoot';
      this.permissionModal = true;
      this.permissionTitle = '添加根权限';
    }
  },
  created () {
    this.handleGetPermissionList();
    this.handleGetPermissionTree()
  }
}
</script>
<style scoped>

</style>
