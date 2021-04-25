<template>
  <div class="doctorList">
    <!-- 搜索栏 -->
    <div style="float:right;">
      <a-space>
        <a-tooltip title="刷新">
          <a-button shape="circle" icon="reload" @click="refresh" />
        </a-tooltip>
        <a-tooltip title="搜索">
          <a-button shape="circle" icon="search" @click="showSearch" />
        </a-tooltip>
      </a-space>
    </div>
    <transition name="mask">
      <div class="search" v-show="search">
        <a-form-model ref="queryRuleForm" :model="queryInfo" :rules="queryRules" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }" @keyup.enter.native="onSubmit">
          <a-row>
            <a-col :span="6">
              <a-form-model-item label="菜单名称" prop="resName">
                <a-input placeholder="菜单名称" v-model="queryInfo.resName" />
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item label="科室" prop="department">
                <a-select v-model="queryInfo.department" placeholder="请选择科室">
                  <a-select-option value="内分泌科">
                    内分泌科
                  </a-select-option>
                  <a-select-option value="内科">
                    内科
                  </a-select-option>
                  <a-select-option value="消化科">
                    消化科
                  </a-select-option>
                  <a-select-option value="儿科">
                    儿科
                  </a-select-option>
                  <a-select-option value="中医科">
                    中医科
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item label="职称" prop="job">
                <a-select v-model="queryInfo.job" placeholder="请选择职称">
                  <a-select-option value="主任医师">
                    主任医师
                  </a-select-option>
                  <a-select-option value="副主任医师">
                    副主任医师
                  </a-select-option>
                  <a-select-option value="主治医师">
                    主治医师
                  </a-select-option>
                  <a-select-option value="住院医师">
                    住院医师
                  </a-select-option>
                  <a-select-option value="药剂师">
                    药剂师
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item :wrapper-col="{ span: 24, offset: 4 }">
                <a-button style="margin-right:20px;" type="primary" icon="search" @click="onSubmit">
                  搜索
                </a-button>
                <a-button icon="delete" @click="resetForm">
                  清空
                </a-button>
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-form-model>
      </div>
    </transition>

    <!-- 操作按钮 -->
    <div class="operationButton" style="margin-bottom:20px;">
      <a-row type="flex" justify="space-between">
        <a-col>
          <a-space>
            <a-button type="primary" icon="plus" @click="addDoctor">新增医生</a-button>
            <a-button type="danger" icon="delete">删除</a-button>
            <a-button icon="import">批量导入</a-button>
          </a-space>
        </a-col>
      </a-row>
    </div>

    <!-- 切换标签 -->
    <div class="tabs">
      <a-tabs default-active-key="1" @change="changeTabs">
        <a-tab-pane key="1" tab="全部">
        </a-tab-pane>
        <a-tab-pane key="2" tab="审核通过">
        </a-tab-pane>
        <a-tab-pane key="3" tab="审核未通过">
        </a-tab-pane>
      </a-tabs>
    </div>

    <!-- 医生操作抽屉 -->
    <a-drawer width="50%" :title="actionTitle" :visible="actionVisible" :after-visible-change="afterActionVisibleChange" @close="actionOnClose">
      <div class="actionBox">
        <div class="title">基本信息</div>
        <a-row type="flex" justify="space-between">
          <div style="flex:2">
            <img style="margin:0 auto;width:100%;margin:35px 0;" src="../../assets/u2133.png" alt="">
          </div>
          <div style="flex:8">
            <a-descriptions :column="2" size="small" bordered>
              <a-descriptions-item label="ID">
                <a-input v-model="doctorInfo.id" :disabled="viewVisible" placeholder=""></a-input>
              </a-descriptions-item>
              <a-descriptions-item label="姓名">
                <a-input v-model="doctorInfo.name" :disabled="viewVisible" placeholder=""></a-input>
              </a-descriptions-item>
              <a-descriptions-item label="手机号">
                <a-input v-model="doctorInfo.mobile" :disabled="viewVisible" placeholder=""></a-input>
              </a-descriptions-item>
              <a-descriptions-item label="平台科室">
                <a-select v-model="doctorInfo.ptDepartmanet" :disabled="viewVisible" style="width:100%;" placeholder="请选择科室">
                  <a-select-option value="内科">
                    内科
                  </a-select-option>
                  <a-select-option value="外科">
                    外科
                  </a-select-option>
                  <a-select-option value="骨科">
                    骨科
                  </a-select-option>
                </a-select>
              </a-descriptions-item>
              <a-descriptions-item label="性别">
                <a-select v-model="doctorInfo.sex" :disabled="viewVisible" style="width:100%;" placeholder="请选择性别">
                  <a-select-option value="男">
                    男
                  </a-select-option>
                  <a-select-option value="女">
                    女
                  </a-select-option>
                </a-select>
              </a-descriptions-item>
              <a-descriptions-item label="医院">
                <a-select v-model="doctorInfo.hospital" :disabled="viewVisible" style="width:100%;" placeholder="请选择医院">
                  <a-select-option value="成都四六一医院">
                    成都四六一医院
                  </a-select-option>
                  <a-select-option value="湘雅医学院">
                    湘雅医学院
                  </a-select-option>
                </a-select>
              </a-descriptions-item>
              <a-descriptions-item label="职称">
                <a-select v-model="doctorInfo.job" :disabled="viewVisible" style="width:100%;" placeholder="请选择职称">
                  <a-select-option value="医师">
                    医师
                  </a-select-option>
                  <a-select-option value="副主任医师">
                    副主任医师
                  </a-select-option>
                  <a-select-option value="主任医师">
                    主任医师
                  </a-select-option>
                </a-select>
              </a-descriptions-item>
              <a-descriptions-item label="医院科室">
                <a-select v-model="doctorInfo.department" :disabled="viewVisible" style="width:100%;" placeholder="请选择科室">
                  <a-select-option value="内科">
                    内科
                  </a-select-option>
                  <a-select-option value="外科">
                    外科
                  </a-select-option>
                  <a-select-option value="骨科">
                    骨科
                  </a-select-option>
                </a-select>
              </a-descriptions-item>
              <a-descriptions-item label="注册时间">
                <a-input v-model="doctorInfo.time" :disabled="viewVisible" placeholder=""></a-input>
              </a-descriptions-item>
            </a-descriptions>
          </div>
        </a-row>

      </div>
      <div class="actionBox">
        <div class="title">擅长</div>
        <a-textarea v-model="doctorInfo.goodAt" :disabled="viewVisible" :auto-size="{ minRows: 4, maxRows: 6 }"></a-textarea>
      </div>
      <div class="actionBox">
        <div class="title">简介</div>
        <a-textarea v-model="doctorInfo.introduction" :disabled="viewVisible" :auto-size="{ minRows: 6, maxRows: 10 }"></a-textarea>
      </div>
      <div class="actionBox">
        <a-modal :visible="previewVisible" :footer="null" @cancel="previewHandleCancel">
          <img alt="example" style="width: 100%" :src="previewImage" />
        </a-modal>
        <div class="title" style="">照片证书</div>
        <a-row type="flex" style="margin:15px;">
          <div style="width:100px;">医生照片</div>
          <div style="flex:9">
            <a-upload :disabled="viewVisible" action="https://www.mocky.io/v2/5cc8019d300000980a055e76" list-type="picture-card" :file-list="doctorFileList" @preview="uploadHandlePreview" @change="({ fileList })=>uploadHandleChange({ fileList },'doctorFileList')">
              <div v-if="doctorFileList.length < 1">
                <a-icon type="plus" />
                <div class="ant-upload-text">
                  Upload
                </div>
              </div>
            </a-upload>
          </div>
        </a-row>

        <a-row type="flex" style="margin:15px;">
          <div style="width:100px;">执业证书</div>
          <div style="flex:9">
            <a-upload :disabled="viewVisible" action="https://www.mocky.io/v2/5cc8019d300000980a055e76" list-type="picture-card" :file-list="practiceFileList" @preview="uploadHandlePreview" @change="({ fileList })=>uploadHandleChange({ fileList },'practiceFileList')">
              <div v-if="practiceFileList.length < 9">
                <a-icon type="plus" />
                <div class="ant-upload-text">
                  Upload
                </div>
              </div>
            </a-upload>
          </div>
        </a-row>

        <a-row type="flex" style="margin:15px;">
          <div style="width:100px;">职称证书</div>
          <div style="flex:9">
            <a-upload :disabled="viewVisible" action="https://www.mocky.io/v2/5cc8019d300000980a055e76" list-type="picture-card" :file-list="jobFileList" @preview="uploadHandlePreview" @change="({ fileList })=>uploadHandleChange({ fileList },'jobFileList')">
              <div v-if="jobFileList.length < 9">
                <a-icon type="plus" />
                <div class="ant-upload-text">
                  Upload
                </div>
              </div>
            </a-upload>
          </div>
        </a-row>

      </div>

      <div :style="{
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'right',
          zIndex: 1,
        }">
        <a-button icon="close-circle" :style="{ marginRight: '8px' }" @click="actionOnClose">
          取消
        </a-button>
        <a-button icon="plus-circle" type="primary" @click="actionOnSave">
          保存
        </a-button>
      </div>
    </a-drawer>

    <!-- 菜单表格 -->
    <div class="table">
      <a-table size="middle" :expandIconColumnIndex="2" :loading="tableLoading" bordered :data-source="dataSource" :columns="columns" :row-selection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}" :rowKey="(record, index) => {return record.key}" :pagination="{ showSizeChanger: true, showQuickJumper: true, pageSize: 10, total: 50, current: 1, showTotal: ((total) => {return `共 ${total} 条`}) }">
        <template slot="action" slot-scope="text,record">
          <a-space :size="15">
            <a @click="toView(record)">
              <a-icon type="eye" /> 查看
            </a>
            <a @click="toEdit(record)">
              <a-icon type="edit" /> 查看粉丝
            </a>
            <a-popconfirm title="确定删除吗?" @confirm="() => onDelete(record.key)">
              <a href="javascript:;">
                <a-icon type="delete" /> 删除
              </a>
            </a-popconfirm>
          </a-space>
        </template>
      </a-table>
    </div>

  </div>
</template>

<script>
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })
}
const columns = [
  // {
  //   title: '#',
  //   align: 'center',
  //   customRender: (text, record, index) => `${index + 1}`,
  //   width: '60px',
  // },
  {
    title: '姓名',
    dataIndex: 'name',
  },
  {
    title: '电话',
    dataIndex: 'mobile',
  },
  {
    title: '医院',
    dataIndex: 'hospital',
  },
  {
    title: '科室',
    dataIndex: 'department',
  },
  {
    title: '职称',
    dataIndex: 'job',
  },
  {
    title: '加入时间',
    dataIndex: 'joinTime',
  },
  {
    title: '审核状态',
    dataIndex: 'status',
  },
  {
    title: '服务审核',
    dataIndex: 'service',
  },
  {
    title: '粉丝',
    dataIndex: 'fans',
  },
  {
    title: '操作',
    scopedSlots: { customRender: 'action' },
    align: 'center',
    width: '230px',
  },
]
const dataSource = []
for (let i = 0; i < 8; i++) {
  dataSource.push({
    key: i,
    name: '秦山',
    mobile: '18811110000',
    hospital: '北大医院',
    department: '内科',
    job: '主任医师',
    joinTime: '2020-02-07 21:00:00',
    status: '已通过',
    service: '已审核',
    fans: '12',
  })
}
export default {
  name: 'DoctorList',
  inject: ['reloadCard'],
  data() {
    return {
      // 搜索栏
      search: true,
      queryInfo: {
        resName: '',
        department: undefined,
        job: undefined,
      },
      queryRules: {},
      // 表格
      tableLoading: false,
      columns,
      dataSource,
      selectedRowKeys: [],
      // 操作医生
      actionTitle: '新增医生',
      actionVisible: false,
      doctorInfo: {
        id: '',
        name: '',
        mobile: '',
        ptDepartmanet: '',
        sex: '',
        hospital: '',
        job: '',
        department: '',
        time: '',
        goodAt: '',
        introduction: '',
      },

      // 上传图片
      previewVisible: false,
      previewImage: '',
      doctorFileList: [],
      practiceFileList: [],
      jobFileList: [],
      // 查看医生详情
      viewVisible: false,
    }
  },
  methods: {
    // 搜索栏
    onSubmit() {
      this.$refs.queryRuleForm.validate((valid) => {
        if (valid) {
          alert('1')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm() {
      this.$refs.queryRuleForm.resetFields()
    },
    // 新增医生
    addDoctor() {
      this.actionTitle = '新增医生'
      this.actionVisible = true
      this.viewVisible = false
    },
    refresh() {
      this.reloadCard()
    },
    showSearch() {
      this.search = !this.search
    },
    changeTabs(key) {
      console.log(key)
    },
    // 表格
    // 勾选表单数据
    onSelectChange(selectedRowKeys) {
      console.log('selectedRowKeys changed: ', selectedRowKeys)
      this.selectedRowKeys = selectedRowKeys
    },
    // 操作抽屉
    afterActionVisibleChange(val) {
      console.log('visible', val)
    },
    actionOnClose() {
      this.actionVisible = false
    },
    actionOnSave() {
      // this.$refs.actionRuleForm.validate((valid) => {
      //   if (valid) {
      //     alert('submit!')
      //   } else {
      //     console.log('error submit!!')
      //     return false
      //   }
      // })
    },
    // 上传图片
    previewHandleCancel() {
      this.previewVisible = false
    },
    async uploadHandlePreview(file) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj)
      }
      this.previewImage = file.url || file.preview
      this.previewVisible = true
    },
    uploadHandleChange({ fileList }, listName) {
      console.log(fileList, listName)
      this[listName] = fileList
    },
    // 查看医生详情
    toView(record) {
      console.log(record)
      this.actionTitle = '医生详情'
      this.actionVisible = true
      this.viewVisible = true
    },
  },
}
</script>

<style lang="less" scoped>
@keyframes mask-in {
  0% {
    height: 0;
  }
  100% {
    height: 65px;
  }
}
.mask-enter-active {
  animation: mask-in 0.2s linear;
}
.mask-leave-active {
  animation: mask-in 0.2s reverse linear;
}
.doctorList {
  background: #fff;
  padding: 24px;
  .search {
    height: 65px;
    overflow: hidden;
  }
}
.actionBox {
  border: 1px solid #eee;
  margin-bottom: 10px;
  // padding: 5px;
  .title {
    font-size: 16px;
    background: rgb(250, 250, 250);
    padding: 10px;
  }
}
</style>