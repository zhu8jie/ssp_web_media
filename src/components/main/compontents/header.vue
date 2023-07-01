<template>
    <div class="clearfix root-header">
        <div class="header-card"><img src="~@/assets/image/header_logo.png">数字欢喜</div>
        <div class="user-avatar-dropdown">
            <Dropdown trigger="click" placement="bottom-end" @on-click="handleClick">
                <a href="javascript:void(0)">
                    {{userName}}
                    <Icon type="ios-arrow-down"></Icon>
                </a>
                <DropdownMenu slot="list">
                    <DropdownItem name="account">账户信息</DropdownItem>
                    <DropdownItem name="logout">退出</DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </div>
    </div>
</template>
<script>

import {mapActions, mapMutations} from 'vuex'

export default {
    name: 'Header',
    computed: {
        userName() {
            return this.$store.state.user.userName
        }
    },
    methods: {
        ...mapActions([
            'logout'
        ]),
        ...mapMutations([
            'setLoginOut'
        ]),
        /**
         * [handleClick 切换点击]
         * @param  {[type]} name [description]
         * @return {[type]}      [description]
         */
        handleClick(name) {
            switch (name) {
                case 'logout':
                    this.toLogOut()
                    break
                case 'account':
                    this.toAccount()
                    break
            }
        },
        /**
         * [toLogOut 退出登录]
         * @return {[type]} [description]
         */
        toLogOut() {
            this.$Modal.confirm({
                title: '确认退出？',
                onOk: () => {
                    this.logout().then(res => {
                        if (res.code === 200) {
                            this.setLoginOut() // 清除
                            this.$Message.success({content: '退出成功', duration: 3})
                            this.$router.replace({name: 'login'})
                        } else {
                            this.$Message.error({content: res.msg, duration: 3})
                        }
                    })
                },
                onCancel() {
                    console.log('取消')
                }
            })
        },
        /**
         * [toAccount 跳转到个人中心]
         * @return {[type]} [description]
         */
        toAccount() {
            this.$router.push({name: 'infroAccout'})
        }
    }
}
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
.header-card
    display: inline
    float: left
    font-size: 16px
    font-weight: bold
    color: #FFF
    height: 50px
    line-height: 50px
    img
        margin-right: 10px
        width: 28px
        height: 28px
        vertical-align: -8px
.user-avatar-dropdown
    display: inline
    float: right
    a
        color: #FFF

</style>
