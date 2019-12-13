<template>
  <div>
    <Card>
      <Form ref="dataForm" :model="dataForm" :label-width="100" label-position="left">
        <Row>
          <Col span="12">
            <FormItem label="部门: " prop="dep">
<!--              <Select v-model="dataForm.dep" @on-change="change">-->
<!--                <Option v-for="dep in depList" :key="dep.id" :value="dep.id">{{ dep.name }}</Option>-->
<!--              </Select>-->
              <treeselect v-model="dataForm.dep" :options="depList" :disable-branch-nodes="true" @select="change"
                          :show-count="true" placeholder="请选择部门"></treeselect>
            </FormItem>
          </Col>
          <Col span="8" offset="1">
            <FormItem label="指标名: " prop="kpi">
              <Select v-model="dataForm.kpi" @on-change="check_date">
                <Option v-for="kpi in kpiList" :key="kpi.kpi.id" :value="kpi.kpi.id">{{ kpi.kpi.name }}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="月份: " prop="month">
              <DatePicker type="month" placeholder="选择录入数据的月份" v-model="dataForm.month" @on-change="in_date"></DatePicker>
            </FormItem>
          </Col>
          <Col span="8" offset="1">
            <FormItem label="录入人: " prop="user">
              <!--              <Select v-model="dataForm.user">-->
              <!--                <Option v-for="user in userList" :key="user.id" :value="user.id">{{ user.nickname }}</Option>-->
              <!--              </Select>-->
              <Input v-model="dataForm.user.name" disabled></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="8">
            <FormItem label="KPI指标值: " prop="r_value">
              <Input v-model="dataForm.r_value" type="number"></Input>
            </FormItem>
          </Col>
          <Col span="2" style="padding: 5px 5px">%</Col>
          <Col span="8" style="text-align: center">
            <Alert type="warning" show-icon>注意：录入及修改日期为每月{{this.in_time}}~{{this.mo_time}}号.如果不在区间内,提交按钮不可用！</Alert>
          </Col>
        </Row>
        <Row>
          <Col span="4">
            <FormItem label="下限值: ">
              <!--              <Alert type="error">{{ this.dataForm.u_limit }}%</Alert>-->
              <span v-if="dataForm.l_limit === ''"></span>
              <span style="background-color: #ed4014; font-size:20px" v-else>{{ this.dataForm.l_limit }}%</span>
            </FormItem>
          </Col>
          <Col span="4">
            <FormItem label="目标值: ">
              <!--              <Alert type="success">{{ this.dataForm.l_limit }}%</Alert>-->
              <span v-if="dataForm.t_value === ''"></span>
              <span style="background-color: #19be6b; font-size:20px" v-else>{{ this.dataForm.t_value }}%</span>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="注释说明：" prop="notice">
              <Input type="textarea" :rows="4" v-model="dataForm.notice"></Input>
            </FormItem>
          </Col>
          <Col span="6" style="text-align: center;padding: 25px 25px">
            <Alert>可输入指标数值原因或行动对策。</Alert>
          </Col>
        </Row>
        <FormItem>
          <Button type="primary" @click="handleCreateInput" :disabled=this.check>提交</Button>
          <Button style="margin-left: 8px" @click="handleReset('dataForm')">重置</Button>
        </FormItem>
      </Form>
    </Card>
    <Card style="margin-top: 10px">
      <Table stripe border :columns="columns" :data="inputList"></Table>
    </Card>
  </div>
</template>
<script>
import Cookies from 'js-cookie'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { getOrganizationTree } from '../../api/personnel/organizationtree';
import { getGroupKPIList } from '../../api/kpi/kpigroup';
import { getInputList, createInput } from '../../api/kpi/kpidata';
import { getUserList } from '../../api/personnel/user';
import { formatDate } from '../../libs/format';
// import { getDepList } from '../api/account/departments'
// import { getGroupKpiList } from '../api/kpi/groupkpi'
// import { getInputList, createInput } from '../api/kpi/kpiinput'
// import { getUsersList } from '../api/account/users'
export default {
  name: 'kpi-data',
  components: { Treeselect },
  data () {
    return {
      userList: [],
      kpiList: [],
      depList: [],
      groupKpiList: [],
      inputList: [],
      kpis: '',
      in_time: '',
      mo_time: '',
      check: false,
      dataForm: {
        kpi: '',
        month: '',
        user: '',
        r_value: 0,
        notice: '',
        group_kpi: '',
        // 此处t_value, l_limit用来做v-if, v-else判断使用
        t_value: '',
        l_limit: ''
      },
      depName: {
        search: ''
      },
      columns: [
        {
          title: '序号',
          type: 'index',
          align: 'center',
          sortable: true
        },
        {
          title: '部门',
          align: 'center',
          render: (h, params) => {
            return h('span', {}, params.row.dep)
          }
        },
        {
          title: '指标名',
          align: 'center',
          render: (h, params) => {
            return h('span', {}, params.row.kpi)
          }
        },
        {
          title: '月份',
          align: 'center',
          key: 'month',
          sortType: 'desc',
          sortable: true,
          render: (h, params) => {
            // 默认Django返回的month格式是2019-06-15,截断到2019-06
            return h('span', {}, params.row.month.substr(0, 7))
          }
        },
        {
          title: '指标值',
          align: 'center',
          render: (h, params) => {
            return h('span', {}, params.row.r_value)
          }
        },
        {
          title: '录入人',
          align: 'center',
          render: (h, params) => {
            return h('span', {}, params.row.user)
          }
        },
        {
          title: '录入时间',
          align: 'center',
          key: 'data',
          // render: (h, params) => {
          //   return h('span', formatDate(new Date(params.row.add_time), 'yyyy-MM-dd hh:mm'))
          // }
          render: (h, params) => {
            return h('Time', {
              props: {
                time: params.row.add_time,
                type: 'datetime'
              }
            })
          }
        },
        {
          title: '最后修改时间',
          align: 'center',
          render: (h, params) => {
            return h('span', {}, formatDate(new Date(params.row.update_time), 'yyyy-MM-dd hh:mm'))
          }
          // render: (h, params) => {
          //   return h('Time', {
          //     props: {
          //       time: parseInt(params.row.update_time),
          //       type: 'datetime'
          //     }
          //   })
          // }
        },
        {
          title: '操作',
          align: 'center'
        }
      ]
    }
  },
  methods: {
    handleGetUserList () {
      getUserList().then(
        res => {
          let users = res.data.results;
          // name是浏览器中Cookies中的名字,在store/module/user.js中定义
          let c_user = Cookies.get('name');
          users.forEach((item) => {
            if (c_user === item.username) {
              let id = { 'id': item.id };
              let name = { 'name': item.name };
              this.dataForm.user = Object.assign(id, name)
            }
          })
        }
      )
    },
    handleGetInputList () {
      getInputList(this.depName).then(
        res => {
          this.inputList = res.data
        }
      )
    },
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
    handleCreateInput () {
      this.dataForm.month = this.dataForm.month + '-15';
      this.dataForm.user = this.dataForm.user.id;
      createInput(this.dataForm).then(
        res => {
          this.$refs['dataForm'].resetFields();
          this.$Message.success('部门指标添加成功')
          this.handleGetInputList()
        }
      )
    },
    handleReset (name) {
      this.$refs[name].resetFields()
    },
    change (val) {
      // 设置kpiList为空, 这样才可以在部门切换时, 指标窗口才能置为空
      this.kpiList = []
      // 遍历arr里面的部门ID， 与传递过来的val作比较,相同的添加到kpiList中并传递到Select选择框中.val是iview Select中on-change的默认返回值
      let arr = this.groupKpiList
      for (let i = 0; i < arr.length; i++) {
        if (val.id === arr[i].dep.id) {
          this.depName.search = arr[i].dep.name;
          if (arr[i].status.id === 'using') {
            this.kpiList.push(arr[i])
          }
        }
      }
      this.handleGetInputList()
    },
    in_date (value) {
      this.dataForm.month = value
    },
    // 取到KPI指标时,根据指标的录入日期与当前时间做判断,如果不在录入日期区间内,则不充许提交
    check_date (value) {
      for (let i = 0; i < this.kpiList.length; i++) {
        if (this.kpiList[i].kpi.id === value) {
          this.in_time = this.kpiList[i].in_time
          this.mo_time = this.kpiList[i].mo_time
        }
      }
      let cur_date = new Date().getDate()
      // if (this.in_time < cur_date && this.mo_time > cur_date) {
      //   this.check = false
      // } else {
      //   this.check = true
      // }
      // 只要有一个为true,则结果为true
      // this.check = !(this.in_time < cur_date < this.mo_time)
      this.check = !(this.in_time < cur_date && this.mo_time > cur_date)
    }
  },
  created () {
    this.handleGetDepList()
    this.handleGetGroupKpiList()
    // this.handleGetInputList()
    this.handleGetUserList()
  },
  watch: {
    // 监视dataFom.kpi数据变化,当其有值时,将它关联的t_value,l_limit赋值到dataForm中,通过双向绑定传递到span标签中
    'dataForm.kpi': function () {
      let arr = this.groupKpiList
      let i = arr.length
      while (i--) {
        if (arr[i].kpi.id === this.dataForm.kpi) {
          this.dataForm.t_value = arr[i].t_value
          this.dataForm.l_limit = arr[i].l_limit
          this.dataForm.group_kpi = arr[i].id
        } else if (this.dataForm.kpi === '') {
          this.dataForm.t_value = ''
          this.dataForm.l_limit = ''
        }
      }
    }
  }
}
</script>

<style scoped>
</style>
