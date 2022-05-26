# 中文编码支持
```bash
# -*- coding: utf-8 -*-  
```
# PIP相关
## 换源
### 常用的国内镜像包括：
>（1）阿里云 http://mirrors.aliyun.com/pypi/simple/

>（2）豆瓣http://pypi.douban.com/simple/ 

>（3）清华大学 https://pypi.tuna.tsinghua.edu.cn/simple/

>（4）中国科学技术大学 http://pypi.mirrors.ustc.edu.cn/simple/

>（5）华中科技大学http://pypi.hustunique.com/

### 临时换源
```bash
pip install -i https://pypi.tuna.tsinghua.edu.cn/simple pandas
```
### 永久换源
```
（a）Linux下，修改 ~/.pip/pip.conf (没有就创建一个文件夹及文件。文件夹要加“.”，表示是隐藏文件夹)
[global]
index-url = https://pypi.tuna.tsinghua.edu.cn/simple
[install]
trusted-host = https://pypi.tuna.tsinghua.edu.cn

(b) windows下，直接在user目录中创建一个pip目录，如：C:\Users\xx\pip，然后新建文件pip.ini，即 %HOMEPATH%\pip\pip.ini，在pip.ini文件中输入以下内容：
[global]
index-url = https://pypi.tuna.tsinghua.edu.cn/simple
[install]
trusted-host = https://pypi.tuna.tsinghua.edu.cn
```
# selenium使用
## 安装：
```bash
pip install selenium
```
## 相关代码
```python
from selenium import webdriver
from selenium.webdriver.common.by import By

# chrome_driver=r"C:\Python310\Lib\site-packages\selenium\webdriver\chrome\chromedriver.exe"
# driver=webdriver.Chrome(executable_path=chrome_driver)
driver=webdriver.Chrome()
driver.get(url)   #获取当前url   driver.current_url
# 查找元素
userName_tag = driver.find_element(By.ID, 'tbLoginName')
res = driver.find_element(By.XPATH, "//li[text()='导出为']")
# 输入内容
userName_tag.send_keys('100019050')
# 点击
res.click()
```
## 判断元素存在
```python
from selenium.common.exceptions import NoSuchElementException
# 元素是否存在 is_element_present(driver, By.XPATH, "//div[text()='回收站']")
def is_element_present(driver, type, value):
    try:
        id = driver.find_element(type, value)
    except NoSuchElementException as e:
        return False
    return True
```
## 双击动作
```python
from  selenium.webdriver.common.action_chains import ActionChains
ActionChains(driver).double_click(driver.find_element_by_name(“name”)).perform()
```
## 指定缓存目录，保留登陆状态
```python
# 目录路径在：chrome://version/   个人资料路径
option = webdriver.ChromeOptions()
option.add_argument('--user-data-dir=/home/dongjie/.config/google-chrome')
driver = webdriver.Chrome(options = option)
```
# log日志
```python
import logging

logging.debug("This is a debug log.")
logging.info("This is a info log.")
logging.warning("This is a warning log.")
logging.error("This is a error log.")
logging.critical("This is a critical log.")
```
## 日志级别
```python
logging.basicConfig(level=logging.DEBUG)  #默认只显示warning及以上
```
## 日志格式
```python
LOG_FORMAT = "%(asctime)s - %(levelname)s - %(message)s"
logging.basicConfig(format=LOG_FORMAT)
#2017-05-08 14:29:53,783 - DEBUG - This is a debug log.
#2017-05-08 14:29:53,784 - INFO - This is a info log.
#2017-05-08 14:29:53,784 - WARNING - This is a warning log.
#2017-05-08 14:29:53,784 - ERROR - This is a error log.
#2017-05-08 14:29:53,784 - CRITICAL - This is a critical log.
```
## 日期格式
```python
DATE_FORMAT = "%m/%d/%Y %H:%M:%S %p"
logging.basicConfig(datefmt=DATE_FORMAT)
```
## 输出到文件
```python
logging.basicConfig(filename='my.log')
```
# tornado
## 命令行参数
```python
from tornado.options import define, options

define("port", default=8011, help="运行端口", type=int)
define("uarg", default='/gitlab-push', help="网页路由", type=str)
define("script", default='./gitlab-hook.sh', help="hook脚本", type=str)
define("isExecute", default='true', help="控制是否执行脚本", type=str)

print(options.port)
```
## 使用
```bash
python app.py --port=3000 --script="myscript.sh" --uarg="/post" --isExecute="false"
```