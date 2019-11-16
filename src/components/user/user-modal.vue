<template>
  <Modal width="800" :title="type === 'create' ? '增加用户' : '修改用户'" draggable
         scrollable v-model="modal" @on-cancel="cancel('userForm')">
    <Row>
      <Alert type="warning" show-icon>
        <Icon type="ios-bulb-outline" slot="icon"></Icon>
        <template slot="desc">带*填写完后，并且密码必须大于6位数，提交才可以点击.并且默认密码是:
        <span style="color: #ff0000">123456</span>
        </template>
      </Alert>
    </Row>
    <Form ref="userForm" :model="userForm" :label-width="100" label-colon :rules="ruleUserForm">
      <Row>
        <Col span="12">
          <FormItem label="用户名" prop="username">
            <Input v-model="userForm.username" placeholder="请输入用户名"></Input>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="姓名" prop="name">
            <Input v-model="userForm.name" placeholder="请输入姓名"></Input>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="12">
          <FormItem label="部门" prop="department">
            <treeselect v-model="userForm.department" :options="depTree" :expand-all="true" placeholder="请选择部门"></treeselect>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="上级主管" prop="superior">
            <treeselect v-model="userForm.superior" :disable-branch-nodes="true" :options="userTree" placeholder="请选择上级主管"></treeselect>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="12">
          <FormItem label="邮箱" prop="email">
            <Input v-model="userForm.email" placeholder="请输入邮箱地址"></Input>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="手机号码" prop="mobile">
            <Input v-model="userForm.mobile" placeholder="请输入手机号码"></Input>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <FormItem label="系统身份" prop="userStatus">
          <Checkbox label="is_active" v-model="userForm.is_active" prop="is_active">已激活</Checkbox>
          <Checkbox label="is_staff" v-model="userForm.is_staff" prop="is_staff">登录后台</Checkbox>
          <Checkbox label="is_superuser" v-model="userForm.is_superuser" prop="is_superuser">管理员</Checkbox>
        </FormItem>
      </Row>
    </Form>
    <div slot="footer">
      <Button @click="cancel">取消</Button>
      <!--使用v-if对type类型做判断使用哪个Button-->
      <Button type="primary" v-if="type === 'create'"
              @click="handelCreateUser">确定</Button>
      <Button type="primary" v-else @click="handelUpdateUser">修改</Button>
    </div>
  </Modal>
</template>

<script>
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { getOrganizationTree, getUserTree } from '@/api/personnel/organizationtree'
import { createUser, updateUser } from '@/api/personnel/user'
import { isvalidMoblie } from '../../libs/validate'

export default {
  name: 'user-modal',
  props: [ 'updateInfoList' ],
  components: { Treeselect },
  data () {
    const validMoblie = (rule, value, callback) => {
      if (!value) {
        callback(new Error('手机号码不能为空'))
      } else if (!isvalidMoblie(value)) {
        callback(new Error('请输入正确的11位手机号码'))
      } else {
        callback()
      }
    }
    return {
      submitDisabled: false,
      depTree: [],
      userTree: [],
      userStatus: ['is_active', 'is_staff', 'is_superuser'],
      userForm: {
        username: '',
        name: '',
        mobile: null,
        email: null,
        roles: [],
        department: null,
        superior: null,
        is_active: true,
        is_staff: false,
        is_superuser: false
      },
      ruleUserForm: {
        username: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
        name: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
        department: [{ required: true, message: '部门不能为空', trigger: 'blur' }],
        email: [
          { required: true, message: '邮箱不能为空', trigger: 'blur' },
          { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
        ],
        mobile: [
          { validator: validMoblie, trigger: 'blur', required: true }
        ]
      }
    }
  },
  methods: {
    handelGetTree () {
      getOrganizationTree().then(
        res => {
          this.depTree = res.data
        }
      )
    },
    handelGetUserTree () {
      getUserTree().then(
        res => {
          this.userTree = res.data
        }
      )
    },
    handelCreateUser () {
      createUser(this.userForm).then(
        res => {
          this.$Message.success(`新增${this.userForm.name}成功!`)
          this.$store.commit('setModal', false)
          this.$refs['userForm'].resetFields()
          this.userForm.is_staff = false
          this.userForm.is_superuser = false
          this.$emit('userList')
        }
      )
    },
    handelUpdateUser () {
      const { id, ...data } = this.userForm
      updateUser(id, data).then(
        res => {
          this.$Message.success(`修改${this.userForm.name}成功!`)
          this.$store.commit('setModal', false)
          this.$emit('userList')
        }
      )
    },
    handelDeleteUser () {},
    cancel () {
      this.$Message.info({ background: true, content: '取消操作', closable: true, duration: 5 })
      this.$store.commit('setModal', false)
      this.$emit('userList')
    }
  },
  created () {
    this.handelGetTree()
    this.handelGetUserTree()
  },
  computed: {
    // username: {
    //   get () {
    //     return this.$store.state.users.userForm.username
    //   },
    //   set (value) {
    //     this.$store.commit('setUsername', value)
    //   }
    // },
    // name: {
    //   get () {
    //     return this.$store.state.users.userForm.name
    //   },
    //   set (value) {
    //     this.$store.commit('setName', value)
    //   }
    // },
    // mobile: {
    //   get () {
    //     return this.$store.state.users.userForm.mobile
    //   },
    //   set (value) {
    //     this.$store.commit('setMobile', value)
    //   }
    // },
    // email: {
    //   get () {
    //     return this.$store.state.users.userForm.email
    //   },
    //   set (value) {
    //     this.$store.commit('setEmail', value)
    //   }
    // },
    // department: {
    //   get () {
    //     return this.$store.state.users.userForm.department
    //   },
    //   set (value) {
    //     this.$store.commit('setDepartment', value)
    //   }
    // },
    // superior: {
    //   get () {
    //     return this.$store.state.users.userForm.superior
    //   },
    //   set (value) {
    //     this.$store.commit('setSuperior', value)
    //   }
    // },
    // roles: {
    //   get () {
    //     return this.$store.state.users.userForm.roles
    //   },
    //   set (value) {
    //     this.$store.commit('setRoles', value)
    //   }
    // },
    // is_active: {
    //   get () {
    //     return this.$store.state.users.userForm.is_active
    //   },
    //   set (value) {
    //     this.$store.commit('setIs_active', value)
    //   }
    // },
    // is_staff: {
    //   get () {
    //     return this.$store.state.users.userForm.is_staff
    //   },
    //   set (value) {
    //     this.$store.commit('setIs_staff', value)
    //   }
    // },
    // is_superuser: {
    //   get () {
    //     return this.$store.state.users.userForm.is_superuser
    //   },
    //   set (value) {
    //     this.$store.commit('setIs_superuser', value)
    //   }
    // },
    type: {
      get () {
        return this.$store.state.users.type
      }
    },
    modal: {
      get () {
        return this.$store.state.users.modal
      }
    }
  },
  watch: {
    // updateInfoList () {
    //   this.userForm = this.updateInfoList
    //   this.userForm.superior = this.updateInfoList.superior.id
    //   this.userForm.department = this.updateInfoList.department.id
    //   console.log(this.userForm, 99999)
    // }
    type () {
      console.log(this.$store.state.users.userForm, 666)
      this.userForm = this.$store.state.users.userForm
    }
  }
}
</script>

<style scoped>

</style>
