import React, { useEffect, useState } from 'react';
import { IoChatbubbleEllipses } from "react-icons/io5";
import { IoClose } from "react-icons/io5";
import { serverURL } from '../constants';
import axios from 'axios';

const ChatWidget = ({ defaultMessage, defaultPrompt, mainTopic }) => {
    const [isOpen, setIsOpen] = useState(false);

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    const [isMobile, setIsMobile] = useState(false);
    const storedTheme = sessionStorage.getItem('darkMode');
    // Set mobile view based on window size
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        loadMessages();
        checkMobile(); // Check on mount
        window.addEventListener("resize", checkMobile); // Add event listener for resizing

        return () => window.removeEventListener("resize", checkMobile); // Cleanup on unmount
    }, []);


    // Toggle chat window
    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

    const loadMessages = async () => {
        try {
            const jsonValue = sessionStorage.getItem(mainTopic);
            if (jsonValue !== null) {
                setMessages(JSON.parse(jsonValue));
            } else {
                const newMessages = [...messages, { text: defaultMessage, sender: 'bot' }];
                setMessages(newMessages);
                await storeLocal(newMessages);
            }
        } catch (error) {
            loadMessages();
        }
    };

    const sendMessage = async () => {
        if (newMessage.trim() === '') return;

        const userMessage = { text: newMessage, sender: 'user' };
        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);
        await storeLocal(updatedMessages);
        setNewMessage('');

        let mainPrompt = defaultPrompt + newMessage;
        const dataToSend = { prompt: mainPrompt };
        const url = serverURL + '/api/chat';

        try {
            const response = await axios.post(url, dataToSend);

            if (response.data.success === false) {
                sendMessage();
            } else {
                const botMessage = { text: response.data.text, sender: 'bot' };
                const updatedMessagesWithBot = [...updatedMessages, botMessage];
                setMessages(updatedMessagesWithBot);
                await storeLocal(updatedMessagesWithBot);
            }
        } catch (error) {

        }
    };

    async function storeLocal(messages) {
        try {
            sessionStorage.setItem(mainTopic, JSON.stringify(messages));
        } catch (error) {
            sessionStorage.setItem(mainTopic, JSON.stringify(messages));
        }
    }

    // Inline CSS Styles
    const chatWidgetStyle = {
        position: 'fixed',
        bottom: isMobile ? '0px' : '15px',
        right: isMobile ? '0px' : '15px',
        zIndex: '9999',
        width: 'auto',
        height: isMobile ? '100%' : 'auto',
    };

    const chatWindowStyle = {
        display: isOpen ? 'flex' : 'none',
        position: 'absolute',
        bottom: isMobile ? '0px' : '80px',
        right: isMobile ? '0' : '20px',
        width: isMobile ? '100vw' : '300px',
        zIndex: '9999',
        backgroundColor: storedTheme === "true" ? '#000' : '#fff',
        border: '1px solid #ccc',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        maxHeight: isMobile ? '' : '400px',
        height: isMobile ? '100%' : '',
        minHeight: isMobile ? '' : '400px',
        flexDirection: 'column',
        transition: 'all 0.3s ease-in-out',
    };

    const chatHeaderStyle = {
        backgroundColor: storedTheme === "true" ? '#fff' : '#000',
        color: storedTheme === "true" ? '#000' : 'white',
        padding: '10px',
        fontSize: '16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    };

    const closeBtnStyle = {
        background: 'transparent',
        border: 'none',
        color: storedTheme === "true" ? '#000' : 'white',
        fontSize: '18px',
        cursor: 'pointer',
    };

    const chatMessagesStyle = {
        padding: '10px',
        overflowY: 'auto',
        flexGrow: '1',
    };

    const messageInputStyle = {
        display: 'flex',
        padding: '10px',
        borderTop: '1px solid #ccc',
    };

    const buttonStyle = {
        padding: '8px 12px',
        backgroundColor: storedTheme === "true" ? 'white' : '#000',
        color: storedTheme === "true" ? '#000' : 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    };

    return (
        <div style={chatWidgetStyle}>
            <div style={chatWindowStyle}>
                <div style={chatHeaderStyle}>
                    <span>Chat with Ai teacher!</span>
                    <button style={closeBtnStyle} onClick={toggleChat}><IoClose /></button>
                </div>
                <div style={chatMessagesStyle}>

                    {messages.map((msg, index) => (
                        <div key={index} style={{ alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start', display: 'flex', flexDirection: 'column', }}>
                            <div style={{ borderBottomLeftRadius: 5, borderBottomRightRadius: 5, borderTopLeftRadius: msg.sender === 'user' ? 5 : 0, borderTopRightRadius: msg.sender === 'user' ? 0 : 5, overflow: 'hidden' }}>
                                {msg.sender === 'user' ?
                                    <div style={{ backgroundColor: storedTheme === 'true' ? '#F9F9F9' : '#282C34', padding: 16, color: storedTheme === 'true' ? '#01020A' : '#fff', margin: 4, borderRadius: 8 }} className='text-black dark:text-white text-xs' dangerouslySetInnerHTML={{ __html: msg.text }} />
                                    :
                                    <div style={{ backgroundColor: storedTheme === 'true' ? '#313131' : '#F9F9F9', padding: 16, color: storedTheme === 'true' ? '#fff' : '#01020A', margin: 4, borderRadius: 8 }} className='text-black dark:text-white text-xs ' dangerouslySetInnerHTML={{ __html: msg.text }} />
                                }
                            </div>
                        </div>
                    ))}

                </div>
                <div style={messageInputStyle}>
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        className='flex-grow border-none border-transparent focus:border-transparent focus:ring-0 text-black dark:text-white bg-white dark:bg-black'
                    />
                    <button onClick={sendMessage} style={buttonStyle}>Send</button>
                </div>
            </div>

            {/* Chat Button */}
            <button
                className=" cursor-pointer max-md:m-2 m-5 fixed bottom-4 right-4 z-40 w-12 h-12 bg-black text-white rounded-full flex justify-center items-center shadow-md dark:text-black dark:bg-white"
                onClick={toggleChat}
            >
                <IoChatbubbleEllipses size={20} />
            </button>
        </div>
    );
};

export default ChatWidget;
