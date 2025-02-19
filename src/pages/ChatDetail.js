import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import Header from "../shared/Header";
import Footer from "../shared/Footer";
import CategoryBar from "../shared/CategoryBar";
import ChatMessage from "../components/chat/ChatMessage";
import ChatInput from "../components/chat/ChatInput";
import { Layout, MobileTitleName } from "../components/common";
import { getChatMessage, subMessage } from "../redux/modules/chatSlice";
import { getCookie } from "../utils/cookie";
import { chatApi } from "../apis/chatApi";
import { close } from "../static/images/resources";
import useStore from "../zustand/store";
import { color } from "../utils/designSystem";
import { useMediaQuery } from "react-responsive";
import ChatMessageBox from "../components/chat/ChatMessageBox";
import { Helmet } from "react-helmet";

const ChatDetail = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const params = useParams();
    const roomId = params.id;
    const { setCurrentHeader } = useStore();

    const isMobile = useMediaQuery({
        query: "(max-width: 420px)",
    });

    // 보내는 사람
    const isLogin = useSelector((state) => state.userSlice.isLogin);
    const userInfo = useSelector((state) => state.userSlice.userInfo);
    useEffect(() => {
        if (isLogin && userInfo.nickname === "") {
            navigate("/signup");
        }
    }, []);

    // const token = getCookie("accessToken");
    const token = localStorage.getItem("accessToken");
    const [text, setText] = React.useState("");
    const scrollRef = useRef();
    const ws = useRef();

    // 상대방 정보
    const [otherUserInfo, setOtherUserInfo] = useState([]);

    // messages
    const messages = useSelector((state) => state.chatSlice.messages);

    // 상대방 정보 가져오기
    useEffect(() => {
        setCurrentHeader("채팅");
        chatApi
            .enterChatRoom(roomId)
            .then((response) => {
                setOtherUserInfo(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    // 채팅방 이전 메시지 가져오기
    useEffect(() => {
        let sock = new SockJS(`${process.env.REACT_APP_BASE_URL}/stomp/chat`);
        let client = Stomp.over(sock);
        ws.current = client;

        dispatch(getChatMessage(roomId));
    }, []);

    // 방 입장 시 스크롤 아래로 이동
    useEffect(() => {
        scrollRef.current.scrollIntoView({ block: "end" });
    }, []);

    // 메시지 state 변경 시 스크롤 아래로 이동
    useEffect(() => {
        scrollRef.current.scrollIntoView({ block: "end" });
    }, [messages]);

    // 소켓 연결, unmount 시 소켓 연결 해제
    useEffect(() => {
        wsConnect();
        return () => {
            wsDisConnect();
        };
    }, []);

    // 소켓 연결 함수
    function wsConnect() {
        try {
            ws.current.debug = function (str) {};
            ws.current.debug();
            ws.current.connect({ token: token, type: "CHAT" }, () => {
                // connect 이후 subscribe
                ws.current.subscribe(`/sub/chat/room/${roomId}`, (response) => {
                    const newMessage = JSON.parse(response.body);
                    dispatch(subMessage(newMessage));
                });

                // 입장 시 enter 메시지 발신
                // 이 메시지를 기준으로 서버에서 unReadCount 판별
                const message = {
                    roomId: roomId,
                };
                ws.current.send("/pub/chat/enter", { token: token }, JSON.stringify(message));
            });
        } catch (error) {
            console.log(error);
        }
    }

    // 소켓 연결 해제
    function wsDisConnect() {
        try {
            ws.current.disconnect(() => {
                ws.current.unsubscribe("sub-0");
            });
        } catch (error) {
            console.log(error);
        }
    }

    // 메시지 발신
    const onSend = async () => {
        try {
            // send할 데이터
            const message = {
                roomId: roomId,
                message: text,
                otherUserId: otherUserInfo.otherUserId, // 메시지 받는 상대방
            };

            if (text === "") {
                return;
            }
            // send message
            ws.current.send("/pub/chat/message", { token: token }, JSON.stringify(message));
            setText("");
        } catch (error) {
            console.log(error);
        }
    };

    if (messages === null) {
        return;
    }

    return (
        <Layout>
            <Container>
                <Header />
                {!isMobile ? <CategoryBar /> : <MobileTitleName title={"일대일 대화"} />}
                <ChatRoom BgColor={color.containerBoxColor}>
                    <ChatRoomTitle>
                        <p> {otherUserInfo.otherUserNickname}님과의 대화</p>
                        <BackButton onClick={() => navigate("/chatlist")}>
                            <img src={close} alt={"close-button"} />
                        </BackButton>
                    </ChatRoomTitle>
                    <ChatMessageBox messages={messages} scrollRef={scrollRef} />
                    <InputWrpper>
                        <ChatInput userInfo={userInfo} onSend={onSend} text={text} setText={setText} />
                    </InputWrpper>
                </ChatRoom>
            </Container>
            <Footer />
        </Layout>
    );
};

export default React.memo(ChatDetail);

const Container = styled.div`
    width: 100%;
    height: 100vh;
    overflow: hidden;
`;

const ChatRoom = styled.div`
    width: 950px;
    height: 530px;
    background: ${(props) => props.BgColor};
    border: 2px solid rgba(255, 255, 255, 0.3);
    box-shadow: 0px 0px 70px #465981;
    backdrop-filter: blur(80px);

    border-radius: 25px;

    position: relative;
    margin: auto;

    @media only screen and (max-width: 420px) {
        width: 320px;
        height: 80vh;

        border: none;
        box-shadow: none;
        backdrop-filter: none;
    }
`;

const ChatRoomTitle = styled.div`
    width: 100%;
    height: 52px;
    margin-top: 23px;

    background: rgba(8, 17, 52, 0.3);

    border-radius: 0px;

    display: flex;
    align-items: center;
    justify-content: space-between;

    color: #ffffff;

    & p {
        margin-left: 22px;
        font-size: 20px;
        line-height: 25px;

        color: #ffffff;
    }

    @media only screen and (max-width: 420px) {
        width: 320px;
        height: 7vh;
        margin-top: 9px;
        background: #959ebe;

        & p {
            font-size: 14px;
            line-height: 17px;

            color: #354569;
        }
    }
`;

const BackButton = styled.div`
    margin-right: 15px;
    cursor: pointer;
`;

const MessageWrapper = styled.div`
    width: 942px;
    height: 375px;
    margin-top: 19px;
    overflow-y: auto;

    &::-webkit-scrollbar {
        width: 5px;
    }

    &::-webkit-scrollbar-thumb {
        background-color: #d3d3d3;
        border-radius: 50px;
    }
    &::-webkit-scrollbar-track {
        background-color: #08105d;
        border-radius: 50px;
    }

    @media only screen and (max-width: 420px) {
        width: 319px;
        height: 65vh;
        top: 0;
        left: 0;
        margin-top: 12px;
    }
`;
const InputWrpper = styled.div`
    width: 950px;
    height: 61px;
    background: #2f3a5f;
    border-radius: 0px 0px 25px 25px;
    display: flex;
    align-items: center;
    justify-content: space-evenly;

    @media only screen and (max-width: 420px) {
        width: 320px;
        height: 8vh;
        border-radius: 0 0 0 0;
    }
`;
