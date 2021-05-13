<template>
    <a-modal title="云存储配置" :maskClosable="false" :visible.sync="visible">
        <a-form-model :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px">
            <a-form-model-item size="mini" label="存储类型">
                <a-radio-group v-model="dataForm.type">
                    <a-radio :label="1">七牛</a-radio>
                    <a-radio :label="2">阿里云</a-radio>
                    <a-radio :label="3">腾讯云</a-radio>
                </a-radio-group>
            </a-form-model-item>
            <template v-if="dataForm.type === 1">
                <a-form-model-item label="域名">
                    <a-input v-model="dataForm.qiniuDomain" placeholder="七牛绑定的域名"></a-input>
                </a-form-model-item>
                <a-form-model-item label="路径前缀">
                    <a-input v-model="dataForm.qiniuPrefix" placeholder="不设置默认为空"></a-input>
                </a-form-model-item>
                <a-form-model-item label="AccessKey">
                    <a-input v-model="dataForm.qiniuAccessKey" placeholder="七牛AccessKey"></a-input>
                </a-form-model-item>
                <a-form-model-item label="SecretKey">
                    <a-input v-model="dataForm.qiniuSecretKey" placeholder="七牛SecretKey"></a-input>
                </a-form-model-item>
                <a-form-model-item label="空间名">
                    <a-input v-model="dataForm.qiniuBucketName" placeholder="七牛存储空间名"></a-input>
                </a-form-model-item>
            </template>
            <template v-else-if="dataForm.type === 2">
                <a-form-model-item label="域名">
                    <a-input v-model="dataForm.aliyunDomain" placeholder="阿里云绑定的域名"></a-input>
                </a-form-model-item>
                <a-form-model-item label="路径前缀">
                    <a-input v-model="dataForm.aliyunPrefix" placeholder="不设置默认为空"></a-input>
                </a-form-model-item>
                <a-form-model-item label="EndPoint">
                    <a-input v-model="dataForm.aliyunEndPoint" placeholder="阿里云EndPoint"></a-input>
                </a-form-model-item>
                <a-form-model-item label="AccessKeyId">
                    <a-input v-model="dataForm.aliyunAccessKeyId" placeholder="阿里云AccessKeyId"></a-input>
                </a-form-model-item>
                <a-form-model-item label="AccessKeySecret">
                    <a-input v-model="dataForm.aliyunAccessKeySecret" placeholder="阿里云AccessKeySecret"></a-input>
                </a-form-model-item>
                <a-form-model-item label="BucketName">
                    <a-input v-model="dataForm.aliyunBucketName" placeholder="阿里云BucketName"></a-input>
                </a-form-model-item>
            </template>
            <template v-else-if="dataForm.type === 3">
                <a-form-model-item label="域名">
                    <a-input v-model="dataForm.qcloudDomain" placeholder="腾讯云绑定的域名"></a-input>
                </a-form-model-item>
                <a-form-model-item label="路径前缀">
                    <a-input v-model="dataForm.qcloudPrefix" placeholder="不设置默认为空"></a-input>
                </a-form-model-item>
                <a-form-model-item label="AppId">
                    <a-input v-model="dataForm.qcloudAppId" placeholder="腾讯云AppId"></a-input>
                </a-form-model-item>
                <a-form-model-item label="SecretId">
                    <a-input v-model="dataForm.qcloudSecretId" placeholder="腾讯云SecretId"></a-input>
                </a-form-model-item>
                <a-form-model-item label="SecretKey">
                    <a-input v-model="dataForm.qcloudSecretKey" placeholder="腾讯云SecretKey"></a-input>
                </a-form-model-item>
                <a-form-model-item label="BucketName">
                    <a-input v-model="dataForm.qcloudBucketName" placeholder="腾讯云BucketName"></a-input>
                </a-form-model-item>
                <a-form-model-item label="Bucket所属地区">
                    <a-input v-model="dataForm.qcloudRegion" placeholder="如：sh（可选值 ，华南：gz 华北：tj 华东：sh）"></a-input>
                </a-form-model-item>
            </template>
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
            dataForm: {},
            dataRule: {}
        }
    },
    methods: {
        init(id) {
            this.visible = true
            this.$http({
                url: this.$http.adornUrl('/sys/oss/config'),
                method: 'get',
                params: this.$http.adornParams()
            }).then(({ data }) => {
                this.dataForm = data && data.code === 200 ? data.config : []
            })
        },
        // 表单提交
        dataFormSubmit() {
            this.$refs['dataForm'].validate((valid) => {
                if (valid) {
                    this.$http({
                        url: this.$http.adornUrl('/sys/oss/saveConfig'),
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

