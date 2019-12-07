<template>
  <div>
    <Row :class="['expand-row', 'v-center', 'bd-bottom', i1 === 0 ? 'bd-top' : '']" v-for="(item, i1) in row.permissions" :key="item.id">
      <Col :span="5">
        <Tag size="medium" color="geekblue" type="border">{{ item.label }}</Tag>
        <Icon type="md-arrow-dropright" />
      </Col>
      <Col :span="19">
        <Row v-for="(item2, i2) in item.children" :key="item2.id" :class="['v-center', i2 === 0 ? '' : 'bd-top']">
          <Col :span="6">
            <Tag size="medium" color="volcano" type="border">{{ item2.label }}</Tag>
            <Icon type="md-arrow-dropright" />
          </Col>
          <Col :span="18">
            <Tag size="medium" type="border" color="magenta" closable @on-close="handleCloseTag(row, item3)"
                 v-for="item3 in item2.children" :key="item3.id" :name="item3.name">
              <Poptip
                confirm
                @on-ok="ok(row, item3)"
                @on-cancel="cancel(item3)" placement="top-start" transfer v-if="tagName === item3.name"
                :title="`确定要删除${item3.name}吗?`" v-model="tagModal">
              </Poptip>
              <Poptip v-else transfer></Poptip>
                {{ item3.name }}
            </Tag>
<!--            <Button icon="ios-add" type="dashed" size="small" >添加标签</Button>-->
            <Select size="small" multiple style="width:120px" placeholder="添加标签" transfer ref="resetSelect"
                    @on-open-change="handleOpenSelect(row.id, item.id, item2)" @on-change="handleTagSelect"
                    not-found-text="无可用权限">
              <Option  v-for="item in selectData" :value="item.id" :key="item.id" v-if="selectData.length > 0">{{ item.name }}</Option>
            </Select>
          </Col>
        </Row>
      </Col>
    </Row>
  </div>
</template>
<script>
import { updateRolePermission, addPermissionToRole } from '../../../api/personnel/role';
import { getPermissionTree } from '../../../api/personnel/permission'

export default {
  name: 'table-expand',
  props: {
    row: Object,
    button: Array,
    expand: {
      type: Function,
      default: null
    }
  },
  data () {
    return {
      roleList: null,
      tagModal: false,
      tagName: '',
      allPermissions: [],
      selectLoading: true,
      selectData: [],
      hasPermission: [],
      permissionList: [],
      unHasPermission: [],
      roleId: 0,
      newVal: []
    }
  },
  methods: {
    ok (row, tag) {
      updateRolePermission(row.id, tag).then(
        res => {
          this.$Message.success({ background: true, content: `删除${tag.name}成功`, duration: 3 });
          if (this.expand) {
            this.expand(row)
          }
        }
      ).catch(error => {
        console.log(error, '删除失败')
      })
    },
    cancel (item) {
      this.$Message.success({ background: true, content: `取消删除${item.name}`, duration: 3 });
    },
    handleCloseTag (row, item3) {
      this.tagName = item3.name;
      this.tagModal = true;
    },
    handleOpenSelect (roleId, menuId, permission) {
      this.roleId = roleId;
      let permissionId = permission.id;
      this.hasPermission = permission['children']
      getPermissionTree().then(
        res => {
          for (let i = 0; i < res.data.length; i++) {
            if (res.data[i]['id'] === menuId) {
              for (let y = 0; y < res.data[i]['children'].length; y++) {
                if (res.data[i]['children'][y]['id'] === permissionId) {
                  this.permissionList = res.data[i]['children'][y]['children']
                }
              }
            }
          }
          if (!this.permissionList) {
            this.selectData = {}
          } else {
            for (let i = 0; i < this.permissionList.length; i++) {
              for (let y = 0; y < this.hasPermission.length; y++) {
                if (this.permissionList[i]['id'] === this.hasPermission[y]['id']) {
                  this.permissionList.splice(i, 1)
                }
              }
            }
            this.selectData = {};
            this.selectData = this.permissionList
          }
        }
      )
    },
    handleTagSelect (val) {
      let data = {};
      data['id'] = val;
      addPermissionToRole(this.roleId, data).then(
        res => {
          this.$Message.success({ background: true, content: '权限添加成功', duration: 3 });
          if (this.expand) {
            this.expand(this.roleId)
          }
        }
      )
    }
  },
  watch: {
    row: function (newVal, oldVal) {
      console.log(newVal, oldVal, 777777999)
    }
  },
  created () {
    // this.handleTest()
  }
}
</script>

<style lang="less" scoped>
.ivu-tag{
  margin: 7px
}
.bd-top {
  border-top: 1px solid #e8eaec;
}
.bd-bottom {
  border-bottom: 1px solid #e8eaec;
}
.v-center {
  display: flex;
  align-items: center
}
/*/deep/ .ivu-table-expanded-cell {*/
/*  background: indianred;*/
/*}*/
.td {
  /deep/ .ivu-table-expanded-cell {background: indianred}
}
</style>
