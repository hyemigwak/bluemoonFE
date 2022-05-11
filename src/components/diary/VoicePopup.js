import React from "react";
import styled from "styled-components";
import microphone from "../../static/images/diary/microphone.svg";
import onRecIcon from "../../static/images/diary/onRecording.svg";
import closeBtn from "../../static/images/diary/closePopup.svg";
import pauseIcon from "../../static/images/diary/voicePause.svg";
import stopIcon from "../../static/images/diary/voiceStop.svg";
import playIcon from "../../static/images/diary/voicePlay.svg";
import OnRecIconInActive from "../../static/images/diary/onRecording_inactive.svg";
import PlayInActive from "../../static/images/diary/voicePlay_inactive.svg";
import BigPlay from "../../static/images/diary/big_play.svg";
import smallPause from "../../static/images/diary/small_pause.svg";

const VoicePopup = (props) => {

    const { closePopup, play, onRec, recordVoice, stopRecord,
        finishRecord, isPlaying, isPaused, replay, pause } = props;


    // 녹음이 시작되면 OnRec은 false
    // 시작 전 (onRec = true && finishRecord false)
    // 녹음 중 (onRec = false)
    // 녹음 완료 (onRec true && finishRecord true)
    // 재생 중 ( play state를 따로 만들어야 함)

    return (
        <VoiceContainer>
            <CloseButton src={closeBtn} onClick={closePopup}/>
            <RecordStatus>
                {
                    (!finishRecord && onRec) && <div>녹음하기</div>
                }
                {
                    (!onRec && !isPaused) && <div>녹음중</div>
                }
                {
                    ( isPaused && !onRec) && <div>일시 정지</div>
                }
                {
                    (finishRecord && !isPlaying) && <div>음성 녹음 완료</div>
                }
                {
                    isPlaying && <div>재생 중</div>
                }
            </RecordStatus>
            <RecordImg>
                <img src={microphone} alt={"voiceIcon"}/>
            </RecordImg>
            <RecordTime>
                00 : 00
            </RecordTime>
            <IconArea>

                {/*처음 화면*/}
                {
                    (!finishRecord && onRec) &&
                    <OnRecording onClick={recordVoice}>
                        <img src={onRecIcon} alt={"onRecIcon"}/>
                    </OnRecording>
                }

                {/*녹음중 & 일시정지*/}
                {
                    !onRec &&
                        <RecIcons>
                            <PlayingButtonInActive>
                                <img src={PlayInActive} alt={"playIcon"}/>
                            </PlayingButtonInActive>
                            { isPaused ?
                                <PlayingButton onClick={replay}>
                                    <img src={BigPlay} alt={"BigPlay"}/>
                                </PlayingButton>
                                :
                                <PauseBtn onClick={pause}>
                                    <img src={pauseIcon} alt={"pauseIcon"}/>
                                </PauseBtn>
                            }
                            <StopBtn onClick={stopRecord}>
                                <img src={stopIcon} alt={"stopIcon"}/>
                            </StopBtn>
                        </RecIcons>
                }

                {/*녹음 완료*/}
                {
                    (finishRecord && !isPlaying) &&
                        <FinishRecord>
                            <RecIcons>
                                <PlayingButton onClick={play}>
                                    <img src={playIcon} alt={"playIcon"}/>
                                </PlayingButton>
                                <OnRecording onClick={replay}>
                                    <img style={{marginRight: '13px'}} src={onRecIcon} alt={"onRecIcon"}/>
                                </OnRecording>
                                <StopBtn onClick={stopRecord}>
                                    <img src={stopIcon} alt={"stopIcon"}/>
                                </StopBtn>
                            </RecIcons>
                        </FinishRecord>
                }

                {/*재생중*/}
                {
                    isPlaying &&
                        <RecIcons>
                            <PauseBtn onClick={pause}>
                                <img src={smallPause} alt={"pauseIcon"}/>
                            </PauseBtn>
                            <OnRecordingInActive>
                                <img src={OnRecIconInActive} alt={"onRecIcon"}/>
                            </OnRecordingInActive>
                            <StopBtn onClick={stopRecord}>
                                <img src={stopIcon} alt={"stopIcon"}/>
                            </StopBtn>
                        </RecIcons>
                }
            </IconArea>
        </VoiceContainer>
    );
};


export default VoicePopup;


const VoiceContainer = styled.div`
  width: 266px;
  height: 265px;
  background: rgba(198, 211, 236, 0.9);
  border-radius: 20px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`;

const CloseButton = styled.img`
  position: absolute;
  right: 16px;
  top: 19px;
  cursor: pointer;
`;

const RecordStatus = styled.div`
  font-size: 20px;
  line-height: 24px;
  text-align: center;
  color: #43567E;
  margin-top: 37px;
`;
const RecordImg = styled.div`
  text-align: center;
  margin-top: 17px;
  img {
    width: 74px;
    height: 74px;
  }
`;
const RecordTime = styled.div`
  font-size: 24px;
  line-height: 29px;
  text-align: center;
  color: #000000;
  margin-top: 5px;
  font-weight: 400;
`;

const IconArea = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 15px;
`;
const OnRecording = styled.div`
  cursor: pointer;
`;

const OnRecordingInActive = styled(OnRecording)`
  margin-right: 13px;
  pointer-events: none;
`;

const FinishRecord = styled.div`
  
`;

const RecIcons = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PlayingButton = styled.div`
  margin-right: 13px;
  cursor: pointer;
`;

const PlayingButtonInActive = styled(PlayingButton)`
  pointer-events: none;
`;

const StartRecord = styled.div``;
const PlaySound = styled.div``;

const DeleteBtn = styled.div`
  cursor: pointer;
  margin: 0 10px;
`;

const UploadBtn = styled.div`
  cursor: pointer;
`;

const PauseBtn = styled.div`
  cursor: pointer;
  margin-right: 13px;
`;
const StopBtn = styled.div`
  cursor: pointer;
`;
