<style lang="less">
  @import "../../../src/styles/table-common.less";
</style>
<template>
<div class="search">
  <Card>
    <Row class="operation">
      <Button @click="addRole" type="primary" icon="md-add">添加角色</Button>
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
      <Table :data="roleData" :columns="columns" border stripe></Table>
    </Row>
  </Card>
</div>
</template>

<script>
import { getRoleList } from '@/api/personnel/role';

export default {
  name: 'role',
  data () {
    return {
      selectCount: 0,
      roleData: [],
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '序号',
          type: 'index',
          width: 80,
          align: 'center'
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
          // render: (h, params) => {
          //   let memberList = [];
          //   let member;
          //   for (member of params.row.members) {
          //     memberList.push(member.name)
          //   }
          //   return h('span', memberList.map(function (item, index) {
          //     return h('Tag', {
          //       props: {
          //         color: '#CCCCFF'
          //       }
          //     }, item)
          //   }
          //   ))
          // }
          render: (h, { row, index }) => {
            let memberList = [];
            let member;
            for (member of row.members) {
              memberList.push(h('tbody', [
                h('tr', [
                  h('td', index + 1),
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
          align: 'center',
          sortable: true
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
                    type: 'warning',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      console.log('测试')
                    }
                  }
                }, '菜单权限'
              ),
              h(
                'Button',
                {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      console.log('编辑')
                    }
                  }
                }, '编辑'
              ),
              h(
                'Button',
                {
                  props: {
                    size: 'small',
                    type: 'error'
                  },
                  on: {
                    click: () => {
                      console.log('删除')
                    }
                  }
                }, '删除'
              )
            ])
          }
        }
      ]
    }
  },
  methods: {
    handelGetRoleList () {
      getRoleList().then(
        res => {
          this.roleData = res.data
        }
      )
    },
    addRole () {},
    init () {},
    delAll () {},
    clearSelectAll () {}
  },
  created () {
    this.handelGetRoleList()
  }
}
</script>
<style lang="less">
  .m-table table {
    table-layout: fixed;
    font-family:"Trebuchet MS", Arial, Helvetica, sans-serif;
    width:100%;
    border-collapse:collapse;
    border:1px solid #e9e9e9;
  }
  .m-table td, .m-table th {
    font-size:1em;
    border:1px solid #e9e9e9;
    padding:3px 7px 2px 7px;
    text-align: center;
  }
  .m-table th {
    font-size:1.1em;
    padding-top:5px;
    padding-bottom:4px;
    background-color:#f7f7f7;
  }
</style>
