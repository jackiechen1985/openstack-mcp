import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],       // 入口文件
  outDir: 'dist',                // 输出目录
  format: ['cjs'],               // 输出格式，因为你的 package.json 是 "type": "module"
  platform: 'node',              // 平台目标
  target: 'node18',              // 目标 Node 版本
  dts: true,                     // 生成类型定义文件 (.d.ts)
  clean: true,                   // 打包前自动清空 dist 目录
  minify: true,                  // 【关键】开启代码压缩混淆
  treeshake: true,               // 【关键】开启摇树优化，去掉未使用的代码（包括未引用的 Map 操作等）
  external: [                    // 排除外部依赖，防止它们被打包进文件（保持包体积小）
    // 如果你的依赖中有需要动态加载的，可以在这里排除
  ]
});