import React from 'react';
import LogoComponent from '../../components/LogoComponent';
import { MdSpaceDashboard } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import { PiVideoFill } from "react-icons/pi";
import { FaDollarSign } from "react-icons/fa";
import { MdSettingsInputComponent } from "react-icons/md";
import { AiFillMessage } from "react-icons/ai";
import { IoIosDocument } from "react-icons/io";
import { Sidebar } from 'flowbite-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const AdminSidebar = () => {
    const { t } = useTranslation();

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

    const navigate = useNavigate();
    function redirectDashBoard() {
        navigate("/dashBoard");
    }
    function redirectUsers() {
        navigate("/users");
    }
    function redirectCourses() {
        navigate("/courses");
    }
    function redirectPaid() {
        navigate("/paid");
    }
    function redirectContacts() {
        navigate("/contacts");
    }
    function redirectAdmins() {
        navigate("/admins");
    }
    function redirectTerms() {
        navigate("/editterms");
    }
    function redirectRefund() {
        navigate("/editrefund");
    }
    function redirectPrivacy() {
        navigate("/editprivacy");
    }
    function redirectBilling() {
        navigate("/editbilling");
    }
    function redirectCancel() {
        navigate("/editcancellation");
    }


    return (
        <Sidebar
            theme={style}
            aria-label="Default sidebar example">
            <LogoComponent isDarkMode={false} />
            <Sidebar.Items className='mt-8'>
                <div className='flex flex-row items-center' onClick={redirectDashBoard}>
                    <MdSpaceDashboard size={18} />
                    <p className='font-bold text-base ml-2 '>{t("DashBoard")}</p>
                </div>
                <div className='flex flex-row items-center mt-6' onClick={redirectUsers}>
                    <FaUsers size={18} />
                    <p className='font-bold text-base ml-2'>{t("Users")}</p>
                </div>
                <div className='flex flex-row items-center mt-6' onClick={redirectCourses}>
                    <PiVideoFill size={18} />
                    <p className='font-bold text-base ml-2'>{t("Courses")}</p>
                </div>
                <div className='flex flex-row items-center mt-6' onClick={redirectPaid}>
                    <FaDollarSign size={18} />
                    <p className='font-bold text-base ml-2'>{t("Paid Users")}</p>
                </div>
                <div className='flex flex-row items-center mt-6' onClick={redirectAdmins}>
                    <MdSettingsInputComponent size={18} />
                    <p className='font-bold text-base ml-2'>{t("Admins")}</p>
                </div>
                <div className='flex flex-row items-center mt-6' onClick={redirectContacts}>
                    <AiFillMessage size={18} />
                    <p className='font-bold text-base ml-2'>{t("Contacts")}</p>
                </div>
                <div className='flex flex-row items-center mt-6' onClick={redirectTerms}>
                    <IoIosDocument size={18} />
                    <p className='font-bold text-base ml-2'>{t("Terms")}</p>
                </div>
                <div className='flex flex-row items-center mt-6'  onClick={redirectPrivacy}>
                    <IoIosDocument size={18} />
                    <p className='font-bold text-base ml-2'>{t("Privacy")}</p>
                </div>
                <div className='flex flex-row items-center mt-6' onClick={redirectCancel}>
                    <IoIosDocument size={18} />
                    <p className='font-bold text-base ml-2'>{t("Cancellation")}</p>
                </div>
                <div className='flex flex-row items-center mt-6'  onClick={redirectRefund}>
                    <IoIosDocument size={18} />
                    <p className='font-bold text-base ml-2'>{t("Refund")}</p>
                </div>
                <div className='flex flex-row items-center mt-6' onClick={redirectBilling}>
                    <IoIosDocument size={18} />
                    <p className='font-bold text-base ml-2'>{t("Subscription & Billing")}</p>
                </div>
            </Sidebar.Items>
        </Sidebar>
    );
};

export default AdminSidebar;