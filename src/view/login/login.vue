<template>
  <div class="login" @keydown.enter="handleSubmit">
    <Row type="flex" justify="center" align="bottom">
      <Col style="width: 369px">
        <div class="login-con">
          <p slot="title" style="color: black">
            <Icon type="md-log-in"></Icon>
            欢迎登录
          </p>
          <Form ref="loginForm" :model="form" :rules="rules" class="form">
            <FormItem prop="userName">
              <Input v-model="form.userName" placeholder="请输入用户名" clearable prefix="ios-contact" size="large">
              </Input>
            </FormItem>
            <FormItem prop="password">
              <Input type="password" v-model="form.password" password placeholder="请输入密码" clearable prefix="ios-lock" size="large">
              </Input>
            </FormItem>
            <FormItem>
              <Checkbox>记住密码</Checkbox>
            </FormItem>
            <FormItem>
              <Button @click="handleSubmit" type="primary" long>登录</Button>
            </FormItem>
          </Form>
        </div>
      </Col>
    </Row>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import router from '../../router'
import { backendMenusToRouters } from '../../libs/util'
export default {
  data () {
    return {
      form: {
        userName: '',
        password: ''
      },
      rules: {
        userName: [
          { required: true, message: '账号不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    //
  },
  methods: {
    ...mapActions([
      'handleLogin'
    ]),
    handleSubmit () {
      const userName = this.form.userName
      const password = this.form.password
      this.handleLogin({
        username: userName,
        password: password
      }).then(() => {
        this.$Message.success('登录成功');
        this.$store.dispatch('getUserRouters').then(
          res => {
            const routers = backendMenusToRouters(res);
            router.addRoutes(routers);
            this.$store.commit('setRouters', routers)
          }
        );
        this.$router.push({
          name: 'home'
        })
      }).catch(() => {
        this.$Message.error('用户名或者密码错误')
      })
    }
  }
}
</script>

<style lang="less">
  @import './login.less';
</style>
