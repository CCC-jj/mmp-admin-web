<template>
    <a-modal title="模板配置" :maskClosable="false" :visible.sync="visible" @cancel="visible = false">
        <a-form-model :model="dataForm" :rules="dataRule" ref="dataForm" label-width="100px" size="small">
            <a-form-model-item label="标题" prop="title">
                <a-input v-model="dataForm.title" placeholder="标题"></a-input>
            </a-form-model-item>
            <a-form-model-item label="链接" prop="url">
                <a-input v-model="dataForm.url" placeholder="跳转链接"></a-input>
            </a-form-model-item>
            <div>
                <a-form-model-item label="小程序appid" prop="miniprogram.appid">
                    <a-input v-model="dataForm.miniprogram.appid" placeholder="小程序appid"></a-input>
                </a-form-model-item>
                <a-form-model-item label="小程序路径" prop="miniprogram.pagePath">
                    <a-input v-model="dataForm.miniprogram.pagePath" placeholder="小程序pagePath"></a-input>
                </a-form-model-item>
            </div>
            <a-row>
                <a-col :span="16">
                    <a-form-model-item label="模版名称" prop="name">
                        <a-input v-model="dataForm.name" placeholder="模版名称"></a-input>
                    </a-form-model-item>
                </a-col>
                <a-col :span="8">
                    <a-form-model-item label="有效" prop="status">
                        <a-switch v-model="dataForm.status" placeholder="是否有效" :active-value="true" :inactive-value="false"></a-switch>
                    </a-form-model-item>
                </a-col>
            </a-row>
            <div class="form-group-area">
                <a-form-model-item  class="form-group-title">消息填充数据，请对照模板内容填写</a-form-model-item>
                <a-form-model-item>
                    <a-input type="textarea" disabled autosize v-model="dataForm.content" placeholder="模版"></a-input>
                </a-form-model-item>
                <a-row v-for="(item,index) in dataForm.data" :key="item.name">
                    <a-col :span="16">
                        <a-form-model-item :label="item.name" :prop="'data.'+index+'.value'" :rules="[{required: true,message: '填充内容不得为空', trigger: 'blur' }]">
                            <a-input type="textarea" autosize rows="1" v-model="item.value" placeholder="填充内容"  ></a-input>
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="8">
                        <a-form-model-item label="颜色" >
                            <a-input type="color" v-model="item.color" placeholder="颜色"></a-input>
                        </a-form-model-item>
                    </a-col>
                </a-row>
            </div>
        </a-form-model>
        <span slot="footer" class="dialog-footer">
            <a-button @click="visible = false">取消</a-button>
            <a-button type="primary" @click="dataFormSubmit()">确定</a-button>
        </span>
    </a-modal>
</template>

<script>
export default {
    data() {
        return {
            visible: false,
            dataForm: {
                id: 0,
                templateId: '',
                title: '',
                data: [],
                url: '',
                miniprogram:{appid:'',pagePath:''},
                content: '',
                status: true,
                name: ''
            },
            dataRule: {
                title: [
                    { required: true, message: '标题不能为空', trigger: 'blur' }
                ],
                data: [
                    { required: true, message: '内容不能为空', trigger: 'blur' }
                ],
                name: [
                    { required: true, message: '模版名称不能为空', trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
        init(id) {
            console.log('init',id)
            this.dataForm.id = id || 0
            this.visible = true
            this.$nextTick(() => {
                this.$refs['dataForm'].resetFields()
                if (this.dataForm.id) {
                    this.$http({
                        url: this.$http.adornUrl(`/manage/msgTemplate/info/${this.dataForm.id}`),
                        method: 'get',
                        params: this.$http.adornParams()
                    }).then(({ data }) => {
                        if (data && data.code === 200) {
                            this.transformTemplate(data.msgTemplate)
                        }else{
                            this.$message.error(data.msg)
                        }
                    })
                }
            })
        },
        /**
         * 根据content信息展开data配置项(content为微信公众平台后台配置的模板)
         * 如content='{{first.DATA}} ↵商品名称：{{keyword1.DATA}} ↵购买时间：{{keyword2.DATA}} ↵{{remark.DATA}}'
         * 则生成data=[{name:'first',value:'',color:''},{name:'first',value:'',color:''},{name:'first',value:'',color:''}]
         * 展示表单让管理员给对应的字段填充内容
         */
        transformTemplate(template){
            if(!template.miniprogram)template.miniprogram={appid:'',pagePath:''}
            if(template.data instanceof Array) {//已经配置过了，直接读取
                this.dataForm =  template
                return
            }
            
            template.data=[]
            let keysArray = template.content.match(/\{\{(\w*)\.DATA\}\}/g) || [] //示例： ["{{first.DATA}}", "{{keyword1.DATA}}", "{{keyword2.DATA}}", "{{remark.DATA}}"]
            keysArray.map(item=>{
                name=item.replace('{{','').replace('.DATA}}','')
                template.data.push({"name":name,"value":"",color:"#000000"})
            })
            this.dataForm = template
        },
        // 表单提交
        dataFormSubmit() {
            this.$refs['dataForm'].validate((valid) => {
                if (valid) {
                    this.$http({
                        url: this.$http.adornUrl(`/manage/msgTemplate/${!this.dataForm.id ? 'save' : 'update'}`),
                        method: 'post',
                        data: this.$http.adornData(this.dataForm)
                    }).then(({ data }) => {
                        if (data && data.code === 200) {
                            this.$message({
                                message: '操作成功',
                                type: 'success',
                                duration: 1500,
                                onClose: () => {
                                    this.visible = false
                                    this.$emit('refreshDataList')
                                }
                            })
                        } else {
                            this.$message.error(data.msg)
                        }
                    })
                }
            })
        }
    }
}
</script>
<style scoped>
.form-group-area{
    border:1px dotted gray;
}
.form-group-title{
    color: gray;
    font-size: 12px;
}
</style>