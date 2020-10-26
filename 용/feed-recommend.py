import pandas as pd
import numpy as np
import pymysql
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.metrics import mean_squared_error
import json
import sys
import warnings
warnings.filterwarnings("ignore")
user="권용"

db=pymysql.connect(
    user='root',
    passwd='hoseo9620!',
    host='localhost',
    db='instagram',
    charset='utf8'
)

cursor=db.cursor(pymysql.cursors.DictCursor)
cursor2=db.cursor(pymysql.cursors.DictCursor)
cursor3=db.cursor(pymysql.cursors.DictCursor)
try:
    #like를 누른 Id조회
    sql="select user.id,post_likes.post_id from user left join post_likes on user.id=post_likes.likes_id;"
    cursor.execute(sql)
    result=cursor.fetchall()
    post_df=pd.DataFrame(result)
    # sql2="select post_id,count() as count from post group by id;"
    #각 게시물의 like수 조회
    sql2="select post_id,count(likes_id) as count from post_likes group by post_id;"
    cursor2.execute(sql2)
    result2=cursor2.fetchall()
    count_df=pd.DataFrame(result2)

    #해당 Id가 like를 누른 post검색
    sql3="select distinct(post.post_id) as post_id from post join following as f on post.id=f.following_id where f.id=%s or post.id=%s;"
    cursor3.execute(sql3,(user,user))
    result3=cursor3.fetchall()
    follow_post_id=pd.DataFrame(result3)
    # post_df=pd.merge(post_df,follow_df,on="id",how="outer")
    post_df=pd.merge(post_df,count_df,on="post_id",how="outer")

    post_df['check']=post_df['post_id'].notna().astype('int').replace(0,0.5)
    post_df['count']=post_df['count'].fillna(0)
    post_df['post_id']=post_df['post_id'].fillna(0)
    post_df['check']=post_df['check']*post_df['count']

    likes=post_df[['id','post_id','check']]
    likes_matrix=likes.pivot_table('check',index='id',columns='post_id')

    likes_matrix.drop(likes_matrix.columns[0],axis=1,inplace=True)
    likes_matrix=likes_matrix.fillna(0)
    likes_matrix_T=likes_matrix.transpose()
    likes_matrix_T.head()

    item_sim=cosine_similarity(likes_matrix_T,likes_matrix_T)
    item_sim_df=pd.DataFrame(data=item_sim,index=likes_matrix.columns,columns=likes_matrix.columns)

    item_sim_df.head(3)

    #예측 like -> 사용자가 좋아요한 게시글에 그와 유사한 게시글의 합
    def predict_likes(likes_arr,item_sim_arr):
        likes_pred=likes_arr.dot(item_sim_arr)/np.array([np.abs(item_sim_arr).sum(axis=1)])
        return likes_pred

    #결국 각각에 대한 점수들이 매겨짐 -> 유사도에 따른 예측 점수
    likes_pred=predict_likes(likes_matrix.values,item_sim_df.values)
    likes_pred_matrix=pd.DataFrame(data=likes_pred,index=likes_matrix.index,columns=likes_matrix.columns)

    #원본데이타의 점수와 예측 점수를 비교함
    #사용자가 조아요를 누른 게시글에 대해서만 예측성능평가 mse를 구함
    def get_mse(pred,actual):
        pred=pred[actual.nonzero()].flatten()#0은 빼고 계산
        actual=actual[actual.nonzero()].flatten()
        return mean_squared_error(pred,actual)

    #모든 데이터에 대해서 예측 점수 계산
    def predict_likes_sim(likes_arr,item_sim_arr):
        pred=np.zeros(likes_arr.shape)
        for col in range(likes_arr.shape[1]):
            #유사도가 큰 순으로 모든 데이터 행렬의 index변환
            top_item=[np.argsort(item_sim_arr[:,col])[::-1]]
            #개인화된 예측 점수 계산
            for row in range(likes_arr.shape[0]):
                pred[row,col]=item_sim_arr[col,:][top_item].dot(likes_arr[row,:][top_item].T)
                pred[row,col]/=np.sum(np.abs(item_sim_arr[col,:][top_item]))
        return pred

    likes_pred=predict_likes_sim(likes_matrix.values,item_sim_df.values)

    likes_pred_matrix=pd.DataFrame(data=likes_pred,index=likes_matrix.index,columns=likes_matrix.columns)

    user_like_id=likes_matrix.loc[user,:]
    user_like_id[user_like_id>0].sort_values(ascending=False)[:]

    #자신이 좋아요를 누른 것은 뺌
    def get_unlike_likes(likes_matrix,userId):
        user_like=likes_matrix.loc[userId,:]
        already_like=user_like[user_like>0].index.tolist()
        
        like_list=likes_matrix.columns.tolist()
        
        unlike_list=[like for like in like_list if like not in already_like]
        
        return unlike_list

    #좋아요를 누르지 않은 피드 중 예측률이 높은 순으로 정렬함
    def recomm_like_by_userid(pred_df,userId,unlike_list):
        recomm_like=pred_df.loc[userId,unlike_list].sort_values(ascending=False)[:]
        return recomm_like

    unlike_list=get_unlike_likes(likes_matrix,user)

    recomm_like=recomm_like_by_userid(likes_pred_matrix,user,unlike_list)

    r=pd.DataFrame(data=recomm_like.values,index=recomm_like.index,columns=['col'])
    try:
        follow_post_id_list=np.array(follow_post_id['post_id']).tolist()
    except KeyError:
        follow_post_id_list=[]

    recomm_like_list=np.array(recomm_like.index.values).astype('int').tolist()

    follow_post_id_list=set(follow_post_id_list)
    result=[x for x in recomm_like_list if x not in follow_post_id_list]
    if user in post_df[post_df['count']==0].id.values:
        p=post_df[post_df['post_id'].isin(result)]
        p=p.drop_duplicates(["post_id"])
        result=np.array(p.sort_values(by=['count'],ascending=False)['post_id']).astype('int').tolist()
        result=dict({user:result})
        print(result)
        # result=json.dumps(result)
        print(result)
    else :
        result=dict({user:result})
        print(result)
        # result=json.dumps(result)
        print(result)
except KeyError:
    result=dict({user:''})
    result=json.dumps(result)
    print(result)