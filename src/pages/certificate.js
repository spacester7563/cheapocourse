import React, { useEffect, useRef, useState } from 'react';
import Header from '../components/header';
import Footers from '../components/footers';
import { Button } from 'flowbite-react';
import { AiOutlineLoading } from 'react-icons/ai';
import Logos from '../res/img/certificate.png';
import logo from '../res/img/logo.svg';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { toPng } from 'html-to-image';
import { name } from '../constants';

const Certificate = () => {

    const [processing, setProcessing] = useState(false);
    const userName = sessionStorage.getItem('mName');
    const { state } = useLocation();
    const navigate = useNavigate();
    const { courseTitle, end } = state || {};

    const pdfRef = useRef(null);

    const handleDownload = async () => {
        setProcessing(true);
        toPng(pdfRef.current, { cacheBust: false })
            .then((dataUrl) => {
                console.log(dataUrl);
                const link = document.createElement("a");
                link.download = "certificate.png";
                link.href = dataUrl;
                link.click();
                showToast("Downloaded")
            })
            .catch((err) => {
                //DO NOTHING
            });
    };


    useEffect(() => {

        if (!courseTitle) {
            navigate("/create");
        }

    }, []);

    function isValidFormat(dateString) {
        // Regex to check if date is in M/D/YY format
        const regex = /^([1-9]|1[0-2])\/([1-9]|[1-2][0-9]|3[0-1])\/\d{2}$/;
        return regex.test(dateString);
    }

    function formatDateToMDYY(date) {
        // Create a Date object from the ISO string
        const dateObj = new Date(date);

        // Handle invalid date scenarios
        if (isNaN(dateObj.getTime())) {
            throw new Error("Invalid date");
        }

        // Format the date to M/D/YY
        const month = dateObj.getMonth() + 1; // No leading zero
        const day = dateObj.getDate();
        const year = dateObj.getFullYear().toString().slice(-2); // Last two digits of the year

        return `${month}/${day}/${year}`;
    }

    function checkAndFormatDate(dateString) {
        if (isValidFormat(dateString)) {
            return dateString; // Already in M/D/YY format
        } else {
            // Assume input is in ISO 8601 format if not already valid
            return formatDateToMDYY(dateString);
        }
    }


    const showToast = async (msg) => {
        setProcessing(false);
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
        <div className='h-screen flex flex-col'>
            <Header isHome={true} className="sticky top-0 z-50" />
            <div className='dark:bg-black flex-1'>
                <div className='flex-1 flex flex-col items-center justify-center py-8'>
                    <p className='text-center font-black text-4xl text-black dark:text-white'>Congratulations🎉</p>
                    <p className='text-center font-normal text-black py-4 dark:text-white'><strong>{userName}</strong> on completion of course <strong>{courseTitle}</strong>. <br></br> Download your certificate</p>
                    <Button onClick={handleDownload} isProcessing={processing} processingSpinner={<AiOutlineLoading className="h-6 w-6 animate-spin" />} className='items-center justify-center rounded-none text-center dark:bg-white  bg-black text-white dark:text-black font-bold max-w-sm enabled:hover:bg-black enabled:focus:bg-black enabled:focus:ring-transparent dark:enabled:hover:bg-black dark:enabled:focus:bg-black dark:enabled:focus:ring-transparent' type="submit">Download</Button>
                </div>
                <div className='relative lg:mx-40 max-lg:m-20 max-md:m-2'>
                    <div ref={pdfRef}>
                        <img src={Logos} alt="logo" />
                        <p className='absolute text-4xl font-black italic max-lg:text-2xl max-md:text-xl' style={{ top: '47%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                            {sessionStorage.getItem('mName')}
                        </p>
                        <p className='absolute text-xl font-medium max-lg:text-lg max-md:text-[9px]' style={{ top: '67.5%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                            on {checkAndFormatDate(end)}
                        </p>
                        <div className='absolute' style={{ top: '63%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                            <p className='text-xl font-bold capitalize max-lg:text-lg max-md:text-[9px]'>
                                {courseTitle}
                            </p>
                        </div>
                        <div className='absolute' style={{ top: '83%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                            <img style={{ width: '15%', height: '15%', justifySelf: 'center' }} src={logo} />
                            <p className='text-xl justify-center self-center text-center font-semibold max-lg:text-lg max-md:text-xs'>
                                {name}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <Footers className="sticky bottom-0 z-50" />
        </div>
    );
};

export default Certificate;