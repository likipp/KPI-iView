<template>
  <div>
    <Row>
      <Col span="6">
        <Alert show-icon>
          操作提示
          <template slot="desc">选择部门后,显示相关数据信息 </template>
        </Alert>
      </Col>
    </Row>
    <Row style="padding: 15px 0">
      <Form inline :label-width="90">
        <Col span="5">
          <FormItem label="请选择部门: ">
            <TreeSelect v-model="form.dep" :options="depList" :disable-branch-nodes="true" @select="change"
                        @input="handleInput" :show-count="true" placeholder="请选择部门"></TreeSelect>
          </FormItem>
        </Col>
        <FormItem label="请选择指标: ">
          <Select ref="kpiSelect" v-model="form.kpi" style="width: 200px" :disabled="!forms.name" clearable
                  @on-change="kpiChange" @on-clear="handleClear">
            <Option v-for="kpi in kpiList" :key="kpi.kpi.id" :value="kpi.kpi.id">{{ kpi.kpi.name }}</Option>
          </Select>
        </FormItem>
      </Form>
      <Card v-if="inputList.length !== 0">
        <div style="text-align: center; padding: 15px">
          <Row style="padding-bottom: 10px; float: left">
            <Tag color="success">达到目标</Tag>
            <Tag color="warning">需要改善</Tag>
            <Tag color="error">低于下限</Tag>
          </Row>
          <Row>
            <Col span="24">
              <Table stripe border :columns="columns" :data="this.inputList"></Table>
            </Col>
          </Row>
        </div>
      </Card>
      <Row>
        <Col span="6">
          <Alert show-icon type="error" v-if="this.inputList.length === 0 && this.form.dep">
            <template slot="desc">未录入KPI数据</template>
          </Alert>
        </Col>
      </Row>
    </Row>
    <Row>
      <Card v-if="reFresh">
        <chart-line :search=this.forms></chart-line>
      </Card>
    </Row>
  </div>
</template>

<script>
import Charts from '_c/charts/chart-line'
// import { getDepList } from '../../../api/account/departments'
// import { getGroupKpiList } from '../../../api/kpi/groupkpi'
// import { compare } from '../../utils/compare'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { getInputList } from '../../api/kpi/kpidata';
import { getGroupKPIList } from '../../api/kpi/kpigroup';
import { getOrganizationTree } from '../../api/personnel/organizationtree';
import { selectData } from '../../api/kpidash';

export default {
  name: 'home',
  components: {
    'chart-line': Charts,
    'TreeSelect': Treeselect
  },
  data () {
    return {
      groupKpiList: [],
      kpi: [],
      depList: [],
      kpiList: [],
      List: [],
      inputList: [],
      monthList: [],
      forms: {
        name: '',
        kpi: ''
      },
      form: {
        dep: null,
        kpi: ''
      },
      reFresh: false,
      columns: [
        {
          title: '序号',
          type: 'index',
          align: 'center',
          width: '80px'
        },
        {
          title: '指标名称',
          align: 'center',
          width: 160,
          render: (h, params) => {
            return h('span', {}, params.row.kpi)
          }
        },
        {
          title: '下限值',
          key: '下限值',
          align: 'center',
          width: '80px',
          render: (h, params) => {
            return h('span', {}, params.row.value.l_limit)
          }
        },
        {
          title: '目标值',
          align: 'center',
          width: '80px',
          render: (h, params) => {
            return h('span', {}, params.row.value.t_value)
          }
        }
      ]
    }
  },
  mounted () {
  },
  methods: {
    handleGetDepList () {
      getOrganizationTree().then(
        res => {
          this.depList = res.data
        }
      )
    },
    handelGetGroupKpiList () {
      getGroupKPIList().then(
        res => {
          this.groupKpiList = res.data.results
        }
      )
    },
    handleGetInputList () {
      getInputList(this.forms).then(
        res => {
          this.List = res.data;
        }
      )
    },
    handelPostGroupKpi () {
      //  当切换部门时,删除表格中现在有的列数据, 只输入4代表从第4列开始删除到结尾的数据
      this.reFresh = false;
      this.$nextTick(() => {
        this.reFresh = true
      });
      this.columns.splice(4);
      let data = this.form;
      selectData(data).then(
        res => {
          if (res.status !== 251) {
            let result = Object.entries(Object.entries(res.data)[0][1]).map(([key, value]) => {
              return { value: value, kpi: key }
            });
            this.monthList = [];
            const date = new Date();
            for (let i = 12; i > 0; i--) {
              if (i < 10) {
                this.monthList.push((date.getFullYear() + '').substr(2, 3) + '/' + 0 + i)
              } else {
                this.monthList.push((date.getFullYear() + '').substr(2, 3) + '/' + i)
              }
            }
            for (let i = 0; i < this.monthList.length; i++) {
              this.columns.splice(4, 0, {
                title: this.monthList[i],
                key: this.monthList[i],
                align: 'center',
                render: (h, params) => {
                  let r_values = Object.entries(Object.entries(params.row.value.r_value));
                  let t_value = Object.entries((Object.entries(params.row.value)))[0][1][1];
                  let l_limit = Object.entries((Object.entries(params.row.value)))[1][1][1];
                  for (const r_value of r_values) {
                    if (r_value[1][0].substr(2, 5) === this.monthList[i]) {
                      if (r_value[1][1] >= t_value) {
                        return h('Tag', {
                          props: { color: '#19be6b' }
                        }, r_value[1][1])
                      } else if (r_value[1][1] < l_limit) {
                        return h('Tag', {
                          props: { color: '#ed4014' }
                        }, r_value[1][1])
                      } else {
                        return h('Tag', {
                          props: { color: '#ff9900' }
                        }, r_value[1][1])
                      }
                    }
                  }
                  return h('Tag', 'NA')
                }
              })
            }
            this.inputList = result
            this.columns.splice(16)
          } else {
            this.inputList = []
          }
        }
      )
    },
    handleInput (val) {
      if (val === undefined) {
        this.$refs['kpiSelect'].clearSingleSelect();
        this.inputList = [];
        this.reFresh = false;
      }
    },
    change (val) {
      this.kpiList = [];
      this.$refs['kpiSelect'].clearSingleSelect();
      let arr = this.groupKpiList;
      for (let i = 0; i < arr.length; i++) {
        if (val.id === arr[i].dep.id) {
          this.kpiList.push(arr[i]);
          this.forms.name = arr[i].dep.name;
          this.handelPostGroupKpi();
          this.handleGetInputList();
        } else {
          this.$Notice.error({
            title: '系统提示',
            desc: '未录入KPI数据,请先输入!',
            duration: 3
          });
          this.inputList = [];
          this.reFresh = false;
          break;
        }
      }
    },
    kpiChange (val) {
      if (val) {
        for (let i = 0; i < this.kpiList.length; i++) {
          if (this.kpiList[i].kpi.id === val) {
            this.forms.kpi = this.kpiList[i].kpi.name
          }
        }
        this.handelPostGroupKpi();
        this.handleGetInputList();
      }
    },
    handleClear () {
      this.forms.kpi = ''
    }
    // 动态更改单元格样式, 没测试成功, 查看资料需要在data中先设置cellClassName, 但是render回来的数据不知道怎么操作。。
    // test (params) {
    //   let column = params.column.key
    //   let row = params.index
    //   this.$set(this.inputList[row].cellClassName, column, 'err')
    // }
  },
  created () {
    this.handleGetDepList();
    this.handelGetGroupKpiList()
  }
}
</script>

<style lang="less">
  .err {
    background-color: #ff9900;
    color: #fff
  }
  .vue-treeselect__control {
    height: 30px;
  }
  .vue-treeselect--single .vue-treeselect__input-container {
    height: 30px;
  }
</style>
