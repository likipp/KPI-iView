<template>
  <div>
    <Layout :style="{minHeight: '100vh'}">
      <Sider :style="{background: '#fff',}">
        <Menu active-name="1-2" theme="light" width="auto">
          <UserTree :list=this.treeList @select="getSelect"></UserTree>
        </Menu>
      </Sider>
      <Content :style="{padding: '24px', minHeight: '280px', background: '#fff'}">
        <Card>
          <div style="padding-bottom: 10px">
            <Button style="margin-right:8px;" type="error" @click="handelDeleteSelectUser">
              <Icon type="ios-trash-outline" size="15" style="margin-bottom: 3px"></Icon>删除</Button>
            <Input placeholder="搜索" style="width: auto; margin-left: 5px;" v-model="getParams.search"
                   @on-click="handleGetUserList" @on-enter="handleGetUserList" clearable @on-clear="handleGetUserList">
            </Input>
            <Button style="float:right" type="primary" @click="createButton">
              <Icon type=" iconfont icon-jurassic_add-user" size="15" ></Icon>新增用户</Button>
          </div>
          <UserTable
            :list="this.userList"
            :total=this.total
            :loading="this.loading"
            :pageParams = this.getParams
            @userList="handleGetUserList"
            @callBack="updateInfo"
            @getSelectUser="getSelectUser"
          ></UserTable>
          <UserPage :total="this.total"></UserPage>
        </Card>
      </Content>
    </Layout>
    <UserModal @userList="handleGetUserList" :updateInfoList="this.updateInfoList"></UserModal>
  </div>
</template>

<script>
import { getUserList, deleteUser } from '../../api/personnel/user'
import { getOrganizationTree } from '../../api/personnel/organizationtree'
import { UserTable, UserTree, UserPage, UserModal } from '_c/user/'

export default {
  name: 'user',
  components: { UserTable, UserTree, UserPage, UserModal },
  data () {
    return {
      userModal: false,
      isCollapsed: false,
      loading: false,
      total: 1,
      getParams: {
        page: 1,
        page_size: 10,
        department: '',
        search: ''
      },
      userList: [],
      treeList: [],
      updateInfoList: [],
      selectUser: []
    }
  },
  methods: {
    handleGetUserList () {
      if (this.curPage >= this.getParams.page) {
        if (this.loading) return
        this.loading = true
        getUserList(this.getParams).then(
          res => {
            this.userList = res.data
            this.total = res.data.length
            this.loading = false
          }
        )
      } else {
        if (this.loading) return
        this.loading = true
        this.getParams.page = 1
        getUserList(this.getParams).then(
          res => {
            this.userList = res.data
            this.total = res.data.length
            this.loading = false
          }
        )
      }
    },
    handleGetOrganizationTree () {
      getOrganizationTree().then(
        res => {
          this.treeList = res.data
        }
      )
    },
    createButton () {
      this.$store.commit('setType', 'create')
      this.$store.commit('setModal', true)
    },
    getSelect (data) {
      if (data.length > 0) {
        for (let result of data) {
          if (data.indexOf(result) === 0) {
            this.getParams.department = result.title
          } else {
            this.getParams.department = this.getParams.department + ',' + result.title
          }
        }
        this.handleGetUserList()
      } else {
        this.getParams.department = ''
        this.handleGetUserList()
      }
    },
    updateInfo (value) {
      this.updateInfoList = value
    },
    getSelectUser (data) {
      this.selectUser = data
    },
    handelDeleteSelectUser () {
      if (this.selectUser.length === 1) {
        deleteUser(this.selectUser[0].id, this.selectUser[0].name).then(
          res => {
            this.$Message.success({ background: true, content: `删除${this.selectUser[0].name}成功!`, closable: true, duration: 5 })
            this.$emit('userList')
          }
        )
      } else if (this.selectUser.length > 1) {
        for (let user of this.selectUser) {
          deleteUser(user.id).then(
            res => {
            }
          ).catch(error)
        }
        this.$Message.success({ background: true, content: `批量删除用户成功!`, closable: true, duration: 5 })
      } else {
        this.$Message.error({ background: true, content: '未选中任何用户!', closable: true, duration: 5 })
      }
    }
  },
  created () {
    this.handleGetUserList()
    this.handleGetOrganizationTree()
  },
  computed: {
    curPage: function () {
      return Math.ceil(this.total / this.getParams.page_size)
    }
  }
}
</script>

<style scoped>
</style>
