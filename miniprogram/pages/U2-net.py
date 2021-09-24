import cv2
import numpy as np
import paddlehub as hub


def preprocess(imgs, face_detection=True, scale=1):
    if face_detection:
        face_detector = hub.Module(name="pyramidbox_lite_mobile")
        results = face_detector.face_detection(images=imgs,
                                               use_gpu=False,
                                               visualization=False,
                                               confs_threshold=0.5)
        im_faces = []
        for datas, img in zip(results, imgs):
            for face in datas['data']:
                l, r, t, b = [face['left'], face['right'], face['top'], face['bottom']]

                pad = max(int(scale * (r - l)), int(scale * (b - t)))
                c_w, c_h = (r - l) // 2 + l, (b - t) // 2 + t
                top = 0 if c_h - pad < 0 else c_h - pad
                bottom = pad + c_h
                left = 0 if c_w - pad < 0 else c_w - pad
                right = pad + c_w
                crop = img[top:bottom, left:right]

                im_face = cv2.resize(crop, (512, 512), interpolation=cv2.INTER_AREA)
                im_faces.append(im_face)
    else:
        im_faces = []
        for img in imgs:
            h, w = img.shape[:2]
            if h > w:
                if (h - w) % 2 == 0:
                    img = np.pad(img, ((0, 0), ((h - w) // 2, (h - w) // 2), (0, 0)), mode='constant',
                                 constant_values=((255, 255), (255, 255), (255, 255)))
                else:
                    img = np.pad(img, ((0, 0), ((h - w) // 2, (h - w) // 2 + 1), (0, 0)), mode='constant',
                                 constant_values=((255, 255), (255, 255), (255, 255)))
            else:
                if (w - h) % 2 == 0:
                    img = np.pad(img, (((w - h) // 2, (w - h) // 2), (0, 0), (0, 0)), mode='constant',
                                 constant_values=((255, 255), (255, 255), (255, 255)))
                else:
                    img = np.pad(img, (((w - h) // 2, (w - h) // 2 + 1), (0, 0), (0, 0)), mode='constant',
                                 constant_values=((255, 255), (255, 255), (255, 255)))
            im_face = cv2.resize(img, (512, 512), interpolation=cv2.INTER_AREA)
            im_faces.append(im_face)

    input_datas = []
    for im_face in im_faces:
        tmpImg = np.zeros((im_face.shape[0], im_face.shape[1], 3))
        im_face = im_face / np.max(im_face)

        tmpImg[:, :, 0] = (im_face[:, :, 2] - 0.406) / 0.225
        tmpImg[:, :, 1] = (im_face[:, :, 1] - 0.456) / 0.224
        tmpImg[:, :, 2] = (im_face[:, :, 0] - 0.485) / 0.229

        # convert BGR to RGB
        tmpImg = tmpImg.transpose((2, 0, 1))
        tmpImg = tmpImg[np.newaxis, :, :, :]
        input_datas.append(tmpImg)

    return input_datas

import paddle
from u2net import U2NET
def load_model(model_name, pretrain_model):
    model_name = eval(model_name)
    model = model_name(3,1)
    state_dict = paddle.load(pretrain_model)
    model.set_dict(state_dict)
    model.eval()
    return model


import os


def normPRED(d):
    ma = paddle.max(d)
    mi = paddle.min(d)

    dn = (d - mi) / (ma - mi)

    return dn


def inference(model, input_datas, visualization=False, output_dir='output'):
    results = []
    if visualization and not os.path.exists(output_dir):
        os.mkdir(output_dir)

    for i, data in enumerate(input_datas):
        data = paddle.to_tensor(data, 'float32')

        # inference
        d1, d2, d3, d4, d5, d6, d7 = model(data)
        # normalization
        pred = 1.0 - d1[:, 0, :, :]

        pred = normPRED(pred)

        # convert torch tensor to numpy array
        pred = pred.squeeze()
        pred = pred.numpy()
        pred = (pred * 255).astype(np.uint8)
        results.append(pred)
        if visualization:
            cv2.imwrite(os.path.join(output_dir, 'result_%d.png' % i), pred)
    return results


# 读取数据
imgs = [cv2.imread('test.jpg')]

# 数据预处理
# face_detection：是否开启人脸检测识别，开启会检测人脸，并由中心点进行缩放
# scale：缩放比例 > 0.5
input_datas = preprocess(imgs, face_detection=False, scale=1)

# 加载模型
model = load_model('U2NET', '/home/aistudio/data/data64051/u2net_portrait.pdparams')

# 模型预测
results = inference(model, input_datas, visualization=True, output_dir='output')