import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // 设置测试环境
    environment: 'happy-dom',
    
    // 设置全局超时时间
    testTimeout: 10000,
    
    // 设置钩子超时时间
    hookTimeout: 10000,
    
    // 并行运行测试
    threads: true,
    
    // 设置最大并发数
    maxConcurrency: 5,
    
    // 启用隔离
    isolate: true,
    
    // 设置覆盖率
    coverage: {
      provider: 'istanbul',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        'src/main.ts',
        'src/router/**',
        'src/data/**',
        '**/*.d.ts',
        '**/*.spec.ts',
        '**/*.test.ts'
      ]
    },
    
    // 设置文件包含和排除
    include: ['src/**/*.{test,spec}.{ts,js}'],
    exclude: [
      'node_modules',
      'dist',
      '**/node_modules/**',
      '**/dist/**'
    ]
  }
})