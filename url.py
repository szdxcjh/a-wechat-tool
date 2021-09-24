import json
import flask
import requests
import urllib.request
import os
import base64
import numpy as np
import u2net_portrait_test
server = flask.Flask(__name__)
@server.route('/getUrl',methods=['get'])
def getUrl():
    a = flask.request.values.get('url')
    image_url = a
    file_path = './test_data/test_portrait_images/your_portrait_im/1.jpg'
    r = requests.get(image_url)
    with open(file_path, 'wb') as f:
        f.write(r.content)
    u2net_portrait_test.main_()
    savepath='./test_data/test_portrait_images/your_portrait_results'
    for item in os.listdir(savepath):
        temp = os.path.join(savepath,item)
        f = open(temp,mode='rb')
        encoded_string = base64.b64encode(f.read())
        encoded_string_ = str(encoded_string, encoding='utf-8')
        print(encoded_string)
        print(encoded_string_)
    path_ = './test_data/test_portrait_images/your_portrait_im'
    for item in os.listdir(path_):
        temp = os.path.join(path_,item)
        os.remove(temp)
    for item in os.listdir(savepath):
        temp = os.path.join(savepath,item)
        os.remove(temp)
    Cjson = {"res":encoded_string_}
    return json.dumps(Cjson)
server.run(host='172.31.102.77',port=8998,debug=True)
import logging
logging.captureWarnings(True)
# def downloadimg():
#     image_url = 'https://6d69-miniprogram-1-8gowy4m6f5c15b1c-1305602141.tcb.qcloud.la/olFzo5F3hql_kRg5nZ0e6bcAv4mI16190741406491.jpg'
#     file_path = 'G://windows//U-2-Net-master//U-2-Net-master//test_data//test_portrait_images//your_portrait_im//1.jpg'
#     r = requests.get(image_url)
#     with open(file_path, 'wb') as f:
#         f.write(r.content)
# if __name__ == '__main__':
#     downloadimg()
