import sys
from konlpy.tag import Okt
import pickle #tokenizer 저장하기 위해 
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.sequence import pad_sequences

stopwords = ['의','가','이','은','들','는','좀','잘','걍','과','도','를','으로','자','에','와','한','하다']
okt = Okt()

# 저장된 tokenizer load
with open('tokenizer.pickle', 'rb') as handle:
    tokenizer = pickle.load(handle)
    
max_len=19 # 입력 일기 최대 길이: 모델에서 정의

CLASS_NUM=12 # 상황 카테고리 개수 

# 저장된 모델 load 
loaded_model = load_model('best_model.h5') # 가장 훈련 잘된 모델


loaded_model = load_model('best_model.h5') # 가장 훈련 잘된 모델
def sentiment_predict(new_sentence):
  new_sentence = okt.morphs(new_sentence, stem=True) # 토큰화
  new_sentence = [word for word in new_sentence if not word in stopwords] # 불용어 제거
  encoded = tokenizer.texts_to_sequences([new_sentence]) # 정수 인코딩
  pad_new = pad_sequences(encoded, maxlen = max_len) # 패딩
  result = loaded_model.predict(pad_new)[0] # 예측

  max=result[0]
  index=0
  for i in range(0,CLASS_NUM):
    if result[i] > max:
      max=result[i]
      index=i
  print(index)

loaded_model = load_model('best_model.h5') # 가장 훈련 잘된 모델
sentiment_predict(sys.argv[1])
