<template>
  <div>
    <Tree :data="list" show-checkbox @on-check-change="handleSelect" multiple :render="renderContent"></Tree>
  </div>
</template>

<script>
export default {
  name: 'UserTree',
  props: ['list'],
  data () {
    return {
      renderContent: (h, { data }) => {
        if (data.type === '公司') {
          return h('Span', {
            style: {
              // display: 'inline-block',
              width: '100%'
            }
          }, [
            h('Span', [
              h('Icon', {
                props: {
                  type: ' iconfont icon-bumen3',
                  size: '17'
                },
                style: {
                  marginRight: '8px',
                  color: '#2d8cf0'
                }
              }),
              h('span', data.title)
            ])
          ])
        } else {
          return h('Span', {
            style: {
              // display: 'inline-block',
              width: '100%'
            }
          }, [
            h('Span', [
              h('Icon', {
                props: {
                  type: ' iconfont icon-bumen2',
                  size: '17'
                },
                style: {
                  marginRight: '8px',
                  color: '#19be6b'
                }
              }),
              h('span', data.title)
            ])
          ])
        }
      }
    }
  },
  methods: {
    handleSelect (value) {
      this.$emit('select', value)
    }
  }
}
</script>

<style scoped>
.tree-item {
  /*display: inline-block;*/
  /*width: ~"calc(100% -50px");*/
}
</style>
