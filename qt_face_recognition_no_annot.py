#!/usr/bin/env python
from __future__ import print_function

# import sys
import rospy
import cv2
import threading
import numpy as np
import time

import pandas as pd
from sensor_msgs.msg import Image
from cv_bridge import CvBridge, CvBridgeError
from qt_nuitrack_app.msg import Faces, FaceInfo


class image_converter:
    faces = None
    faces_time = None
    gaze_vectors = []
    min_sample_size = 50
    start_time = time.time()
    fourcc = cv2.VideoWriter_fourcc('X','V','I','D')
    out = cv2.VideoWriter('output.mp4', fourcc, 30, (640, 480))
    emotion={'neutral':0, 'angry':0, 'happy':0, 'surprise':0,"time":0}
    data_emotion=[]
    def __init__(self):
        self.lock = threading.Lock()
        self.bridge = CvBridge()
        self.image_pub = rospy.Publisher("/face_recognition/out", Image, queue_size=1)
        self.image_sub = rospy.Subscriber("/camera/color/image_raw",Image,self.image_callback)
        self.face_sub = rospy.Subscriber("/qt_nuitrack_app/faces", Faces, self.face_callback)

    def face_callback(self, data):
        
        self.lock.acquire()
        self.faces = data.faces
        self.faces_time = rospy.Time.now()
        self.lock.release()
        

        # if self.faces:
        #     print("recieved data")
        # else:
        #     print("no face data recieved")

    def image_callback(self,data):
        try:
            cv_image = self.bridge.imgmsg_to_cv2(data, "bgr8")
        except CvBridgeError as e:
            print(e)
        # rospy.loginfo("image_callback")
        (rows, cols, channels) = cv_image.shape
        self.lock.acquire()
        new_faces = self.faces
        new_faces_time = self.faces_time
        self.lock.release()

        if new_faces:
            for face in new_faces:
                rect = face.rectangle
                # print(face.angles)
                self.emotion["neutral"]=face.emotion_neutral
                self.emotion["angry"]=face.emotion_angry
                self.emotion["happy"]=face.emotion_happy
                self.emotion["surprise"]=face.emotion_surprise
                self.emotion["time"]=time.time()
                self.data_emotion.append(self.emotion)
                # if (time.time() - self.start_time > 5):
                #     print("startd recording gaze")
                #     mid_x = (face.left_eye[0] + face.right_eye[0]) / 2.0
                #     mid_y = (face.left_eye[1] + face.right_eye[1]) / 2.0
                #     target_x = 0.5  # x-coordinate of the target point
                #     target_y = 0.5  # y-coordinate of the target point
                #     gaze_vector_x = target_x - mid_x
                #     gaze_vector_y = target_y - mid_y
                #     self.gaze_vectors.append((gaze_vector_x, gaze_vector_y))
                #     # print(f"gaze_x: {gaze_vector_x}")
                    # print(f"gaze_y: {gaze_vector_y}")
                # cv2.rectangle(cv_image, (int(rect[0]*cols),int(rect[1]*rows)),
                #                       (int(rect[0]*cols+rect[2]*cols), int(rect[1]*rows+rect[3]*rows)), (0,255,0), 2)
                x = int(rect[0]*cols)
                y = int(rect[1]*rows)
                w = int(rect[2]*cols)
                h = int(rect[3]*rows)
                # # # #cv2.putText(cv_image, "Gender:", (x, y+h+10), cv2.FONT_HERSHEY_SIMPLEX, 1, (0,255,255), lineType=cv2.LINE_AA)
                # cv2.putText(cv_image, "Gender: %s" % face.gender, (x, y+h+20), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0,255,0), 1, lineType=cv2.LINE_AA)
                # cv2.putText(cv_image, "Age: %d" % face.age_years, (x, y+h+40), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0,255,0), 1, lineType=cv2.LINE_AA)

                # # Neutral
                # cv2.putText(cv_image, "Neutral:", (x, y+h+60), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0,255,0), 1, lineType=cv2.LINE_AA)
                # cv2.rectangle(cv_image, (x+80,y+h+50),
                #                       (x+80+int(face.emotion_neutral*100), y+h+10+50), (0,255,0), cv2.FILLED)
                # cv2.rectangle(cv_image, (x+80,y+h+50),
                #                       (x+80+100, y+h+10+50), (255,255,255), 1)
                # # Angry
                # cv2.putText(cv_image, "Angry:", (x, y+h+80), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0,255,0), 1, lineType=cv2.LINE_AA)
                # cv2.rectangle(cv_image, (x+80,y+h+70),
                #                       (x+80+int(face.emotion_angry*100), y+h+10+70), (0,255,0), cv2.FILLED)
                # cv2.rectangle(cv_image, (x+80,y+h+70),
                #                       (x+80+100, y+h+10+70), (255,255,255), 1)

                # # Happy
                # cv2.putText(cv_image, "Happy:", (x, y+h+100), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0,255,0), 1, lineType=cv2.LINE_AA)
                # cv2.rectangle(cv_image, (x+80,y+h+90),
                #                       (x+80+int(face.emotion_happy*100), y+h+10+90), (0,255,0), cv2.FILLED)
                # cv2.rectangle(cv_image, (x+80,y+h+90),
                #                       (x+80+100, y+h+10+90), (255,255,255), 1)

                # cv2.putText(cv_image, "Surprise:", (x, y+h+120), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0,255,0), 1, lineType=cv2.LINE_AA)
                # cv2.rectangle(cv_image, (x+80,y+h+110),
                #                       (x+80+int(face.emotion_surprise*100), y+h+10+110), (0,255,0), cv2.FILLED)
                # cv2.rectangle(cv_image, (x+80,y+h+110),
                #                       (x+80+100, y+h+10+110), (255,255,255), 1)
                # cv2.putText(cv_image, f"Eye: ({face.left_eye[0]}, {face.left_eye[1]}, {face.right_eye[0]}, {face.right_eye[1]})", (x, y+h+140), cv2.FONT_HERSHEY_SIMPLEX, 0.4, (0,255,0), 1, lineType=cv2.LINE_AA)
        # if len(self.gaze_vectors) >= self.min_sample_size:
        #     print("calculating...")
        #     # Convert the list of gaze direction vectors to a NumPy array
        #     gaze_vectors_array = np.array(self.gaze_vectors)

        #     # Calculate the mean of the gaze direction vectors
        #     gaze_mean = np.mean(gaze_vectors_array, axis=0)

        #     # Calculate the standard deviation of the gaze direction vectors
        #     gaze_std = np.std(gaze_vectors_array, axis=0)

        #     # Print or use the computed statistics as needed
        #     print("Mean Gaze Direction:", gaze_mean)
        #     print("Standard Deviation of Gaze Direction:", gaze_std)
        try:
            cv2.imshow('frame', cv_image)
            self.image_pub.publish(self.bridge.cv2_to_imgmsg(cv_image, "bgr8"))
            self.out.write(cv_image)
            pd.DataFrame(self.data_emotion).to_csv('emotion.csv')
            cv2.waitKey(1) 
        except CvBridgeError as e:
            print(e)


if __name__ == '__main__':
    rospy.init_node('qt_face_recognition', anonymous=True)
    rospy.loginfo("Node Started")
    ic = image_converter()
    try:
        rospy.spin()
    except KeyboardInterrupt:
        print("Shutting down")
