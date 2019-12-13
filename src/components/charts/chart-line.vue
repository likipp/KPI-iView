<template>
  <div id="mountNode">
  </div>
</template>

<script>
import G2 from '@antv/g2'
import DataSet from '@antv/data-set'
import { getInputList } from '../../api/kpi/kpidata';

export default {
  name: 'charts-line',
  data () {
    return {
      monthList: [],
      kpiList: [],
      t_value: [],
      l_limit: [],
      form: {
        search: ''
      },
      List: []
    }
  },
  props: ['search'],
  methods: {
    handleGetInputList () {
      getInputList(this.form).then(
        res => {
          this.List = res.data;
          this.drawChart()
        }
      )
    },
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
        height: window.innerHeight,
        forceFit: true,
        padding: [20, 30, 30, 50]
      });
      if (this.form.search.indexOf(' ') !== -1) {
        dv.transform({
          type: 'fold',
          fields: ['kpi'],
          key: 'key',
          value: 'value',
          retains: ['month', 'r_value']
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
            range: [0, 1],
            // 设置X轴时间格式为年/月: 19/01
            mask: 'YY/MM'
          },
          // 设置图像的value轴的起点最小值跟终点最大值
          r_value: {
            min: 0,
            max: 100,
            // 设置数据圆点的别名
            alias: dv.origin[0].kpi
          }
        });
        chart.axis('value', {
          label: {
            formatter: function formatter (val) {
              return val + '%'
            }
          }
        });
        chart.legend('value', {
          position: 'top-center',
          marker: 'square',
          // offsetY: 10,
          textStyle: {
            fill: '#404040', // 文本的颜色
            fontSize: '12', // 文本大小
            fontWeight: 'bold'
          }
        });
        // 设置超过预警线之后变色
        chart.guide().regionFilter({
          top: true,
          start: ['min', dv.origin[0].l_limit],
          end: ['max', 0],
          color: '#F5222D',
          apply: ['line']
        });
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
            content: '上限值' + dv.origin[0].t_value,
            offsetY: -5
          }
        });
        chart.line().position('month*r_value').color('#436EEE').shape('smooth');
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
        chart.source(dv, {
          month: {
            type: 'timeCat',
            range: [0, 1],
            mask: 'YY/MM',
            alias: '月份'
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
        chart.line().position('month*value').color('kpi').shape('smooth');
        chart.point().position('month*value').size(4).shape('circle').color('kpi').style({
          stroke: '#fff',
          lineWidth: 1
        });
        chart.render()
      }
    }
  },
  mounted () {
  },
  watch: {
    search: {
      handler: function (newVal) {
        if (newVal) {
          if (newVal.kpi) {
            this.form.search = newVal.name + ' ' + newVal.kpi
          } else if (newVal.name) {
            this.form.search = newVal.name
          } else {
            this.form.search = ''
          }
        } else {
          this.form.search = ''
        }
        this.handleGetInputList()
      },
      deep: true,
      immediate: true
    }
  }
}
</script>

<style scoped>
</style>
