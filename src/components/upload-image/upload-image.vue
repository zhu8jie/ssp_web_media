<template>
  <div class="upload-image" :style="{width: widthVal+'px', height: heightVal+'px'}"  >
    <Upload  :action="`/api/v1/base/upload`"
            :ref="field"
            v-show="!value && !loading"
            :data="{type:2}"
            :show-upload-list="false"
             :format="format"
            :before-upload="handleBeforeUpload"
    >
      <div :id="'uploadAgain'+idVal"  class="logo-upload" :style="{width: widthVal+'px', height: heightVal+'px'}">
         <slot></slot>
      </div>
    </Upload>
    <div class="logo-image" :style="{width: widthVal+'px', height: heightVal+'px',lineHeight:heightVal + 'px'}" v-show="value || loading">
      <img :src="value" v-if="value" class="ry-align-center" :style="{maxWidth: widthVal-2+'px', maxHeight: heightVal-2 +'px'}">
      <div class="cover" :style="{width: widthVal+'px', height: heightVal+'px',lineHeight:heightVal+'px' }" :class="{'is-edit': disEdit}">
        <div class="cover_content" :style="{width: widthVal+'px', height: heightVal+'px'}">
          <div class="left">
            <i class="icon icon-upload" @click="removeUpload"/>
          </div>
          <div class="right">
            <i class="icon icon-zoom-up" @click="modelShow"/>
          </div>
        </div>
      </div>
      <Spin class="ry-align-center" v-show="loading"></Spin>
    </div>
    <Modal v-model="uploadImgModel" class="mediaModal">
      <div class="img_content">
        <img :src="value" alt/>
      </div>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
import axios from '@/libs/api.request'
export default {
    props: {
        field: {
            type: String
        },
        value: {
            type: String
        },
        widthVal: {
            type: Number,
            default: 60
        },
        heightVal: {
            type: Number,
            default: 60
        },
        idVal: {
            type: Number
        },
        format: { // 上传的format类型， 必须小写
            type: Array,
            default: function() {
                return ['jpg', 'jpeg', 'png']
            }
        },
        disEdit: {
            type: Boolean,
            default: false
        },
        size: {
            type: Number,
            default: 10
        }
    },
    data() {
        return {
            loading: false,
            uploadList: [],
            uploadImgModel: false,
            uploadImgUrl: ''
        }
    },
    computed: {},
    watch: {
        uploadList(val) {
            if (val.length > 0) {
                this.uploadPublic()
            }
        }
    },
    methods: {
      removeUpload(field) {
        const sub = document.getElementById('uploadAgain' + this.idVal)
        sub.click()
        // !this.disEdit && this.$emit('input', undefined)
        },
        handleFormatError(file) {
            this.$Message.warning('图片格式错误')
            this.loading = false
        },
        uploadPublic() { // 图片、视频公共批量上传
            let formData = new FormData()
            for (let i = 0; i < this.uploadList.length; i++) {
                formData.append('files', this.uploadList[i]) // 文件对象
            }
            formData.append('type', 2)
            axios.request({
                url: '/api/v1/base/upload',
                method: 'POST',
                data: formData
            }).then(res => {
                let date = res
                if (date.code === 200) {
                    this.source_id = []
                    this.$Message.success('上传成功')
                    let imgUrl = date.data.host + date.data.url[0]
                    date.data && this.$emit('input', imgUrl)
                } else {
                    this.uploadList = []
                    this.loading = false
                    // this.$Message.error(date.msg)
                }
                this.loading = false
            }).catch(error => {
                this.uploadList = []
                this.loading = false
            })
        },
      handleBeforeUpload(file) {
          let type = file.type && file.type.indexOf('/') ? file.type.split('/')[1].toLowerCase() : ''
            this.uploadList = []
            if (file && file.size > (this.size * 1024 * 1024)) {
                this.$Message.warning('文件不能大于' + this.size + 'M')
                return false
            } else if (!this.format.includes(type)) {
                this.$Message.error({content: '格式错误', duration: 3})
                return false
            } else {
                this.uploadList.push(file)
                return false
            }
        },
        modelShow() {
            this.uploadImgModel = true
        }
    }
}
</script>
<style lang="stylus">
      .mediaModal{
        .img_content {
          width 400px
          height 400px
          margin 0 auto
          line-height 400px
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          flex-direction: column;
          img {
            text-align center
            max-width 400px
            max-height 400px
            vertical-align middle
          }
        }
        .ivu-modal-footer {
          border 0px;
          padding 0px
        }
    }
</style>

<style lang="stylus" scoped>
  @import './index.styl';

</style>
