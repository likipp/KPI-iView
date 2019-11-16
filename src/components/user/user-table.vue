<template>
  <div>
    <Table :data="list" :columns="columns" border :pageParams="pageParams" :loading="loading" stripe
           @on-select="selectChange"
           @on-select-cancel="selectCancel"
    ></Table>
  </div>
</template>

<script>
// import { mapActions } from 'vuex'
import { Button, Poptip } from 'view-design'
import { deleteUser } from '../../api/personnel/user'
import { setUserForm } from '../../libs/util'

export default {
  name: 'UserTable',
  props: ['list', 'pageParams', 'loading'],
  data () {
    return {
      ids: [],
      columns: [
        {
          type: 'selection',
          width: '60',
          align: 'center'
        },
        {
          title: '序号',
          type: 'index',
          align: 'center',
          key: 'id',
          width: '100',
          sortable: true,
          indexMethod: (row) => {
            return (row._index + 1) + (this.pageParams.page * this.pageParams.page_size) - this.pageParams.page_size
          }
        },
        {
          title: '名称',
          align: 'center',
          resizable: true,
          width: '120',
          render: (h, params) => {
            return h('Div', {}, params.row.name)
          }
        },
        {
          title: '帐号',
          align: 'center',
          resizable: true,
          width: '120',
          render: (h, params) => {
            return h('Div', {}, params.row.username)
          }
        },
        {
          title: '岗位',
          align: 'center',
          resizable: true,
          width: '120',
          render: (h, params) => {
            return h('Div', {}, params.row.position.name)
          }
        },
        {
          title: '直接上级',
          align: 'center',
          resizable: true,
          width: '150',
          render: (h, params) => {
            return h('Div', {}, params.row.superior.name)
          }
        },
        {
          title: '所属部门',
          align: 'center',
          resizable: true,
          width: '150',
          render: (h, params) => {
            return h('Div', {}, params.row.department.name)
          }
        },
        {
          title: '状态',
          align: 'center',
          render: (h, params) => {
            const iconMap = {
              true: { 'icon': 'ios-checkmark-circle-outline', 'color': '#19be6b' },
              false: { 'icon': 'ios-close-circle-outline', 'color': 'red' }
            }
            let status = []
            let superuser = params.row.is_superuser
            let active = params.row.is_active
            let staff = params.row.is_staff
            status.push(h('Span', {}, '管理员'))
            status.push(h('Icon', { props: { type: iconMap[superuser].icon }, style: { marginRight: '8px', color: iconMap[superuser].color } }))
            status.push(h('Span', {}, '已激活'))
            status.push(h('Icon', { props: { type: iconMap[active].icon }, style: { marginRight: '8px', color: iconMap[active].color } }))
            status.push(h('Span', {}, '登录后台'))
            status.push(h('Icon', { props: { type: iconMap[staff].icon }, style: { marginRight: '8px', color: iconMap[staff].color } }))
            return h('Span', {}, status)
          }
        },
        {
          title: '操作',
          align: 'center',
          render: (h, params) => {
            return h('Div', [
              h(Button, {
                props: {
                  type: 'primary',
                  size: 'small',
                  icon: 'ios-create-outline'
                },
                on: {
                  click: () => {
                    this.$store.commit('setModal', true)
                    this.$store.commit('setType', 'edit')
                    setUserForm(this, params.row)
                    // this.$emit('callBack', params.row)
                  }
                },
                style: {
                  marginRight: '12px'
                }
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
                    this.handelDeleteUser(params.row)
                  },
                  'on-cancel': () => {
                    this.$Message.info('点击了取消')
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
      ]
    }
  },
  methods: {
    handelDeleteUser (value) {
      const { id, ...params } = value
      deleteUser(id).then(
        res => {
          this.$Message.success(`删除${params.name}成功!`)
          this.$emit('userList')
        }
      )
    },
    selectChange (selection) {
      for (const data of selection) {
        this.ids.push({ 'id': data.id, 'name': data.name })
      }
      this.$emit('getSelectUser', this.ids)
    },
    selectCancel (selection) {
      this.ids = selection
      this.$emit('getSelectUser', this.ids)
    }
  }
}
</script>

<style scoped>

</style>
