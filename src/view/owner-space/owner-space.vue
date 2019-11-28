<template>
  <div class="own-space">
    <Card class="own-space-new">
      <div class="own-wrap">
        <div style="width: 240px">
          <Menu active-name="基本信息" theme="light" @on-select="changeMenu">
            <MenuItem name="基本信息">基本信息</MenuItem>
            <MenuItem name="安全设置">安全设置</MenuItem>
          </Menu>
        </div>
        <div style="padding: 8px 40px;width:100%">
          <div class="title">{{ currMenu }}</div>
          <div>
            <div v-show="currMenu === '基本信息'">
              <Form :label-width="90" label-position="left">
                <FormItem label="用户头像：">
<!--                  <upload-pic-thumb-->
<!--                    @on-change="userForm.avatar=$event"-->
<!--                    :multiple="false"-->
<!--                    ref="uploadThumb"-->
<!--                  ></upload-pic-thumb>-->
                </FormItem>
                <FormItem label="昵称：" prop="nickName">
                  <Input style="width: 250px" />
                </FormItem>
                <FormItem label="个人简介：" prop="description">
                  <Input
                    type="textarea"
                    style="width: 250px"
                    :autosize="{minRows: 3,maxRows: 5}"
                    placeholder="个人简介"
                  ></Input>
                </FormItem>
              </Form>
            </div>
            <div v-show="currMenu === '安全设置'" class="safe">
              <div class="item">
                <div>
                  <div class="title">帐号密码</div>
                </div>
                <div>
                  <Button type="text" @click="changePass">修改</Button></div>
              </div>
            </div>
          </div>
      </div>
      </div>
      <Modal width="500" title="修改密码" draggable scrollable v-model="changePassModel" @on-cancel="cancel">
        <Form ref="changePassForm" :model="changePassForm" :label-width="100" :rules="ruleChangePassForm" label-colon>
          <FormItem label="原密码" prop="oldPass">
            <Input type="password" password v-model="changePassForm.oldPass" placeholder="请输入原密码"></Input>
          </FormItem>
          <FormItem label="新密码" prop="newPass">
            <SetPassword v-model="changePassForm.newPass" @on-change="changeInputPass"></SetPassword>
          </FormItem>
          <FormItem label="确认新密码" prop="newPassCon">
            <Input type="password" password v-model="changePassForm.newPassCon" placeholder="请再次输入新密码"></Input>
          </FormItem>
        </Form>
        <div slot="footer">
          <Button @click="cancel">取消</Button>
          <Button type="primary" @click="handleChangePassword" :disabled="submitDisabled">修改</Button>
        </div>
      </Modal>
    </Card>
  </div>
</template>

<script>
import SetPassword from '_c/xboot/set-password';
import { changePassword } from '../../api/personnel/user';

export default {
  name: 'owner-space',
  components: { SetPassword },
  data () {
    const validConPassword = (rule, value, callback) => {
      if (value !== this.changePassForm.newPass) {
        this.status = 'false';
        callback(new Error('两次输入的密码不一致'))
      } else {
        this.status = 'true';
        callback()
      }
    };
    return {
      changePassModel: false,
      currMenu: '基本信息',
      strength: '',
      status: 'false',
      changePassForm: {
        oldPass: '',
        newPass: '',
        newPassCon: ''
      },
      ruleChangePassForm: {
        oldPass: [{ required: true, message: '旧密码不能为空', trigger: 'blur' }],
        newPass: [{ required: true, message: '新密码不能为空', trigger: 'blur' }],
        newPassCon: [{ required: true, message: '确认新密码不能为空', trigger: 'blur' }, { validator: validConPassword, trigger: 'blur' }]
      }
    }
  },
  methods: {
    changeMenu (v) {
      this.currMenu = v
    },
    changePass () {
      this.changePassModel = true
    },
    changeInputPass (v, grade, strength) {
      this.strength = strength;
    },
    handleChangePassword () {
      let id = this.$store.state.user.userId;
      changePassword(id, this.changePassForm).then(
        res => {
          console.log(res.status, 6666)
          this.$Message.success({ background: true, content: '密码修改成功', duration: 3 });
          this.changePassModel = false;
          this.$refs['changePassForm'].resetFields()
        }
      ).catch(error => {
        if (error.response.status === 500) {
          this.$Message.error({ background: true, content: '旧密码错误', duration: 3 });
        }
      })
    },
    cancel () {
      this.changePassModel = false;
      this.$refs['changePassForm'].resetFields();
      this.$Message.info({ background: true, content: '点击了取消', duration: 3 })
    }
  },
  computed: {
    submitDisabled () {
      let disabled = false;
      if (this.changePassForm.oldPass.length < 6 || this.changePassForm.newPass.length < 6 ||
        this.changePassForm.newPassCon.length < 6) disabled = true;
      if (this.status !== 'true') disabled = true;
      return disabled
    }
  }
}
</script>

<style lang="less">
@import './owner-space';
</style>
