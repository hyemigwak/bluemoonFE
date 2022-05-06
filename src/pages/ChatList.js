import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
// import Modal from "../components/modal";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { chatApi } from "../apis/chatApi";
import CategoryBar from "../shared/CategoryBar";
import useStore from "../zustand/store";
import Header2 from "../shared/Header2";
import Loading from "../shared/Loading";
import _ from "lodash";

ChatList.propTypes = {};

function ChatList(props) {
    const navigate = useNavigate();
    const ref = useRef();
    const { setCurrentHeader } = useStore();

    const [chatList, setChatList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasNext, setHasNext] = useState(null);

    const inicialRoom = {
        roomename: null,
        roomId: null,
        lastMessage: null,
        lastTime: null,
    };

    // const [isModalOpen, setIsModalOpen] = useState(false);
    // const openModal = () => {
    //     setIsModalOpen(true);
    // };
    // const closeModal = () => {
    //     setIsModalOpen(false);
    // };

    // 채팅방 나가기
    const deleteChat = (chatId) => {
        if (window.confirm("정말 이 방을 나가시겠습니까?")) {
            chatApi.deleteChat(chatId).then((response) => {
                if (response.status === 200) {
                    window.alert("채팅방에서 나가셨습니다.");
                    window.location.reload();
                }
            });
        }
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

        if (e.target.scrollTop + e.target.clientHeight >= e.target.scrollHeight) {
            chatApi.getChatList(page).then((response) => {
                setChatList([...chatList, ...response.data]);
                setIsLoading(false);
                if (response.length < 5) {
                    setHasNext(false);
                } else {
                    setHasNext(true);
                }
                setPage(page + 1);
            });
        }
    }, 300);

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
        <Container>
            <Header2 />
            <CategoryBar />
            <ChatRoomListBox ref={ref} onScroll={InfinityScroll}>
                <ChatRoomListTitle>
                    <p>채팅 리스트</p>
                </ChatRoomListTitle>
                {chatList.map((chat, i) => {
                    return (
                        <ChatRoom onClick={() => navigate(`/chat/${chat.chatRoomUuid}`)} key={chat.chatRoomUuid}>
                            <TiTleLine>
                                <CharRoomTitle>{chat.roomName} 님과의 대화</CharRoomTitle>
                                <LastChatTime>{chat.createAt}</LastChatTime>
                            </TiTleLine>
                            <ContentLine>
                                <LastChat>{chat.lastMessage}</LastChat>
                                <ChatOutButton
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        deleteChat(chat.chatRoomUuid);
                                    }}
                                >
                                    채팅방 나가기
                                </ChatOutButton>
                            </ContentLine>
                        </ChatRoom>
                    );
                })}
            </ChatRoomListBox>
        </Container>
    );
}

export default ChatList;

const Container = styled.div`
    width: 100%;
    height: 100vh;
    background-color: #111b3f;
    overflow: hidden;
`;

const ChatRoomListBox = styled.div`
    width: 950px;
    height: 530px;
    margin: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    background: linear-gradient(180deg, rgba(63, 75, 112, 0.79) 0%, rgba(100, 114, 152, 0.79) 100%);
    border: 2px solid #ffffff4d;
    border-radius: 25px;
    box-shadow: 0 0 70px #465981;
    overflow-y: auto;
`;

const ChatRoomListTitle = styled.div`
    margin: 20px 0;
    background-color: #2f3a5f;
    height: 52px;
    width: 925px;
    left: 167px;
    top: 160px;
    border-radius: 0px;

    display: flex;
    align-items: center;

    color: #ffffff;

    & p {
        margin-left: 20px;
        font-size: 20px;
        font-weight: 400;
        line-height: 24px;
        letter-spacing: 0em;
        text-align: left;
    }
`;

const ChatRoom = styled.div`
    width: 880px;
    height: 150px;
    border-radius: 5px;

    display: flex;
    flex-direction: column;
    background-color: #959ebe;
    border: 1px solid black;
    border-radius: 10px;
    margin: 10px auto;
    padding: 10px;
`;

const TiTleLine = styled.div`
    width: 860px;
    display: flex;
    justify-content: space-between;
    margin: 10px auto;
`;

const CharRoomTitle = styled.div`
    font-family: Inter;
    font-size: 22px;
    font-weight: 700;
    line-height: 19px;
    letter-spacing: 0em;
    text-align: left;
    color: #373857;
`;

const LastChatTime = styled.div`
    width: 80px;
    overflow: hidden;
`;

const ContentLine = styled.div`
    width: 860px;
    display: flex;
    justify-content: space-between;
    margin: 10px auto;
`;

const LastChat = styled.div``;

const ChatOutButton = styled.button`
    width: 100px;
    cursor: pointer;
`;
