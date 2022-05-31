# IO多路复用（select poll  epoll）

# select
fd_set 使用数组实现  
1. fd_size 有限制 1024 bitmap
    fd[i] = accept()
2. fdset不可重用，新的fd进来，重新创建
3. 用户态和内核态拷贝产生开销
4. O(n)时间复杂度的轮询
成功调用返回结果大于 0，出错返回结果为 -1，超时返回结果为 0
5. 具有超时时间

# poll
基于结构体存储fd
```c
struct pollfd{
    int fd;
    short events;
    short revents; //可重用
}
```
解决了select的1,2两点缺点

# epoll

[知乎](https://zhuanlan.zhihu.com/p/460786724)

## 特点
解决select的1，2，3，4
不需要轮询，时间复杂度为O(1)


## 两种触发模式：
* LT:水平触发
    > 当 epoll_wait() 检测到描述符事件到达时，将此事件通知进程，进程可以不立即处理该事件，下次调用 epoll_wait() 会再次通知进程。是默认的一种模式，并且同时支持 Blocking 和 No-Blocking。
* ET:边缘触发
    > 和 LT 模式不同的是，通知之后进程必须立即处理事件。
    下次再调用 epoll_wait() 时不会再得到事件到达的通知。很大程度上减少了 epoll 事件被重复触发的次数，
    因此效率要比 LT 模式高。只支持 No-Blocking，以避免由于一个文件句柄的阻塞读/阻塞写操作把处理多个文件描述符的任务饿死。

## 四个函数
* `epoll_create();`
* `epoll_ctl();`
* `epoll_wait();`
* `epoll_event_callback();`

### int epoll_create(int size)
* 功能：创建一个epoll对象，返回该对象的描述符【文件描述符】，这个描述符就代表这个epoll对象，后续会用到。
* 这个epoll对象最终要用close()，因为文件描述符/句柄 总是关闭的。
* size > 0;。

#### 原理
```c
struct eventpoll *ep = (struct eventpoll*)calloc(1, sizeof(struct eventpoll)); 
```
eventpoll结构体
```c
//调用epoll_create()的时候我们会创建这个结构的对象
struct eventpoll {
	ep_rb_tree rbr;      //ep_rb_tree是个结构，所以rbr是结构变量，这里代表红黑树的根；
	int rbcnt;
	
	LIST_HEAD( ,epitem) rdlist;    //rdlist是结构变量，这里代表双向链表的根；
	/*	这个LIST_HEAD等价于下边这个 
		struct {
			struct epitem *lh_first;
		}rdlist;
	*/
	int rdnum; //双向链表里边的节点数量（也就是有多少个TCP连接来事件了）
 
	int waiting;
 
	pthread_mutex_t mtx; //rbtree update
	pthread_spinlock_t lock; //rdlist update
	
	pthread_cond_t cond; //block for event
	pthread_mutex_t cdmtx; //mutex for cond	
};
```

### epoll_ctl()
```c
int epoll_ctl(int efpd,int op,int sockid,struct epoll_event *event);
```

功能：把一个socket以及这个socket相关的事件添加到这个epoll对象描述符中去，目的就是通过这个epoll对象来监视这个socket【客户端的TCP连接】上数据的来往情况；当有数据来往时，系统会通知我们 。

**efpd**：epoll_create()返回的epoll对象描述符

**op**：动作，添加/删除/修改 ，对应数字是1,2,3， EPOLL_CTL_ADD, EPOLL_CTL_DEL ,EPOLL_CTL_MOD

* **EPOLL_CTL_ADD** 添加事件：等于你往红黑树上添加一个节点，每个客户端连入服务器后，服务器都会产生 一个对应的socket，每个连接这个socket值都不重复所以，这个socket就是红黑树中的key，把这个节点添加到红黑树上去
* **EPOLL_CTL_MOD**：修改事件你 用了EPOLL_CTL_ADD把节点添加到红黑树上之后，才存在修改
* **EPOLL_CTL_DEL**：是从红黑树上把这个节点干掉这会导致这个socket【这个tcp链接】上无法收到任何系统通知事件
  
**sockid**：表示客户端连接，就是你从accept()这个是红黑树里边的key;

**event**：事件信息，这里包括的是 一些事件信息EPOLL_CTL_ADD和EPOLL_CTL_MOD都要用到这个event参数里边的事件信息


### epoll_wait()
```c
int epoll_wait(int epfd,struct epoll_event *events,int maxevents,int timeout);
```
**功能**：阻塞一小段时间并等待事件发生，返回事件集合，也就是获取内核的事件通知
说白了就是遍历这个双向链表，把这个双向链表里边的节点数据拷贝出去，拷贝完毕的就从双向链表里移除。

因为双向链表里记录的是所有有数据/有事件的socket【TCP连接】。

参数timeout：阻塞等待的时长

参数events：是内存，也是数组，长度 是maxevents，表示此次epoll_wait调用可以搜集到的maxevents个已经就绪【已经准备好的】的读写事件。

就是返回的是 实际 发生事件的tcp连接数目。

参数timeout：阻塞等待的时长

epitem结构设计的高明之处：既能够作为红黑树中的节点，又能够作为双向链表中的节点。

**内核向双向链表增加节点**

一般有四种情况，会使操作系统把节点插入到双向链表中

a)客户端完成三次握手服务器要accept();
b)当客户端关闭连接，服务器也要调用close()关闭
c)客户端发送数据来的服务器要调用read(),recv()函数来收数据
d)当可以发送数据时服务武器可以调用send(),write()
e)其他情况...