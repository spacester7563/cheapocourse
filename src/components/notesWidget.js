import React, { useEffect, useState } from 'react';
import { IoClose } from "react-icons/io5";
import { serverURL } from '../constants';
import { PiNotepadFill } from "react-icons/pi";
import axios from 'axios';
import {
    BtnBold,
    BtnClearFormatting,
    BtnItalic,
    BtnRedo,
    BtnStrikeThrough,
    BtnUnderline,
    BtnUndo,
    Editor,
    EditorProvider,
    Toolbar
} from 'react-simple-wysiwyg';
import { toast } from 'react-toastify';

const NotesWidget = ({ mainTopic, courseId }) => {

    const [isOpen, setIsOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const storedTheme = sessionStorage.getItem('darkMode');
    const [value, setValue] = useState('');

    function onChange(e) {
        setValue(e.target.value);
    }

    // Set mobile view based on window size
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        if(courseId){
            getNotes();
        }

        checkMobile(); // Check on mount
        window.addEventListener("resize", checkMobile); // Add event listener for resizing

        return () => window.removeEventListener("resize", checkMobile); // Cleanup on unmount
    }, []);


    // Toggle chat window
    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

    async function getNotes(){
        try {
            const postURL = serverURL + '/api/getnotes';
            const response = await axios.post(postURL, {course: courseId});
            if (response.data.success) {
               setValue(response.data.message);
            }else{
                console.log('NOT FOUND')
            }
        } catch (error) {
            console.log(error)
        }
    }

    async function saveNotes(){
        const id = toast.loading("Please wait saving...");
        const postURL = serverURL + '/api/savenotes';
        const response = await axios.post(postURL, {course: courseId, notes: value});
        if (response.data.success) {
            toast.update(id, { render: "Saved!", type: "success", isLoading: false, autoClose: 3000, hideProgressBar: false, closeOnClick: true });
        }else{
            toast.update(id, { render: "Internal Server Error", type: "error", isLoading: false, autoClose: 3000, hideProgressBar: false, closeOnClick: true });
        }
    }

    // Inline CSS Styles
    const chatWidgetStyle = {
        position: 'fixed',
        bottom: isMobile ? '0px' : '80px',
        right: isMobile ? '0px' : '20px',
        zIndex: '9998',
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
                    <span>{mainTopic} Notes</span>
                    <div className='flex flex-row'>
                        <p onClick={()=> saveNotes()} className='text-white dark:text-black mr-2 cursor-pointer'>Save</p>
                        <button style={closeBtnStyle} onClick={toggleChat}><IoClose /></button>
                    </div>
                </div>
                <EditorProvider>
                    <Editor containerProps={{ style: { borderWidth: 0, height: '100%', overflowY: 'auto', color: storedTheme === "true" ? 'white' : '#000' } }}
                        value={value} onChange={onChange}>
                        <Toolbar>
                            <BtnBold />
                            <BtnItalic />
                            <BtnUnderline />
                            <BtnClearFormatting />
                            <BtnStrikeThrough />
                            <BtnRedo />
                            <BtnUndo />
                        </Toolbar>
                    </Editor>
                </EditorProvider>
            </div>

            {/* Chat Button */}
            <button
                className="cursor-pointer max-md:mb-16 mb-20 max-md:mr-2 mr-5 fixed bottom-4 right-4 z-40 w-12 h-12 bg-black text-white rounded-full flex justify-center items-center shadow-md dark:text-black dark:bg-white"
                onClick={toggleChat}
            >
                <PiNotepadFill size={20} />
            </button>
        </div>
    );
};

export default NotesWidget;
