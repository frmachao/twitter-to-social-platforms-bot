module.exports = {
  apps: [{
    name: "twitter-telegram-bot",
    script: "./dist/index.js",
    watch: false,
    env: {
      NODE_ENV: "production",
    },
    // 自动重启设置
    autorestart: true,
    max_restarts: 10,
    restart_delay: 4000,
    // 错误日志文件
    error_file: "logs/error.log",
    // 输出日志文件
    out_file: "logs/out.log",
    // 时间格式
    time: true,
    // 合并日志
    merge_logs: true,
    // 日志日期格式
    log_date_format: "YYYY-MM-DD HH:mm:ss",
    // 添加日志轮转配置
    max_size: "10M",          // 当日志达到10MB时轮转
    retain: "30",             // 保留30个日志文件
    compress: true            // 压缩轮转后的日志
  }]
} 