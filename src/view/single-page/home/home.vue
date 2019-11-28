<template>
  <div>
<!--    <treeselect v-model="depForm.id" :options="data" :expand-all="true" placeholder="请选择上级部门"></treeselect>-->
    <Tree  :data="data" show-checkbox :render="renderPermission"
          multiple @on-check-change="handleCheckPermission"></Tree>
  </div>
</template>

<script>
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { getPermissionTree } from '../../../api/personnel/permission';

export default {
  name: 'home',
  components: {
    Treeselect
  },
  data () {
    return {
      data: [],
      depForm: {
        id: ''
      },
      renderPermission: (h, { root, node, data }) => {
        //
        // console.log(node, 666345345)
        let icon = '';
        let color = '';
        if (data.pid === null) {
          icon = ' iconfont icon-bumen3';
          color = '#2d8cf0'
        } else {
          icon = 'md-filing';
          color = '#19be6b'
        }
        return h('Span', {
          style: {
            width: '100%',
            display: 'inline-block',
            cursor: 'pointer'
          }
          // on: {
          //   click: () => {
          //     // data.checked = !data.checked
          //   }
          // }
        }, [
          h('Span', [
            h('Icon', {
              props: {
                type: icon,
                size: '17'
              },
              style: {
                marginRight: '8px',
                color: color
              }
            }),
            h('Span', data.label)
          ])
        ])
      }
    }
  },
  methods: {
    handleGetPermissionTree () {
      getPermissionTree().then(
        res => {
          this.data = res.data
        }
      )
    },
    handleCheckPermission (val) {
      val.forEach(p => {
        if (p.type) {
          console.log(p, 'true')
        } else {
          console.log(p, 'false')
        }
      })
    }
  },
  mounted () {
    //
  },
  created () {
    this.handleGetPermissionTree()
  }
}
</script>

<style lang="less">
.count-style{
  font-size: 50px;
}
</style>
