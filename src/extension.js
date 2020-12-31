function activate (content) {
    let identical = {"Git repository found": true, "DS_Store found": true, "JetBrains .idea project directory": true};

    let config = goby.getConfiguration();
    const fs = require('fs');
    const os = require('os');
    var cp = require('child_process');

    goby.registerCommand('ExpInfoVuln', function (content) {
        let vulurl = content.vulurl
        console.log(content)
        console.log(vulurl)
        let exp_path = ""
        let open_dir = ""
        var index = 0
        if (content.name == 'Git repository found') {
            exp_path = config["GitHack"]["default"];
            // http://127.0.0.1/.git/config ---> http://127.0.0.1/.git/
            index = vulurl.lastIndexOf("\/");
            vulurl = vulurl.substring(0,index+1);
        } else if (content.name == 'DS_Store found') {
            exp_path = config["ds_store_exp"]["default"]
        } else if (content.name == 'JetBrains .idea project directory') {
            exp_path = config["idea_exploit"]["default"]
        }

        // 运行完打开工具目录，方便查看结果
        if (os.type() == 'Windows_NT') {
            index = exp_path.lastIndexOf("\\");
        } else {
            index = exp_path.lastIndexOf("\/");
        }

        if (! exp_path) return goby.showWarningMessage(`Please Configure the ${content.name} path`);

        console.log(index)
        open_dir = exp_path.substring(0,index+1);
        console.log(exp_path)
        console.log(open_dir)


        var cmd = 'cd ' + open_dir + ' && ' + config["Python2"]["default"] + ' ' + exp_path + ' ' + vulurl;
        console.log(os.type())
        if (os.type() == 'Windows_NT') {
            //windows
            cmd += ' && explorer ' + open_dir;
            cp.exec(cmd);

        } else if (os.type() == 'Darwin') {
            //mac
            cmd += ' && open ' + open_dir
            cp.exec(`osascript -e 'tell application "Terminal" to do script "${cmd}"'`)
        } else if (os.type() == 'Linux') {
            //Linux
            cp.exec(`bash -c "${cmd}"`)
        }
        // cp.exec(cmd);
        console.log(cmd);

    }); 

    // 控制组件是否显示的回调命令
    goby.registerCommand('ExpInfoVuln_visi', function (content) {
    // content.name 漏洞名
    if (identical[content.name]) return true;
    return false;
    });
}

exports.activate = activate;
