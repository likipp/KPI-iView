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
            <Tag size="medium" type="border" color="magenta" closable @on-close="handleRemoveTag(row, item3)"
                 v-for="item3 in item2.children" :key="item3.id">
              {{ item3.name }}
            </Tag>
            <Button icon="ios-add" type="dashed" size="small">添加标签</Button>
          </Col>
        </Row>
      </Col>
    </Row>
  </div>
</template>
<script>
import { updateRolePermission } from '../../../api/personnel/role';

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
    }
  },
  methods: {
    handleRemoveTag (row, tag) {
      updateRolePermission(row.id, tag).then(
        res => {
          this.$Message.success({ background: true, content: '删除成功', duration: 3 });
          if (this.expand) {
            this.expand(row)
          }
        }
      )
    }
  }
}
</script>

<style lang="less">
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
</style>
