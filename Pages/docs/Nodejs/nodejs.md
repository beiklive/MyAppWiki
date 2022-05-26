# 后台运行nodejs应用
> 创建一个启动程序run.js
```javascript
const { exec } = require('child_process')
exec('这里写程序启动的命令',(error, stdout, stderr) => {
if(error){
        console.log('exec error: ${error}')
        return
}
console.log('stdout: ${stdout}');
console.log('stderr: ${stderr}');
})
```
> 使用pm2管理器启动运行  `pm2 start run.js`