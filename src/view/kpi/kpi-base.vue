<style lang="less">
  @import '../../styles/table-common';
</style>
<template>
  <div>
    <Card>
      <div class="search">
        <Row style="padding-bottom: 10px" operation>
          <Button style="margin-right: 8px">
            <Icon type="ios-trash-outline" size="15" style="margin-bottom: 3px"></Icon>删除
          </Button>
          <Input placeholder="搜索" style="width: auto; margin-left: 5px" clearable></Input>
          <Button @click="kpiModal = true" type="primary" style="float: right">
            <Icon type="ios-add" size="15" style="margin-bottom: 3px"></Icon>新增KPI
          </Button>
        </Row>
        <Row>
          <Col span="24">
            <Table strip border :columns="columns" :data="kpiList" :loading="loading"></Table>
          </Col>
        </Row>
        <Row type="flex" justify="end" class="page">
          <Page :total="total" show-sizer show-elevator size="small" :current.sync="getParams.page" show-total
                @on-change="handleChange" @on-page-size-change="sizeChange" :page-size=1
                :page-size-opts="[1,10,20,50]"></Page>
        </Row>
      </div>
    </Card>
    <Modal v-model="kpiModal" width="600" :title="type === 'create' ? '增加KPI' : '修改KPI'" draggable scrollable @on-cancel="cancel">
      <Form ref="kpiForm" :model="kpiForm" :rules="ruleForm" :label-width="90" label-colon>
        <Row>
          <Col span="12">
            <FormItem label="名称" prop="name">
              <Input v-model="kpiForm.name"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="单位" prop="unit">
              <Input v-model="kpiForm.unit"></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="使用状态" prop="status">
              <Select v-model="kpiForm.status">
                <Option value="unused">未使用</Option>
                <Option value="using">使用中</Option>
                <Option value="disabled">禁用</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="开始时间: " prop="in_time">
              <Input v-model="kpiForm.in_time"></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="结束时间: " prop="mo_time">
              <Input v-model="kpiForm.mo_time"></Input>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot="footer">
        <Button @click="cancel">取消</Button>
        <Button type="primary" v-if="type === 'create'"
                @click="handleCreateKpi" :disabled="submitDisabled">确定</Button>
        <Button type="primary" v-else @click="handleUpdateKpi" :disabled="submitDisabled">修改</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { getKPIList, createKPI, updateKPI, deleteKPI } from '../../api/kpi/kpibase';

export default {
  name: 'kpi-base',
  data () {
    return {
      total: 1,
      type: 'create',
      kpiModal: false,
      loading: false,
      getParams: {
        page: 1,
        page_size: 1,
        search: ''
      },
      kpiForm: {
        name: '',
        in_time: '',
        mo_time: '',
        unit: '',
        status: ''
      },
      ruleForm: {
        name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
        in_time: [{ required: true, message: '开始日期不能为空', trigger: 'blur' }],
        mo_time: [{ required: true, message: '结束日期不能为空', trigger: 'blur' }],
        unit: [{ required: true, message: '单位不能为空', trigger: 'blur' }],
        status: [{ required: true, message: '状态必须选择', trigger: 'blur' }]
      },
      kpiList: [],
      columns: [
        {
          title: '序号',
          type: 'index',
          align: 'center',
          key: 'id',
          width: '80px',
          sortable: true,
          indexMethod: (row) => {
            return (row._index + 1) + (this.getParams.page * this.getParams.page_size) - this.getParams.page_size
          }
        },
        {
          title: '名称',
          align: 'center',
          render: (h, params) => {
            return h('span', {}, params.row.name)
          }
        },
        {
          title: '单位',
          align: 'center',
          render: (h, params) => {
            return h('span', {}, params.row.unit)
          }
        },
        {
          title: '录入/修改日期',
          align: 'center',
          render: (h, params) => {
            let time = params.row.in_time + '~' + params.row.mo_time + '号';
            return h('span', {}, time)
          }
        },
        {
          title: '状态',
          align: 'center',
          render: (h, params) => {
            const row = params.row;
            if (row.status.id === 'using') {
              const color = 'success';
              const text = '使用中';
              return h('Tag', {
                props: {
                  type: 'dot',
                  color: color
                }
              }, text)
            } else if (row.status.id === 'unused') {
              const color = 'warning';
              const text = '未使用';
              return h('Tag', {
                props: {
                  type: 'dot',
                  color: color
                }
              }, text)
            } else {
              const color = 'error';
              const text = '禁用';
              return h('Tag', {
                props: {
                  type: 'dot',
                  color: color
                }
              }, text)
            }
          }
        },
        {
          title: '操作',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small',
                  icon: 'ios-create-outline'
                },
                style: {
                  marginRight: '12px'
                },
                on: {
                  click: () => {
                    this.type = 'edit';
                    this.kpiModal = true;
                    this.kpiForm.name = params.row.name;
                    this.kpiForm.unit = params.row.unit;
                    this.kpiForm.in_time = params.row.in_time;
                    this.kpiForm.mo_time = params.row.mo_time;
                    this.kpiForm.status = params.row.status.id;
                    this.kpiForm.id = params.row.id
                  }
                }
              }, '修改'),
              h('Poptip', {
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
                    this.handleDeleteKPI(params.row)
                  },
                  'on-cancel': () => {
                    this.$Message.info('点击了取消')
                  }
                }
              }, [
                h('Button', {
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
    handleGetKPIList () {
      if (this.curPage >= this.getParams.page) {
        if (this.loading) return;
        this.loading = true;
        getKPIList(this.getParams).then(
          res => {
            this.kpiList = res.data.results;
            this.total = res.data.count;
            this.loading = false
          }
        )
      } else {
        if (this.loading) return;
        this.loading = true;
        this.getParams.page = 1;
        getKPIList(this.getParams).then(
          res => {
            this.kpiList = res.data.results;
            this.total = res.data.count;
            this.loading = false
          }
        )
      }
    },
    handleCreateKpi () {
      createKPI(this.kpiForm).then(
        res => {
          this.$Message.success({ background: true, content: `添加${this.kpiForm.name}成功`, duration: 3, closable: true });
          this.kpiModal = false;
          this.$refs['kpiForm'].resetFields();
          this.handleGetKPIList()
        }
      )
    },
    handleUpdateKpi () {
      const { id, ...params } = this.kpiForm
      updateKPI(id, params).then(
        res => {
          this.$Message.success({ background: true, content: `修改${params.name}成功`, duration: 3, closable: true });
          this.kpiModal = false;
          this.$refs['kpiForm'].resetFields();
          this.handleGetKPIList()
        }
      )
    },
    handleDeleteKPI (valve) {
      const { id, ...params } = value;
      deleteKPI(id).then(
        res => {
          this.$Message.success({ background: true, content: `删除${params.name}成功`, duration: 3, closable: true });
          this.loading = false;
          this.total = this.total - 1;
          this.handleGetKPIList()
        }
      )
    },
    cancel () {
      this.kpiModal = false;
      this.$refs['kpiForm'].resetFields();
      this.handleGetKPIList()
    },
    handleChange (val) {
      this.getParams.page = val;
      this.handleGetKPIList()
    },
    sizeChange (size) {
      this.getParams.page_size = size;
      this.$nextTick(() => {
        this.handleGetKPIList()
      })
    }
  },
  created () {
    this.handleGetKPIList()
  },
  computed: {
    submitDisabled () {
      let disabled = false;
      if (this.kpiForm.name === '') disabled = true;
      return disabled
    },
    curPage () {
      return Math.ceil(this.total / this.getParams.page_size)
    }
  }
}
</script>

<style scoped>

</style>
