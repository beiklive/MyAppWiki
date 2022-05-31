# C++ 笔记
# makefile项目模板地址
> [https://github.com/beiklive/Linux_CPP_Template](https://github.com/beiklive/Linux_CPP_Template)

# Linux安装高版本gcc,g++
## 添加相应的源
```bash
sudo add-apt-repository ppa:ubuntu-toolchain-r/test
```
## 更新软件源
```bash
sudo apt-get update
```
## 安装
```bash
sudo apt-get install gcc-11 g++-11
```

# TCP
> Server
```c
// 1.创建一个socket(服务端)
    int socket_fd = socket(AF_INET, SOCK_STREAM, 0);
    if (socket_fd == -1)
    {
        spdlog::error("socket create failed");
        exit(1);
    }
    // 2.建立套接子地址
    // 绑定IP和端口号port
    struct sockaddr_in addr;
    addr.sin_family = AF_INET;
    addr.sin_port = htons(port);// 将一个无符号短整型的主机数值转换为网络字节顺序，即大尾顺序(big-endian)
    addr.sin_addr.s_addr = inet_addr("127.0.0.1");// inet_addr方法可以转化字符串，主要用来将一个十进制的数转化为二进制的数，用途多于ipv4的IP转化。

    // 3.bind()绑定
    int res = bind(socket_fd,(struct sockaddr*)&addr,sizeof(addr));
    if (res == -1)
    {
        spdlog::error("bind failed");
        exit(-1);
    }
    spdlog::info("waiting for connection ...");
    // 4.监听客户端listen()函数
    // 参数二：进程上限，一般小于30
    listen(socket_fd, 30);
    // 5.等待客户端的连接accept()，返回用于交互的socket描述符
    struct sockaddr_in client;
    socklen_t len = sizeof(client);
    int fd = accept(socket_fd,(struct sockaddr*)&client,&len);
    if (fd == -1)
    {
        spdlog::error("accept failed");
        exit(-1);
    }
    // 6.使用第5步返回socket描述符，进行读写通信。
    char *ip = inet_ntoa(client.sin_addr);
    spdlog::info("client [{}] connect success!", ip);

    json j;
    j["msg"] = "welcome, this is server!";
    // char *msg = nullptr;
    char buffer[255]={};
    while(1){
        std::string s = j.dump();
        write(fd, s.c_str(), s.size());
        spdlog::info("[send] {}", j["msg"]);
        memset(buffer, 0, 255);
        int size = read(fd, buffer, sizeof(buffer));//通过fd与客户端联系在一起,返回接收到的字节数
        j = json::parse(buffer);
        spdlog::info("[recive] {}", j["msg"]);
        char say[255]={};
        std::cin >> say;
        j["msg"] = say;
    }



    // 7.关闭sockfd
    close(fd);
    close(socket_fd);
    return ;
```
> Client
```c
void bTcp::startup(int port, std::string ip){
    int socket_fd = socket(AF_INET, SOCK_STREAM, 0);
    if (socket_fd == -1)
    {
        spdlog::error("socket create failed");
        exit(1);
    }

    struct sockaddr_in addr;
    addr.sin_family = AF_INET;
    addr.sin_port = htons(port);
    addr.sin_addr.s_addr = inet_addr(ip.c_str());

    spdlog::info("start to connect ...");
    if (connect(socket_fd, (struct sockaddr *)&addr, sizeof(addr)) == -1)
    {
        spdlog::error("connect failed");
        exit(1);
    }
    spdlog::info("connect success");

    auto fd = socket_fd;

    json j;
    j["msg"] = "welcome, this is client!";
    // char *msg = nullptr;
    char buffer[255]={};
    int size = read(fd, buffer, sizeof(buffer));//通过fd与客户端联系在一起,返回接收到的字节数
    j = json::parse(buffer);
    spdlog::info("[recive] {}", j["msg"]);

    while(1){
        std::string s = j.dump();
        write(fd, s.c_str(), s.size());
        spdlog::info("[send] {}", j["msg"]);
        memset(buffer, 0, 255);
        size = read(fd, buffer, sizeof(buffer));//通过fd与客户端联系在一起,返回接收到的字节数
        j = json::parse(buffer);
        spdlog::info("[recive] {}", j["msg"]);
        char say[255]={};
        std::cin >> say;
        j["msg"] = say;
    }



    // 7.关闭sockfd
    close(fd);
    close(socket_fd);
    return ;
}
```

