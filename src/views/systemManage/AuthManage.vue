<template>
    <div>
        <div class="tabs">
            <ul>
                <li :class="componentName=='Role'?'active':'' " @click="tabFunc('Role')">角色权限</li>
                <li :class="componentName=='Menu'?'active':'' " @click="tabFunc('Menu')">菜单列表</li>
                <li :class="componentName=='Permission'?'active':'' " @click="tabFunc('Permission')">接口列表</li>
            </ul>
        </div>
        <div class="tabs_content">
            <component :is="componentName"></component>
        </div>
    </div>
</template>
<script>
    import Role from '@/components/authManage/Role';
    import Menu from '@/components/authManage/Menu';
    import Permission from '@/components/authManage/Permission';
    export default {
        name: 'dashboard',
        data() {
            return {
                componentName: 'Role',
            };
        },
        components: {
            Role,
            Menu,
            Permission,
        },
        created() {},
        methods: {
            // 切换tab执行
            tabFunc (tab) {
                this.componentName = tab
            },
        }
    };
</script>