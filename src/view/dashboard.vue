<template>
  <div ref="dom">
  </div>
</template>

<script>
import echarts from 'echarts'
import { on, off } from '@/libs/tools'
import { getInputList } from '../api/kpi/kpidata';
// import { selectData } from '../../api/kpi/kpidash'

export default {
  name: 'dashboard',
  props: [
    'search'
  ],
  data () {
    return {
      dom: null,
      monthList: [],
      kpiList: [],
      table: [],
      t_value: [],
      l_limit: [],
      form: {
        search: ''
      }
    }
  },
  mounted () {
    // this.dashBoardCharts = echarts.init(document.getElementById('dashboard'))
  },
  methods: {
    resize () {
      this.dom.resize()
    },
    handlegetInputList () {
      getInputList(this.form).then(
        res => {
          let arr = res.data.results
          function compare (obj1, obj2) {
            let val1 = obj1.month
            let val2 = obj2.month
            if (val1 < val2) {
              return -1
            } else if (val1 > val2) {
              return 1
            } else {
              return 0
            }
          }
          this.monthList = []
          this.kpiList = []
          this.t_value = []
          this.l_limit = []
          arr = arr.sort(compare)
          for (let i = 0; i < arr.length; i++) {
            this.monthList.push(arr[i].month.substr(0, 7))
          }
          for (let i = 0; i < arr.length; i++) {
            this.kpiList.push(arr[i].r_value)
          }
          for (let i = 0; i < arr.length; i++) {
            this.t_value.push(arr[i].t_value)
          }
          for (let i = 0; i < arr.length; i++) {
            this.l_limit.push(arr[i].l_limit)
          }
          this.drawChart()
        }
      )
    },
    drawChart () {
      const option = {
        title: {
          text: 'KPI指标图'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        legend: {
          data: [ '实际值', '目标值', '下限值' ]
        },
        grid: {
          left: '3%',
          right: '3%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.monthList
        },
        yAxis: {
          type: 'value',
          containLabel: true,
          axisLabel: {
            formatter: '{value} %'
          }
        },
        series: [
          {
            name: '实际值',
            type: 'line',
            data: this.kpiList,
            lineStyle: {
              normal: {
                color: '#2db7f5'
              }
            },
            label: {
              normal: {
                show: true,
                position: 'insideBottomLeft',
                color: '#515a6e'
              }
            }
          },
          {
            name: '下限值',
            type: 'line',
            data: this.l_limit,
            lineStyle: {
              normal: {
                color: '#ed4014',
                width: 2,
                type: 'dotted'
              }
            }
          },
          {
            name: '目标值',
            type: 'line',
            data: this.t_value,
            lineStyle: {
              normal: {
                color: '#19be6b',
                width: 2,
                type: 'dotted'
              }
            }
          }
        ]
      }
      this.$nextTick(() => {
        this.dom = echarts.init(this.$refs.dom)
        this.dom.setOption(option)
        on(window, 'resize', this.resize)
      })
    }
  },
  created () {
  },
  watch: {
    search: function (newVal, oldVal) {
      this.form.search = this.search
      this.handlegetInputList()
    }
    // search: val => {
    //   console.log(this.search, 33333)
    // }
  },
  beforeDestroy () {
    off(window, 'resize', this.resize)
  }
}
</script>

<style scoped>
</style>
