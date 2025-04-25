import React, { useEffect, useState } from 'react';
import img from '../../src/res/img/signin.svg';
import { Flowbite, Navbar } from 'flowbite-react';
import { Button, Label } from 'flowbite-react';
import { facebookClientId, name, serverURL, websiteURL } from '../constants';
import DarkModeToggle from '../components/DarkModeToggle';
import LogoComponent from '../components/LogoComponent';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { AiOutlineLoading } from 'react-icons/ai';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import FacebookLogin from '@greatsumini/react-facebook-login';
import { useTranslation } from 'react-i18next';

const SignIn = () => {
    const { t } = useTranslation();
    const storedTheme = sessionStorage.getItem('darkMode');
    const [email, setEmail] = useState('');
    const [processing, setProcessing] = useState(false);
    const [password, setPassword] = useState('');

    const navigate = useNavigate();
    function redirectSignUp() {
        navigate("/signup");
    }

    function redirectForgot() {
        navigate("/forgot");
    }

    function redirectHome() {
        navigate("/home");
    }

    useEffect(() => {

        if (sessionStorage.getItem('auth')) {
            redirectHome();
        }

    }, []);

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

    const handleSignin = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            showToast(t('Please fill in all required fields'));
            return;
        }
        const postURL = serverURL + '/api/signin';
        try {
            setProcessing(true);
            const response = await axios.post(postURL, { email, password });
            if (response.data.success) {
                showToast(response.data.message);
                sessionStorage.setItem('email', response.data.userData.email);
                sessionStorage.setItem('mName', response.data.userData.mName);
                sessionStorage.setItem('auth', true);
                sessionStorage.setItem('uid', response.data.userData._id);
                sessionStorage.setItem('type', response.data.userData.type);
                if (sessionStorage.getItem('shared') === null) {
                    redirectHome();
                } else {
                    getDataFromDatabase(sessionStorage.getItem('shared'));
                }
            } else {
                showToast(response.data.message);
            }
        } catch (error) {
            showToast(t('Internal Server Error'));
        }
    };

    async function getDataFromDatabase(id) {
        const postURL = serverURL + `/api/shareable?id=${id}`;
        try {
            const response = await axios.get(postURL);
            const dat = response.data[0].content;
            const jsonData = JSON.parse(dat);
            let type = response.data[0].type.toLowerCase();
            let mainTopic = response.data[0].mainTopic;
            const user = sessionStorage.getItem('uid');
            const content = JSON.stringify(jsonData);

            const postURLs = serverURL + '/api/courseshared';
            const responses = await axios.post(postURLs, { user, content, type, mainTopic });
            if (responses.data.success) {
                sessionStorage.removeItem('shared');
                redirectHome();
            } else {
                redirectHome();
            }
        } catch (error) {
            console.log(error)
            redirectHome();
        }
    }

    return (
        <Flowbite>
            <div className="flex h-screen dark:bg-black no-scrollbar">

                <div className="flex-1 overflow-y-auto no-scrollbar">

                    <Navbar fluid className='p-8 dark:bg-black'>
                        <Navbar.Brand href={websiteURL} className="ml-1">
                            <LogoComponent isDarkMode={storedTheme} />
                            <span className="self-center whitespace-nowrap text-2xl font-black dark:text-white ">{name}</span>
                        </Navbar.Brand>
                        <DarkModeToggle />
                    </Navbar>

                    <form onSubmit={handleSignin} className="max-w-sm m-auto py-9 no-scrollbar">

                        <h1 className='text-center font-black text-5xl text-black dark:text-white'>{t('SignIn')}</h1>
                        <p className='text-center font-normal text-black py-4 dark:text-white'>{t('Enter email & password to continue')}</p>

                        <div className='py-10'>
                            <div className='mb-6'>
                                <div className="mb-2 block">
                                    <Label className="font-bold text-black dark:text-white" htmlFor="email1" value={t("Email")} />
                                </div>
                                <input onChange={(e) => setEmail(e.target.value)} className='focus:ring-black focus:border-black border border-black font-normal bg-white rounded-none block w-full dark:bg-black dark:border-white dark:text-white' id="email1" type="email" />
                            </div>
                            <div className='mb-4'>
                                <div className="mb-2 block">
                                    <Label className="font-bold text-black dark:text-white" htmlFor="password1" value={t("Password")} />
                                </div>
                                <input onChange={(e) => setPassword(e.target.value)} className='focus:ring-black focus:border-black border border-black font-normal bg-white rounded-none block w-full dark:bg-black dark:border-white dark:text-white' id="password1" type="password" />
                            </div>
                            <div className="flex items-center mb-10">
                                <p onClick={redirectForgot} className='text-center font-normal text-black underline dark:text-white'>{t('Forgot Password ?')}</p>
                            </div>
                            <Button isProcessing={processing} processingSpinner={<AiOutlineLoading className="h-6 w-6 animate-spin" />} className='items-center justify-center text-center dark:bg-white dark:text-black bg-black text-white font-bold rounded-none w-full enabled:hover:bg-black enabled:focus:bg-black enabled:focus:ring-transparent dark:enabled:hover:bg-white dark:enabled:focus:bg-white dark:enabled:focus:ring-transparent' type="submit">{t('Submit')}</Button>
                            <p onClick={redirectSignUp} className='text-center font-normal text-black underline py-4  dark:text-white'>{t("Don't have an account ? SignUp")}</p>

                            {/* <GoogleLogin
                                theme='outline'
                                type='standard'
                                width={400}
                                onSuccess={async (credentialResponse) => {
                                    const decoded = jwtDecode(credentialResponse.credential);
                                    let email = decoded.email;
                                    let name = decoded.name;
                                    const postURL = serverURL + '/api/social';
                                    try {
                                        setProcessing(true);
                                        const response = await axios.post(postURL, { email, name });
                                        if (response.data.success) {
                                            showToast(response.data.message);
                                            sessionStorage.setItem('email', decoded.email);
                                            sessionStorage.setItem('mName', decoded.name);
                                            sessionStorage.setItem('auth', true);
                                            sessionStorage.setItem('uid', response.data.userData._id);
                                            sessionStorage.setItem('type', response.data.userData.type);
                                            redirectHome();
                                        } else {
                                            showToast(response.data.message);
                                        }
                                    } catch (error) {
                                        showToast('Internal Server Error');
                                    }

                                }}
                                onError={() => {
                                    showToast('Internal Server Error');
                                }}
                            />

                            <FacebookLogin
                                appId={facebookClientId}
                                style={{
                                    backgroundColor: '#4267b2',
                                    color: '#fff',
                                    fontSize: '15px',
                                    padding: '8px 24px',
                                    width: '104%',
                                    border: 'none',
                                    marginTop: '16px',
                                    borderRadius: '0px',
                                }}
                                onFail={(error) => {
                                    showToast('Internal Server Error');
                                }}
                                onProfileSuccess={async (response) => {
                                    let email = response.email;
                                    let name = response.name;
                                    const postURL = serverURL + '/api/social';
                                    try {
                                        setProcessing(true);
                                        const response = await axios.post(postURL, { email, name });
                                        if (response.data.success) {
                                            showToast(response.data.message);
                                            sessionStorage.setItem('email', response.email);
                                            sessionStorage.setItem('mName', response.name);
                                            sessionStorage.setItem('auth', true);
                                            sessionStorage.setItem('uid', response.data.userData._id);
                                            sessionStorage.setItem('type', response.data.userData.type);
                                            redirectHome();
                                        } else {
                                            showToast(response.data.message);
                                        }
                                    } catch (error) {
                                        showToast('Internal Server Error');
                                    }
                                }}
                            /> */}

                        </div>

                    </form>
                </div>

                <div className="flex-1 hidden lg:flex items-center justify-center bg-gray-50 dark:bg-white">
                    <img
                        src={img}
                        className="h-full bg-cover bg-center p-9"
                        alt="Background"
                    />
                </div>
            </div>
        </Flowbite>
    );
};

export default SignIn;