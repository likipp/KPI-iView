<template>
  <div>
    <Table :data="list" :columns="columns"></Table>
  </div>
</template>

<script>
import { Button, Poptip } from 'view-design'
export default {
  name: 'position-table',
  props: ['list'],
  data () {
    return {
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
          sortable: true
        },
        {
          title: '名称',
          type: 'name',
          align: 'center',
          render: (h, params) => {
            return h('Div', {}, params.row.name)
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
                on: {},
                style: {
                  marginRight: '12px'
                }
              }, '修改'),
              h(Button, {
                props: {
                  type: 'error',
                  size: 'small',
                  icon: 'ios-trash-outline'
                }
              }, [
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
                  on: {}
                }, '删除')
              ])
            ])
          }
        }
      ]
    }
  }
}
</script>

<style scoped>

</style>
