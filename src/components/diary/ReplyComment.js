import React, {useRef, useState} from "react";
import styled from "styled-components";
import { replyIcon, listenIcon } from "../../static/images/resources";
import {convertDate, stringToSeconds, timeFormatter2} from "../../utils/convertDate";
import PropTypes from "prop-types";
import { MyTimer } from "./Timer";



const ReplyComment = (props) => {

    const { replyComments } = props;

    const [expireTime, setExpireTime] = useState();
    const audioRef = useRef();

    const { seconds, minutes, isRunning, start, restart, pause, resume } = MyTimer(expireTime);

    const audioPlay = (timer) => {

        if(audioRef.current){
            if(audioRef.current.paused){
                audioRef.current.play();
                restart(timer);
            } else {
                audioRef.current.currentTime = 0;
                audioRef.current.pause();
                pause();
            }
        }
    };


    return (
        <ReplyCommentList>
            {
                replyComments.map((comment, idx) => {
                    return (
                        <OneReplyComment key={idx}>
                            <NickNameArea>
                                <NickNameAreaLeft>
                                    <ReplyImg src={replyIcon}/>
                                    <Nickname>
                                        {comment.nickname}의 답글
                                    </Nickname>
                                </NickNameAreaLeft>
                                <CreatedTime>
                                    {convertDate(comment.createdAt)}
                                </CreatedTime>
                            </NickNameArea>

                            <Content>
                                {comment.content}
                            </Content>
                            <IconArea>
                                {
                                    comment.voiceUrl.length &&
                                        <VoiceArea
                                            onClick={(e)=>{
                                            e.preventDefault();
                                            const now = new Date();
                                            let addedNow = now.setSeconds(now.getSeconds() + stringToSeconds(comment.timer));
                                            setExpireTime(new Date(addedNow));
                                            audioPlay(new Date(addedNow));
                                            }}>
                                            <VoiceIcon src={listenIcon}/>
                                            <ListenText>음성 듣기</ListenText>
                                            <Timer>
                                                {
                                                    isRunning ? timeFormatter2(minutes) + ":" + timeFormatter2(seconds)
                                                        : comment.timer
                                                }
                                            </Timer>
                                            <audio ref={audioRef} src={comment.voiceUrl}/>
                                        </VoiceArea>

                                }

                                <OptionIconArea>
                                    <ChattingIcon>
                                        채팅
                                    </ChattingIcon>
                                    <DeleteIcon>
                                        삭제
                                    </DeleteIcon>
                                </OptionIconArea>
                            </IconArea>
                        </OneReplyComment>
                        );

                })

            }
        </ReplyCommentList>
    );
};

export default ReplyComment;

ReplyComment.propTypes = {
    replyComments: PropTypes.array,
};


const ReplyCommentList = styled.div`
  width: 876px;
  height: 100%;
`;
const OneReplyComment = styled.div`
  background-color: rgba(149, 158, 190, 0.8);
  margin-top: 9px;
  border-radius: 5px;
  padding: 15px 44px;
  box-sizing: border-box;
`;

const NickNameArea = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const NickNameAreaLeft = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ReplyImg = styled.img``;
const Nickname = styled.div`
  font-size: 14px;
  line-height: 18px;
  color: #08105D;
`;
const CreatedTime = styled.div`
  font-size: 10px;
  line-height: 13px;
  color: #354569;
`;
const Content = styled.div`
  margin: 7px 0 8px;
  font-size: 10px;
  line-height: 13px;
  color: #08105D;
`;
const IconArea = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const VoiceArea = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const VoiceIcon = styled.img`
  width: 18px;
  height: 18px;
  cursor: pointer;
`;

const ListenText = styled.div`
  font-size: 8px;
  color: #08105D;
  margin-left: 6px;
`;

const Timer = styled.div`
  font-size: 8px;
  color: #08105D;
  margin-left: 4px;
`;

const OptionIconArea = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;
const ChattingIcon = styled.div`
  font-size: 10px;
  line-height: 13px;
  color: #36466B;
  cursor: pointer;
  
`;
const DeleteIcon = styled(ChattingIcon)`
  margin-left: 10px;
`;



