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
          <Button @click="groupKPIModal = true" type="primary" style="float: right">
            <Icon type="ios-add" size="15" style="margin-bottom: 3px"></Icon>新增KPI
          </Button>
        </Row>
        <Row>
          <Col span="24">
            <Table strip border :columns="columns" :data="groupKPIList" :loading="loading"></Table>
          </Col>
        </Row>
        <Row type="flex" justify="end" class="page">
          <Page :total="total" show-sizer show-elevator size="small" :current.sync="getParams.page" show-total
                 :page-size=1
                :page-size-opts="[1,10,20,50]"></Page>
        </Row>
      </div>
    </Card>
    <Modal v-model="groupKPIModal" width="800" :title="type === 'create' ? '增加部门KPI' : '修改部门KPI'"
           draggable scrollable @on-cancel="cancel">
      <Form ref="groupKPIForm" :model="groupKPIForm" :label-width="100" :rules="ruleGroupKPIForm" label-colon>
        <Row>
          <Col span="11">
            <FormItem label="部门" prop="dep">
              <treeselect v-model="groupKPIForm.dep" :options="depList" :disable-branch-nodes="true" @select="handleGetDep"
                          :show-count="true" placeholder="请选择部门"></treeselect>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="11">
            <FormItem label="状态" prop="status">
              <Select v-model="groupKPIForm.status" placeholder="请选择状态">
                <Option value="unused">未使用</Option>
                <Option value="using">使用中</Option>
                <Option value="disabled">禁用</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="11">
            <FormItem label="目标值" prop="t_value">
              <Input v-model="groupKPIForm.t_value"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="11">
            <FormItem label="上限值" prop="u_limit">
              <Input v-model="groupKPIForm.u_limit"></Input>
            </FormItem>
          </Col>
          <Col span="11">
            <FormItem label="下限值" prop="l_limit">
              <Input v-model="groupKPIForm.l_limit"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row type="flex" justify="center">
          <Col span="22">
            <Alert show-icon style="padding-top: 8px;padding-bottom: 8px;">
              <template slot="desc">指标只能选择一个，请不要尝试选择多个。</template>
          </Alert></Col>
        </Row>
        <Row>
          <Col span="24">
            <FormItem label="部门指标" prop="kpi">
              <Transfer :data="kpiList" :target-keys="targetKeys" :list-style="listStyle" v-model="this.groupKPIForm.kpi"
                        @on-change="handleCreateChange" :operations="['删除', '添加']" :title="title" filterable :filter-method="filterMethod">
              </Transfer>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot="footer">
        <Button @click="cancel">取消</Button>
        <Button type="primary" v-if="type === 'create'" @click="handleCreateDepKpi('groupKPIForm')">确定</Button>
        <Button type="primary" v-else @click="handleUpdateDepKpi">修改</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import {
  getGroupKPIList,
  getGroupKPIUnused,
  createGroupKPI,
  deleteGroupKPI,
  updateGroupKPI
} from '../../api/kpi/kpigroup';
// import { getDepList } from '../../api/personnel/department';
import { getOrganizationTree } from '../../api/personnel/organizationtree';
// import { contains } from '../../libs/transfer';
// import { getKPIList } from '../../api/kpi/kpibase';

export default {
  name: 'kpi-group',
  components: { Treeselect },
  data () {
    const validDep = (rule, value, callback) => {
      if (!value) {
        callback(new Error('部门必须选择'))
      } else {
        callback()
      }
    };
    const validKPI = (rule, value, callback) => {
      if (this.targetKeys.length === 0) {
        callback(new Error('KPI必须选择'))
      } else {
        callback()
      }
    };
    return {
      loading: false,
      allKPIList: [],
      type: 'create',
      groupKPIList: [],
      total: 1,
      getParams: {
        page: 1,
        page_size: 10,
        search: ''
      },
      groupKPIModal: false,
      depList: [],
      kpiList: [],
      targetKeys: [],
      listStyle: {
        width: '250px',
        height: '300px'
      },
      title: ['可选', '已选'],
      groupKPIForm: {
        kpi: '',
        dep: null,
        u_limit: 0,
        l_limit: 0,
        t_value: 0,
        status: ''
      },
      ruleGroupKPIForm: {
        dep: [{ required: true, trigger: 'change', validator: validDep }],
        status: [{ required: true, message: '状态必须选择', trigger: 'change' }],
        u_limit: [{ required: true, message: '上限值必须输入', trigger: 'blur' }],
        l_limit: [{ required: true, message: '下限值必须输入', trigger: 'blur' }],
        t_value: [{ required: true, message: '目标值必须输入', trigger: 'blur' }],
        kpi: [{ required: true, trigger: 'change', validator: validKPI }]
      },
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
          title: '部门',
          align: 'center',
          render: (h, params) => {
            return h('span', {}, params.row.dep.name)
          }
        },
        {
          title: 'KPI',
          align: 'center',
          render: (h, params) => {
            return h('span', {}, params.row.kpi.name)
          }
        },
        {
          title: '上限值',
          align: 'center',
          width: '80',
          render: (h, params) => {
            return h('span', {}, params.row.u_limit)
          }
        },
        {
          title: '下限值',
          align: 'center',
          width: '80',
          render: (h, params) => {
            return h('span', {}, params.row.l_limit)
          }
        },
        {
          title: '目标值',
          align: 'center',
          width: '80',
          render: (h, params) => {
            return h('span', {}, params.row.t_value)
          }
        },
        {
          title: '状态',
          align: 'center',
          width: '140',
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
                on: {
                  click: () => {
                    const value = { 'id': params.row.dep.id, 'dep': params.row.dep.name };
                    getGroupKPIUnused(value.id, value).then(
                      res => {
                        let kpiList = res.data;
                        this.kpiFormat(kpiList);
                        // console.log(this.kpiList, 66666)
                        this.type = 'edit';
                        this.groupKPIModal = true;
                        this.groupKPIForm.dep = params.row.dep.id;
                        this.groupKPIForm.status = params.row.status.id;
                        this.groupKPIForm.l_limit = params.row.l_limit;
                        this.groupKPIForm.u_limit = params.row.u_limit;
                        this.groupKPIForm.t_value = params.row.t_value;
                        this.groupKPIForm.id = params.row.id;
                        let kpi = params.row.kpi;
                        let kpi_selected = { 'id': params.row.kpi.id - 1, 'key': params.row.kpi.id, 'label': params.row.kpi.name };
                        this.kpiList.push(kpi_selected);
                        let kpi_copy = [];
                        kpi_copy[0] = kpi.id;
                        this.targetKeys = kpi_copy;
                      }
                    ).catch(error => {
                      console.log(error)
                    })
                    // this.type = 'edit';
                    // this.groupKPIModal = true;

                  //   if (this.kpiList.length !== 0) {
                  //     console.log(this.kpiList, 77777)
                  //
                  //     console.log(this.targetKeys)
                  //   } else {
                  //     console.log(this.targetKeys, 9876)
                  //   }
                  }
                },
                style: {
                  marginRight: '12px'
                }
              }, '修改'),
              h('Poptip', {
                props: {
                  confirm: true,
                  transfer: true,
                  placement: 'left-start',
                  title: `确定要删除${params.row.kpi.name}吗?`,
                  type: 'error',
                  size: 'small',
                  width: '300',
                  vModel: true
                },
                on: {
                  'on-ok': () => {
                    this.handleDeleteDepKpi(params.row)
                  },
                  'on-cancel': () => {
                    this.$Message.info({ background: true, content: '点击了取消', duration: 3, closable: true })
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
    kpiFormat (kpiList) {
      let kpis = [];
      kpiList.map((item) => {
        kpis.push({
          id: item.id - 1,
          key: item.id,
          label: item.name
        })
      });
      this.kpiList = kpis
    },
    handleGetKPIGroupList () {
      if (this.curPage >= this.getParams.page) {
        if (this.loading) return;
        this.loading = true;
        getGroupKPIList(this.getParams).then(
          res => {
            this.groupKPIList = res.data.results;
            this.total = res.data.count;
            this.loading = false
          }
        )
      } else {
        if (this.loading) return;
        this.loading = true;
        this.getParams.page = 1;
        getGroupKPIList(this.getParams).then(
          res => {
            this.groupKPIList = res.data.results;
            this.total = res.data.count;
            this.loading = false
          }
        )
      }
    },
    handleGetDepList () {
      getOrganizationTree().then(
        res => {
          this.depList = res.data
        }
      )
    },
    handleGetKPIList () {
      // getKPIList().then(
      //   res => {
      //     let kpiList = res.data.results;
      //     this.kpiFormat(kpiList)
      //   }
      // )
    },
    filterMethod (data, query) {
      return data.label.indexOf(query) > -1
    },
    handleGetDep (val) {
      const params = { 'dep': val.label };
      getGroupKPIUnused(val.id, params).then(
        res => {
          let kpiList = res.data;
          this.kpiFormat(kpiList)
        }
      )
    },
    cancel () {
      this.$Message.info({ background: true, content: '取消操作', duration: 3, closable: true });
      this.groupKPIModal = false;
      this.type = 'create';
      this.targetKeys = [];
      this.$refs['groupKPIForm'].resetFields()
    },
    handleCreateChange (newTargetKeys) {
      this.targetKeys = newTargetKeys
    },
    handleCreateDepKpi (name) {
      let data = this.groupKPIForm;
      for (let value of this.targetKeys.values()) {
        data.kpi = value
      }
      this.$refs['groupKPIForm'].validate((valid) => {
        if (valid) {
          createGroupKPI(data).then(
            res => {
              this.$Message.success({ background: true, content: '指标新建成功', duration: 3, closable: true });
              this.groupKPIModal = false;
              this.$refs['groupKPIForm'].resetFields();
              this.targetKeys = [];
              this.kpiList = [];
              this.handleGetKPIGroupList()
            }
          )
        } else {
          this.$Message.error({ background: true, content: '请检查数据是否都已经录入!', duration: 3, closable: true })
        }
      })
    },
    handleUpdateDepKpi () {
      const { id, ...params } = this.groupKPIForm;
      for (let value of this.targetKeys.values()) {
        params.kpi = value
      }
      updateGroupKPI(id, params).then(
        res => {
          this.$Message.success({ background: true, content: '修改成功', duration: 3, closable: true });
          this.groupKPIModal = false;
          this.type = 'create';
          this.$refs['groupKPIForm'].resetFields();
          this.kpiList = [];
          this.targetKeys = [];
          this.handleGetKPIGroupList()
        }
      )
    },
    handleDeleteDepKpi (value) {
      const { id, ...params } = value;
      deleteGroupKPI(id).then(
        res => {
          this.$Message.success({ background: true, content: `删除${params.dep.name}下的${params.kpi.name}成功`, duration: 3, closable: true })
          this.total = this.total - 1;
          this.handleGetKPIGroupList()
        }
      )
    }
    // handleGetAllKPIList () {
    //   getGroupKPIEnabled().then(
    //     res => {
    //       let kpiList = res.data;
    //       this.kpiFormat(kpiList)
    //     }
    //   )
    // }
  },
  created () {
    this.handleGetKPIGroupList();
    this.handleGetDepList();
    this.handleGetKPIList();
    // this.handleGetAllKPIList()
  },
  computed: {
    curPage () {
      return Math.ceil(this.total / this.getParams.page_size)
    }
  },
  watch: {
    targetKeys () {
      if (this.targetKeys.length === 1) {
        this.kpiList.map((item) => {
          if (this.targetKeys[0] !== item.key) { item['disabled'] = true }
        });
      } else {
        this.kpiList.map((item) => {
          if (this.targetKeys[0] !== item.key) { item['disabled'] = false }
        });
      }
    }
  }
}
</script>

<style scoped>

</style>
