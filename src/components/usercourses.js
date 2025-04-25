import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { serverURL } from '../constants';
import { Card, Spinner } from 'flowbite-react';
import { useNavigate } from 'react-router-dom';
import found from '../res/img/found.svg';

const UserCourses = ({ userId }) => {
    const [courses, setCourses] = useState([]);
    const [processing, setProcessing] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);

    const fetchUserCourses = useCallback(async () => {
        setProcessing(page === 1);
        setLoadingMore(page > 1);
        const postURL = `${serverURL}/api/courses?userId=${userId}&page=${page}&limit=9`;
        try {
            const response = await axios.get(postURL);
            if (response.data.length === 0) {
                setHasMore(false);
            } else {
                setCourses((prevCourses) => [...prevCourses, ...response.data]);
            }
        } catch (error) {
            console.error("Error fetching courses:", error);
        } finally {
            setProcessing(false);
            setLoadingMore(false);
        }
    }, [userId, page]);

    useEffect(() => {
        fetchUserCourses();
    }, [fetchUserCourses]);

    const handleScroll = useCallback(() => {
        if (!hasMore || loadingMore) return;
        const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
        if (scrollTop + clientHeight >= scrollHeight - 100) {
            setPage((prevPage) => prevPage + 1);
        }
    }, [hasMore, loadingMore]);

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [handleScroll]);

    const navigate = useNavigate();
    const redirectGenerate = () => navigate("/create");

    const handleCourse = async (content, mainTopic, type, courseId, completed, end) => {

        const postURL = serverURL + '/api/getmyresult';
        const response = await axios.post(postURL, { courseId });
        console.log(response.data.lang)
        if (response.data.success) {
            const jsonData = JSON.parse(content);
            sessionStorage.setItem('courseId', courseId);
            sessionStorage.setItem('first', completed);
            sessionStorage.setItem('jsonData', JSON.stringify(jsonData));
            let ending = '';
            if (completed) ending = end;
            navigate('/course', {
                state: {
                    jsonData,
                    mainTopic: mainTopic.toUpperCase(),
                    type: type.toLowerCase(),
                    courseId,
                    end: ending,
                    pass: response.data.message,
                    lang: response.data.lang
                }
            });
        }else{
            const jsonData = JSON.parse(content);
            sessionStorage.setItem('courseId', courseId);
            sessionStorage.setItem('first', completed);
            sessionStorage.setItem('jsonData', JSON.stringify(jsonData));
            let ending = '';
            if (completed) ending = end;
            navigate('/course', {
                state: {
                    jsonData,
                    mainTopic: mainTopic.toUpperCase(),
                    type: type.toLowerCase(),
                    courseId,
                    end: ending,
                    pass: false,
                    lang: response.data.lang
                }
            });
        }
    };

    const handleCertificate = (mainTopic, end) => {
        const ending = new Date(end).toLocaleDateString();
        navigate('/certificate', { state: { courseTitle: mainTopic, end: ending } });
    };

    const style = {
        "root": {
            "base": "flex flex-col rounded-none border border-black bg-white shadow-none dark:border-white dark:bg-black mx-2 my-4",
            "children": "flex h-full flex-col justify-center gap-3 p-5",
            "horizontal": {
                "off": "flex-col",
                "on": "flex-col md:flex-row"
            },
            "href": "hover:bg-white dark:hover:bg-black"
        },
        "img": {
            "base": "",
            "horizontal": {
                "off": "rounded-none",
                "on": "h-96 w-full rounded-none object-cover md:h-auto md:w-48 md:rounded-none md:rounded-l-lg"
            }
        }
    };

    return (
        <div className='my-4'>
            {processing ? (
                <div className="text-center h-screen w-screen flex items-center justify-center">
                    <Spinner size="xl" className='fill-black dark:fill-white' />
                </div>
            ) : (
                <>
                    {courses.length === 0 ? (
                        <div className="text-center h-center flex flex-col items-center justify-center">
                            <img alt='img' src={found} className='max-w-sm h-3/6' />
                            <p className='text-black font-black dark:text-white text-xl'>Nothing Found</p>
                            <button onClick={redirectGenerate} className='bg-black text-white px-5 py-2 mt-4 font-medium dark:bg-white dark:text-black'>
                                Generate Course
                            </button>
                        </div>
                    ) : (
                        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
                            {courses.map((course) => (
                                <div key={course._id} className='w-full'>
                                    <Card theme={style} imgSrc={course.photo}>
                                        <h5 className='text-xl font-black tracking-tight text-black dark:text-white' style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                            {course.mainTopic.toUpperCase()}
                                        </h5>
                                        <p className='font-normal text-sm capitalize text-black dark:text-white'>
                                            {course.type}
                                        </p>
                                        <p className='font-normal text-sm text-black dark:text-white'>
                                            {new Date(course.date).toLocaleDateString()}
                                        </p>
                                        <div className='flex-row flex space-x-4'>
                                            <button onClick={() => handleCourse(course.content, course.mainTopic, course.type, course._id, course.completed, course.end)} className='bg-black text-white px-5 py-2 font-medium dark:bg-white dark:text-black'>
                                                Continue
                                            </button>
                                            {course.completed ? (
                                                <button onClick={() => handleCertificate(course.mainTopic, course.end)} className='border-black text-black border px-5 py-2 font-medium dark:border-white dark:text-white'>
                                                    Certificate
                                                </button>
                                            ) : null}
                                        </div>
                                    </Card>
                                </div>
                            ))}
                        </div>
                    )}
                    {loadingMore && (
                        <div className="text-center my-4">
                            <Spinner size="lg" className='fill-black dark:fill-white' />
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default UserCourses;
