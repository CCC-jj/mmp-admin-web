<template>
    <div v-show="visible">
        <a-form-model :model="dataForm" :rules="dataRule" ref="dataForm" size="mini" label-width="80px">
            <el-row>
                <el-col :span="12">
                    <a-form-model-item label="文章标题" prop="title" required>
                        <a-input v-model="dataForm.title" :maxLength="1024" placeholder="标题"></a-input>
                    </a-form-model-item>
                </el-col>
                <el-col :span="12">
                    <a-form-model-item label="文章类型" prop="type" required>
                        <a-select v-model="dataForm.type" placeholder="选择文章类型">
                            <a-select-option v-for="(name,key) in ARTICLE_TYPES" :key="name" :label="name" :value="key" allow-create></a-select-option>
                        </a-select>
                    </a-form-model-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <a-form-model-item label="一级目录" prop="category">
                        <a-input :maxLength="50" v-model="dataForm.category" placeholder="一级目录"></a-input>
                    </a-form-model-item>
                </el-col>
                <el-col :span="12">
                    <a-form-model-item label="二级分类" prop="subCategory">
                        <a-input :maxLength="50" v-model="dataForm.subCategory" placeholder="二级目录"></a-input>
                    </a-form-model-item>
                </el-col>
            </el-row>
            <a-form-model-item label="指向外链" prop="targetLink">
                <a-input v-model="dataForm.targetLink" placeholder="指向外链"></a-input>
            </a-form-model-item>
            <a-form-model-item label="摘要" prop="summary">
                <a-input v-model="dataForm.summary" placeholder="摘要" type="textarea" rows="3" maxLength="512" show-word-limit></a-input>
            </a-form-model-item>
            <a-form-model-item label="标签" prop="tags">
                <tags-editor v-model="dataForm.tags"></tags-editor>
            </a-form-model-item>
            <a-form-model-item label="封面图" prop="image">
                <a-input v-model="dataForm.image" placeholder="图片链接">
                    <OssUploader slot="append" @uploaded="dataForm.image=$event"></OssUploader>
                </a-input>
            </a-form-model-item>
            <tinymce-editor ref="editor" v-model="dataForm.content"></tinymce-editor>
        </a-form-model>
        <div class="margin-top text-right">
            <a-button @click="$emit('hide')">取消</a-button>
            <a-button type="primary" @click="dataFormSubmit()">确定</a-button>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
    name:'article-add-or-update',
    components: {
        TinymceEditor: () => import("@/components/tinymce-editor"),
        tagsEditor: () => import("@/components/tags-editor"),
        OssUploader: () => import('../oss/oss-uploader')
    },
    props:{
        visible:{
            type:Boolean,
            default:false
        }
    },
    data() {
        return {
            dataForm: {
                id: "",
                type: '1',
                title: "",
                content: "",
                category: "",
                subCategory: "",
                summary: "",
                tags: "",
                openCount: 0,
                targetLink: location.origin + "/client/#/article/${articleId}",
                image: ""
            },
            dataRule: {
                type: [
                    { required: true, message: "文章类型不能为空", trigger: "blur" }
                ],
                title: [
                    { required: true, message: "标题不能为空", trigger: "blur" }
                ],
                category: [
                    { required: true, message: "分类不能为空", trigger: "blur" }
                ]
            }
        };
    },
    computed: mapState({
        ARTICLE_TYPES: state=>state.article.ARTICLE_TYPES
    }),
    methods: {
        init(id) {
            this.dataForm.id = id || "";
            this.$nextTick(() => {
                this.$refs["dataForm"].resetFields();
                if (id > 0) {
                    this.$http({
                        url: this.$http.adornUrl(`/manage/article/info/${this.dataForm.id}`),
                        method: "get",
                        params: this.$http.adornParams()
                    }).then(({ data }) => {
                        if (data && data.code === 200) {
                            this.dataForm=data.article;
                            this.dataForm.type = data.article.type + "";
                        }
                    });
                }
            });
        },
        // 表单提交
        dataFormSubmit() {
            this.$refs["dataForm"].validate(valid => {
                if (valid) {
                    this.$http({
                        url: this.$http.adornUrl(`/manage/article/save`),
                        method: "post",
                        data: this.$http.adornData(this.dataForm)
                    }).then(({ data }) => {
                        if (data && data.code === 200) {
                            this.$message({
                                message: "操作成功",
                                type: "success",
                                duration: 1500,
                                onClose: () => {
                                    this.$emit("refreshDataList");
                                    this.$emit('hide')
                                }
                            });
                        } else {
                            this.$message.error(data.msg);
                        }
                    });
                }
            });
        },
        imgUploadSuccess(response, file, fileList) {
            console.log(response);
            if (response.code == 200) {
                this.dataForm.image = response.data;
                console.log("this.article", this.article);
            } else {
                this.$message.warning(response.msg);
            }
        }
    }
};
</script>
