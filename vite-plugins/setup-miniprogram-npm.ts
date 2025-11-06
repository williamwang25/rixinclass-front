import type { Plugin } from 'vite'
import path from 'node:path'
import process from 'node:process'
import fs from 'fs-extra'

/**
 * 设置小程序 npm 包
 * 解决 @cloudbase/wx-cloud-client-sdk 在小程序中找不到的问题
 */
export function setupMiniprogramNpm(): Plugin {
  return {
    name: 'setup-miniprogram-npm',
    apply: 'build',
    enforce: 'post',

    async writeBundle() {
      const { UNI_PLATFORM } = process.env
      
      // 只在微信小程序平台执行
      if (UNI_PLATFORM !== 'mp-weixin') {
        return
      }

      try {
        const projectRoot = process.cwd()
        const buildMode = process.env.NODE_ENV === 'production' ? 'build' : 'dev'
        const mpDir = path.resolve(projectRoot, 'dist', buildMode, 'mp-weixin')

        console.log('[npm] 设置小程序 npm 包...')

        // 1. 创建 package.json
        const packageJsonPath = path.resolve(mpDir, 'package.json')
        const packageJson = {
          name: 'rixinclass-mp',
          version: '1.0.0',
          description: '日新智课微信小程序',
          dependencies: {
            '@cloudbase/wx-cloud-client-sdk': '^1.7.1'
          }
        }

        await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 })
        console.log('✅ [npm] package.json 已创建')

        // 2. 修改 project.config.json，添加 npm 配置
        const configPath = path.resolve(mpDir, 'project.config.json')
        
        if (await fs.pathExists(configPath)) {
          const config = await fs.readJson(configPath)
          
          // 添加 npm 相关配置
          config.setting = config.setting || {}
          config.setting.packNpmManually = true
          config.setting.packNpmRelationList = [
            {
              packageJsonPath: './package.json',
              miniprogramNpmDistDir: './'
            }
          ]
          
          await fs.writeJson(configPath, config, { spaces: 2 })
          console.log('✅ [npm] project.config.json 已配置 npm 支持')
        }

        // 3. 提示用户操作
        console.log('\n' + '='.repeat(60))
        console.log('📋 [重要] 接下来需要执行以下步骤：')
        console.log('='.repeat(60))
        console.log('\n1️⃣  在终端执行：')
        console.log('   cd dist/dev/mp-weixin && pnpm install\n')
        console.log('2️⃣  在微信开发者工具中：')
        console.log('   工具 → 构建 npm\n')
        console.log('3️⃣  刷新微信开发者工具')
        console.log('   点击"编译"按钮\n')
        console.log('='.repeat(60) + '\n')

      } catch (error) {
        console.error('❌ [npm] 设置失败:', error)
      }
    }
  }
}

