<template>
  <div class="user-avator-dropdown">
    <Dropdown @on-click="handleClick">
      <Badge :dot="!!messageUnreadCount">
        <Avatar :src="userAvator" v-if="userAvator !== ''"/>
        <Avatar :style="{ background: color }" v-else>{{ userName }}</Avatar>
      </Badge>
      <Icon :size="18" type="md-arrow-dropdown"></Icon>
      <DropdownMenu slot="list">
<!--        <DropdownItem name="message">-->
<!--          消息中心<Badge style="margin-left: 10px" :count="messageUnreadCount"></Badge>-->
<!--        </DropdownItem>-->
        <router-link to="/owner/owner-space">
          <DropdownItem name="ownerSpace">个人中心</DropdownItem>
        </router-link>
        <DropdownItem name="logout">退出登录</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </div>
</template>

<script>
import './user.less'
import { mapActions } from 'vuex'

const ColorList = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae'];
export default {
  name: 'User',
  props: {
    userAvator: {
      type: String,
      default: ''
    },
    messageUnreadCount: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      // color: ColorList[0]
    }
  },
  methods: {
    ...mapActions([
      'Logout'
    ]),
    logout () {
      this.Logout().then(() => {
        this.$router.push({
          name: 'login'
        })
      })
    },
    message () {
      this.$router.push({
        name: 'message_page'
      })
    },
    ownerSpace () {
      //
    },
    handleClick (name) {
      switch (name) {
        case 'logout': this.logout();
          break;
        case 'message': this.message();
          break;
        // case 'ownerSpace': this.ownerSpace()
      }
    }
  },
  computed: {
    userName () {
      return this.$store.state.user.name
    },
    color () {
      const index = this.$store.state.user.userId;
      return index < ColorList.length - 1 ? ColorList[index + 1] : ColorList[0];
    }
  }
}
</script>
