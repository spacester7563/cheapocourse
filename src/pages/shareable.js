import React, { useEffect } from 'react';
import axios from 'axios';
import { serverURL } from '../constants';
import { Spinner } from 'flowbite-react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Shareable = () => {
    const navigate = useNavigate();
    useEffect(() => {
        const query = new URLSearchParams(window.location.search);
        const id = query.get('id');

        if (!id) {
            showToast("Course doesn't exist");
            navigate("/create");
        } else {
            getDataFromDatabase(id);
        }

    }, []);

    async function getDataFromDatabase(id) {
        const postURL = serverURL + `/api/shareable?id=${id}`;
        try {
            const response = await axios.get(postURL);
            const dat = response.data[0].content;
            const jsonData = JSON.parse(dat);
            sessionStorage.setItem('courseId', id);
            sessionStorage.setItem('first', response.data[0].completed);
            sessionStorage.setItem('jsonData', JSON.stringify(jsonData));
            let type = response.data[0].type.toLowerCase();
            let mainTopic = response.data[0].mainTopic;
            if (sessionStorage.getItem('uid') === null) {
                sessionStorage.setItem('shared', id);
                navigate('/course', { state: { jsonData: jsonData, mainTopic: mainTopic.toUpperCase(), type: type, courseId: id, end: '', pass: false } });
            } else {
                const user = sessionStorage.getItem('uid');
                const content = JSON.stringify(jsonData);
                const postURLs = serverURL + '/api/courseshared';
                const responses = await axios.post(postURLs, { user, content, type, mainTopic });
                if (responses.data.success) {
                    sessionStorage.setItem('courseId', responses.data.courseId);
                    sessionStorage.setItem('first', responses.data.completed);
                    sessionStorage.setItem('jsonData', JSON.stringify(jsonData));
                    navigate('/course', { state: { jsonData: jsonData, mainTopic: mainTopic.toUpperCase(), type: type.toLowerCase(), courseId: responses.data.courseId, end: '', pass: false } });
                } else {
                    sessionStorage.setItem('shared', id);
                    navigate('/course', { state: { jsonData: jsonData, mainTopic: mainTopic.toUpperCase(), type: type, courseId: id, end: '', pass: false } });
                }
            }
        } catch (error) {
            showToast("Course doesn't exist");
            navigate("/create");
        }
    }

    const showToast = async (msg) => {
        toast(msg, {
            position: "bottom-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined
        });
    }

    return (
        <div className="text-center h-screen w-screen flex items-center justify-center">
            <Spinner size="xl" className='fill-black dark:fill-white' />
        </div>
    );
};

export default Shareable;
