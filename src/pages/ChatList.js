import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import { chatApi } from "../apis/chatApi";
import CategoryBar from "../shared/CategoryBar";
import useStore from "../zustand/store";
import Header from "../shared/Header";
import Loading from "../shared/Loading";
import _ from "lodash";
import { Layout } from "../components/common";
import ChatOutModal from "../components/common/ChatOutModal";
import { color } from "../utils/designSystem";
import Popup from "../shared/Popup";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { deleteUnreadCount } from "../redux/modules/chatSlice";
import { unreadCount } from "../static/images/resources";

ChatList.propTypes = {};

function ChatList(props) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { setCurrentHeader } = useStore();

    const userInfo = useSelector((state) => state.userSlice.userInfo);

    // chatList 에 소켓에서 받는 안 읽은 메시지 수를 unreadCount 라는 속성에 넣어주는 작업 필요
    const [chatList, setChatList] = useState([]);
    const [isOpenPopup, setIsOpenPopup] = useState(false);

    // 무한스크롤
    const InfinityScrollref = useRef();
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasNext, setHasNext] = useState(null);

    // modal
    const [ModalisOpen, setModalIsOpen] = useState(false);
    const ChatOutTabRef = useRef();

    const openModal = () => {
        console.log("open!");
        setModalIsOpen(true);
    };
    const closeModal = () => {
        console.log("close!");
        setModalIsOpen(false);
    };

    const inicialRoom = {
        roomename: null,
        roomId: null,
        lastMessage: null,
        lastTime: null,
    };

    // 채팅방 나가기
    const deleteChat = (chatId) => {
        chatApi.deleteChat(chatId).then((response) => {
            if (response.status === 200) {
                setIsOpenPopup(false);
                // 리덕스 charList 에서 delete 처리 해줘야 함.
            } else {
                window.alert("에러처리");
            }
        });
    };

    // 무한스크롤을 함수
    // Grid onScroll 이벤트에 넣어두어, Grid 스크롤 발생 시 실행됨
    const InfinityScroll = _.throttle((e) => {
        // // 실제 요소의 높이값
        // console.log(e.target.scrollHeight);

        //  // 스크롤 위치
        //  console.log(e.target.scrollTop);

        //  //현재 보여지는 요소의 높이 값 (border, scrollbar 크기 제외)
        // console.log(e.target.clientHeight);

        console.log(e.target.scrollHeight - (e.target.scrollTop + e.target.clientHeight));

        if (e.target.scrollHeight - (e.target.scrollTop + e.target.clientHeight) <= 200 && hasNext) {
            chatApi.getChatList(page).then((response) => {
                console.log(response);
                setChatList([...chatList, ...response.data]);
                setIsLoading(false);
                if (response.data.length < 5) {
                    setHasNext(false);
                } else {
                    setHasNext(true);
                }
                setPage(page + 1);
            });
        }
    }, 300);

    // 카테고리바에 별 표시 삭제
    useEffect(() => {
        dispatch(deleteUnreadCount());
    }, []);

    // 채팅방 리스트 조회 api
    useEffect(() => {
        chatApi.getChatList(page).then((response) => {
            console.log(response);
            setChatList([...chatList, ...response.data]);
            setIsLoading(false);
            if (response.length < 5) {
                setHasNext(false);
            } else {
                setHasNext(true);
            }
            setPage(page + 1);
        });

        setCurrentHeader("채팅");
    }, []);

    if (isLoading) {
        return <Loading />;
    }

    return (
        <Layout>
            <Container>
                <Header />
                <CategoryBar />
                <ChatRoomListBox BgColor={color.containerBoxColor}>
                    <ChatRoomListTitle>
                        <p>채팅 리스트</p>
                    </ChatRoomListTitle>
                    <ChatRoomWrapper ref={InfinityScrollref} onScroll={InfinityScroll}>
                        {chatList.length === 0 && <NoChatNotice>아직 개설된 채팅방이 없습니다.</NoChatNotice>}
                        {chatList.length > 0 &&
                            chatList.map((chat, i) => {
                                return (
                                    <ChatRoom
                                        roomName={chat.roomName}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            navigate(`/chat/${chat.chatRoomUuid}`);
                                        }}
                                        key={chat.chatRoomUuid}
                                    >
                                        <TitleLine>
                                            <CharRoomTitle>{chat.roomName} 님과의 대화</CharRoomTitle>
                                            <UnreadCount>
                                                {chat.unreadCount !== 0 ? (
                                                    <UnreadCountNum>{chat.unreadCount}</UnreadCountNum>
                                                ) : (
                                                    ""
                                                )}
                                                {chat.unreadCount !== 0 && (
                                                    <UnreadCountIcon src={unreadCount}></UnreadCountIcon>
                                                )}
                                            </UnreadCount>
                                        </TitleLine>

                                        <LastChatTime>{chat.dayBefore}</LastChatTime>
                                        <LastChat>{chat.lastMessage}</LastChat>
                                        <ChatOutButton
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setIsOpenPopup(true);
                                            }}
                                        >
                                            나가기
                                        </ChatOutButton>
                                        {/* <TiTleLine></TiTleLine>
                                        <ContentLine></ContentLine> */}

                                        {isOpenPopup && (
                                            <Popup
                                                title={"정말로/대화를 종료하시겠습니까?"}
                                                close={() => setIsOpenPopup(false)}
                                                event={() => {
                                                    deleteChat(chat.chatRoomUuid);
                                                }}
                                            />
                                        )}
                                    </ChatRoom>
                                );
                            })}
                    </ChatRoomWrapper>
                </ChatRoomListBox>
            </Container>
        </Layout>
    );
}

export default ChatList;

const Container = styled.div`
    width: 100%;
    height: 100vh;
    overflow: hidden;
`;

const ChatRoomListBox = styled.div`
    width: 950px;
    height: 530px;
    background: ${(props) => props.BgColor};
    border: 2px solid rgba(255, 255, 255, 0.3);
    box-shadow: 0px 0px 70px #465981;
    backdrop-filter: blur(80px);

    border-radius: 25px;

    position: relative;
    margin: auto;
`;

const NoChatNotice = styled.div`
    position: absolute;
    top: 100px;
    left: 50%;
    transform: translate(-50%, 0);

    font-family: "Inter";
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 19px;
    text-align: center;

    color: #d7d7d7;
`;
const ChatRoomListTitle = styled.div`
    position: absolute;
    width: 950px;
    height: 50px;
    top: 20px;

    background: #2f3a5f;

    border-radius: 0px;

    display: flex;
    align-items: center;

    color: #ffffff;

    & p {
        margin-left: 23px;
        font-family: "Spoqa Han Sans Neo";
        font-style: normal;
        font-weight: 400;
        font-size: 20px;
        line-height: 25px;
        display: flex;
        align-items: center;

        color: #ffffff;
    }
`;

const ChatRoomWrapper = styled.div`
    width: 915px;
    height: 414px;
    position: absolute;
    top: 94px;
    left: 25px;
    overflow-y: auto;

    &:: -webkit-scrollbar {
        width: 6px;
    }

    &:: -webkit-scrollbar-thumb {
        background-color: #d3d3d3;
        border-radius: 50px;
    }

    &:: -webkit-scrollbar-track {
        background-color: #08105d;
        border-radius: 50px;
    }
`;

const ChatRoom = styled.div`
    position: relative;
    width: 889px;
    height: 65px;
    border-radius: 5px;
    background: #959ebe;

    margin: 0 0 5px;
    // padding: 16px;
    box-sizing: border-box;
    cursor: pointer;
`;

const TitleLine = styled.div`
    position: absolute;
    display: flex;
    flex-direction: row;
    margin: 12px 0 0 16px;
`;

const CharRoomTitle = styled.div`
    // position: absolute;
    // top: 12px;
    // left: 16px;

    font-family: "Spoqa Han Sans Neo";
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 18px;
    display: flex;
    align-items: center;

    color: #354569;
`;

const UnreadCount = styled.div`
    position: relative;
    // top: 14px;
    // left: 125px;

    margin: 0 0 0 11px;

    font-family: "Spoqa Han Sans Neo";
    font-style: normal;
    font-weight: 400;
    font-size: 10px;
    line-height: 13px;
    display: flex;
    align-items: center;

    color: #c6d3ec;
`;

const UnreadCountNum = styled.div`
    // position: absolute;
    z-index: 1;
    margin-left: 4px;
    // top: 50%;
    // left: 50%;
    // transform: translate(-50%, -50%);
`;

const UnreadCountIcon = styled.img`
    position: absolute;
    // top: 14px;
    // left: 0px;
    // width: 14px;
    // height: 14px;
    // margin: 0 0 0 11px;
`;

const LastChatTime = styled.div`
    position: absolute;
    top: 12px;
    right: 16px;

    font-family: "Spoqa Han Sans Neo";
    font-style: normal;
    font-weight: 400;
    font-size: 10px;
    line-height: 13px;
    display: flex;
    align-items: center;
    text-align: center;

    color: #354569;
`;

const LastChat = styled.div`
    position: absolute;
    top: 42px;
    left: 16px;

    font-family: "Spoqa Han Sans Neo";
    font-style: normal;
    font-weight: 400;
    font-size: 10px;
    line-height: 13px;
    display: flex;
    align-items: center;

    color: #354569;
`;

const ChatOutButton = styled.div`
    position: absolute;
    top: 44px;
    right: 16px;

    font-family: "Spoqa Han Sans Neo";
    font-style: normal;
    font-weight: 400;
    font-size: 10px;
    line-height: 13px;
    display: flex;
    align-items: center;
    text-align: center;

    color: #354569;
`;

// const ContentLine = styled.div`
//     width: 860px;
//     display: flex;
//     justify-content: space-between;
//     margin: 10px auto;
// `;

// const ModalOpenButton = styled.div`
//     // width: 100px;
//     cursor: pointer;
// `;
