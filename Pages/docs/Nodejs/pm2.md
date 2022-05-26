## 使用npm/cnpm全局安装：
```bash
$ npm install -g pm2
```
<!-- more -->
## 使用命令
```bash
$ pm2 start app.js  #启动app项目

$ pm2 list #列出由pm2管理的所有进程信息，还会显示一个进程会被启动多少次，因为没处理的异常。

$ pm2 monit #监视每个node进程的CPU和内存的使用情况

$ pm2 logs #显示所有进程日志

$ pm2 stop all #停止所有进程

$ pm2 restart all #重启所有进程

$ pm2 reload all #0秒停机重载进程 (用于 NETWORKED 进程)

$ pm2 stop 0 #停止指定的进程

$ pm2 restart 0 #重启指定的进程

$ pm2 startup #产生 init 脚本 保持进程活着

$ pm2 web #运行健壮的 computer API endpoint (http://localhost:9615)

$ pm2 delete 0 #杀死指定的进程

$ pm2 delete all #杀死全部进程
```

## 非node app方式启动的程序
创建一个js文件，在exec()中写入启动命令
```shell
//run
const { exec } = require('child_process')
exec('服务的启动命令',(error, stdout, stderr) => {
if(error){
console.log('exec error: ${error}')
return
}
console.log('stdout: ${stdout}');
console.log('stderr: ${stderr}');
})
```
之后就可以通过pm2来运行
```bash
$ pm2 start xxx.js
```


## 启动进程的方式详细
```bash
$ pm2 start app.js -i max #根据有效CPU数目启动最大进程数目

$ pm2 start app.js -i 3 #启动3个进程

$ pm2 start app.js -x #用fork模式启动 app.js 而不是使用 cluster

$ pm2 start app.js -x -- -a 23 #用fork模式启动 app.js 并且传递参数 (-a 23)

$ pm2 start app.js --name serverone #启动一个进程并把它命名为 serverone

$ pm2 stop serverone #停止 serverone 进程

$ pm2 start app.json #启动进程, 在 app.json里设置选项

$ pm2 start app.js -i max -- -a 23 #在--之后给 app.js 传递参数

$ pm2 start app.js -i max -e err.log -o out.log #启动 并 生成一个配置文件
```