<template>
    <div class="FunctionParameter">
        <div class="pagestyle" style="padding: 0 20px">
            <div class="wrap_tag">
                <div class="item_tag" @click="chooseTag('tagBasicVisible')">
                    <div class="tag_all">
                        <div class="tag_left">
                            <img src="@/assets/img/systemManage/basic.png" alt="">
                        </div>
                        <div class="tag_right">
                            <div class="tag_title">基础数据配置</div>
                            <div>监控设备</div>
                        </div>
                    </div>
                </div>
                <div class="item_tag">
                    <div class="tag_all" @click="chooseTag('tagPlatformVisible')">
                        <div class="tag_left">
                            <img src="@/assets/img/systemManage/platform.png" alt="">
                        </div>
                        <div class="tag_right">
                            <div class="tag_title">平台对接信息</div>
                            <div>省云平台数据、部云平台对接</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="organization_dialog functionConfig">
            <el-dialog title="基础数据配置" width="42%"  :visible.sync="tagBasicVisible" center>
                <div class="bullet_frame">
                    <div class="frame_left">
                        <div class="frame_tips">基础数据配置</div>
                        <div class="active frame_menu">摄像机数据</div>
                    </div>
                    <div class="frame_right vice">
                        <div class="vice_all">
                            <div class="vice_title">
                                <span>副称控件</span>
                                <div class="wrap_vise">
                                    <el-switch size="small" v-model="viceName" :active-value=1 :inactive-value=0 @change="dealNameSuffix"></el-switch>
                                </div>
                            </div>
                            <div class="vice_tips">
                                副称字段可以作为摄像机监控设备唯一区别字符标识，若开启副称控件即可在页面中查看到摄像机设备全称中进行展示，若关闭副称控件即在页面中无法查看，但可在视频播放窗体中进行切换作用
                            </div>
                        </div>
                    </div>
                </div>
            </el-dialog>
        </div>
        <div class="organization_dialog functionConfig">
            <el-dialog title="平台对接信息" width="42%"  :visible.sync="tagPlatformVisible" center>
                <div class="bullet_frame">
                    <div class="frame_left">
                        <div class="frame_tips">平台对接信息</div>
                        <div @click="chooseForm('province')" :class="[tagForm=='province'?'active':'','frame_menu']">省云平台数据</div>
                        <div @click="chooseForm('unit')" :class="[tagForm=='unit'?'active':'','frame_menu']">部云平台数据</div>
                    </div>
                    <div class="frame_right">
                        <el-form v-if="tagForm=='province'" key="province" :model="provinceForm" size="small" :rules="provinceRules" ref="provinceForm" label-width="120px">
                            <el-form-item label="省云用户名称" prop="local_user">
                                <el-input v-model="provinceForm.local_user" @change="getTokenAndKey" placeholder="请输入省云用户名称"></el-input>
                            </el-form-item>
                            <el-form-item label="省云编号" prop="local_deviceCode">
                                <el-input v-model="provinceForm.local_deviceCode" placeholder="请输入省云编号"></el-input>
                            </el-form-item>
                            <el-form-item label="省云IP地址" prop="local_url">
                                <div class="item_flex">
                                    <div class="item_select">
                                        <el-select v-model="provinceForm.local_scheme">
                                            <el-option label="http" value="http"></el-option>
                                            <el-option label="https" value="https"></el-option>
                                        </el-select>
                                    </div>
                                    <div>
                                        <el-input v-model="provinceForm.local_url"></el-input>
                                    </div>
                                </div>
                            </el-form-item>
                            <el-form-item label="省云初始Token" prop="local_original_token">
                                <el-input :disabled="true" v-model="provinceForm.local_original_token" placeholder="请输入省云初始token"></el-input>
                            </el-form-item>
                            <el-form-item label="省云新Token" prop="local_latest_token">
                                <el-input v-model="provinceForm.local_latest_token"></el-input>
                            </el-form-item>
                            <el-form-item label="秘钥" prop="local_private_key">
                                <div class="wrap_area">
                                    <el-input :disabled="true" type="textarea" v-model="provinceForm.local_private_key"></el-input>
                                    <el-button class="copy" type="primary" @click="handleCopy(provinceForm.local_private_key)">复制</el-button>
                                </div>
                            </el-form-item>
                            <el-form-item>
                                <el-button @click="resetForm('provinceForm')">重置</el-button>
                                <el-button type="primary" @click="submitProvinceForm('provinceForm')">保存</el-button>
                            </el-form-item>
                        </el-form>
                        <el-form v-else :model="unitForm" key="unit" size="small" :rules="unitRules" ref="unitForm" label-width="120px">
                            <el-form-item label="国家" prop="ministerial_area">
                                <el-input v-model="unitForm.ministerial_area" placeholder="请输入国家"></el-input>
                            </el-form-item>
                            <el-form-item label="部云用户名称" prop="ministerial_user">
                                <el-input v-model="unitForm.ministerial_user" placeholder="请输入部云用户名称"></el-input>
                            </el-form-item>
                            <el-form-item label="部云编号" prop="ministerial_deviceCode">
                                <el-input v-model="unitForm.ministerial_deviceCode" placeholder="请输入部云编号"></el-input>
                            </el-form-item>
                            <el-form-item label="部云IP地址" prop="ministerial_url">
                                <div class="item_flex">
                                    <div class="item_select">
                                        <el-select v-model="unitForm.ministerial_scheme">
                                            <el-option label="http" value="http"></el-option>
                                            <el-option label="https" value="https"></el-option>
                                        </el-select>
                                    </div>
                                    <div>
                                        <el-input v-model="unitForm.ministerial_url"></el-input>
                                    </div>
                                </div>
                            </el-form-item>
                            <el-form-item label="部云Token" prop="ministerial_latest_token">
                                <el-input v-model="unitForm.ministerial_latest_token" placeholder="请输入部云token"></el-input>
                            </el-form-item>
                            <el-form-item label="秘钥" prop="ministerial_private_key">
                                <div class="wrap_area">
                                    <el-input type="textarea" v-model="unitForm.ministerial_private_key" placeholder="请输入部云秘钥"></el-input>
                                    <el-button class="copy" type="primary" @click="handleCopy(unitForm.ministerial_private_key)">复制</el-button>
                                </div>
                            </el-form-item>
                            <el-form-item>
                                <el-button @click="resetForm('unitForm')">重置</el-button>
                                <el-button type="primary" @click="submitUnitForm('unitForm')">保存</el-button>
                                <el-button type="primary" @click="checkData">一键检核</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    export default {
        name:'FunctionParameter',
        data(){
            return{
                tagBasicVisible:false, //基础信息弹窗
                tagPlatformVisible:false, //平台对接弹窗
                tagForm:'province',//记录当前操作的form province:省 unit:部
                viceName:null,//是否开启副称
                provinceForm:{ //省
                    local_user:null,
                    local_deviceCode:null,
                    local_scheme:'http',
                    local_url:null,
                    local_original_token:null,
                    local_latest_token:null,
                    local_private_key:null,
                    local_public_key:null
                },
                provinceRules:{
                    local_user:[{ required: true, message: '请输入省云用户名称', trigger: 'blur' }],
                    local_deviceCode:[{ required: true, message: '请输入省云编号', trigger: 'blur' }],
                    local_url:[{ required: true, message: '请输入省云ip', trigger: 'blur' }],
                    local_original_token:[{ required: true, message: '请输入省云初始token', trigger: 'blur' }],
                    local_private_key:[{ required: true, message: '请输入省云秘钥', trigger: 'blur' }]
                },
                unitForm:{ //部
                    ministerial_area:null,
                    ministerial_user:null,
                    ministerial_deviceCode:null,
                    ministerial_scheme:'http',
                    ministerial_url:null,
                    ministerial_latest_token:null,
                    ministerial_private_key:null
                },
                unitRules:{
                    ministerial_area:[{ required: true, message: '请输入国家', trigger: 'blur' }],
                    ministerial_user:[{ required: true, message: '请输入部云用户名称', trigger: 'blur' }],
                    ministerial_deviceCode:[{ required: true, message: '请输入部云编号', trigger: 'blur' }],
                    ministerial_latest_token:[{ required: true, message: '请输入部云初始token', trigger: 'blur' }],
                    ministerial_private_key:[{ required: true, message: '请输入部云秘钥', trigger: 'blur' }]
                }
            }
        },
        mounted() {
            this.viceName = this.$store.state.open_global_name_suffix
        },
        methods: {
            //处理副称的开启
            dealNameSuffix(data){
                let params = {
                    type:data
                }
                this.$apiList.functionParameter.controlGlobalNameSuffix(params).then(res=>{
                    if(res.data.code==200){
                        this.$store.dispatch('SETNAMESUFFIX', data)
                        this.$message.success(res.data.message)
                    }
                })
            },
            //一键检测
            checkData(){
                this.$confirm('请确保数据已经保存，否则检核有误！', '提示', {
                    cancelButtonText: '确定',
                    confirmButtonText: '继续检核',
                    type: 'warning'
                }).then(() => {
                    this.$apiList.functionParameter.checkPlatformData().then(res=>{
                        if(res.data.code==200){
                            this.$message.success(res.data.message)
                        }
                    })
                }).catch(() => {
                });
            },
            //鼠标点击复制到粘贴板
            handleCopy(data){
                const textarea = document.createElement('textarea');
                textarea.value = data;
                document.body.appendChild(textarea);
                textarea.select();
                if (document.execCommand('Copy')) {
                    document.execCommand('Copy');
                }
                textarea.remove();
                this.$message({
                    message: '已复制链接至剪贴板中，请粘贴操作！',
                    type: 'success'
                });
            },
            chooseTag(val){
                this[val] = true
                if(val=='tagPlatformVisible'){ //如果选择平台对接信息加载省云参数
                    this.tagForm = 'province'
                    this.getPlatFormParameters()
                }
            },
            //获取平台对接参数
            getPlatFormParameters(){
                let params = {
                    platform_type:null
                }
                if(this.tagForm == 'province'){
                    params.platform_type = 1
                } else {
                    params.platform_type = 2
                }
                this.$apiList.functionParameter.getPlatformParameters(params).then(res=>{
                    if(res.data.code==200){
                        if(!Array.isArray(res.data.data)){ //因为返回数据为空时是一个空的数组而不是对象，需要判断一下
                            if(this.tagForm == 'province')
                                this.provinceForm = {...res.data.data}
                            else
                                this.unitForm = {...res.data.data}
                        } else { //获取对象为空时重置一下
                            if(this.tagForm == 'province')
                                this.provinceForm = this.$options.data().provinceForm
                            else
                                this.unitForm = this.$options.data().unitForm
                        }
                    } else{
                        this.$message.error('获取参数失败！')
                    }
                })
            },
            chooseForm(val){
                this.tagForm = val
                this.getPlatFormParameters()
            },
            //省云提交
            submitProvinceForm(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$apiList.functionParameter.saveProvinceParameters({...this.provinceForm}).then(res=>{
                            if(res.data.code==200){
                                this.$message.success('保存成功！')
                            }
                        })
                    } else {
                        return false;
                    }
                });
            },
            //部平台提交
            submitUnitForm(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$apiList.functionParameter.saveUnitParameters({...this.unitForm}).then(res=>{
                            if(res.data.code==200){
                                this.$message.success('保存成功！')
                            }
                        })
                    } else {
                        return false;
                    }
                });
            },
            //获取省平台token和秘钥
            getTokenAndKey(data){
                let params = {
                    local_user:data
                }
                this.$apiList.functionParameter.getCreateTokenAndKey(params).then(res=>{
                    if(res.data.code==200){
                        this.provinceForm.local_original_token = res.data.data.local_original_token
                        this.provinceForm.local_private_key = res.data.data.local_private_key
                        this.provinceForm.local_public_key = res.data.data.local_public_key
                    }
                })
            },
            resetForm(formName){
                this.$refs[formName].resetFields();
            }
        },
    }
</script>

<style scoped>
    .functionConfig ::v-deep .el-dialog--center .el-dialog__body{
        padding:0;
        overflow-y: auto;
    }
    .wrap_tag{
        padding-top:10px;
    }
    .item_tag{
        border:1px solid #bebebe;
        padding:30px;
        display: inline-block;
        width:297px;
        box-sizing: border-box;
        margin-right:36px;
        cursor: pointer;
    }

    .item_tag .tag_all{
        display: flex;
    }
    .item_tag .tag_left img{
        width:40px;
        height:40px;
        margin-right:10px;
    }
    .item_tag .tag_right{
        flex:1;
        font-size:14px;
        color:#666666;
    }
    .item_tag .tag_right .tag_title{
        font-weight: bold;
        color:#222222;
        font-size: 16px;
        margin-bottom:2px;
    }
    .bullet_frame{
        display: flex;
        height:588px;
        background:#fff;
    }
    .bullet_frame .frame_left{
        width:163px;
        background-color: #f5f5f5;
    }
    .bullet_frame .frame_left .frame_tips{
        color:#222222;
        font-size:16px;
        font-weight: bold;
        padding-left:22px;
        margin:17px 0;
        position: relative;
    }
    .bullet_frame .frame_left .frame_tips::before{
        position: absolute;
        width:2px;
        height:100%;
        background-color: #5CB1FF;
        content:"";
        left:15px;
        top:0;
    }
    .bullet_frame .frame_left .frame_menu{
        text-align: center;
        padding:13px 0;
        font-size: 14px;
        color:#222222;
        cursor: pointer;
    }
    .bullet_frame .frame_left .frame_menu.active{
        background-color: #b8daf9;
    }

    .bullet_frame .frame_right{
        flex:1;
        padding:34px 20px 0 20px;
    }
    .bullet_frame .frame_right.vice{
        padding:0;
    }
    .item_flex{
        display: flex;

    }
    .item_flex > div{
        flex:7;
    }
    .item_flex .item_select{
        flex:2;
        margin-right:10px;
    }

    .wrap_area{
        position: relative;
    }
    .wrap_area::v-deep .el-textarea__inner{
        width:80%;
        resize: none;
        height:94px;
    }
    .wrap_area .copy{
        position: absolute;
        top:0;
        right:0;
    }
    .vice_title{
        color:#222222;
        font-size: 16px;
        font-weight: bold;
        position: relative;
    }
    .vice_title .wrap_vise{
        position: absolute;
        top:0;
        right:0;
    }
    .vice_all{
        padding:35px 35px 30px 35px;
    }
    .vice_all .vice_tips{
        font-size:14px;
        color:#878787;
        margin-top:20px;
        line-height:26px;
    }
</style>