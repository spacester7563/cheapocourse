import { Drawer, Navbar, Sidebar } from 'flowbite-react';
import React, { useEffect, useState } from 'react';
import LogoComponent from '../components/LogoComponent';
import { FiMenu, FiX } from 'react-icons/fi';
import DarkModeToggle from '../components/DarkModeToggle';
import TruncatedText from '../components/TruncatedText';
import { useLocation, useNavigate } from 'react-router-dom';
import { IoIosArrowDown } from "react-icons/io";
import StyledText from '../components/styledText';
import YouTube from 'react-youtube';
import { toast } from 'react-toastify';
import { logo, name, serverURL, websiteURL } from '../constants';
import axios from 'axios';
import { FaCheck } from "react-icons/fa";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import html2pdf from 'html2pdf.js';
import ShareOnSocial from 'react-share-on-social';
import ChatWidget from '../components/chatWidget';
import NotesWidget from '../components/notesWidget';
import { AiFillHome } from "react-icons/ai";
import { HiDownload } from "react-icons/hi";
import { RiShareFill } from "react-icons/ri";

const Course = () => {

    const [isOpen, setIsOpen] = useState(false);
    const [key, setkey] = useState('');
    const { state } = useLocation();
    const { mainTopic, type, courseId, end, pass, lang } = state || {};
    const jsonData = JSON.parse(sessionStorage.getItem('jsonData'));
    const storedTheme = sessionStorage.getItem('darkMode');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [selected, setSelected] = useState('');
    const [theory, setTheory] = useState('');
    const [media, setMedia] = useState('');
    const [percentage, setPercentage] = useState(0);
    const [isComplete, setIsCompleted] = useState(false);
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    async function redirectExam() {
        const id = toast.loading("Please wait...")
        const mainTopicExam = jsonData[mainTopic.toLowerCase()];
        let subtopicsString = '';
        mainTopicExam.map((topicTemp) => {
            let titleOfSubTopic = topicTemp.title;
            subtopicsString = subtopicsString + ' , ' + titleOfSubTopic;
        });

        const postURL = serverURL + '/api/aiexam';
        const response = await axios.post(postURL, { courseId, mainTopic, subtopicsString, lang });
        if (response.data.success) {
            const element = document.documentElement; // or you can use a specific container if you want
            if (element.requestFullscreen) {
                element.requestFullscreen();
            } else if (element.mozRequestFullScreen) { // Firefox
                element.mozRequestFullScreen();
            } else if (element.webkitRequestFullscreen) { // Chrome, Safari and Opera
                element.webkitRequestFullscreen();
            } else if (element.msRequestFullscreen) { // IE/Edge
                element.msRequestFullscreen();
            } else {
                console.error('Full-screen mode is not supported by this browser.');
            }
            let questions = JSON.parse(response.data.message);
            navigate('/exam', { state: { topic: mainTopic, courseId: courseId, questions: questions } });
            toast.update(id, { render: "Starting Quiz", type: "success", isLoading: false, autoClose: 3000, hideProgressBar: false, closeOnClick: true });
        } else {
            toast.update(id, { render: "Internal Server Error", type: "error", isLoading: false, autoClose: 3000, hideProgressBar: false, closeOnClick: true });
        }

    }

    async function htmlDownload() {
        const id = toast.loading("Please wait exporting...")
        // Generate the combined HTML content
        const combinedHtml = await getCombinedHtml(mainTopic, jsonData[mainTopic.toLowerCase()]);

        // Create a temporary div element
        const tempDiv = document.createElement('div');
        tempDiv.style.width = '100%';  // Ensure div is 100% width
        tempDiv.style.height = '100%';  // Ensure div is 100% height
        tempDiv.innerHTML = combinedHtml;
        document.body.appendChild(tempDiv);

        // Create the PDF options
        const options = {
            filename: `${mainTopic}.pdf`,
            image: { type: 'jpeg', quality: 1 },
            margin: [15, 15, 15, 15],
            pagebreak: { mode: ["avoid-all", "css", "legacy"] },
            html2canvas: {
                scale: 2,
                logging: false,
                scrollX: 0,
                scrollY: 0,
                useCORS: true
            },
            jsPDF: { unit: 'pt', format: 'a4', orientation: 'portrait' },
        };

        // Generate the PDF
        html2pdf().from(tempDiv).set(options).save().then(() => {
            // Save the PDF
            document.body.removeChild(tempDiv);
            toast.update(id, { render: "Done!", type: "success", isLoading: false, autoClose: 3000, hideProgressBar: false, closeOnClick: true });
        });
    }


    async function getCombinedHtml(mainTopic, topics) {


        async function toDataUrl(url) {
            return new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();

                xhr.onload = function () {
                    const reader = new FileReader();
                    reader.onloadend = function () {
                        resolve(reader.result);
                    };
                    reader.readAsDataURL(xhr.response);
                };

                xhr.onerror = function () {
                    reject({
                        status: xhr.status,
                        statusText: xhr.statusText,
                    });
                };

                xhr.open("GET", url);
                xhr.responseType = "blob";
                xhr.send();
            }).catch(error => {
                console.error(`Failed to fetch image at ${url}:`, error);
                return ''; // Fallback or placeholder
            });
        }

        const topicsHtml = topics.map(topic => `
            <h3 style="font-size: 18pt; font-weight: bold; margin: 0; margin-top: 15px;">${topic.title}</h3>
            ${topic.subtopics.map(subtopic => `
                <p style="font-size: 16pt; margin-top: 10px;">${subtopic.title}</p>
            `).join('')}
        `).join('');

        const theoryPromises = topics.map(async topic => {
            const subtopicPromises = topic.subtopics.map(async (subtopic, index, array) => {
                const imageUrl = type === 'text & image course' ? await toDataUrl(subtopic.image) : ``;
                console.log(imageUrl);
                return `
                <div>
                    <p style="font-size: 16pt; margin-top: 20px; font-weight: bold;">
                        ${subtopic.title}
                    </p>
                    <div style="font-size: 12pt; margin-top: 15px;">
                        ${subtopic.done
                        ? `
                                ${type === 'text & image course'
                            ? (imageUrl ? `<img style="margin-top: 10px;" src="${imageUrl}" alt="${subtopic.title} image">` : `<a style="color: #0000FF;" href="${subtopic.image}" target="_blank">View example image</a>`)
                            : `<a style="color: #0000FF;" href="https://www.youtube.com/watch?v=${subtopic.youtube}" target="_blank" rel="noopener noreferrer">Watch the YouTube video on ${subtopic.title}</a>`
                        }
                                <div style="margin-top: 10px;">${subtopic.theory}</div>
                            `
                        : `<div style="margin-top: 10px;">Please visit ${subtopic.title} topic to export as PDF. Only topics that are completed will be added to the PDF.</div>`
                    }
                    </div>
                </div>
            `;
            });
            const subtopicHtml = await Promise.all(subtopicPromises);
            return `
                <div style="margin-top: 30px;">
                    <h3 style="font-size: 18pt; text-align: center; font-weight: bold; margin: 0;">
                        ${topic.title}
                    </h3>
                    ${subtopicHtml.join('')}
                </div>
            `;
        });
        const theoryHtml = await Promise.all(theoryPromises);

        return `
        <div class="html2pdf__page-break" 
             style="display: flex; align-items: center; justify-content: center; text-align: center; margin: 0 auto; max-width: 100%; height: 11in;">
            <h1 style="font-size: 30pt; font-weight: bold; margin: 0;">
                ${mainTopic}
            </h1>
        </div>
        <div class="html2pdf__page-break" style="text-align: start; margin-top: 30px; margin-right: 16px; margin-left: 16px;">
            <h2 style="font-size: 24pt; font-weight: bold; margin: 0;">Index</h2>
            <br>
            <hr>
            ${topicsHtml}
        </div>
        <div style="text-align: start; margin-right: 16px; margin-left: 16px;">
            ${theoryHtml.join('')}
        </div>
        `;
    }



    const CountDoneTopics = () => {
        let doneCount = 0;
        let totalTopics = 0;

        jsonData[mainTopic.toLowerCase()].forEach((topic) => {

            topic.subtopics.forEach((subtopic) => {

                if (subtopic.done) {
                    doneCount++;
                }
                totalTopics++;
            });
        });
        totalTopics = totalTopics + 1;
        if(pass){
            totalTopics = totalTopics - 1;
        }
        const completionPercentage = Math.round((doneCount / totalTopics) * 100);
        setPercentage(completionPercentage);
        if (completionPercentage >= '100') {
            setIsCompleted(true);
        }
    }

    const opts = {
        height: '390',
        width: '640',
    };

    const optsMobile = {
        height: '250px',
        width: '100%',
    };

    async function finish() {
        if (sessionStorage.getItem('first') === 'true') {
            if (!end) {
                const today = new Date();
                const formattedDate = today.toLocaleDateString('en-GB');
                navigate('/certificate', { state: { courseTitle: mainTopic, end: formattedDate } });
            } else {
                navigate('/certificate', { state: { courseTitle: mainTopic, end: end } });
            }

        } else {
            const dataToSend = {
                courseId: courseId
            };
            try {
                const postURL = serverURL + '/api/finish';
                const response = await axios.post(postURL, dataToSend);
                if (response.data.success) {
                    const today = new Date();
                    const formattedDate = today.toLocaleDateString('en-GB');
                    sessionStorage.setItem('first', 'true');
                    sendEmail(formattedDate);
                } else {
                    finish()
                }
            } catch (error) {
                finish()
            }
        }
    }

    async function sendEmail(formattedDate) {
        const userName = sessionStorage.getItem('mName');
        const email = sessionStorage.getItem('email');
        const html = `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="initial-scale=1.0">
            <title>Certificate of Completion</title>
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700;900&display=swap">
            <style>
            body {
                font-family: 'Roboto', sans-serif;
                text-align: center;
                background-color: #fff;
                margin: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
            }
        
            .certificate {
                border: 10px solid #000;
                max-width: 600px;
                margin: 20px auto;
                padding: 50px;
                background-color: #fff;
                position: relative;
                color: #000;
                text-align: center;
            }
        
            h1 {
                font-weight: 900;
                font-size: 24px;
                margin-bottom: 10px;
            }
        
            h4 {
                font-weight: 900;
                text-align: center;
                font-size: 20px;
            }
        
            h2 {
                font-weight: 700;
                font-size: 18px;
                margin-top: 10px;
                margin-bottom: 5px;
                text-decoration: underline;
            }
        
            h3 {
                font-weight: 700;
                text-decoration: underline;
                font-size: 16px;
                margin-top: 5px;
                margin-bottom: 10px;
            }
        
            p {
                font-weight: 400;
                line-height: 1.5;
            }
        
            img {
                width: 40px;
                height: 40px;
                margin-right: 10px;
                text-align: center;
                align-self: center;
            }
            </style>
        </head>
        <body>
        
        <div class="certificate">
        <h1>Certificate of Completion 🥇</h1>
        <p>This is to certify that</p>
        <h2>${userName}</h2>
        <p>has successfully completed the course on</p>
        <h3>${mainTopic}</h3>
        <p>on ${formattedDate}.</p>
    
        <div class="signature">
            <img src=${logo}>
            <h4>${name}</h4>
        </div>
    </div>
        
        </body>
        </html>`;

        try {
            const postURL = serverURL + '/api/sendcertificate';
            await axios.post(postURL, { html, email }).then(res => {
                navigate('/certificate', { state: { courseTitle: mainTopic, end: formattedDate } });
            }).catch(error => {
                navigate('/certificate', { state: { courseTitle: mainTopic, end: formattedDate } });
            });

        } catch (error) {
            navigate('/certificate', { state: { courseTitle: mainTopic, end: formattedDate } });
        }

    }

    useEffect(() => {
        loadMessages()
        const CountDoneTopics = () => {
            let doneCount = 0;
            let totalTopics = 0;

            jsonData[mainTopic.toLowerCase()].forEach((topic) => {

                topic.subtopics.forEach((subtopic) => {

                    if (subtopic.done) {
                        doneCount++;
                    }
                    totalTopics++;
                });
            });
            totalTopics = totalTopics + 1;
            if(pass){
                doneCount = doneCount + 1;
            }
            const completionPercentage = Math.round((doneCount / totalTopics) * 100);
            setPercentage(completionPercentage);
            if (completionPercentage >= '100') {
                setIsCompleted(true);
            }
        }

        if (!mainTopic) {
            navigate("/create");
        } else {
            if (percentage >= '100') {
                setIsCompleted(true);
            }

            const mainTopicData = jsonData[mainTopic.toLowerCase()][0];
            const firstSubtopic = mainTopicData.subtopics[0];
            firstSubtopic.done = true
            setSelected(firstSubtopic.title)
            setTheory(firstSubtopic.theory);

            if (type === 'video & text course') {
                setMedia(firstSubtopic.youtube);
            } else {
                setMedia(firstSubtopic.image)

            }
            sessionStorage.setItem('jsonData', JSON.stringify(jsonData));
            CountDoneTopics();

        }

    }, []);

    const handleSelect = (topics, sub) => {

        const mTopic = jsonData[mainTopic.toLowerCase()].find(topic => topic.title === topics);
        const mSubTopic = mTopic?.subtopics.find(subtopic => subtopic.title === sub);

        if (mSubTopic.theory === '' || mSubTopic.theory === undefined || mSubTopic.theory === null) {
            if (type === 'video & text course') {

                const query = `${mSubTopic.title} ${mainTopic} in english`;
                const id = toast.loading("Please wait...")
                sendVideo(query, topics, sub, id, mSubTopic.title);

            } else {

                const prompt = `Strictly in ${lang}, Explain me about this subtopic of ${mainTopic} with examples :- ${mSubTopic.title}. Please Strictly Don't Give Additional Resources And Images.`;
                const promptImage = `Example of ${mSubTopic.title} in ${mainTopic}`;
                const id = toast.loading("Please wait...")
                sendPrompt(prompt, promptImage, topics, sub, id);

            }
        } else {
            setSelected(mSubTopic.title)

            setTheory(mSubTopic.theory)
            if (type === 'video & text course') {
                setMedia(mSubTopic.youtube);
            } else {
                setMedia(mSubTopic.image)
            }
        }

    };

    async function sendPrompt(prompt, promptImage, topics, sub, id) {
        const dataToSend = {
            prompt: prompt,
        };
        try {
            const postURL = serverURL + '/api/generate';
            const res = await axios.post(postURL, dataToSend);
            const generatedText = res.data.text;
            const htmlContent = generatedText;
            try {
                const parsedJson = htmlContent;
                sendImage(parsedJson, promptImage, topics, sub, id);
            } catch (error) {
                //sendPrompt(prompt, promptImage, topics, sub, id)
            }

        } catch (error) {
            //sendPrompt(prompt, promptImage, topics, sub, id)
        }
    }

    async function sendImage(parsedJson, promptImage, topics, sub, id) {
        const dataToSend = {
            prompt: promptImage,
        };
        try {
            const postURL = serverURL + '/api/image';
            const res = await axios.post(postURL, dataToSend);
            try {
                const generatedText = res.data.url;
                sendData(generatedText, parsedJson, topics, sub, id);
            } catch (error) {
                //sendImage(parsedJson, promptImage, topics, sub, id)
            }

        } catch (error) {
            //sendImage(parsedJson, promptImage, topics, sub, id)
        }
    }

    async function sendData(image, theory, topics, sub, id) {

        const mTopic = jsonData[mainTopic.toLowerCase()].find(topic => topic.title === topics);
        const mSubTopic = mTopic?.subtopics.find(subtopic => subtopic.title === sub);
        mSubTopic.theory = theory
        mSubTopic.image = image;
        setSelected(mSubTopic.title)

        toast.update(id, { render: "Done!", type: "success", isLoading: false, autoClose: 3000, hideProgressBar: false, closeOnClick: true });
        setTheory(theory)
        if (type === 'video & text course') {
            setMedia(mSubTopic.youtube);
        } else {
            setMedia(image)
        }
        mSubTopic.done = true;
        updateCourse();
    }

    async function sendDataVideo(image, theory, topics, sub, id) {

        const mTopic = jsonData[mainTopic.toLowerCase()].find(topic => topic.title === topics);
        const mSubTopic = mTopic?.subtopics.find(subtopic => subtopic.title === sub);
        mSubTopic.theory = theory
        mSubTopic.youtube = image;
        setSelected(mSubTopic.title)

        toast.update(id, { render: "Done!", type: "success", isLoading: false, autoClose: 3000, hideProgressBar: false, closeOnClick: true });
        setTheory(theory)
        if (type === 'video & text course') {
            setMedia(image);
        } else {
            setMedia(mSubTopic.image)
        }
        mSubTopic.done = true;
        updateCourse();

    }

    async function updateCourse() {
        CountDoneTopics();
        sessionStorage.setItem('jsonData', JSON.stringify(jsonData));
        const dataToSend = {
            content: JSON.stringify(jsonData),
            courseId: courseId
        };
        try {
            const postURL = serverURL + '/api/update';
            await axios.post(postURL, dataToSend);
        } catch (error) {
            //updateCourse()
        }
    }

    async function sendVideo(query, mTopic, mSubTopic, id, subtop) {
        const dataToSend = {
            prompt: query,
        };
        try {
            const postURL = serverURL + '/api/yt';
            const res = await axios.post(postURL, dataToSend);

            try {
                const generatedText = res.data.url;
                sendTranscript(generatedText, mTopic, mSubTopic, id, subtop);
            } catch (error) {
                //sendVideo(query, mTopic, mSubTopic, id, subtop)
            }

        } catch (error) {
            //sendVideo(query, mTopic, mSubTopic, id, subtop)
        }
    }

    async function sendTranscript(url, mTopic, mSubTopic, id, subtop) {
        const dataToSend = {
            prompt: url,
        };
        try {
            const postURL = serverURL + '/api/transcript';
            const res = await axios.post(postURL, dataToSend);

            try {
                const generatedText = res.data.url;
                const allText = generatedText.map(item => item.text);
                const concatenatedText = allText.join(' ');
                const prompt = `Strictly in ${lang}, Summarize this theory in a teaching way :- ${concatenatedText}.`;
                sendSummery(prompt, url, mTopic, mSubTopic, id);
            } catch (error) {
                const prompt = `Strictly in ${lang}, Explain me about this subtopic of ${mainTopic} with examples :- ${subtop}. Please Strictly Don't Give Additional Resources And Images.`;
                sendSummery(prompt, url, mTopic, mSubTopic, id);
            }

        } catch (error) {
            const prompt = `Strictly in ${lang}, Explain me about this subtopic of ${mainTopic} with examples :- ${subtop}.  Please Strictly Don't Give Additional Resources And Images.`;
            sendSummery(prompt, url, mTopic, mSubTopic, id);
        }
    }

    async function sendSummery(prompt, url, mTopic, mSubTopic, id) {
        const dataToSend = {
            prompt: prompt,
        };
        try {
            const postURL = serverURL + '/api/generate';
            const res = await axios.post(postURL, dataToSend);
            const generatedText = res.data.text;
            const htmlContent = generatedText;
            try {
                const parsedJson = htmlContent;
                sendDataVideo(url, parsedJson, mTopic, mSubTopic, id);
            } catch (error) {
                //sendSummery(prompt, url, mTopic, mSubTopic, id)
            }

        } catch (error) {
            //sendSummery(prompt, url, mTopic, mSubTopic, id)
        }
    }

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleOpenClose = (keys) => {
        setIsOpen(!isOpen)
        setkey(keys);
    };

    const defaultMessage = `<p>Hey there! I'm your AI teacher. If you have any questions about your ${mainTopic} course, whether it's about videos, images, or theory, just ask me. I'm here to clear your doubts.</p>`;
    const defaultPrompt = `I have a doubt about this topic :- ${mainTopic}. Please clarify my doubt in very short :- `;

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

    function redirectHome() {
        navigate("/home");
    }

    const style = {
        "root": {
            "base": "h-full",
            "collapsed": {
                "on": "w-16",
                "off": "w-64 max-w-64 min-w-64"
            },
            "inner": "no-scrollbar h-full overflow-y-auto overflow-x-hidden rounded-none border-black dark:border-white md:border-r  bg-white py-4 px-3 dark:bg-black"
        }
    }

    const renderTopicsAndSubtopics = (topics) => {
        try {
            return (
                <div className='mt-2'>
                    {topics.map((topic) => (
                        <Sidebar.ItemGroup key={topic.title}>
                            <div className="relative inline-block text-left " >
                                <button
                                    onClick={() => handleOpenClose(topic.title)}
                                    type="button"
                                    className="inline-flex text-start text-base font-bold  text-black dark:text-white"
                                >
                                    {topic.title}
                                    <IoIosArrowDown className="-mr-1 ml-2 h-3 w-3 mt-2" />
                                </button>

                                {isOpen && key === topic.title && (
                                    <div className="origin-top-right mt-2 pr-4">
                                        <div
                                            className="py-1"
                                            role="menu"
                                            aria-orientation="vertical"
                                            aria-labelledby="options-menu"
                                        >
                                            {topic.subtopics.map((subtopic) => (
                                                <p
                                                    key={subtopic.title}

                                                    onClick={() => handleSelect(topic.title, subtopic.title)}
                                                    className="flex py-2 text-sm flex-row items-center font-normal text-black dark:text-white  text-start"
                                                    role="menuitem"
                                                >
                                                    {subtopic.title}
                                                    {subtopic.done === true ? <FaCheck className='ml-2' size={12} /> : <></>}
                                                </p>

                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Sidebar.ItemGroup>
                    ))}
                </div>
            );
        } catch (error) {
            return (
                <div>
                    {topics.map((topic) => (
                        <Sidebar.ItemGroup key={topic.Title}>
                            <div className="relative inline-block text-left " >
                                <button
                                    onClick={() => handleOpenClose(topic.Title)}
                                    type="button"
                                    className="inline-flex text-start text-base font-bold  text-black dark:text-white"
                                >
                                    {topic.Title}
                                    <IoIosArrowDown className="-mr-1 ml-2 h-3 w-3 mt-2" />
                                </button>

                                {isOpen && key === topic.Title && (
                                    <div className="origin-top-right mt-2 pr-4">
                                        <div
                                            className="py-1"
                                            role="menu"
                                            aria-orientation="vertical"
                                            aria-labelledby="options-menu"
                                        >
                                            {topic.Subtopics.map((subtopic) => (
                                                <p
                                                    key={subtopic.Title}
                                                    onClick={() => handleSelect(topic.Title, subtopic.Title)}
                                                    className="flex py-2 flex-row text-sm items-center font-normal text-black dark:text-white  text-start"
                                                    role="menuitem"
                                                >
                                                    {subtopic.Title}
                                                    {subtopic.done === true ? <FaCheck className='ml-2' size={12} /> : <></>}
                                                </p>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Sidebar.ItemGroup>
                    ))}
                </div>
            );
        }
    };

    return (
        <>
            {!mainTopic ? <></>
                :
                <div>
                    <div className="flex bg-white dark:bg-black md:hidden pb-10 overflow-y-auto">
                        <div className={`fixed inset-0 bg-black opacity-50 z-50 ${isSidebarOpen ? 'block' : 'hidden'}`} onClick={toggleSidebar}></div>
                        <div className="flex-1 flex flex-col overflow-hidden">

                            <div>
                                <Navbar fluid className='py-3 dark:bg-black bg-white border-black dark:border-white md:border-b'>
                                    <Navbar.Brand className='ml-1'>

                                        {isComplete ?
                                            <p onClick={finish} className='mr-3 underline text-black dark:text-white font-normal'>Certificate</p>
                                            :
                                            <div className='w-7 h-7 mr-3'>
                                                <CircularProgressbar
                                                    value={percentage}
                                                    text={`${percentage}%`}
                                                    styles={buildStyles({
                                                        rotation: 0.25,
                                                        strokeLinecap: 'butt',
                                                        textSize: '20px',
                                                        pathTransitionDuration: 0.5,
                                                        pathColor: storedTheme === "true" ? '#fff' : '#000',
                                                        textColor: storedTheme === "true" ? '#fff' : '#000',
                                                        trailColor: storedTheme === "true" ? 'grey' : '#d6d6d6',
                                                    })}
                                                />
                                            </div>
                                        }

                                        <TruncatedText text={mainTopic} len={1} />
                                    </Navbar.Brand>
                                    <div className='flex md:hidden justify-center items-center'>
                                        <div className='mx-2' onClick={redirectHome}><AiFillHome size={20} color={sessionStorage.getItem('darkMode') === 'true' ? 'white' : 'black'} /></div>
                                        <div className='mx-2' onClick={htmlDownload}><HiDownload size={20} color={sessionStorage.getItem('darkMode') === 'true' ? 'white' : 'black'} /></div>
                                        <div>
                                            <ShareOnSocial
                                                textToShare={sessionStorage.getItem('mName') + " shared you course on " + mainTopic}
                                                link={websiteURL + '/shareable?id=' + courseId}
                                                linkTitle={sessionStorage.getItem('mName') + " shared you course on " + mainTopic}
                                                linkMetaDesc={sessionStorage.getItem('mName') + " shared you course on " + mainTopic}
                                                linkFavicon={logo}
                                                noReferer
                                            >

                                                <div className='mx-2'><RiShareFill size={20} color={sessionStorage.getItem('darkMode') === 'true' ? 'white' : 'black'} /></div>

                                            </ShareOnSocial>
                                        </div>
                                        <DarkModeToggle className='inline-flex items-center md:hidden' />
                                        {isSidebarOpen ? (
                                            <FiX
                                                onClick={toggleSidebar}
                                                className='mx-2'
                                                size={20}
                                                color={sessionStorage.getItem('darkMode') === 'true' ? 'white' : 'black'}
                                            />
                                        ) : (
                                            <FiMenu
                                                onClick={toggleSidebar}
                                                className='mx-2'
                                                size={20}
                                                color={sessionStorage.getItem('darkMode') === 'true' ? 'white' : 'black'}
                                            />
                                        )}
                                    </div>
                                    <Navbar.Collapse>
                                        <div className='hidden md:flex justify-center items-center mb-2 mt-2'>
                                            <DarkModeToggle />
                                        </div>
                                    </Navbar.Collapse>
                                </Navbar>

                            </div>

                            <Sidebar
                                aria-label="Default sidebar example"
                                theme={style}
                                className={`md:border-r md:border-black md:dark:border-white dark:bg-black fixed inset-y-0 left-0 w-64  bg-white z-50 overflow-y-auto transition-transform transform lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
                            >
                                <LogoComponent isDarkMode={storedTheme} />
                                <Sidebar.Items className='mt-6'>
                                    {jsonData && renderTopicsAndSubtopics(jsonData[mainTopic.toLowerCase()])}
                                </Sidebar.Items>
                                <br />
                                <hr />
                                <Sidebar.Items className='mt-6'>
                                    <p className='text-start flex flex-row items-center text-base font-bold  text-black dark:text-white cursor-pointer' onClick={redirectExam}> {mainTopic} Quiz
                                        {pass === true ? <FaCheck className='ml-2' size={12} /> : <></>}
                                    </p>
                                </Sidebar.Items>
                            </Sidebar>
                            <div className='mx-5 overflow-y-auto bg-white dark:bg-black'>
                                <p className='font-black text-black dark:text-white text-lg'>{selected}</p>

                                <div className='overflow-hidden mt-5 text-black dark:text-white text-base pb-10 max-w-full'>
                                    {type === 'video & text course' ?
                                        <div>
                                            <YouTube key={media} className='mb-5' videoId={media} opts={optsMobile} />
                                            <StyledText text={theory} />
                                        </div>

                                        :
                                        <div>
                                            <StyledText text={theory} />
                                            <img className='overflow-hidden p-10' src={media} alt="Media" />
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='flex flex-row overflow-y-auto h-screen max-md:hidden'>
                        <Sidebar
                            theme={style}
                            aria-label="Default sidebar example">
                            <LogoComponent isDarkMode={storedTheme} />
                            <Sidebar.Items className='mt-6'>
                                {jsonData && renderTopicsAndSubtopics(jsonData[mainTopic.toLowerCase()])}
                            </Sidebar.Items>
                            <br />
                            <hr />
                            <Sidebar.Items className='mt-6'>
                                <p className='text-start flex flex-row items-center text-base font-bold  text-black dark:text-white cursor-pointer' onClick={redirectExam}> {mainTopic} Quiz
                                    {pass === true ? <FaCheck className='ml-2' size={12} /> : <></>}
                                </p>
                            </Sidebar.Items>
                        </Sidebar>
                        <div className='overflow-y-auto flex-grow flex-col'>
                            <Navbar fluid className='py-3 dark:bg-black bg-white border-black dark:border-white md:border-b'>
                                <Navbar.Brand className='ml-1'>
                                    {isComplete ?
                                        <p onClick={finish} className='mr-3 underline text-black dark:text-white font-normal'>Download Certificate</p> :
                                        <div className='w-8 h-8 mr-3'>
                                            <CircularProgressbar
                                                value={percentage}
                                                text={`${percentage}%`}
                                                styles={buildStyles({
                                                    rotation: 0.25,
                                                    strokeLinecap: 'butt',
                                                    textSize: '20px',
                                                    pathTransitionDuration: 0.5,
                                                    pathColor: storedTheme === "true" ? '#fff' : '#000',
                                                    textColor: storedTheme === "true" ? '#fff' : '#000',
                                                    trailColor: storedTheme === "true" ? 'grey' : '#d6d6d6',
                                                })}
                                            />
                                        </div>
                                    }
                                    <TruncatedText text={mainTopic} len={4} />
                                </Navbar.Brand>
                                <Navbar.Collapse>
                                    <div className='hidden md:flex justify-center items-center mb-2 mt-2'>
                                        <p onClick={redirectHome} className='font-normal text-black dark:text-white text-base mr-4'>Home</p>
                                        <p onClick={htmlDownload} className='font-normal text-black dark:text-white text-base mr-4'>Export</p>
                                        <ShareOnSocial
                                            textToShare={sessionStorage.getItem('mName') + " shared you course on " + mainTopic}
                                            link={websiteURL + '/shareable?id=' + courseId}
                                            linkTitle={sessionStorage.getItem('mName') + " shared you course on " + mainTopic}
                                            linkMetaDesc={sessionStorage.getItem('mName') + " shared you course on " + mainTopic}
                                            linkFavicon={logo}
                                            noReferer
                                        >
                                            <button
                                                type="button"
                                                className="bg-transparent"
                                            >
                                                <p className='font-normal text-black dark:text-white text-base mr-4'>Share</p>
                                            </button>
                                        </ShareOnSocial>
                                        <DarkModeToggle />
                                    </div>
                                </Navbar.Collapse>
                            </Navbar>
                            <div className='px-5 bg-white dark:bg-black pt-5'>
                                <p className='font-black text-black dark:text-white text-xl'>{selected}</p>

                                <div className='overflow-hidden mt-5 text-black dark:text-white text-base pb-10 max-w-full'>

                                    {type === 'video & text course' ?
                                        <div>
                                            <YouTube key={media} className='mb-5' videoId={media} opts={opts} />
                                            <StyledText text={theory} />
                                        </div>

                                        :
                                        <div>
                                            <StyledText text={theory} />
                                            <img className='overflow-hidden p-10' src={media} alt="Media" />
                                        </div>
                                    }

                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-col'>
                        <ChatWidget defaultMessage={defaultMessage} defaultPrompt={defaultPrompt} mainTopic={mainTopic} />
                        <NotesWidget courseId={courseId} mainTopic={mainTopic} />
                    </div>
                </div>
            }
        </>
    );
};


export default Course;