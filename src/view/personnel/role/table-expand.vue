<template>
  <div>
    {{ row }}
    <Row :class="['expand-row', 'v-center', 'bd-bottom', i1 === 0 ? 'bd-top' : '']" v-for="(item, i1) in row.permissions" :key="item.id">
      <Col :span="6">
        <Tag size="medium" color="geekblue" type="border">{{ item.label }}</Tag>
        <Icon type="md-arrow-dropright" />
      </Col>
      <Col :span="18">
        <Row v-for="(item2, i2) in item.children" :key="item2.id" :class="['v-center', i2 === 0 ? '' : 'bd-top']">
          <Col :span="6">
            <Tag size="medium" color="volcano" type="border">{{ item2 }}</Tag>
            <Icon type="md-arrow-dropright" />
          </Col>
          <Col :span="18">
            <Tag size="medium" type="border" color="magenta" closable v-for="item3 in item2.children" :key="item3.id">
              {{ item3.name }}
            </Tag>
          </Col>
        </Row>
      </Col>
    </Row>
  </div>
</template>
<script>

export default {
  name: 'table-expand',
  props: {
    row: Object,
    button: Array
  },
  data () {
    return {
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
