import autoImport from 'unplugin-auto-import/vite'
// 系统自动引入
export default function createAutoImport() {
    return autoImport({
        imports: [
            'vue',
            'vue-router',
            'pinia'
        ],
        dts: false
    })
}
