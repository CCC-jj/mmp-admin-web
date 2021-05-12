<template>
    <a-modal title="消息回复" :maskClosable="false" :visible.sync="visible">
        <a-form-model :model="dataForm" :rules="dataRule" ref="dataForm">
            <a-form-model-item prop="replyContent">
                <a-input v-model="dataForm.replyContent" type="textarea" :rows="5" placeholder="回复内容" maxLength="600" show-word-limit :autosize="{ minRows: 5, maxRows: 30 }" autocomplete></a-input>
                <a-button type="text" v-show="'text'==dataForm.replyType" @click="addLink">插入链接</a-button>
            </a-form-model-item>
        </a-form-model>
        <span slot="footer" class="dialog-footer">
            <a-button @click="visible = false">取消</a-button>
            <a-button type="success" @click="dataFormSubmit()" :disabled="uploading">{{uploading?'发送中...':'发送'}}</a-button>
        </span>
    </a-modal>
</template>

<script>
export default {
    data() {
        return {
            visible: false,
            uploading: false,
            dataForm: {
                openid:'',
                replyType:'text',
                replyContent:''
            },
            dataRule: {
                replyContent: [
                    { required: true, message: "回复内容不能为空", trigger: "blur" }
                ]
            }
        }
    },
    components:{
        WxMsgPreview:()=>import('@/components/wx-msg-preview')
    },
    methods: {
        init(openid) {
            if(!openid)throw '参数异常'
            this.dataForm.openid=openid
            this.visible = true
        },
        // 表单提交
        dataFormSubmit() {
            if(this.uploading)return
            this.uploading=true
            this.$refs['dataForm'].validate((valid) => {
                if (valid) {
                    this.$http({
                        url: this.$http.adornUrl(`/manage/wxMsg/reply`),
                        method: 'post',
                        data: this.$http.adornData(this.dataForm)
                    }).then(({ data }) => {
                        if (data && data.code === 200) {
                            this.$message({
                                message: '回复成功',
                                type: 'success',
                                duration: 1500,
                                onClose: () => {
                                    this.visible = false
                                    
                                }
                            })
                            this.$emit("success",{...this.dataForm});
                            this.dataForm.replyContent=''
                        } else {
                            this.$message.error(data.msg)
                        }
                        this.uploading=false
                    })
                }
            })
        },
        addLink() {
            this.dataForm.replyContent += '<a href="链接地址">链接文字</a>'
        }
    }
}
</script>
<style scoped>
.msg-container{
    background: #eee;
}
</style>