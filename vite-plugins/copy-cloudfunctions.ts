import type { Plugin } from 'vite'
import path from 'node:path'
import process from 'node:process'
import fs from 'fs-extra'

/**
 * 复制云函数到小程序构建目录
 * 解决 uni-app 编译后云函数丢失的问题
 */
export function copyCloudfunctions(): Plugin {
  return {
    name: 'copy-cloudfunctions',
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
        const sourcePath = path.resolve(projectRoot, 'cloudfunctions')
        
        const buildMode = process.env.NODE_ENV === 'production' ? 'build' : 'dev'
        const targetPath = path.resolve(
          projectRoot,
          'dist',
          buildMode,
          'mp-weixin',
          'cloudfunctions'
        )

        // 检查源目录是否存在
        const sourceExists = await fs.pathExists(sourcePath)
        if (!sourceExists) {
          console.warn('[云函数] 源目录不存在，跳过复制')
          return
        }

        console.log('[云函数] 开始复制...')
        console.log('[云函数] 源目录:', sourcePath)
        console.log('[云函数] 目标目录:', targetPath)

        // 复制云函数（排除 node_modules 和文档）
        await fs.copy(sourcePath, targetPath, {
          overwrite: true,
          filter: (src) => {
            const relativePath = path.relative(sourcePath, src)
            // 排除 node_modules、.md 文件
            if (relativePath.includes('node_modules')) return false
            if (src.endsWith('.md')) return false
            return true
          }
        })

        console.log('✅ [云函数] 复制成功')
        
        // 修改 project.config.json 添加云函数配置
        const configPath = path.resolve(
          projectRoot,
          'dist',
          buildMode,
          'mp-weixin',
          'project.config.json'
        )
        
        if (await fs.pathExists(configPath)) {
          const config = await fs.readJson(configPath)
          
          // 添加云函数根目录配置
          if (!config.cloudfunctionRoot) {
            config.cloudfunctionRoot = 'cloudfunctions/'
            await fs.writeJson(configPath, config, { spaces: 2 })
            console.log('✅ [云函数] project.config.json 已更新')
          }
        }

      } catch (error) {
        console.error('❌ [云函数] 复制失败:', error)
      }
    }
  }
}

