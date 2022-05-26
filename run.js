const { exec } = require('child_process')
exec('docsify serve Pages --port=4001',(error, stdout, stderr) => {
if(error){
        console.log('exec error: ${error}')
        return
}
console.log('stdout: ${stdout}');
console.log('stderr: ${stderr}');
})
