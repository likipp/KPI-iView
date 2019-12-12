<template>
  <div>
    <Row style="padding: 15px 0">
      <Form inline :label-width="90">
        <Col span="5">
          <FormItem label="请选择部门: ">
            <!--          <Select v-model="form.name" style="width: 200px" @on-change="change">-->
            <!--            <Option v-for="dep in formdep" :key="dep.id" :value="dep.name">{{ dep.name }}</Option>-->
            <!--          </Select>-->
            <treeselect v-model="form.dep" :options="depList" :disable-branch-nodes="true" @select="change"
                        :show-count="true" placeholder="请选择部门"></treeselect>
          </FormItem>
        </Col>
        <FormItem label="请选择指标: ">
          <Select v-model="form.kpi" @on-change="handleSelectKPI">
            <Option v-for="kpi in kpiList" :key="kpi.kpi.id" :value="kpi.kpi.id">{{ kpi.kpi.name }}</Option>
          </Select>
        </FormItem>
      </Form>
      <Card>
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
    </Row>
    <Card v-if="kpiList.length">
      <div id="mountNode">
      </div>
    </Card>
  </div>
</template>

<script>
import G2 from '@antv/g2'
import DataSet from '@antv/data-set'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { getInputList } from '../../api/kpi/kpidata';
import { getGroupKPIList } from '../../api/kpi/kpigroup';
import { getOrganizationTree } from '../../api/personnel/organizationtree';
import { selectData } from '../../api/kpidash';

export default {
  name: 'charts-line',
  components: { Treeselect },
  data () {
    return {
      monthList: [],
      kpiList: [],
      depList: [],
      inputList: [],
      groupKpiList: [],
      t_value: [],
      l_limit: [],
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
      ],
      dep: '',
      name: '',
      form: {
        search: '',
        name: '',
        kpi: ''
      },
      List: []
    }
  },
  methods: {
    handleGetDepList () {
      getOrganizationTree().then(
        res => {
          this.depList = res.data
        }
      )
    },
    handleGetGroupKpiList () {
      getGroupKPIList().then(
        res => {
          this.groupKpiList = res.data.results
        }
      )
    },
    change (val) {
      // 设置kpiList为空, 这样才可以在部门切换时, 指标窗口才能置为空
      this.kpiList = [];
      // 遍历arr里面的部门ID， 与传递过来的val作比较,相同的添加到kpiList中并传递到Select选择框中.val是iview Select中on-change的默认返回值
      let arr = this.groupKpiList;
      for (let i = 0; i < arr.length; i++) {
        if (val.id === arr[i].dep.id) {
          // this.depName.search = arr[i].dep.name
          this.kpiList.push(arr[i]);
          this.dep = arr[i].dep.name
        }
      }
      this.handleGetInputList();
      this.handelPostGroupKpi()
    },
    handleGetInputList () {
      getInputList(this.form).then(
        res => {
          this.List = res.data;
          this.drawChart()
        }
      )
    },
    // drawChartKPI () {
    //   const data = this.List
    //   const ds = new DataSet()
    //   const dv = ds.createView().source(data)
    //   dv.transform({
    //     type: 'fold',
    //     fields: ['r_value'],
    //     key: 'key',
    //     value: 'value',
    //     retains: ['month', 'kpi']
    //   })
    //   dv.transform({
    //     type: 'map',
    //     callback (row) {
    //       if (row.key === 't_value') {
    //         row.key = '目标值'
    //       } else if (row.key === 'l_limit') {
    //         row.key = '下限值'
    //       } else {
    //         row.key = '实际值'
    //       }
    //       return row
    //     }
    //   })
    //   const chart = new G2.Chart({
    //     container: 'mountNode',
    //     // width: 700,
    //     forceFit: true,
    //     padding: [20, 30, 30, 50]
    //   })
    //   chart.source(dv, {
    //     month: {
    //       type: 'timeCat',
    //       range: [0, 1]
    //     },
    //     // 设置图像的vlaue轴的起点最小值跟终点最大值
    //     value: {
    //       min: dv.origin[0].l_limit - dv.origin[0].l_limit * 0.4,
    //       max: dv.origin[0].t_value + dv.origin[0].l_limit * 0.3
    //     }
    //   })
    //   chart.axis('value', {
    //     label: {
    //       formatter: function formatter (val) {
    //         return val + '%'
    //       }
    //     }
    //   })
    //   // chart.legend({
    //   //   attachLast: true
    //   // })
    //   chart.guide().line({
    //     start: ['min', dv.origin[0].l_limit],
    //     end: ['max', dv.origin[0].l_limit],
    //     lineStyle: {
    //       stroke: '#ed4014',
    //       lineWidth: 1,
    //       lineDash: [3, 3]
    //     }
    //     // text: {
    //     //   position: 'start',
    //     //   style: {
    //     //     fill: '#8c8c8c',
    //     //     fontSize: 15,
    //     //     fontWeight: 'normal'
    //     //   },
    //     //   content: '下限值' + dv.origin[0].l_limit,
    //     //   offsetY: -5
    //     // }
    //   })
    //   chart.guide().line({
    //     start: ['min', dv.origin[0].t_value],
    //     end: ['max', dv.origin[0].t_value],
    //     lineStyle: {
    //       stroke: '#19be6b',
    //       lineWidth: 1,
    //       lineDash: [3, 3]
    //     }
    //     // text: {
    //     //   position: 'start',
    //     //   style: {
    //     //     fill: '#8c8c8c',
    //     //     fontSize: 15,
    //     //     fontWeight: 'normal'
    //     //   },
    //     //   content: '上限值' + dv.origin[0].t_value,
    //     //   offsetY: -5
    //     // }
    //   })
    //   chart.line().position('month*value').color('key').shape('smooth')
    //   chart.point().position('month*value').size(4).shape('circle').style({
    //     stroke: '#fff',
    //     lineWidth: 1
    //   })
    //   chart.render()
    // },
    // drawChartDep () {
    //   const data = this.List
    //   const ds = new DataSet()
    //   const dv = ds.createView().source(data)
    //   dv.transform({
    //     type: 'fold',
    //     fields: ['kpi'],
    //     key: 'key',
    //     value: 'value',
    //     retains: ['month', 'r_value']
    //   })
    //   // dv.transform({
    //   //   type: 'map',
    //   //   callback (row) {
    //   //     if (row.key === 't_value') {
    //   //       row.key = '目标值'
    //   //     } else if (row.key === 'l_limit') {
    //   //       row.key = '下限值'
    //   //     } else {
    //   //       row.key = '实际值'
    //   //     }
    //   //     return row
    //   //   }
    //   // })
    //   const chart = new G2.Chart({
    //     container: 'mountNode',
    //     // width: 700,
    //     forceFit: true,
    //     padding: [20, 30, 30, 50]
    //   })
    //   chart.source(dv, {
    //     month: {
    //       type: 'timeCat',
    //       range: [0, 1]
    //     },
    //     // 设置图像的vlaue轴的起点最小值跟终点最大值
    //     r_value: {
    //       min: 0,
    //       max: 100
    //     }
    //   })
    //   // chart.axis('value', {
    //   //   label: {
    //   //     formatter: function formatter (val) {
    //   //       return val + '%'
    //   //     }
    //   //   }
    //   // })
    //   // chart.legend({
    //   //   attachLast: true
    //   // })
    //   // chart.guide().line({
    //   //   start: ['min', dv.origin[0].l_limit],
    //   //   end: ['max', dv.origin[0].l_limit],
    //   //   lineStyle: {
    //   //     stroke: '#ed4014',
    //   //     lineWidth: 1,
    //   //     lineDash: [3, 3]
    //   //   }
    //   // text: {
    //   //   position: 'start',
    //   //   style: {
    //   //     fill: '#8c8c8c',
    //   //     fontSize: 15,
    //   //     fontWeight: 'normal'
    //   //   },
    //   //   content: '下限值' + dv.origin[0].l_limit,
    //   //   offsetY: -5
    //   // }
    //   // })
    //   // chart.guide().line({
    //   //   start: ['min', dv.origin[0].t_value],
    //   //   end: ['max', dv.origin[0].t_value],
    //   //   lineStyle: {
    //   //     stroke: '#19be6b',
    //   //     lineWidth: 1,
    //   //     lineDash: [3, 3]
    //   //   }
    //   //   // text: {
    //   //   //   position: 'start',
    //   //   //   style: {
    //   //   //     fill: '#8c8c8c',
    //   //   //     fontSize: 15,
    //   //   //     fontWeight: 'normal'
    //   //   //   },
    //   //   //   content: '上限值' + dv.origin[0].t_value,
    //   //   //   offsetY: -5
    //   //   // }
    //   // })
    //   chart.line().position('month*r_value').color('value').shape('smooth')
    //   chart.point().position('month*r_value').size(4).shape('circle').style({
    //     stroke: '#fff',
    //     lineWidth: 1
    //   })
    //   chart.render()
    // },
    drawChart () {
      for (let i = 0; i < this.List.length; i++) {
        this.List[i].month = this.List[i].month.substr(0, 7)
      }
      const data = this.List;
      const ds = new DataSet();
      const dv = ds.createView().source(data);
      const chart = new G2.Chart({
        container: 'mountNode',
        // width: 700,
        forceFit: true,
        padding: [20, 30, 30, 50]
      });
      if (this.kpiList.length === 1) {
        dv.transform({
          type: 'fold',
          fields: ['kpi'],
          key: 'key',
          value: 'value',
          retains: ['month', 'r_value']
        });
        // dv.transform({
        //   type: 'map',
        //   callback (row) {
        //     if (row.key === 't_value') {
        //       row.key = '目标值'
        //     } else if (row.key === 'l_limit') {
        //       row.key = '下限值'
        //     } else {
        //       row.key = '实际值'
        //     }
        //     return row
        //   }
        // })
        chart.source(dv, {
          month: {
            type: 'timeCat',
            range: [0, 1]
          },
          // 设置图像的vlaue轴的起点最小值跟终点最大值
          r_value: {
            min: 0,
            max: 100
          },
          value: {
            min: 1,
            max: 100
          }
        });
        chart.axis('value', {
          label: {
            formatter: function formatter (val) {
              return val + '%'
            }
          }
        });
        // chart.legend({
        //   attachLast: true
        // });
        chart.guide().line({
          start: ['min', dv.origin[0].l_limit],
          end: ['max', dv.origin[0].l_limit],
          lineStyle: {
            stroke: '#ed4014',
            lineWidth: 1,
            lineDash: [3, 3]
          },
          text: {
            position: 'start',
            style: {
              fill: '#8c8c8c',
              fontSize: 15,
              fontWeight: 'normal'
            },
            content: '下限值' + dv.origin[0].l_limit,
            offsetY: -5
          }
        });
        chart.guide().line({
          start: ['min', dv.origin[0].t_value],
          end: ['max', dv.origin[0].t_value],
          lineStyle: {
            stroke: '#19be6b',
            lineWidth: 1,
            lineDash: [3, 3]
          },
          text: {
            position: 'start',
            style: {
              fill: '#8c8c8c',
              fontSize: 15,
              fontWeight: 'normal'
            },
            content: '目标值' + dv.origin[0].t_value,
            offsetY: -5
          }
        });
        // chart.line().position('month*r_value').color('value').shape('smooth');
        chart.line().position('month*r_value').shape('smooth');
        chart.point().position('month*r_value').size(4).shape('circle').style({
          stroke: '#fff',
          lineWidth: 1
        });
        chart.render()
      } else {
        dv.transform({
          type: 'fold',
          fields: ['r_value'],
          key: 'key',
          value: 'value',
          retains: ['month', 'kpi']
        });
        dv.transform({
          type: 'map',
          callback (row) {
            if (row.key === 't_value') {
              row.key = '目标值'
            } else if (row.key === 'l_limit') {
              row.key = '下限值'
            } else {
              row.key = '实际值'
            }
            return row
          }
        });
        chart.source(dv, {
          month: {
            type: 'timeCat',
            range: [0, 1]
          },
          // 设置图像的vlaue轴的起点最小值跟终点最大值
          // value: {
          //   min: dv.origin[0].l_limit - dv.origin[0].l_limit * 0.3,
          //   max: dv.origin[0].t_value + dv.origin[0].t_value * 0.3
          // }
          value: {
            min: 1,
            max: 100
          }
        });
        chart.axis('value', {
          label: {
            formatter: function formatter (val) {
              return val + '%'
            }
          }
        });
        chart.legend({
          attachLast: true
        });
        chart.line().position('month*value').color('kpi').shape('smooth');
        chart.point().position('month*value').size(4).shape('circle').style({
          stroke: '#fff',
          lineWidth: 1
        });
        chart.render()
      }
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
          let result = Object.entries(Object.entries(res.data)[0][1]).map(([key, value]) => {
            return { value: value, kpi: key }
          });
          this.monthlist = [];
          const date = new Date();
          for (let i = 12; i > 0; i--) {
            if (i < 10) {
              this.monthlist.push((date.getFullYear() + '').substr(2, 3) + '/' + 0 + i)
            } else {
              this.monthlist.push((date.getFullYear() + '').substr(2, 3) + '/' + i)
            }
          }
          for (let i = 0; i < this.monthlist.length; i++) {
            this.columns.splice(4, 0, {
              title: this.monthlist[i],
              key: this.monthlist[i],
              align: 'center',
              render: (h, params) => {
                let r_values = Object.entries(Object.entries(params.row.value.r_value));
                let t_value = Object.entries((Object.entries(params.row.value)))[0][1][1];
                let l_limit = Object.entries((Object.entries(params.row.value)))[1][1][1];
                for (const r_value of r_values) {
                  if (r_value[1][0].substr(2, 5) === this.monthlist[i]) {
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
          this.inputList = result;
          this.columns.splice(16)
        }
      )
    },
    handleSelectKPI (val) {
      for (let i = 0; i < this.kpiList.length; i++) {
        if (this.kpiList[i].kpi.id === val) {
          this.name = this.kpiList[i].kpi.name
        }
      }
      this.form.search = this.dep + ' ' + this.name;
      this.handleGetInputList();
      this.handelPostGroupKpi()
    }
  },
  created () {
    this.handleGetDepList();
    this.handleGetGroupKpiList()
  },
  mounted () {
  },
  watch: {
    // search: {
    //   handler: function (newVal) {
    //     if (this.search) {
    //       if (this.search.kpi) {
    //         this.form.search = this.search.name + ' ' + this.search.kpi
    //       } else if (this.search.name) {
    //         this.form.search = this.search.name
    //       } else {
    //         this.form.search = ''
    //       }
    //     } else {
    //       this.form.search = ''
    //     }
    //     this.handleGetInputList()
    //   },
    //   deep: true,
    //   immediate: true
    // }
  }
}
</script>

<style scoped>
</style>
