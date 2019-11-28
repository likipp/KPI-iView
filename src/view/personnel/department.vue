<template>
  <div>
<!--    <depTable :list=this.depList></depTable>-->
    <Card>
      <div style="padding-bottom: 10px">
        <Button v-has="'delete'" style="margin-right:8px;" type="error">
          <Icon type="ios-trash-outline" size="15" style="margin-bottom: 3px"></Icon>删除</Button>
        <Button v-has="'add'" style="float:right" type="primary" @click="createButton">
          <Icon type=" iconfont icon-jurassic_add-user" size="15" ></Icon>新增部门</Button>
      </div>
      <Table :data="this.depList" :columns="columns" :loading="this.loading" border stripe></Table>
    </Card>
    <Modal width="800" :title="type === 'create' ? '增加部门' : '修改部门'" draggable
           scrollable v-model="modal" @on-cancel="cancel">
      <Form ref="depForm" :model="depForm" :label-width="80" :rules="ruleDepForm" label-colon>
        <Row>
          <Col>
            <FormItem label="名称" prop="name">
              <Input v-model="depForm.name" placeholder="请输入部门名称"></Input>
            </FormItem>
          </Col>
          <Col>
            <FormItem label="类型" prop="type">
              <Select v-model="depForm.type">
                <Option value="company">公司</Option>
                <Option value="department">部门</Option>
              </Select>
            </FormItem>
          </Col>
          <Col>
            <FormItem label="上级部门" prop="pid">
              <treeselect v-model="depForm.pid" :options="depTree" :expand-all="true" placeholder="请选择上级部门"></treeselect>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot="footer">
        <Button @click="cancel">取消</Button>
        <Button type="primary" @click="handelCreateDep" v-if="type === 'create'">确定</Button>
        <Button type="primary" @click="handelUpdateDep" v-else>修改</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { getDepList, deleteDep, createDep, updateDep } from '@/api/personnel/department'
import { Button, Poptip } from 'view-design'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { getOrganizationTree } from '@/api/personnel/organizationtree'
import { checkInclude } from '../../libs/validate';
// import { checkInclude } from '/src/libs/validate'
// import depTable from '_c/department/dep-table'

export default {
  name: 'department',
  // components: {
  //   depTable
  // },
  components: { Treeselect },
  data () {
    return {
      permTypes: [],
      depList: [],
      depTree: [],
      loading: false,
      type: 'create',
      modal: false,
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '序号',
          type: 'index',
          align: 'center',
          key: 'id',
          width: '100px',
          sortable: true
        },
        {
          title: '名称',
          key: 'name',
          align: 'center',
          render: (h, { row }) => {
            return h('Span', {}, row.name)
          }
        },
        {
          title: '类别',
          key: 'type',
          align: 'center',
          render: (h, { row }) => {
            if (row.type === 'company') {
              return h('Tag', { props: { color: '#17233d' } }, '公司')
            } else {
              return h('Tag', { props: { color: '#515a6e' } }, '部门')
            }
          }
        },
        {
          title: '操作',
          align: 'center',
          render: (h, params) => {
            if (this.permTypes.includes('edit') && this.permTypes.includes('delete')) {
              console.log(checkInclude(this.permTypes, ['edit', 'delete']), '我是结果判断')
              return h('Div', [
                h(Button, {
                  props: {
                    type: 'primary',
                    size: 'small',
                    icon: 'ios-create-outline'
                  },
                  on: {
                    click: () => {
                      this.handelGetTree();
                      this.type = 'edit';
                      this.modal = true;
                      // 直接写=params.row 效果双向绑定一样.
                      // this.depForm = params.row
                      this.depForm.id = params.row.id;
                      this.depForm.name = params.row.name;
                      this.depForm.type = params.row.type;
                      this.depForm.pid = params.row.pid
                    }
                  },
                  style: { marginRight: '12px' }
                }, '修改'),
                h(Poptip, {
                  props: {
                    confirm: true,
                    transfer: true,
                    placement: 'left-start',
                    title: `确定要删除${params.row.name}吗?`,
                    type: 'error',
                    size: 'small',
                    width: '300',
                    vModel: true
                  },
                  on: {
                    'on-ok': () => {
                      this.handelDeleteDep(params.row)
                    },
                    'on-cancel': () => {
                      this.$Message.info({ background: true, content: '点击了取消', duration: 3 })
                    }
                  }
                }, [
                  h(Button, {
                    props: {
                      type: 'error',
                      size: 'small',
                      icon: 'ios-trash-outline'
                    }
                  }, '删除')
                ])
              ])
            } else if (this.permTypes.includes('delete')) {
              return h('Div', [
                h(Poptip, {
                  props: {
                    confirm: true,
                    transfer: true,
                    placement: 'left-start',
                    title: `确定要删除${params.row.name}吗?`,
                    type: 'error',
                    size: 'small',
                    width: '300',
                    vModel: true
                  },
                  on: {
                    'on-ok': () => {
                      this.handelDeleteDep(params.row)
                    },
                    'on-cancel': () => {
                      this.$Message.info({ background: true, content: '点击了取消', duration: 3 })
                    }
                  }
                }, [
                  h(Button, {
                    props: {
                      type: 'error',
                      size: 'small',
                      icon: 'ios-trash-outline'
                    }
                  }, '删除')
                ])
              ])
            } else if (this.permTypes.includes('edit')) {
              return h('Div', [
                h(Button, {
                  props: {
                    type: 'primary',
                    size: 'small',
                    icon: 'ios-create-outline'
                  },
                  on: {
                    click: () => {
                      this.handelGetTree();
                      this.type = 'edit';
                      this.modal = true;
                      // 直接写=params.row 效果双向绑定一样.
                      // this.depForm = params.row
                      this.depForm.id = params.row.id;
                      this.depForm.name = params.row.name;
                      this.depForm.type = params.row.type;
                      this.depForm.pid = params.row.pid
                    }
                  },
                  style: { marginRight: '12px' }
                }, '修改')])
            } else {
              return h('Span', { props: { color: '#17233d' } }, '当前权限只供查看')
            }
          }
        }
      ],
      depForm: {
        name: '',
        type: 'department',
        pid: null
      },
      ruleDepForm: {
        name: [{ required: true, message: '部门名称不能为空', trigger: 'blur' }],
        type: [{ required: true, message: '部门类型不能为空', trigger: 'blur' }]
      }
    }
  },
  methods: {
    initMeta () {
      let permTypes = this.$route.meta.permTypes;
      if (permTypes !== null && permTypes !== undefined) {
        this.permTypes = permTypes
      }
    },
    handelGetTree () {
      getOrganizationTree().then(
        res => {
          this.depTree = res.data
        }
      )
    },
    handelGetDepList () {
      if (this.loading) return;
      this.loading = true;
      getDepList().then(
        res => {
          this.depList = res.data.results;
          this.loading = false
        }
      )
    },
    createButton () {
      this.modal = true;
      this.handelGetTree()
    },
    handelDeleteDep (value) {
      const { id, ...params } = value;
      deleteDep(id, params).then(
        res => {
          this.loading = false;
          this.$Message.success({ background: true, content: `删除部门${params.name}成功`, closable: true, duration: 5 });
          this.handelGetDepList()
        }
      )
    },
    handelCreateDep () {
      this.handelGetTree();
      createDep(this.depForm).then(
        res => {
          this.modal = false;
          this.$refs['depForm'].resetFields();
          this.handelGetDepList();
          this.$Message.success({ background: true, content: `新增${this.depForm.name}成功!`, closable: true, duration: 5 });
        }
      )
    },
    handelUpdateDep () {
      const { id, ...data } = this.depForm;
      updateDep(id, data).then(
        res => {
          this.modal = false;
          this.$refs['depForm'].resetFields();
          this.handelGetDepList();
          this.$Message.success({ background: true, content: `修改${data.name}成功!`, closable: true, duration: 5 });
        }
      )
    },
    cancel () {
      this.modal = false;
      this.$Message.info({ background: true, content: '取消操作', closable: true, duration: 5 });
      this.$refs['depForm'].resetFields()
    }
  },
  created () {
    this.handelGetDepList();
    this.handelGetTree();
    this.initMeta()
  }
}
</script>
