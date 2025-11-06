/**
 * 小程序 npm 包安装脚本
 * 编译后自动执行，安装小程序所需的 npm 包
 */

const path = require('node:path')
const fs = require('fs-extra')
const { execSync } = require('node:child_process')

const projectRoot = process.cwd()
const buildMode = process.env.NODE_ENV === 'production' ? 'build' : 'dev'
const mpDir = path.resolve(projectRoot, 'dist', buildMode, 'mp-weixin')

console.log('\n' + '='.repeat(60))
console.log('📦 开始设置小程序 npm 包...')
console.log('='.repeat(60) + '\n')

async function setup() {
  try {
    // 检查目录是否存在
    if (!await fs.pathExists(mpDir)) {
      console.error('❌ 小程序目录不存在，请先编译项目')
      console.error('   目录:', mpDir)
      process.exit(1)
    }

    // 检查 package.json 是否存在
    const packageJsonPath = path.resolve(mpDir, 'package.json')
    if (!await fs.pathExists(packageJsonPath)) {
      console.error('❌ package.json 不存在')
      console.error('   请确保 vite 插件已正确配置')
      process.exit(1)
    }

    console.log('📍 工作目录:', mpDir)
    console.log('📦 开始安装依赖...\n')

    // 执行 pnpm install
    execSync('pnpm install', {
      cwd: mpDir,
      stdio: 'inherit'
    })

    console.log('\n✅ npm 包安装成功！')
    console.log('\n' + '='.repeat(60))
    console.log('📋 接下来请在微信开发者工具中执行：')
    console.log('='.repeat(60))
    console.log('\n   工具 → 构建 npm\n')
    console.log('='.repeat(60) + '\n')

  } catch (error) {
    console.error('\n❌ 安装失败:', error.message)
    process.exit(1)
  }
}

setup()

