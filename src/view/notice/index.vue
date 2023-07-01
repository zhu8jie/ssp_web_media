<template>
    <div class="hello">
        通知中心
      <Poptip placement="bottom" width="332">
        <Input v-model="search.app_id_arr" placeholder="应用名称" />
        <div class='appIdSelect' slot="content">
          <Input class="appIdInput" style="width: 200px" placeholder="输入应用名称或ID"/>
          <div class="appID_quan">
            <Checkbox
              :indeterminate="indeterminate"
              :value="checkAll"
              @click.prevent.native="handleCheckAll">全选</Checkbox>
          </div>
          <div>
            <div class="appId_content">
              <CheckboxGroup v-model="checkAllGroup" @on-change="checkAllGroupChange">
                <div v-for="(item,index) in AppList" :key="'applist'+index" style="margin:10px 0">
                  <Checkbox :label="item.app_id">
                    <div style="display:inline-block">
                      <div class="checkbox_content">
                        <div class="checkbox_name">
                          <span>{{item.app_name}}</span>
                        </div>
                        <div class="checkbox_active">
                          <span>{{item.os_type_text}}</span>
                          <span>ID:{{item.app_id}}</span>
                        </div>
                      </div>
                    </div>
                  </Checkbox>
                </div>
              </CheckboxGroup>
            </div>
          </div>
        </div>
      </Poptip>
    </div>
</template>

<script>
export default {
    name: 'dataRevenue',
    data() {
        return {
            msg: 'Welcome to Your Vue.js App'
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
