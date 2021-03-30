<template>
  <div class="user">
    <!-- 部门选择 -->
    <div class="userLeft">
      <a-input-search style="margin-bottom: 8px" placeholder="输入关键字进行过滤" @change="onChange" />
      <a-tree :expanded-keys="expandedKeys" :auto-expand-parent="autoExpandParent" :tree-data="gData" @expand="onExpand">
        <template slot="title" slot-scope="{ title }">
          <span v-if="title.indexOf(searchValue) > -1">
            {{ title.substr(0, title.indexOf(searchValue)) }}
            <span style="color: #f50">{{ searchValue }}</span>
            {{ title.substr(title.indexOf(searchValue) + searchValue.length) }}
          </span>
          <span v-else>{{ title }}</span>
        </template>
      </a-tree>
    </div>

    <div class="userRight">
      <!-- 搜索栏 -->
      <div class="search" v-show="search">
        <a-form-model ref="ruleForm" :model="queryInfo" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-row>
            <a-col :span="6">
              <a-form-model-item label="登录账号" prop="name">
                <a-input placeholder="登录账号" v-model="queryInfo.name" />
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item label="用户姓名" prop="otherName">
                <a-input placeholder="用户姓名" v-model="queryInfo.otherName" />
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

      <div class="operationButton" style="margin-bottom:20px;">
        <!-- 新增抽屉 -->
        <a-drawer class="addDrawer" title="新增" width="50%" :visible="addDrawerVisible" :body-style="{ paddingBottom: '80px' }" @close="OnClose('addDrawerVisible')">
          <a-form-model ref="addRuleForm" :model="addForm" :rules="addRules" v-bind="{labelCol: { span: 6 }, wrapperCol: { span: 18 }}">
            <a-collapse :default-active-key="['1','2','3']" :bordered="false" expand-icon-position="right">
              <template #expandIcon="props">
                <a-icon type="caret-right" :rotate="props.isActive ? 90 : 0" />
              </template>
              <a-collapse-panel key="1" :style="customStyle">
                <template slot="header">
                  <a-icon type="user" /> 基础信息
                </template>
                <a-row>
                  <a-col :span="24">
                    <a-form-model-item label="登录账号" prop="account" :labelCol="{span: 3}" :wrapperCol="{span: 21}">
                      <a-input v-model="addForm.account" placeholder="请输入登录账号" />
                    </a-form-model-item>
                  </a-col>
                  <a-col :span="12">
                    <a-form-model-item label="密码" prop="password">
                      <a-input v-model="addForm.password" type="password" placeholder="请输入密码" />
                    </a-form-model-item>
                  </a-col>
                  <a-col :span="12">
                    <a-form-model-item label="确认密码" prop="checkPwd">
                      <a-input v-model="addForm.checkPwd" type="password" placeholder="请输入确认密码" />
                    </a-form-model-item>
                  </a-col>
                </a-row>
              </a-collapse-panel>
              <a-collapse-panel key="2" :style="customStyle">
                <template slot="header">
                  <a-icon type="file-text" /> 详细信息
                </template>
                <a-row>
                  <a-col :span="12">
                    <a-form-model-item label="用户昵称" prop="nickName">
                      <a-input v-model="addForm.nickName" placeholder="请输入用户昵称" />
                    </a-form-model-item>
                  </a-col>
                  <a-col :span="12">
                    <a-form-model-item label="用户姓名" prop="name">
                      <a-input v-model="addForm.name" placeholder="请输入用户姓名" />
                    </a-form-model-item>
                  </a-col>
                </a-row>
                <a-row>
                  <a-col :span="12">
                    <a-form-model-item label="手机号码" prop="mobile">
                      <a-input v-model="addForm.mobile" placeholder="请输入手机号码" />
                    </a-form-model-item>
                  </a-col>
                  <a-col :span="12">
                    <a-form-model-item label="电子邮箱" prop="email">
                      <a-input v-model="addForm.email" placeholder="请输入电子邮箱" />
                    </a-form-model-item>
                  </a-col>
                </a-row>
                <a-row>
                  <a-col :span="12">
                    <a-form-model-item label="用户性别" prop="sex">
                      <a-select v-model="addForm.sex" placeholder="请选择用户性别">
                        <a-select-option value="男">
                          男
                        </a-select-option>
                        <a-select-option value="女">
                          女
                        </a-select-option>
                        <a-select-option value="未知">
                          未知
                        </a-select-option>
                      </a-select>
                    </a-form-model-item>
                  </a-col>
                  <a-col :span="12">
                    <a-form-model-item label="用户生日" prop="birth">
                      <a-date-picker disabled v-model="addForm.birth" placeholder="请选择用户生日" valueFormat="value" style="width:100%;" />
                    </a-form-model-item>
                  </a-col>
                </a-row>
              </a-collapse-panel>
              <a-collapse-panel key="3" :style="customStyle">
                <template slot="header">
                  <a-icon type="team" /> 职责信息
                </template>
                <a-row>
                  <a-col :span="12">
                    <a-form-model-item label="用户编号" prop="number">
                      <a-input v-model="addForm.number" placeholder="请输入用户编号" />
                    </a-form-model-item>
                  </a-col>
                  <a-col :span="12">
                    <a-form-model-item label="所属角色" prop="role">
                      <a-select show-search mode="multiple" :value="addForm.role" @search="(value) => addOnSearch(value,'role',roleTreeData,dataListRole)" placeholder="请选择所属角色 输入搜索" @change="(value, option) => changeaddSelect(value, option,'role','addroleCheckedKeys')">
                        <div slot="dropdownRender">
                          <div @mousedown="e => e.preventDefault()">
                            <a-tree :checkedKeys="addroleCheckedKeys" checkable checkStrictly :expanded-keys="addroleExpandedKeys" :auto-expand-parent="addroleAutoExpandParent" :tree-data="roleTreeData" @expand="(expandedKeys)=>addOnExpand(expandedKeys,'addroleExpandedKeys','addroleAutoExpandParent')" @check="(checkedKeys)=>addOnCheck(checkedKeys,'role','addroleCheckedKeys')">
                              <template slot="title" slot-scope="{ title }">
                                <span v-if="title.indexOf(searchValueRole) > -1">
                                  {{ title.substr(0, title.indexOf(searchValueRole)) }}
                                  <span style="color: #f50">{{ searchValueRole }}</span>
                                  {{ title.substr(title.indexOf(searchValueRole) + searchValueRole.length) }}
                                </span>
                                <span v-else>{{ title }}</span>
                              </template>
                            </a-tree>
                          </div>
                        </div>
                      </a-select>
                    </a-form-model-item>
                  </a-col>
                </a-row>
                <a-row>
                  <a-col :span="12">
                    <a-form-model-item label="所属部门" prop="department">
                      <a-select show-search mode="multiple" :value="addForm.department" @search="(value) => addOnSearch(value,'department',gData,dataTreeList)" placeholder="请选择所属部门 输入搜索" @change="(value, option) => changeaddSelect(value, option,'department','departmentCheckedKeys')">
                        <div slot="dropdownRender">
                          <div @mousedown="e => e.preventDefault()">
                            <a-tree :checkedKeys="departmentCheckedKeys" checkable checkStrictly :expanded-keys="departmentExpandedKeys" :auto-expand-parent="departmentAutoExpandParent" :tree-data="gData" @expand="(expandedKeys)=>addOnExpand(expandedKeys,'departmentExpandedKeys','departmentAutoExpandParent')" @check="(checkedKeys)=>addOnCheck(checkedKeys,'department','departmentCheckedKeys')">
                              <template slot="title" slot-scope="{ title }">
                                <span v-if="title.indexOf(searchValueDepartment) > -1">
                                  {{ title.substr(0, title.indexOf(searchValueDepartment)) }}
                                  <span style="color: #f50">{{ searchValueDepartment }}</span>
                                  {{ title.substr(title.indexOf(searchValueDepartment) + searchValueDepartment.length) }}
                                </span>
                                <span v-else>{{ title }}</span>
                              </template>
                            </a-tree>
                          </div>
                        </div>
                      </a-select>
                    </a-form-model-item>
                  </a-col>
                  <a-col :span="12">
                    <a-form-model-item label="所属岗位" prop="post">
                      <a-select show-search mode="multiple" :value="addForm.post" @search="(value) => addOnSearch(value,'post',postTreeData,dataListPost)" placeholder="请选择所属岗位 输入搜索" @change="(value, option) => changeaddSelect(value, option,'post','postCheckedKeys')">
                        <div slot="dropdownRender">
                          <div @mousedown="e => e.preventDefault()">
                            <a-tree :checkedKeys="postCheckedKeys" checkable checkStrictly :expanded-keys="postExpandedKeys" :auto-expand-parent="postAutoExpandParent" :tree-data="postTreeData" @expand="(expandedKeys)=>addOnExpand(expandedKeys,'postExpandedKeys','postAutoExpandParent')" @check="(checkedKeys)=>addOnCheck(checkedKeys,'post','postCheckedKeys')">
                              <template slot="title" slot-scope="{ title }">
                                <span v-if="title.indexOf(searchValuePost) > -1">
                                  {{ title.substr(0, title.indexOf(searchValuePost)) }}
                                  <span style="color: #f50">{{ searchValuePost }}</span>
                                  {{ title.substr(title.indexOf(searchValuePost) + searchValuePost.length) }}
                                </span>
                                <span v-else>{{ title }}</span>
                              </template>
                            </a-tree>
                          </div>
                        </div>
                      </a-select>
                    </a-form-model-item>
                  </a-col>
                </a-row>
              </a-collapse-panel>
            </a-collapse>
          </a-form-model>
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
            <a-button icon="close-circle" :style="{ marginRight: '8px' }" @click="addOnClose('addDrawerVisible')">
              取消
            </a-button>
            <a-button icon="plus-circle" type="primary" @click="addOnClose('addDrawerVisible')">
              保存
            </a-button>
          </div>
        </a-drawer>
        <!-- 角色配置对话框 -->
        <a-drawer width="400px" :visible="userRoleVisible" title="用户角色配置" @close="userRoleHandleOk">
          <a-tree v-model="roleCheckedKeys" checkable :expanded-keys="roleExpandedKeys" :auto-expand-parent="roleAutoExpandParent" :selected-keys="roleSelectedKeys" :tree-data="roleTreeData" @expand="roleOnExpand" @select="roleOnSelect" @check="roleOnCheck" />
        </a-drawer>

        <!-- 操作按钮 -->
        <a-row type="flex" justify="space-between">
          <a-col>
            <a-space>
              <a-button type="primary" icon="plus" @click="add">新增</a-button>
              <a-button type="danger" icon="delete">删除</a-button>
              <a-button icon="user" @click="roleSetting">角色配置</a-button>
              <a-button icon="sync" @click="resetPassword">密码重置</a-button>
              <a-button icon="upload">导出</a-button>
              <a-button icon="download">导入</a-button>
            </a-space>
          </a-col>
          <a-drawer width="50%" title="列显隐" placement="right" :visible="drawerVisible" @close="drawerOnClose">
            <div style="margin:0 auto;">
              <a-transfer :listStyle="{width:'45%',height:'500px'}" :titles="['隐藏','显示']" :data-source="mockData" show-search :filter-option="transferFilterOption" :target-keys="targetKeys" :render="item => item.title" @change="transferHandleChange" @search="transferHandleSearch" />
            </div>
          </a-drawer>
          <a-col>
            <a-space>
              <a-tooltip title="刷新">
                <a-button shape="circle" icon="reload" @click="refresh" />
              </a-tooltip>
              <a-tooltip title="显隐">
                <a-button shape="circle" icon="menu-fold" @click="showDrawer" />
              </a-tooltip>
              <a-tooltip title="搜索">
                <a-button shape="circle" icon="search" @click="showSearch" />
              </a-tooltip>
            </a-space>
          </a-col>
        </a-row>
      </div>

      <!-- 表格 -->
      <div class="table">
        <!-- 查看 -->
        <a-drawer class="addDrawer" title="查看" width="50%" :visible="viewDrawerVisible" :body-style="{ paddingBottom: '80px' }" @close="OnClose('viewDrawerVisible')">
          <a-form-model ref="viewRuleForm" :model="viewForm" :rules="viewRules" v-bind="{labelCol: { span: 6 }, wrapperCol: { span: 18 }}">
            <a-collapse :default-active-key="['1','2','3']" :bordered="false" expand-icon-position="right">
              <template #expandIcon="props">
                <a-icon type="caret-right" :rotate="props.isActive ? 90 : 0" />
              </template>
              <a-collapse-panel key="1" :style="customStyle">
                <template slot="header">
                  <a-icon type="user" /> 基础信息
                </template>
                <a-row>
                  <a-col :span="24">
                    <a-form-model-item label="登录账号" prop="account" :labelCol="{span: 3}" :wrapperCol="{span: 21}">
                      <a-input disabled v-model="viewForm.account" placeholder="请输入登录账号" />
                    </a-form-model-item>
                  </a-col>
                </a-row>
              </a-collapse-panel>
              <a-collapse-panel key="2" :style="customStyle">
                <template slot="header">
                  <a-icon type="file-text" /> 详细信息
                </template>
                <a-row>
                  <a-col :span="12">
                    <a-form-model-item label="用户昵称" prop="nickName">
                      <a-input disabled v-model="viewForm.nickName" placeholder="请输入用户昵称" />
                    </a-form-model-item>
                  </a-col>
                  <a-col :span="12">
                    <a-form-model-item label="用户姓名" prop="name">
                      <a-input disabled v-model="viewForm.name" placeholder="请输入用户姓名" />
                    </a-form-model-item>
                  </a-col>
                </a-row>
                <a-row>
                  <a-col :span="12">
                    <a-form-model-item label="手机号码" prop="mobile">
                      <a-input disabled v-model="viewForm.mobile" placeholder="请输入手机号码" />
                    </a-form-model-item>
                  </a-col>
                  <a-col :span="12">
                    <a-form-model-item label="电子邮箱" prop="email">
                      <a-input disabled v-model="viewForm.email" placeholder="请输入电子邮箱" />
                    </a-form-model-item>
                  </a-col>
                </a-row>
                <a-row>
                  <a-col :span="12">
                    <a-form-model-item label="用户性别" prop="sex">
                      <a-select disabled v-model="viewForm.sex" placeholder="请选择用户性别">
                        <a-select-option value="男">
                          男
                        </a-select-option>
                        <a-select-option value="女">
                          女
                        </a-select-option>
                        <a-select-option value="未知">
                          未知
                        </a-select-option>
                      </a-select>
                    </a-form-model-item>
                  </a-col>
                  <a-col :span="12">
                    <a-form-model-item label="用户生日" prop="birth">
                      <a-date-picker disabled v-model="viewForm.birth" placeholder="请选择用户生日" valueFormat="value" style="width:100%;" />
                    </a-form-model-item>
                  </a-col>
                </a-row>
              </a-collapse-panel>
              <a-collapse-panel key="3" :style="customStyle">
                <template slot="header">
                  <a-icon type="team" /> 职责信息
                </template>
                <a-row>
                  <a-col :span="12">
                    <a-form-model-item label="用户编号" prop="number">
                      <a-input disabled v-model="viewForm.number" placeholder="请输入用户编号" />
                    </a-form-model-item>
                  </a-col>
                  <a-col :span="12">
                    <a-form-model-item label="所属角色" prop="role">
                      <a-select disabled show-search mode="multiple" :value="viewForm.role" @search="(value) => addOnSearch(value,'role',roleTreeData,dataListRole)" placeholder="请选择所属角色 输入搜索" @change="(value, option) => changeaddSelect(value, option,'role','addroleCheckedKeys')">
                        <div slot="dropdownRender">
                          <div @mousedown="e => e.preventDefault()">
                            <a-tree :checkedKeys="addroleCheckedKeys" checkable checkStrictly :expanded-keys="addroleExpandedKeys" :auto-expand-parent="addroleAutoExpandParent" :tree-data="roleTreeData" @expand="(expandedKeys)=>addOnExpand(expandedKeys,'addroleExpandedKeys','addroleAutoExpandParent')" @check="(checkedKeys)=>addOnCheck(checkedKeys,'role','addroleCheckedKeys')">
                              <template slot="title" slot-scope="{ title }">
                                <span v-if="title.indexOf(searchValueRole) > -1">
                                  {{ title.substr(0, title.indexOf(searchValueRole)) }}
                                  <span style="color: #f50">{{ searchValueRole }}</span>
                                  {{ title.substr(title.indexOf(searchValueRole) + searchValueRole.length) }}
                                </span>
                                <span v-else>{{ title }}</span>
                              </template>
                            </a-tree>
                          </div>
                        </div>
                      </a-select>
                    </a-form-model-item>
                  </a-col>
                </a-row>
                <a-row>
                  <a-col :span="12">
                    <a-form-model-item label="所属部门" prop="department">
                      <a-select disabled show-search mode="multiple" :value="viewForm.department" @search="(value) => addOnSearch(value,'department',gData,dataTreeList)" placeholder="请选择所属部门 输入搜索" @change="(value, option) => changeaddSelect(value, option,'department','departmentCheckedKeys')">
                        <div slot="dropdownRender">
                          <div @mousedown="e => e.preventDefault()">
                            <a-tree :checkedKeys="departmentCheckedKeys" checkable checkStrictly :expanded-keys="departmentExpandedKeys" :auto-expand-parent="departmentAutoExpandParent" :tree-data="gData" @expand="(expandedKeys)=>addOnExpand(expandedKeys,'departmentExpandedKeys','departmentAutoExpandParent')" @check="(checkedKeys)=>addOnCheck(checkedKeys,'department','departmentCheckedKeys')">
                              <template slot="title" slot-scope="{ title }">
                                <span v-if="title.indexOf(searchValueDepartment) > -1">
                                  {{ title.substr(0, title.indexOf(searchValueDepartment)) }}
                                  <span style="color: #f50">{{ searchValueDepartment }}</span>
                                  {{ title.substr(title.indexOf(searchValueDepartment) + searchValueDepartment.length) }}
                                </span>
                                <span v-else>{{ title }}</span>
                              </template>
                            </a-tree>
                          </div>
                        </div>
                      </a-select>
                    </a-form-model-item>
                  </a-col>
                  <a-col :span="12">
                    <a-form-model-item label="所属岗位" prop="post">
                      <a-select disabled show-search mode="multiple" :value="viewForm.post" @search="(value) => addOnSearch(value,'post',postTreeData,dataListPost)" placeholder="请选择所属岗位 输入搜索" @change="(value, option) => changeaddSelect(value, option,'post','postCheckedKeys')">
                        <div slot="dropdownRender">
                          <div @mousedown="e => e.preventDefault()">
                            <a-tree :checkedKeys="postCheckedKeys" checkable checkStrictly :expanded-keys="postExpandedKeys" :auto-expand-parent="postAutoExpandParent" :tree-data="postTreeData" @expand="(expandedKeys)=>addOnExpand(expandedKeys,'postExpandedKeys','postAutoExpandParent')" @check="(checkedKeys)=>addOnCheck(checkedKeys,'post','postCheckedKeys')">
                              <template slot="title" slot-scope="{ title }">
                                <span v-if="title.indexOf(searchValuePost) > -1">
                                  {{ title.substr(0, title.indexOf(searchValuePost)) }}
                                  <span style="color: #f50">{{ searchValuePost }}</span>
                                  {{ title.substr(title.indexOf(searchValuePost) + searchValuePost.length) }}
                                </span>
                                <span v-else>{{ title }}</span>
                              </template>
                            </a-tree>
                          </div>
                        </div>
                      </a-select>
                    </a-form-model-item>
                  </a-col>
                </a-row>
              </a-collapse-panel>
            </a-collapse>
          </a-form-model>
        </a-drawer>
        <!-- 编辑 -->
        <a-drawer class="addDrawer" title="编辑" width="50%" :visible="editDrawerVisible" :body-style="{ paddingBottom: '80px' }" @close="OnClose('editDrawerVisible')">
          <a-form-model ref="addRuleForm" :model="addForm" :rules="addRules" v-bind="{labelCol: { span: 6 }, wrapperCol: { span: 18 }}">
            <a-collapse :default-active-key="['1','2','3']" :bordered="false" expand-icon-position="right">
              <template #expandIcon="props">
                <a-icon type="caret-right" :rotate="props.isActive ? 90 : 0" />
              </template>
              <a-collapse-panel key="1" :style="customStyle">
                <template slot="header">
                  <a-icon type="user" /> 基础信息
                </template>
                <a-row>
                  <a-col :span="24">
                    <a-form-model-item label="登录账号" prop="account" :labelCol="{span: 3}" :wrapperCol="{span: 21}">
                      <a-input v-model="addForm.account" placeholder="请输入登录账号" />
                    </a-form-model-item>
                  </a-col>
                </a-row>
              </a-collapse-panel>
              <a-collapse-panel key="2" :style="customStyle">
                <template slot="header">
                  <a-icon type="file-text" /> 详细信息
                </template>
                <a-row>
                  <a-col :span="12">
                    <a-form-model-item label="用户昵称" prop="nickName">
                      <a-input v-model="addForm.nickName" placeholder="请输入用户昵称" />
                    </a-form-model-item>
                  </a-col>
                  <a-col :span="12">
                    <a-form-model-item label="用户姓名" prop="name">
                      <a-input v-model="addForm.name" placeholder="请输入用户姓名" />
                    </a-form-model-item>
                  </a-col>
                </a-row>
                <a-row>
                  <a-col :span="12">
                    <a-form-model-item label="手机号码" prop="mobile">
                      <a-input v-model="addForm.mobile" placeholder="请输入手机号码" />
                    </a-form-model-item>
                  </a-col>
                  <a-col :span="12">
                    <a-form-model-item label="电子邮箱" prop="email">
                      <a-input v-model="addForm.email" placeholder="请输入电子邮箱" />
                    </a-form-model-item>
                  </a-col>
                </a-row>
                <a-row>
                  <a-col :span="12">
                    <a-form-model-item label="用户性别" prop="sex">
                      <a-select v-model="addForm.sex" placeholder="请选择用户性别">
                        <a-select-option value="男">
                          男
                        </a-select-option>
                        <a-select-option value="女">
                          女
                        </a-select-option>
                        <a-select-option value="未知">
                          未知
                        </a-select-option>
                      </a-select>
                    </a-form-model-item>
                  </a-col>
                  <a-col :span="12">
                    <a-form-model-item label="用户生日" prop="birth">
                      <a-date-picker v-model="addForm.birth" placeholder="请选择用户生日" valueFormat="value" style="width:100%;" />
                    </a-form-model-item>
                  </a-col>
                </a-row>
              </a-collapse-panel>
              <a-collapse-panel key="3" :style="customStyle">
                <template slot="header">
                  <a-icon type="team" /> 职责信息
                </template>
                <a-row>
                  <a-col :span="12">
                    <a-form-model-item label="用户编号" prop="number">
                      <a-input v-model="addForm.number" placeholder="请输入用户编号" />
                    </a-form-model-item>
                  </a-col>
                  <a-col :span="12">
                    <a-form-model-item label="所属角色" prop="role">
                      <a-select show-search mode="multiple" :value="addForm.role" @search="(value) => addOnSearch(value,'role',roleTreeData,dataListRole)" placeholder="请选择所属角色 输入搜索" @change="(value, option) => changeaddSelect(value, option,'role','addroleCheckedKeys')">
                        <div slot="dropdownRender">
                          <div @mousedown="e => e.preventDefault()">
                            <a-tree :checkedKeys="addroleCheckedKeys" checkable checkStrictly :expanded-keys="addroleExpandedKeys" :auto-expand-parent="addroleAutoExpandParent" :tree-data="roleTreeData" @expand="(expandedKeys)=>addOnExpand(expandedKeys,'addroleExpandedKeys','addroleAutoExpandParent')" @check="(checkedKeys)=>addOnCheck(checkedKeys,'role','addroleCheckedKeys')">
                              <template slot="title" slot-scope="{ title }">
                                <span v-if="title.indexOf(searchValueRole) > -1">
                                  {{ title.substr(0, title.indexOf(searchValueRole)) }}
                                  <span style="color: #f50">{{ searchValueRole }}</span>
                                  {{ title.substr(title.indexOf(searchValueRole) + searchValueRole.length) }}
                                </span>
                                <span v-else>{{ title }}</span>
                              </template>
                            </a-tree>
                          </div>
                        </div>
                      </a-select>
                    </a-form-model-item>
                  </a-col>
                </a-row>
                <a-row>
                  <a-col :span="12">
                    <a-form-model-item label="所属部门" prop="department">
                      <a-select show-search mode="multiple" :value="addForm.department" @search="(value) => addOnSearch(value,'department',gData,dataTreeList)" placeholder="请选择所属部门 输入搜索" @change="(value, option) => changeaddSelect(value, option,'department','departmentCheckedKeys')">
                        <div slot="dropdownRender">
                          <div @mousedown="e => e.preventDefault()">
                            <a-tree :checkedKeys="departmentCheckedKeys" checkable checkStrictly :expanded-keys="departmentExpandedKeys" :auto-expand-parent="departmentAutoExpandParent" :tree-data="gData" @expand="(expandedKeys)=>addOnExpand(expandedKeys,'departmentExpandedKeys','departmentAutoExpandParent')" @check="(checkedKeys)=>addOnCheck(checkedKeys,'department','departmentCheckedKeys')">
                              <template slot="title" slot-scope="{ title }">
                                <span v-if="title.indexOf(searchValueDepartment) > -1">
                                  {{ title.substr(0, title.indexOf(searchValueDepartment)) }}
                                  <span style="color: #f50">{{ searchValueDepartment }}</span>
                                  {{ title.substr(title.indexOf(searchValueDepartment) + searchValueDepartment.length) }}
                                </span>
                                <span v-else>{{ title }}</span>
                              </template>
                            </a-tree>
                          </div>
                        </div>
                      </a-select>
                    </a-form-model-item>
                  </a-col>
                  <a-col :span="12">
                    <a-form-model-item label="所属岗位" prop="post">
                      <a-select show-search mode="multiple" :value="addForm.post" @search="(value) => addOnSearch(value,'post',postTreeData,dataListPost)" placeholder="请选择所属岗位 输入搜索" @change="(value, option) => changeaddSelect(value, option,'post','postCheckedKeys')">
                        <div slot="dropdownRender">
                          <div @mousedown="e => e.preventDefault()">
                            <a-tree :checkedKeys="postCheckedKeys" checkable checkStrictly :expanded-keys="postExpandedKeys" :auto-expand-parent="postAutoExpandParent" :tree-data="postTreeData" @expand="(expandedKeys)=>addOnExpand(expandedKeys,'postExpandedKeys','postAutoExpandParent')" @check="(checkedKeys)=>addOnCheck(checkedKeys,'post','postCheckedKeys')">
                              <template slot="title" slot-scope="{ title }">
                                <span v-if="title.indexOf(searchValuePost) > -1">
                                  {{ title.substr(0, title.indexOf(searchValuePost)) }}
                                  <span style="color: #f50">{{ searchValuePost }}</span>
                                  {{ title.substr(title.indexOf(searchValuePost) + searchValuePost.length) }}
                                </span>
                                <span v-else>{{ title }}</span>
                              </template>
                            </a-tree>
                          </div>
                        </div>
                      </a-select>
                    </a-form-model-item>
                  </a-col>
                </a-row>
              </a-collapse-panel>
            </a-collapse>
          </a-form-model>
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
            <a-button icon="close-circle" :style="{ marginRight: '8px' }" @click="OnClose('editDrawerVisible')">
              取消
            </a-button>
            <a-button icon="plus-circle" type="primary" @click="OnClose('editDrawerVisible')">
              保存
            </a-button>
          </div>
        </a-drawer>
        <!-- 表格数据 -->
        <a-table :loading="roleLoading" bordered :data-source="dataSource" :columns="columns" :row-selection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}" :rowKey="(record, index) => {return record.key}" :pagination="{ showSizeChanger: true, showQuickJumper: true, pageSize: 10, total: 50, current: 1, showTotal: ((total) => {return `每页10条，共 ${total} 条`}) }">
          <template slot="sort" slot-scope="text">
            <a-tag color="blue">
              {{text}}
            </a-tag>
          </template>
          <template slot="department" slot-scope="text">
            <a-tag color="blue">
              {{text}}
            </a-tag>
          </template>
          <template slot="action" slot-scope="text,record">
            <a-space :size="15">
              <a @click="toView(record)">
                <a-icon type="eye" /> 查看
              </a>
              <a @click="toEdit(record)">
                <a-icon type="edit" /> 编辑
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
  </div>
</template>

<script>
import moment from 'moment'

const getParentKey = (key, tree) => {
  let parentKey
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i]
    if (node.children) {
      if (node.children.some((item) => item.key === key)) {
        parentKey = node.key
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children)
      }
    }
  }
  return parentKey
}

const columns = [
  {
    title: '#',
    align: 'center',
    customRender: (text, record, index) => `${index + 1}`,
    width: '60px',
  },
  {
    title: '登录账户',
    dataIndex: 'name',
  },
  {
    title: '用户姓名',
    dataIndex: 'ortherName',
  },
  {
    title: '所属角色',
    dataIndex: 'sort',
    scopedSlots: { customRender: 'sort' },
  },
  {
    title: '所属部门',
    dataIndex: 'department',
    scopedSlots: { customRender: 'department' },
  },
  {
    title: '操作',
    scopedSlots: { customRender: 'action' },
    align: 'center',
    width: '250px',
  },
]
const dataSource = []
for (let i = 0; i < 8; i++) {
  dataSource.push({
    key: i,
    name: '超级管理员',
    ortherName: 'administrator',
    sort: i + 2,
    department: 'Fizz-Gateway公司,部门1,部门4',
  })
}
export default {
  name: 'User',
  inject: ['reloadCard'],
  data() {
    // 表单验证
    let validatePass = (rule, value, callback) => {
      const reg = new RegExp(/^(?![^a-zA-Z]+$)(?!\D+$)/)
      if (value === '' || value.length < 6) {
        callback(new Error('密码需在六位数及以上'))
      } else if (!reg.test(value)) {
        callback(new Error('密码必须包含数字和字母'))
      } else {
        if (this.addForm.checkPwd !== '') {
          this.$refs.addRuleForm.validateField('checkPwd')
        }
        callback()
      }
    }
    let validatecheckPwd = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入新密码'))
      } else if (value !== this.addForm.password) {
        callback(new Error('两次密码不一致！'))
      } else {
        callback()
      }
    }
    return {
      // 树状控件
      expandedKeys: [],
      searchValue: '',
      autoExpandParent: true,
      gData: [
        {
          key: '公司1',
          title: '公司1',
          scopedSlots: { title: 'title' },
          children: [
            {
              key: '部门11',
              title: '部门11',
              scopedSlots: { title: 'title' },
              children: [
                {
                  key: '部门111',
                  title: '部门111',
                  scopedSlots: { title: 'title' },
                },
                {
                  key: '部门112',
                  title: '部门112',
                  scopedSlots: { title: 'title' },
                },
              ],
            },
            {
              key: '部门12',
              title: '部门12',
              scopedSlots: { title: 'title' },
              children: [
                {
                  key: '部门121',
                  title: '部门121',
                  scopedSlots: { title: 'title' },
                },
                {
                  key: '部门122',
                  title: '部门122',
                  scopedSlots: { title: 'title' },
                },
              ],
            },
          ],
        },
        {
          key: '公司2',
          title: '公司2',
          scopedSlots: { title: 'title' },
          children: [
            {
              key: '部门21',
              title: '部门21',
              scopedSlots: { title: 'title' },
              children: [
                {
                  key: '部门211',
                  title: '部门211',
                  scopedSlots: { title: 'title' },
                },
                {
                  key: '部门212',
                  title: '部门212',
                  scopedSlots: { title: 'title' },
                },
              ],
            },
            {
              key: '部门22',
              title: '部门22',
              scopedSlots: { title: 'title' },
              children: [
                {
                  key: '部门221',
                  title: '部门221',
                  scopedSlots: { title: 'title' },
                },
                {
                  key: '部门222',
                  title: '部门222',
                  scopedSlots: { title: 'title' },
                },
              ],
            },
          ],
        },
        {
          key: '公司3',
          title: '公司3',
          scopedSlots: { title: 'title' },
        },
      ],
      dataTreeList: [],
      // 搜索栏
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
      queryInfo: {
        name: '',
        ortherName: '',
      },
      rules: {},
      search: true,
      // 新增
      addDrawerVisible: false,
      addForm: {
        account: '',
        password: '',
        checkPwd: '',
        nickName: '',
        name: '',
        mobile: '',
        email: '',
        sex: undefined,
        birth: null,
        number: '',
        role: ['超级管理员', '用户', '0-1-0-1'],
        department: ['公司2', '部门21', '部门212', '公司3', '部门22'],
        post: ['首席技术官', '普通员工'],
      },
      addRules: {
        account: [{ required: true, message: '请输入登录账号', trigger: 'blur' }],
        password: [{ required: true, validator: validatePass, trigger: 'change' }],
        checkPwd: [{ required: true, validator: validatecheckPwd, trigger: 'change' }],
        nickName: [{ required: true, message: '请输入用户昵称', trigger: 'blur' }],
        name: [{ required: true, message: '请输入用户姓名', trigger: 'blur' }],
        role: [{ required: true, message: '请选择所属角色', trigger: 'blur' }],
        department: [{ required: true, message: '请选择所属部门', trigger: 'blur' }],
        post: [{ required: true, message: '请选择所属岗位', trigger: 'blur' }],
      },
      customStyle:
        'background: #fff;border-radius: 4px;margin-bottom: 24px;border: 0;overflow: hidden',
      // 新增所属角色
      addroleCheckedKeys: [], // 复选框
      addroleExpandedKeys: [], // 展开指定的树节点
      addroleAutoExpandParent: true, // 是否自动展开父节点
      searchValueRole: '', // 搜索内容
      dataListRole: [],
      // 新增所属部门
      departmentCheckedKeys: [],
      departmentExpandedKeys: [],
      departmentAutoExpandParent: true,
      searchValueDepartment: '',
      // dataListDepartment: [],
      // 新增所属岗位
      postTreeData: [
        {
          key: '首席执行官',
          title: '首席执行官',
          scopedSlots: { title: 'title' },
          children: [
            {
              key: '222',
              title: '222',
              scopedSlots: { title: 'title' },
            },
          ],
        },
        {
          key: '首席运营官',
          title: '首席运营官',
          scopedSlots: { title: 'title' },
        },
        {
          key: '首席财务官',
          title: '首席财务官',
          scopedSlots: { title: 'title' },
        },
        {
          key: '首席技术官',
          title: '首席技术官',
          scopedSlots: { title: 'title' },
        },
        {
          key: '首席信息官',
          title: '首席信息官',
          scopedSlots: { title: 'title' },
        },
        {
          key: '技术经理',
          title: '技术经理',
          scopedSlots: { title: 'title' },
        },
        {
          key: '人力经理',
          title: '人力经理',
          scopedSlots: { title: 'title' },
        },
        {
          key: '普通员工',
          title: '普通员工',
          scopedSlots: { title: 'title' },
        },
      ], // 岗位树形控件数据
      postCheckedKeys: [],
      postExpandedKeys: [],
      postAutoExpandParent: true,
      searchValuePost: '',
      dataListPost: [],

      // 用户角色配置
      userRoleVisible: false,
      roleTreeData: [
        {
          title: '超级管理员',
          key: '超级管理员',
          scopedSlots: { title: 'title' },
        },
        {
          title: '用户',
          key: '用户',
          scopedSlots: { title: 'title' },
          children: [
            { title: '0-1-0-0', key: '0-1-0-0', scopedSlots: { title: 'title' } },
            { title: '0-1-0-1', key: '0-1-0-1', scopedSlots: { title: 'title' } },
            { title: '0-1-0-2', key: '0-1-0-2', scopedSlots: { title: 'title' } },
          ],
        },
        {
          title: '管理员',
          key: '管理员',
          scopedSlots: { title: 'title' },
        },
        {
          title: '开发人员',
          key: '开发人员',
          scopedSlots: { title: 'title' },
        },
      ],
      roleCheckedKeys: [],
      roleExpandedKeys: [],
      roleSelectedKeys: [],
      roleAutoExpandParent: true,
      // 列显隐
      drawerVisible: false,
      // 穿梭框
      mockData: [
        {
          key: '1',
          title: '登录账户',
          description: 'description of 登录账户',
        },
        {
          key: '2',
          title: '用户姓名',
          description: 'description of 用户姓名',
        },
        {
          key: '3',
          title: '所属角色',
          description: 'description of 所属角色',
        },
        {
          key: '4',
          title: '所属部门',
          description: 'description of 所属部门',
        },
      ],
      targetKeys: ['1', '2', '3', '4'],

      // 表格
      dataSource,
      columns,
      roleLoading: false, //加载中
      selectedRowKeys: [],
      // 查看
      viewDrawerVisible: false,
      viewForm: {
        account: 'admin',
        nickName: '超级管理员',
        name: '超级管理员',
        mobile: '13555555555',
        email: '123456@qq.com',
        sex: '未知',
        birth: '1996-02-05',
        number: '',
        role: undefined,
        department: undefined,
        post: undefined,
      },
      viewRules: {},
      // 编辑
      editDrawerVisible: false,
    }
  },
  mounted() {
    // this.generateListRole(this.roleTreeData, this.dataListRole)
    this.generateList(this.gData, this.dataTreeList)
    this.generateList(this.roleTreeData, this.dataListRole)
  },
  methods: {
    moment,
    // 树状控件
    onExpand(expandedKeys) {
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    generateList(data, dataList) {
      for (let i = 0; i < data.length; i++) {
        const node = data[i]
        const key = node.key
        dataList.push({ key, title: key })
        if (node.children) {
          this.generateList(node.children, dataList)
        }
      }
    },
    onChange(e) {
      const value = e.target.value
      const expandedKeys = this.dataTreeList
        .map((item) => {
          if (item.title.indexOf(value) > -1) {
            return getParentKey(item.key, this.gData)
          }
          return null
        })
        .filter((item, i, self) => item && self.indexOf(item) === i)
      Object.assign(this, {
        expandedKeys,
        searchValue: value,
        autoExpandParent: true,
      })
    },
    onSubmit() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          alert('1')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm() {
      this.$refs.ruleForm.resetFields()
    },
    // 新增
    add() {
      this.addDrawerVisible = true
    },
    OnClose(drawerName) {
      this[drawerName] = false
    },
    // 新增生日日期
    changeAddbirth(date, dateString) {
      console.log(date, dateString)
      this.viewForm.birth = dateString
    },
    // 新增所属角色
    // 搜索所属角色
    addOnSearch(value, type, dateTree, dataList) {
      const ExpandedKeys = dataList
        .map((item) => {
          if (item.title.indexOf(value) > -1) {
            return getParentKey(item.key, dateTree)
          }
          return null
        })
        .filter((item, i, self) => item && self.indexOf(item) === i)
      switch (type) {
        case 'role':
          Object.assign(this, {
            addroleExpandedKeys: ExpandedKeys,
            searchValueRole: value,
            addroleAutoExpandParent: true,
          })
          break
        case 'department':
          Object.assign(this, {
            departmentExpandedKeys: ExpandedKeys,
            searchValueDepartment: value,
            departmentAutoExpandParent: true,
          })
          break
        case 'post':
          Object.assign(this, {
            postExpandedKeys: ExpandedKeys,
            searchValuePost: value,
            postAutoExpandParent: true,
          })
      }
    },
    // 改变所属角色选择框
    changeaddSelect(value, option, name, keysName) {
      console.log(value, option)
      // console.log(this.addroleCheckedKeys)
      this[keysName] = value
      this.addForm[name] = value
    },
    addOnExpand(expandedKeys, keysName, parent) {
      console.log('onExpand', expandedKeys)
      // if not set autoExpandParent to false, if children expanded, parent can not collapse.
      // or, you can remove all expanded children keys.
      this[keysName] = expandedKeys
      this[parent] = false
    },
    addOnCheck(checkedKeys, name, keysName) {
      console.log('onCheck', checkedKeys)
      this[keysName] = checkedKeys.checked
      this.addForm[name] = checkedKeys.checked
    },
    // 角色配置
    roleSetting() {
      this.userRoleVisible = true
    },
    userRoleHandleOk() {
      this.userRoleVisible = false
    },
    roleOnExpand(expandedKeys) {
      console.log('onExpand', expandedKeys)
      // if not set autoExpandParent to false, if children expanded, parent can not collapse.
      // or, you can remove all expanded children keys.
      this.roleExpandedKeys = expandedKeys
      this.roleAutoExpandParent = false
    },
    roleOnSelect(selectedKeys, info) {
      console.log('onSelect', info)
      this.roleSelectedKeys = selectedKeys
    },
    roleOnCheck(checkedKeys) {
      console.log('onCheck', checkedKeys)
      this.roleCheckedKeys = checkedKeys
      this.addForm.role = checkedKeys.checked
    },
    // 密码重置
    resetPassword() {
      this.$confirm({
        title: '确定将选择账号密码重置为【******】?',
        centered: true,
        okText: '确定',
        cancelText: '取消',
        maskClosable: true,
        closable: true,
        onOk: () => {
          this.$message.success('重置成功！')
        },
        onCancel: () => {},
      })
    },
    // 勾选表格数据
    onSelectChange(selectedRowKeys) {
      console.log('selectedRowKeys changed: ', selectedRowKeys)
      this.selectedRowKeys = selectedRowKeys
    },
    // 刷新此页面
    refresh() {
      this.reloadCard()
    },
    // 列显隐
    showDrawer() {
      this.drawerVisible = true
    },
    drawerOnClose() {
      this.drawerVisible = false
    },
    // 搜索栏显示与隐藏
    showSearch() {
      this.search = !this.search
    },
    // 穿梭框
    transferFilterOption(inputValue, option) {
      return option.description.indexOf(inputValue) > -1
    },
    transferHandleChange(targetKeys, direction, moveKeys) {
      console.log(targetKeys, direction, moveKeys)
      this.targetKeys = targetKeys
    },
    transferHandleSearch(dir, value) {
      console.log('search:', dir, value)
    },
    // 查看
    toView(record) {
      console.log(record)
      // this.viewInfo = record
      this.viewDrawerVisible = true
    },
    viewOnClose() {
      this.viewDrawerVisible = false
    },
    // 编辑
    toEdit(record) {
      console.log(record)
      // this.editForm = record
      this.editDrawerVisible = true
      this.addroleCheckedKeys = this.addForm.role
      this.departmentCheckedKeys = this.addForm.department
      this.postCheckedKeys = this.addForm.post
    },
    editOnClose() {
      this.editDrawerVisible = false
    },
    // 删除
    onDelete(key) {
      const data = [...this.dataSource]
      this.dataSource = data.filter((item) => item.key !== key)
      this.$message.success('删除成功！')
    },
  },
}
</script>

<style lang="less" scoped>
.user {
  display: flex;
  justify-content: space-between;
  .userLeft {
    width: 20%;
    background: #fff;
    padding: 24px;
    // min-height: 280px;
    height: 100%;
  }
  .userRight {
    width: 79%;
    background: #fff;
    padding: 24px;
    min-height: 280px;
    .table {
      a {
        font-size: 12px;
      }
    }
  }
}
.addDrawer /deep/ .ant-collapse {
  background-color: #ffffff;
}
.addDrawer /deep/ .ant-collapse-item {
  margin-bottom: 0 !important;
}
.addDrawer /deep/ .ant-collapse-header {
  border-bottom: 1px solid #eee;
  margin-bottom: 30px;
  font-size: 16px;
}
// .addDrawer /deep/ .ant-collapse-content-box{
//   // padding: 24px 16px !important;
// }
</style>