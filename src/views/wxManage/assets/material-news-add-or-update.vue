<template>
    <div v-show="visible">
        <div class="flex">
            <div class="card-list">
                <div class="text-center margin-bottom">图文列表</div>
                <div class="card-item" :class="{'selected':selectedIndex==index}" v-for="(item,index) in articles" :key="index" @click="selectedIndex=index">
                    <div class="text-cut-name">{{item.title}}</div>
                </div>
                <div v-show="articles.length<8 && !mediaId" class="card-add el-icon-plus" @click="addArticle()"><a-icon type="plus" /></div>
            </div>
            <a-form-model size="small" v-if="articles.length" :model="articles[selectedIndex]" :rules="dataRule" ref="dataForm" v-bind="{labelCol: { span: 3 },wrapperCol: { span: 21 }}" >
                <a-form-model-item label="标题" prop="title">
                    <a-input v-model="articles[selectedIndex].title" placeholder="标题"></a-input>
                </a-form-model-item>
                <a-form-model-item label="封面图" prop="thumbMediaId">
                    <a-input v-model="articles[selectedIndex].thumbMediaId" placeholder="封面图media_id">
                        <div slot="addonAfter" @click="assetsSelectorVisible=true">从素材库中选择</div>
                    </a-input>
                </a-form-model-item>
                <a-form-model-item label="摘要" prop="digest">
                    <a-input v-model="articles[selectedIndex].digest" placeholder="摘要"></a-input>
                </a-form-model-item>
                <a-form-model-item label="原文地址" prop="contentSourceUrl">
                    <a-input v-model="articles[selectedIndex].contentSourceUrl" placeholder="阅读原文链接"></a-input>
                </a-form-model-item>
                <a-row>
                    <a-col :span="9">
                        <a-form-model-item label="作者" prop="author" :labelCol="{span:8}" :wrapperCol="{span:16}">
                            <a-input v-model="articles[selectedIndex].author" placeholder="作者"></a-input>
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="5">
                        <a-form-model-item label="显示封面" prop="showCoverPic" :labelCol="{span:16}" :wrapperCol="{span:8}">
                            <a-switch v-model="articles[selectedIndex].showCoverPic"></a-switch>
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="5">
                        <a-form-model-item label="允许评论" prop="needOpenComment" :labelCol="{span:16}" :wrapperCol="{span:8}">
                            <a-switch v-model="articles[selectedIndex].needOpenComment"></a-switch>
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="5">
                        <a-form-model-item label="仅粉丝可评论" prop="onlyFansCanComment" :labelCol="{span:16}" :wrapperCol="{span:8}">
                            <a-switch v-model="articles[selectedIndex].onlyFansCanComment"></a-switch>
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <a-form-model-item label="内容" prop="content">
                    <tinymce-editor ref="editor" v-model="articles[selectedIndex].content"> </tinymce-editor>
                </a-form-model-item>
            </a-form-model>
        </div>
        <div class="dialog-footer">
            <a-button @click="$emit('hide')">取消</a-button>
            <a-button type="primary" @click="dataFormSubmit()" :disabled="uploading">{{this.mediaId?'修改此篇':'全部提交（共'+articles.length+'篇）'}}</a-button>
        </div>
        <assets-selector v-if="assetsSelectorVisible" :visible="assetsSelectorVisible" selectType="image" @selected="onAssetsSelect" @cancelModal="cancelModal"></assets-selector>
    </div>
</template>

<script>
const articleTemplate={
    templateId: 0,
    title: '',
    content: '',
    author: '',
    showCoverPic: true,
    contentSourceUrl: '',
    digest: '',
    thumbMediaId: '',
    needOpenComment: false,
    onlyFansCanComment: false
}
export default {
    components: {
        TinymceEditor: () => import('@/components/tinymce-editor'),
        AssetsSelector:()=>import('./assets-selector')
    },
    props:{
        visible:{
            type:Boolean,
            default:false
        }
    },
    data() {
        return {
            assetsSelectorVisible:false,
            mediaId:'',
            selectedIndex:0,
            articles:[],
            uploading:false,
            dataRule: {
                title: [
                    { required: true, message: '标题不能为空', trigger: 'blur' }
                ],
                content: [
                    { required: true, message: '内容不能为空', trigger: 'blur' }
                ],
                thumbMediaId: [
                    { required: true, message: '封面图media_id不能为空', trigger: 'blur' }
                ],
                contentSourceUrl: [
                    { required: true, message: '原文地址不得为空', trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
        cancelModal() {
            this.assetsSelectorVisible = false
        },
        init(news){
            if(news && news.mediaId){
                this.mediaId=news.mediaId
                this.articles = news.content.articles
            }else{
                this.mediaId=''
                this.articles=[{...articleTemplate}]
            }
        },
        // 表单提交
        dataFormSubmit() {
            if(this.uploading)return
            this.$refs['dataForm'].validate((valid) => {
                if (valid) {
                    if(this.mediaId){// 编辑，只能一次修改一篇
                        this.materialArticleUpdate();
                    }else{ // 新增，全部文章一起保存
                        this.materialNewsUpload();
                    }
                }
            })
        },
        materialNewsUpload(){
            this.uploading=true
            this.$http({
                url: this.$http.adornUrl(`/manage/wxAssets/materialNewsUpload`),
                method: 'post',
                data: this.$http.adornData(this.articles,false)
            }).then(({ data }) => {
                if (data && data.code === 200) {
                    this.$message({
                        message: "操作成功",
                        type: "success",
                        duration: 1500,
                        onClose: () => {
                            this.$emit("refreshDataList");
                            this.emit('hide')
                        }
                    });
                } else {
                    this.$message.error(data.msg)
                }
                this.uploading=false
            })
        },
        materialArticleUpdate(){
            this.uploading=true
            this.$http({
                url: this.$http.adornUrl(`/manage/wxAssets/materialArticleUpdate`),
                method: 'post',
                data: this.$http.adornData({
                    'mediaId':this.mediaId,
                    'index':this.selectedIndex,
                    'articles':this.articles[this.selectedIndex]
                })
            }).then(({ data }) => {
                if (data && data.code === 200) {
                    this.$message.success('操作成功')
                } else {
                    this.$message.error(data.msg)
                }
                this.uploading=false
            })
        },
        addArticle(){
            this.articles.push({...articleTemplate})
            this.selectedIndex=this.articles.length-1
        },
        onAssetsSelect(assetsInfo){
            Vue.set(this.articles[this.selectedIndex], 'thumbMediaId', assetsInfo.mediaId)
            this.assetsSelectorVisible=false
        }
    }
}
</script>
<style scoped>
@import '../../../assets/css/common.css';
.card-list{
    width: 300px;
    padding-right: 10px;
    border-right: 1px solid #eeeeee;
}
.card-item{
    margin-top: 2px;
    padding: 20px 5px;
    border: 1px solid #ddd;
    font-size: 12px;
    line-height: 15px;
}
.card-item.selected{
    border: 2px solid #409EFF;
}
.text-cut-name{
    display: -webkit-box;
    word-wrap:break-word;
    word-break:break-all;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
}
.card-add{
    margin-top: 2px;
    display: block;
    border: 1px dotted #ddd;
    color: #ddd;
    text-align: center;
    font-size: 30px;
    line-height: 50px;
}
.dialog-footer {
    margin-top: 20px;
    text-align: right;
}
</style>