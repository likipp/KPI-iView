<style lang="less">
  @import "../../../../src/styles/table-common.less";
  @import './role.less';
</style>
<template>
<div class="search">
  <Card>
    <Row class="operation">
      <Button @click="roleModal = true" type="primary" icon="md-add">添加角色</Button>
      <Button @click="delAll" type="error" icon="md-trash">批量删除</Button>
      <Button @click="init" icon="md-refresh">刷新</Button>
    </Row>
    <Row>
      <Alert show-icon>
        已选择
        <span class="select-count">{{selectCount}}</span>项
        <a class="select-clear" @click="clearSelectAll">清空</a>
      </Alert>
    </Row>
    <Row>
      <Table :data="roleData" :columns="columns" :loading="loading" border stripe ref="table"
        @on-selection-change="changeSelect" @on-expand="expand"
      ></Table>
    </Row>
    <Row type="flex" justify="end" class="page">
<!--      <Page :page-size="getParams.page_size" :total="total" size="small" show-total show-sizer show-elevator-->
<!--            :page-size-opts="[2,10,20,50]" :current="getParams.page"-->
<!--            @on-change="changePage" @on-page-size-change="changePageSize"-->
<!--      ></Page>-->
    </Row>
  </Card>
  <Modal v-model="roleModal" :title="type === 'create' ? '增加角色' : '编辑角色'" draggable
         scrollable width="500" @on-cancel="cancel">
    <Form ref="roleForm" :model="roleForm" :rules="roleRule" :label-width="80" label-colon>
      <FormItem label="名称" prop="name">
        <Input v-model="roleForm.name"></Input>
      </FormItem>
      <FormItem label="描述" prop="desc">
        <Input v-model="roleForm.desc" type="textarea"></Input>
      </FormItem>
    </Form>
    <div slot="footer">
      <Button @click="cancel">取消</Button>
      <Button type="primary" v-if="type === 'create'"
              @click="handleCreateRole" :disabled="submitDisabled">确定</Button>
      <Button type="primary" v-else @click="handleUpdateRole" :disabled="submitDisabled">编辑</Button>
    </div>
  </Modal>
  <Modal v-model="menuModal" :title="menuTitle" :mask-closable="false" draggable
         scrollable width="500" @on-cancel="menuCancel" class="permModal">
    <div style="position: relative">
      <Tree ref="tree" :data="menuList" show-checkbox :render="renderContent" :check-directly="true"
            multiple @on-check-change="handleCheckMenu"></Tree>
    </div>
    <div slot="footer">
      <Button @click="menuCancel">取消</Button>
      <Button type="primary" @click="handleUpdateMenu">提交</Button>
    </div>
  </Modal>
  <Modal v-model="permissionModal" :title="permissionTitle" :mask-closable="false" draggable
         scrollable width="500" @on-cancel="buttonCancel">
<!--    <Form ref="permissionForm" :model="permissionForm" :label-width="80" label-colon>-->
<!--      <FormItem-->
<!--    </Form>-->
    <div style="position: relative">
      <Tree ref="permissionTree" :data="permissionList" show-checkbox :render="renderPermission" :check-directly="true"
            multiple @on-check-change="handleCheckPermission"></Tree>
    </div>
    <div slot="footer">
      <Button @click="buttonCancel">取消</Button>
      <Button type="primary" @click="handleUpdateButton">提交</Button>
    </div>
  </Modal>
</div>
</template>

<script>
import { createRole, updateRole, deleteRole, getRoleTree } from '@/api/personnel/role';
import { getMenuList } from '@/api/personnel/menu';
import { getPermissionTree } from '../../../api/personnel/permission';
import { Poptip, Button } from 'view-design';
import expandRow from './table-expand'
import { getRoleSingle } from '../../../api/personnel/role';

export default {
  name: 'role',
  components: { expandRow },
  data () {
    return {
      menuTitle: '',
      permissionTitle: '',
      loading: false,
      roleModal: false,
      menuModal: false,
      permissionModal: false,
      type: 'create',
      editIndex: -1,
      total: 0,
      roleListLasts: null,
      getParams: {
        page: 1,
        page_size: 2,
        search: ''
      },
      selectCount: 0,
      roleData: [],
      roleForm: {
        name: '',
        desc: ''
      },
      permissionForm: {},
      nodes: {},
      buttonNodes: {},
      editId: {},
      editMenuList: {},
      editPermissionId: {},
      editPermissionList: {},
      permissons: [],
      columns: [
        {
          type: 'expand',
          width: 50,
          render: (h, params) => {
            if (this.roleListLasts) {
              return h(expandRow, {
                props: {
                  row: this.roleListLasts,
                  // row: params.row,
                  button: this.permissionList,
                  handleGetRoleList: this.handleGetRoleList,
                  expand: this.expand
                }
              })
            } else {
              return h('span', '数据未获取成功')
            }
          }
        },
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '序号',
          type: 'index',
          width: 80,
          align: 'center',
          indexMethod: (row) => {
            return (row._index + 1) + (this.getParams.page * this.getParams.page_size) - this.getParams.page_size
          }
        },
        {
          title: '角色名称',
          key: 'name',
          width: 200,
          align: 'center',
          sortable: true
        },
        {
          title: '成员',
          align: 'center',
          render: (h, { row, index }) => {
            let memberList = [];
            let member;
            for (member of row.members) {
              memberList.push(h('tbody', [
                h('tr', [
                  h('td', member.id),
                  h('td', member.username),
                  h('td', member.name)
                ])
              ]))
            }
            return h('Poptip', {
              props: {
                title: '成员列表',
                trigger: 'hover',
                transfer: true,
                placement: 'right',
                width: '300',
                wordWrap: true
              }
            }, [
              h('div', {
                slot: 'content',
                class: 'm-table'
              },
              [
                h('table', { style: { borderCollapse: 'collapse' } }, [
                  h('thead', [
                    h('tr', {}, [
                      h('th', 'ID'),
                      h('th', '用户名'),
                      h('th', '姓名')
                    ])
                  ]), memberList
                ])
              ]),
              h('Badge', {
                props: {
                  count: row.members.length,
                  type: 'primary'
                }
              })
            ])
          }
        },
        {
          title: '描述',
          key: 'desc',
          minWidth: 150,
          width: 250,
          align: 'center',
          sortable: true
        },
        {
          title: '权限',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h(
                'Button',
                {
                  props: {
                    type: 'success',
                    size: 'small',
                    icon: 'md-grid'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.editPerm(params.row);
                      this.editId['id'] = params.row.id;
                      this.editId['name'] = params.row.name;
                      // this.nodes = this.$refs.tree.getCheckedNodes()
                    }
                  }
                }, '菜单权限'
              ),
              h(
                'Button',
                {
                  props: {
                    type: 'success',
                    size: 'small',
                    icon: 'md-lock'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.editButton(params.row);
                      this.editPermissionId['id'] = params.row.id;
                      this.editPermissionId['name'] = params.row.name;
                      this.buttonNodes = this.$refs.permissionTree.getCheckedNodes()
                      // this.nodes = this.$refs.tree.getCheckedNodes()
                    }
                  }
                }, '按钮权限'
              )
            ])
          }
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          fixed: 'right',
          width: 300,
          render: (h, params) => {
            return h('div', [
              h(
                'Button',
                {
                  props: {
                    type: 'primary',
                    size: 'small',
                    icon: 'ios-create-outline'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.type = 'edit';
                      this.roleModal = true;
                      this.roleForm.id = params.row.id;
                      this.roleForm.name = params.row.name;
                      this.roleForm.desc = params.row.desc;
                    }
                  }
                }, '编辑'
              ),
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
                    this.handleDeleteRole(params.row)
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
          }
        }
      ],
      roleRule: {
        name: [{ required: true, message: '名称不能为空', trigger: 'blur' }]
      },
      menuList: [],
      permissionList: [],
      renderContent: (h, { data }) => {
        let icon = '';
        let color = '';
        if (data.pid === null) {
          icon = ' iconfont icon-bumen3';
          color = '#2d8cf0'
        } else {
          icon = 'md-filing';
          color = '#19be6b'
        }
        return h('Span', {
          style: {
            width: '100%',
            display: 'inline-block',
            cursor: 'pointer'
          }
          // on: {
          //   click: () => {
          //     // data.checked = !data.checked
          //   }
          // }
        }, [
          h('Span', [
            h('Icon', {
              props: {
                type: icon,
                size: '17'
              },
              style: {
                marginRight: '8px',
                color: color
              }
            }),
            h('Span', data.name)
          ])
        ])
      },
      renderPermission: (h, { data }) => {
        //
        let icon = '';
        let color = '';
        if (data.pid === null) {
          icon = ' iconfont icon-bumen3';
          color = '#2d8cf0'
        } else {
          icon = 'md-filing';
          color = '#19be6b'
        }
        return h('Span', {
          style: {
            width: '100%',
            display: 'inline-block',
            cursor: 'pointer'
          }
          // on: {
          //   click: () => {
          //     // data.checked = !data.checked
          //   }
          // }
        }, [
          h('Span', [
            h('Icon', {
              props: {
                type: icon,
                size: '17'
              },
              style: {
                marginRight: '8px',
                color: color
              }
            }),
            h('Span', data.name)
          ])
        ])
      }
    }
  },
  methods: {
    handleGetRoleList () {
      // if (this.curPage >= this.getParams.page) {
      //   if (this.loading) return;
      //   this.loading = true;
      //   getRoleList(this.getParams).then(
      //     res => {
      //       this.roleData = res.data.results;
      //       this.total = res.data.count;
      //       this.loading = false;
      //     }
      //   )
      // } else {
      //   if (this.loading) return;
      //   this.loading = true;
      //   this.getParams.page = 1;
      //   getRoleList(this.getParams).then(
      //     res => {
      //       this.roleData = res.data.results;
      //       this.total = res.data.count;
      //       this.loading = false;
      //     }
      //   )
      // }
      getRoleTree().then(
        res => {
          this.roleData = res.data
        }
      )
    },
    init () {
      this.handleGetRoleList();
      this.handleGetMenuList();
      this.handleGetPermissionList()
    },
    delAll () {
      this.$Message.info({ background: true, content: '暂时没写', duration: 3 })
    },
    clearSelectAll () {
      this.$refs.table.selectAll(false)
    },
    changePageSize (size) {
      this.getParams.page_size = size;
      this.$nextTick(() => {
        this.handleGetRoleList()
      })
    },
    changePage (val) {
      this.getParams.page = val;
      this.handleGetRoleList();
      this.clearSelectAll()
    },
    changeSelect (val) {
      this.selectCount = val.length
    },
    cancel () {
      this.$Message.info({ background: true, content: '取消操作', closable: true, duration: 5 });
      this.roleModal = false;
      this.$refs['roleForm'].resetFields();
      this.handleGetRoleList()
    },
    handleCreateRole () {
      createRole(this.roleForm).then(
        res => {
          this.$Message.success({ background: true, content: `新增${this.roleForm.name}成功`, closable: true, duration: 5 });
          this.roleModal = false;
          this.$refs['roleForm'].resetFields();
          this.handleGetRoleList()
        }
      )
    },
    handleUpdateRole () {
      const { id, ...params } = this.roleForm;
      updateRole(id, params).then(
        res => {
          this.$Message.success({ background: true, content: `修改${this.roleForm.name}成功`, closable: true, duration: 5 });
          this.roleModal = false;
          this.$refs['roleForm'].resetFields();
          this.handleGetRoleList()
        }
      )
    },
    handleDeleteRole (value) {
      const { id, ...params } = value;
      deleteRole(id).then(
        res => {
          this.$Message.success({ background: true, content: `删除${params.name}成功`, closable: true, duration: 5 });
          this.total = this.total - 1;
          this.handleGetRoleList()
        }
      )
    },
    handleGetMenuList () {
      this.menuList = [];
      getMenuList().then(
        res => {
          this.menuList = res.data.results
        }
      )
    },
    handleUpdateMenu () {
      updateRole(this.editId['id'], this.editMenuList).then(
        res => {
          this.$Message.success({ background: true, content: `修改${this.editId['name']}成功,请刷新页面确认`, closable: true, duration: 5 });
          this.menuModal = false;
          this.init()
        }
      )
    },
    menuCancel () {
      this.$Message.info({ background: true, content: '取消操作', closable: true, duration: 5 });
      this.menuModal = false;
      this.handleGetMenuList()
    },
    buttonCancel () {
      this.$Message.info({ background: true, content: '取消操作', closable: true, duration: 5 });
      this.permissionModal = false;
      this.handleGetMenuList()
    },
    editPerm (value) {
      let roleMenus = value.menus;
      this.checkMenuTree(this.menuList, roleMenus);
      this.menuModal = true;
      this.menuTitle = `菜单分配--${value.name}`;
    },
    editButton (value) {
      let roleButton = value.permissions;
      this.checkMenuTree(this.permissionList, roleButton);
      this.permissionModal = true;
      this.permissionTitle = `按钮分配--${value.name}`;
    },
    handleUpdateButton () {
      updateRole(this.editPermissionId['id'], this.editPermissionList).then(
        res => {
          this.$Message.success({ background: true, content: `修改${this.editPermissionId['name']}成功,请刷新页面确认`, closable: true, duration: 5 });
          this.permissionModal = false;
          this.init()
        }
      )
    },
    checkMenuTree (permData, roleMenus) {
      let that = this;
      permData.forEach(function (p) {
        if (that.hasPerm(p, roleMenus)) {
          if (p.pid === null) {
            p.selected = true
          } else {
            if (p.type !== 'children') {
              that.$set(p, 'checked', false)
            } else {
              that.$set(p, 'checked', true)
            }
          }
        } else {
          that.$set(p, 'checked', false)
        }
        if (p.children) {
          that.checkMenuTree(p.children, roleMenus)
        }
      })
    },
    hasPerm (p, roleMenus) {
      let flag = false;
      for (let i = 0; i < roleMenus.length; i++) {
        if (p.id === roleMenus[i].id) {
          flag = true;
          break;
        }
      }
      return flag;
    },
    handleCheckMenu (val) {
      let menuList = [];
      if (val.length === 0) {
        this.editMenuList['menus'] = []
      } else {
        val.forEach(menu => {
          menuList.push(menu.id);
          menuList.push(menu.pid);
          // menuList = menuList.filter(function (x) {
          //   return x
          // });
          // 使用箭头函数的简写方式
          menuList = menuList.filter(item => item);
          // 通过Set去除重复的项
          this.editMenuList['menus'] = Array.from(new Set(menuList));
        })
      }
    },
    handleCheckPermission (val) {
      let permissions = [];
      if (val.length === 0) {
        this.editPermissionList['permissions'] = []
      } else {
        val.forEach(permission => {
          if (permission.type) {
            permissions.push(permission.id);
            // permissions.push(permission.pid);
            // permissions = permissions.filter(item => item);
            // this.editPermissionList['permissions'] = Array.from(new Set(permissions))
            this.editPermissionList['permissions'] = permissions
          }
        })
      }
    },
    handleGetPermissionList () {
      getPermissionTree().then(
        res => {
          this.permissionList = res.data
        }
      )
    },
    expand (val) {
      // console.log(val, 6666)
      // const roleId = val.id;
      // getRoleSingle(roleId).then(
      //   res => {
      //     this.roleListLasts = res.data
      //   }
      // )
      if (!val.name) {
        getRoleSingle(val).then(
          res => {
            this.roleListLasts = res.data
          }
        )
      } else {
        const roleId = val.id;
        getRoleSingle(roleId).then(
          res => {
            this.roleListLasts = res.data
          }
        )
      }
    }
  },
  created () {
    this.handleGetRoleList();
    this.handleGetMenuList();
    this.handleGetPermissionList()
  },
  computed: {
    curPage: function () {
      return Math.ceil(this.total / this.getParams.page_size)
    },
    submitDisabled () {
      let disabled = false;
      if (this.roleForm.name === '') disabled = true;
      return disabled
    }
  },
  mounted () {
    this.init()
  }
}
</script>

<style lang="less" scoped>
  /*/deep/ .ivu-table-expanded-cell {*/
  /*  background: indianred;*/
  /*}*/
</style>
