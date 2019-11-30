<template>
  <div>
<!--    <div class="upload-list" v-if="this.uploadList[0].status === 'failed'">11111</div>-->
    <div class="upload-list" v-for="(item,index) in uploadList" :key="index">
      <div v-if="item.status === 'finished'">
        <img :src="item.url">
        <div class="upload-list-cover">
          <Icon type="ios-eye-outline" @click="handleView(item.url)">预览</Icon>
          <Icon type="ios-trash-outline" @click="handleRemove(item)">删除</Icon>
        </div>
      </div>
      <div v-else-if="item.status === 'failed'">
        <Avatar :style="{ background: color }">{{ userName }}</Avatar>
      </div>
      <div v-else>
        <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
      </div>
    </div>
    <Upload
      ref="upload"
      :multiple="multiple"
      :show-upload-list="false"
      :on-success="handleSuccess"
      :on-error="handleError"
      :format="['jpg','jpeg','png','gif']"
      :max-size="5120"
      :on-format-error="handleFormatError"
      :on-exceeded-size="handleMaxSize"
      :before-upload="handleBeforeUpload"
      type="drag"
      :action="uploadFileUrl"
      :headers="headers"
      style="display: inline-block;width:58px;"
    >
      <div style="width: 58px;height:58px;line-height: 58px;">
        <Icon type="ios-cloud-upload" size="50"></Icon>
      </div>
    </Upload>
<!--    <Button type="primary" @click="upload" :loading="loadingStatus" style="display: inline-block;width:58px;">{{ loadingStatus ? '上传中' : '上传' }}</Button>-->
    <Modal title="图片预览" v-model="viewImage" :styles="{top: '30px'}" draggable>
      <img :src="imgUrl" alt="无效的图片链接" style="width: 100%;margin: 0 auto;display: block;">
      <div slot="footer">
        <Button @click="viewImage=false">关闭</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { uploadFile } from '@/api/index';

const ColorList = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae'];
export default {
  name: 'uploadPicThumb',
  props: {
    value: Object,
    multiple: {
      type: Boolean,
      default: true
    },
    limit: {
      type: Number,
      default: 10
    }
  },
  data () {
    return {
      loadingStatus: false,
      accessToken: {},
      uploadFileUrl: uploadFile,
      uploadList: [],
      viewImage: false,
      imgUrl: '',
      headers: {}
    };
  },
  methods: {
    init () {
      this.headers = {
        'Authorization': 'JWT ' + this.$store.state.user.token
      }
    },
    upload () {
      console.log('Button')
    },
    handleView (imgUrl) {
      this.imgUrl = imgUrl;
      this.viewImage = true;
    },
    handleRemove (file) {
      const uploadList = this.uploadList;
      this.uploadList.splice(uploadList.indexOf(file), 1);
      this.returnValue();
    },
    handleSuccess (res, file) {
      if (res.image) {
        file.url = res.image;
        // 单张图片处理
        if (!this.multiple && this.uploadList.length > 0) {
          // 删除第一张
          this.uploadList.splice(0, 1);
        }
        this.uploadList.push(file);
        // 返回组件值
        this.returnValue();
      } else {
        this.$Message.error(res.message);
      }
    },
    handleError (error, file, fileList) {
      this.$Message.error(error.toString());
    },
    handleFormatError (file) {
      this.$Notice.warning({
        title: '不支持的文件格式',
        desc:
          '所选文件‘ ' +
          file.name +
          ' ’格式不正确, 请选择 .jpg .jpeg .png .gif图片格式文件'
      });
    },
    handleMaxSize (file) {
      this.$Notice.warning({
        title: '文件大小过大',
        desc: '所选文件‘ " + file.name + " ’大小过大, 不得超过 5M.'
      });
    },
    handleBeforeUpload () {
      if (this.multiple && this.uploadList.length >= this.limit) {
        this.$Message.warning('最多只能上传"+this.limit+"张图片');
        return false;
      }
      return true;
    },
    returnValue () {
      if (!this.uploadList || this.uploadList.length < 1) {
        if (!this.multiple) {
          this.$emit('on-change', '');
        } else {
          this.$emit('on-change', []);
        }
        return;
      }
      if (!this.multiple) {
        // 单张
        let v = this.uploadList[0].url;
        this.$emit('on-change', v);
      } else {
        let v = [];
        this.uploadList.forEach(e => {
          v.push(e.url);
        });
        this.$emit('on-change', v);
      }
    },
    setData (v) {
      if (this.multiple && v.length > this.limit) {
        this.$Message.warning('设置图片数据失败，最多只能设置"+this.limit+"张图片');
        return;
      }
      if (typeof v === 'string') {
        this.uploadList = [];
        if (v === '') {
          let item = {
            url: v,
            status: 'failed'
          };
          this.uploadList.push(item);
        } else {
          let item = {
            url: v,
            status: 'finished'
          };
          this.uploadList.push(item);
        }
      } else if (typeof v === 'object') {
        this.uploadList = [];
        v.forEach(e => {
          let item = {
            url: e,
            status: 'finished'
          };
          this.uploadList.push(item);
        });
      }
      this.returnValue();
    }
  },
  mounted () {
    this.init();
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
};
</script>

<style lang="less">
  .upload-list {
    display: inline-block;
    width: 80px;
    height: 80px;
    text-align: center;
    line-height: 80px;
    border: 1px solid transparent;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    position: relative;
    /*box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);*/
    margin-right: 5px;
  }
  .upload-list img {
    width: 100%;
    height: 100%;
  }
  .upload-list-cover {
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.6);
  }
  .upload-list:hover .upload-list-cover {
    display: block;
  }
  .upload-list-cover i {
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    margin: 0 2px;
  }
</style>
