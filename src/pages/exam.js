import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Quiz from 'react-quiz-component';
import { Spinner } from 'flowbite-react';
import axios from 'axios';
import { company, logo, serverURL } from '../constants';

const Exam = () => {

    const { state } = useLocation();
    const { topic, courseId, questions } = state;
    const [examJSON, setExamJSON] = useState({});
    const [completed, setCompleted] = useState(false);
    const [passedQuiz, setPassed] = useState(false);


    useEffect(() => {

        init();

    }, []);

    const setQuizResult = (obj) => {
        if (obj.numberOfCorrectAnswers > 4) {
            setPassed(true);
            const percentage = obj.numberOfCorrectAnswers*10;
            //SEND EMAIL
            sendEmail("You Have Passed The Quiz", "You Have Passed The Quiz 🎉 Successfully with " + percentage + "%")
            updateResult(obj.numberOfCorrectAnswers);
        } else {
            setPassed(false);
        }
        setCompleted(true);
    }

    async function updateResult(correct) {
        const marks = correct*10;
        const marksString = ""+marks;
        await axios.post(serverURL + '/api/updateresult', {courseId, marksString});
    }


    function init() {
        const topLevelKeys = Object.keys(questions)
        const quiz = {
            "quizTitle": topic + " Quiz",
            "quizSynopsis": "Take the quiz on " + topic + " to test your knowledge.\nYou can take infinite attempts to clear the quiz.\nPassing percentage is 50%",
            "progressBarColor": "#008000",
            "nrOfQuestions": "10",
            "questions": questions[topLevelKeys[0]].map((item) => ({
                "question": item.question,
                "questionType": "text",
                "answerSelectionType": "single",
                "answers": item.options,
                "correctAnswer": item.answer === "A" ? "1" :
                    item.answer === "B" ? "2" :
                        item.answer === "C" ? "3" : "4",
                "messageForCorrectAnswer": "Correct",
                "messageForIncorrectAnswer": "Incorrect",
                "explanation": "",
                "point": "10"
            }))

        }
        setExamJSON(quiz);
    }

    // Function to exit full-screen mode
    const exitFullScreen = () => {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) { // Firefox
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) { // Chrome, Safari and Opera
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { // IE/Edge
            document.msExitFullscreen();
        }
        setTimeout(() => {
            window.history.back();
        }, 100);
    };

    async function sendEmail(subject, msg) {
        const userName = sessionStorage.getItem('mName');
        const email = sessionStorage.getItem('email');

        const html = `
        <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
                <meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
                <html lang="en">
                
                  <head></head>
                 <div id="__react-email-preview" style="display:none;overflow:hidden;line-height:1px;opacity:0;max-height:0;max-width:0">${topic} Quiz Result<div> ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿</div>
                 </div>
                
                  <body style="margin-left:auto;margin-right:auto;margin-top:auto;margin-bottom:auto;background-color:rgb(255,255,255);font-family:ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, Arial, &quot;Noto Sans&quot;, sans-serif, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;, &quot;Noto Color Emoji&quot;">
                    <table align="center" role="presentation" cellSpacing="0" cellPadding="0" border="0" width="100%" style="max-width:37.5em;margin-left:auto;margin-right:auto;margin-top:40px;margin-bottom:40px;width:465px;border-radius:0.25rem;border-width:1px;border-style:solid;border-color:rgb(234,234,234);padding:20px">
                      <tr style="width:100%">
                        <td>
                          <table align="center" border="0" cellPadding="0" cellSpacing="0" role="presentation" width="100%" style="margin-top:32px">
                            <tbody>
                              <tr>
                                <td><img alt="Vercel" src="${logo}" width="40" height="37" style="display:block;outline:none;border:none;text-decoration:none;margin-left:auto;margin-right:auto;margin-top:0px;margin-bottom:0px" /></td>
                              </tr>
                            </tbody>
                          </table>
                          <h1 style="margin-left:0px;margin-right:0px;margin-top:30px;margin-bottom:30px;padding:0px;text-align:center;font-size:24px;font-weight:400;color:rgb(0,0,0)">${topic} Quiz Result</strong></h1>
                          <p style="font-size:14px;line-height:24px;margin:16px 0;color:rgb(0,0,0)">Hello <strong>${userName}</strong>,</p>
                          <p style="font-size:14px;line-height:24px;margin:16px 0;color:rgb(0,0,0)">${userName}, ${msg}</p>
                          <p style="font-size:14px;line-height:24px;margin:16px 0;color:rgb(0,0,0)">Best,<p target="_blank" style="color:rgb(0,0,0);text-decoration:none;text-decoration-line:none">The <strong>${company}</strong> Team</p></p>
                          </td>
                      </tr>
                    </table>
                  </body>
                
                </html>
        `;

        try {
            const postURL = serverURL + '/api/sendexammail';
            await axios.post(postURL, { html, email, subjects: subject }).catch(error => {
                console.log(error);
            });
        } catch (error) {
            console.log(error);
        }

    }

    return (
        <div className='h-screen flex flex-col'>
            <div className='dark:bg-black flex flex-1 justify-center items-center'>
                {/* Only show the Quiz component after the examJSON has been populated */}
                {Object.keys(examJSON).length === 0 ? (
                    <div className="text-center h-screen w-screen flex items-center justify-center">
                        <Spinner size="xl" className='fill-black dark:fill-white' />
                    </div>
                ) : (
                    <div className='flex-1 flex justify-center items-center flex-col content-center text-center'>

                        {completed ? <>
                            {passedQuiz ?
                                <>
                                    <p className='text-center font-black text-xl  mt-4 text-black dark:text-white'>You Have Passed The Quiz 🎉</p>
                                </>
                                :
                                <>
                                    <p className='text-center font-black text-xl mt-4 text-black dark:text-white'>You Have Failed The Quiz 😔{'\n'}Try again</p>
                                </>}
                        </> : <></>}

                        <Quiz shuffle={true} quiz={examJSON} onComplete={setQuizResult} />
                        {completed ?
                            <div className='flex flex-col'>
                                <button onClick={() => {
                                    exitFullScreen();
                                }} className='bg-black text-white items-center  justify-center content-center w-52 px-5 py-2 mt-1 mb-4 font-medium dark:bg-white dark:text-black'>
                                    Finish
                                </button>
                            </div>
                            : <></>}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Exam;
