<template>
  <div>
    <Card>
      <div style="padding-bottom: 10px">
        <Button style="margin-right:8px;" type="error">
          <Icon type="ios-trash-outline" size="15" style="margin-bottom: 3px"></Icon>删除</Button>
        <Button style="float:right" type="primary" @click="modal = true, type = 'create'">
          <Icon type=" iconfont icon-jurassic_add-user" size="15" ></Icon>新增岗位</Button>
      </div>
      <Table :data="positionList" :columns="columns" border stripe></Table>
      <Modal width="800" :title="type === 'create' ? '增加岗位' : '修改岗位'" draggable
             scrollable v-model="modal" @on-cancel="cancel">
        <Form ref="posForm" :model="posForm" :label-width="80" label-colon>
          <Row>
            <Col>
              <FormItem label="名称" prop="name">
                <Input v-model="posForm.name" placeholder="请输入岗位名称"></Input>
              </FormItem>
            </Col>
          </Row>
        </Form>
        <div slot="footer">
          <Button @click="cancel">取消</Button>
          <Button type="primary" @click="handelCreatePos" v-if="type === 'create'">确定</Button>
          <Button type="primary" @click="handelUpdatePos" v-else>修改</Button>
        </div>
      </Modal>
    </Card>
  </div>
</template>

<script>
import { Button, Poptip } from 'view-design'
import PositionTable from '_c/position/position-table'
import { getPositionList, createPosition, updatePosition, deletePosition } from '@/api/personnel/position'

export default {
  name: 'position',
  components: { PositionTable },
  data () {
    return {
      modal: false,
      type: 'create',
      positionList: [],
      posForm: { name: '' },
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
                on: {
                  click: () => {
                    this.modal = true
                    this.type = 'edit'
                    this.posForm.id = params.row.id
                    this.posForm.name = params.row.name
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
                    this.handelDeletePos(params.row)
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
      ]
    }
  },
  methods: {
    handleGetPositionList () {
      getPositionList().then(
        res => {
          this.positionList = res.data.results
        }
      )
    },
    handelCreatePos () {
      createPosition(this.posForm).then(
        res => {
          this.modal = false;
          this.$refs['posForm'].resetFields();
          this.handleGetPositionList();
          this.$Message.success({ background: true, content: `新增${this.posForm.name}成功!`, closable: true, duration: 5 })
        }
      )
    },
    handelUpdatePos () {
      const { id, ...data } = this.posForm;
      updatePosition(id, data).then(
        res => {
          this.modal = false;
          this.$refs['posForm'].resetFields();
          this.handleGetPositionList();
          this.$Message.success({ background: true, content: `修改${data.name}成功!`, closable: true, duration: 5 })
        }
      )
    },
    handelDeletePos (value) {
      const { id, ...data } = value;
      deletePosition(id).then(
        res => {
          this.loading = false;
          this.$Message.success({ background: true, content: `删除部门${data.name}成功`, closable: true, duration: 5 });
          this.handleGetPositionList()
        }
      )
    },
    cancel () {
      this.modal = false;
      this.$Message.info({ background: true, content: '取消操作', closable: true, duration: 5 });
      this.$refs['posForm'].resetFields()
    }
  },
  created () {
    this.handleGetPositionList()
  }
}
</script>

<style scoped>

</style>
