<template>
    <a-modal width="700px" :title="!dataForm.id ? '新增' : '修改'" :maskClosable="false" :visible.sync="visible" @cancel="visible = false">
        <a-form-model :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" v-bind="{labelCol: { span: 3 },wrapperCol: { span: 21 },}">
            <a-form-model-item label="媒体文件">
                <a-button type="primary">
                    选择文件
                    <input type="file" style="opacity: 0;height: 100%;position: absolute;left: 0;top: 0;" @change="onFileChange" />
                </a-button>
                <div>{{dataForm.file.name}}</div>
            </a-form-model-item>
            <a-form-model-item label="媒体类型" prop="mediaType">
                <a-select v-model="dataForm.mediaType" placeholder="媒体类型" style="width:100%">
                    <a-select-option value="image">图片（2M以内，支持PNG\JPEG\JPG\GIF）</a-select-option>
                    <a-select-option value="video">视频（10M以内，只支持MP4）</a-select-option>
                    <a-select-option value="voice">语音（2M、60s以内，支持AMR\MP3）</a-select-option>
                    <a-select-option value="thumb">缩略图（64K以内JPG）</a-select-option>
                </a-select>
            </a-form-model-item>
            <a-form-model-item label="素材名称" prop="fileName">
                <a-input v-model="dataForm.fileName" placeholder="为便于管理建议按用途分类+素材内容命名"></a-input>
            </a-form-model-item>
        </a-form-model>
        <span slot="footer" class="dialog-footer">
            <a-button @click="visible = false">取消</a-button>
            <a-button type="primary" @click="dataFormSubmit()" :disabled="uploading">{{uploading?'提交中...':'提交'}}</a-button>
        </span>
    </a-modal>
</template>

<script>
export default {
    data() {
        return {
            visible: false,
            uploading:false,
            dataForm: {
                mediaId: '',
                file: '',
                fileName: '',
                mediaType: 'image'
            },
            dataRule: {
                fileName: [
                    { required: true, message: '素材名称不能为空', trigger: 'blur' }
                ],
                mediaType: [
                    { required: true, message: '素材类型不能为空', trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
        init(fileType) {
            if(fileType)this.dataForm.mediaType=fileType
            this.visible = true
        },
        // 表单提交
        dataFormSubmit() {
            if(this.uploading)return
            this.$refs['dataForm'].validate((valid) => {
                if (valid) {
                    this.uploading=true
                    console.log(this.dataForm)
                    let form = new FormData();
                    form.append('mediaId', this.dataForm.mediaId || '')
                    form.append('file', this.dataForm.file)
                    form.append('fileName', this.dataForm.fileName)
                    form.append('mediaType', this.dataForm.mediaType)
                    // this.$http({
                    //     url: this.$http.adornUrl(`/manage/wxAssets/materialFileUpload`),
                    //     method: 'post',
                    //     data: form,
                    //     headers: { 'Content-Type': 'multipart/form-data' }
                    // }).then(({ data }) => {
                    //     if (data && data.code === 200) {
                            this.$message({
                                message: '操作成功',
                                type: 'success',
                                duration: 1500,
                                onClose: () => {
                                    this.visible = false
                                    this.$emit('refreshDataList')
                                }
                            })
                    //     } else {
                    //         this.$message.error(data.msg)
                    //     }
                        this.uploading=false
                    // })
                }
            })
        },
        onFileChange(e) {
            let file = event.currentTarget.files[0]
            this.dataForm.file = file;
            this.dataForm.fileName = file.name.substring(0, file.name.lastIndexOf('.'))
            let mediaType = file.type.substring(0, file.type.lastIndexOf('/'))
            if (mediaType == 'audio') mediaType = 'voice'
            this.dataForm.mediaType = mediaType
        }
    }
}
</script>
