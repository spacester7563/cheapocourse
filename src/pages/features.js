import React from 'react';
import Header from '../components/header';
import Footers from '../components/footers';
import { Card } from 'flowbite-react';
import { IoIosTimer } from "react-icons/io";
import { BsSearch } from "react-icons/bs";
import { PiVideo } from "react-icons/pi";
import { useTranslation } from 'react-i18next';

const Features = () => {
    const { t } = useTranslation();

    const cardsFeatures = [
        {
            id: 1,
            title: t('Topic Input'),
            description: t('Easily enter topics and subtopics with an intuitive interface'),
        },
        {
            id: 2,
            title: t('Course Type Preferences'),
            description: t('Choose between Image + Theory or Video + Theory formats for a personalized learning journey'),
        },
        {
            id: 3,
            title: t('AI-Powered Generation'),
            description: t('Our advanced AI algorithms analyze your inputs to generate comprehensive courses'),
        },
        {
            id: 4,
            title: t('Learning Styles'),
            description: t('Accommodate different learning styles to focus on images, videos, or textual content'),
        },
        {
            id: 5,
            title: t('Personalized Curriculum'),
            description: t('Receive a uniquely crafted curriculum based on your preferences'),
        },
        {
            id: 6,
            title: t('Real-time Preview'),
            description: t('See a real-time preview of your generated course before finalizing'),
        },        {
            id: 7,
            title: t('Multilanguage Courses'),
            description: t('Generate Ai images, videos, or textual courses in 23+ multiple languages'),
        },
        {
            id: 8,
            title: t('Ai Teacher Chat'),
            description: t('Chat with Ai teacher to get answers to your questions while learning'),
        },
        {
            id: 9,
            title: t('Export Course'),
            description: t('Download your generated course in various formats for offline access'),
        },
    ];

    const cardsWork = [
        {
            id: 1,
            title: t('Enter Topics'),
            description: t('Begin the course creation journey by entering your desired topics and a list of subtopics'),
        },
        {
            id: 2,
            title: t('Choose Preferences'),
            description: t('Choose between Image + Theory or Video + Theory formats for a personalized learning journey'),
        },
        {
            id: 3,
            title: t('AI Magic'),
            description: t('Watch as our AI processes your inputs to generate a customized course'),
        }
    ];

    const cardBenefit = [
        {
            id: 1,
            title: t('Time Efficiency'),
            description: t('Save hours of manual planning with instant course generation'),
            icon: <IoIosTimer className="text-xl max-md:text-lg  dark:text-white" />
        },
        {
            id: 2,
            title: t('AI-Enhanced Materials'),
            description: t('Ensure high-quality content with AI-driven recommendations'),
            icon: <BsSearch className="text-xl max-md:text-lg  dark:text-white" />
        },
        {
            id: 3,
            title: t('Interactive Learning'),
            description: t('Keeping users engaged with different of media formats'),
            icon: <PiVideo className="text-xl max-md:text-lg  dark:text-white" />
        }
    ];

    const style = {
        "root": {
            "base": "max-w-sm flex rounded-none border border-black bg-white shadow-none dark:border-white dark:bg-black m-4",
            "children": "flex h-full flex-col justify-center gap-3 p-5",
            "horizontal": {
                "off": "flex-col",
                "on": "flex-col md:max-w-xl md:flex-row"
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
    }

    const styleTwo = {
        "root": {
            "base": "max-w-sm flex rounded-none  bg-white shadow-none dark:bg-black m-4",
            "children": "flex h-full flex-col justify-center gap-3 p-5",
            "horizontal": {
                "off": "flex-col",
                "on": "flex-col md:max-w-xl md:flex-row"
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
    }

    return (
        <div className='h-screen flex flex-col'>
            <Header isHome={false} className="sticky top-0 z-50" />
            <div className='dark:bg-black flex-1'>
                <div className='flex-1 flex flex-col items-center justify-center'>
                    <h1 className="text-6xl font-black mt-14 max-md:text-3xl dark:text-white">{t("Features")}</h1>
                    <p className="text-center text-black mt-6 max-w-2xl font-medium max-md:text-xs dark:text-white">
                        {t("Craft your courses Instantly")}
                    </p>
                    <div className='mt-16 flex flex-wrap items-center justify-center'>
                        {cardsFeatures.map((card) => (
                            <Card key={card.id} theme={style}>
                                <h5 className='text-xl font-black tracking-tight text-black dark:text-white'>
                                    {card.title}
                                </h5>
                                <p className='font-normal text-sm text-black dark:text-white'>{card.description}</p>
                            </Card>
                        ))}
                    </div>
                </div>
                <div className='flex-1 flex flex-col items-center justify-center'>
                    <h1 className="text-4xl font-black mt-14 max-md:text-2xl dark:text-white">{t("Benefits")}</h1>
                    <div className='mt-16 flex flex-wrap items-center justify-center'>
                        {cardBenefit.map((card) => (
                            <Card key={card.id} theme={style}>
                                {card.icon}
                                <h5 className='text-xl font-black tracking-tight text-black dark:text-white'>
                                    {card.title}
                                </h5>
                                <p className='font-normal text-sm text-black dark:text-white'>{card.description}</p>
                            </Card>
                        ))}
                    </div>
                </div>
                <div className='flex-1 flex flex-col items-center justify-center'>
                    <h1 className="text-4xl font-black mt-14 max-md:text-2xl dark:text-white">{t("How It Works")}</h1>
                    <div className='my-16 flex flex-wrap items-center justify-center'>
                        {cardsWork.map((card) => (
                            <Card key={card.id} theme={styleTwo}>
                                <p className='text-black dark:text-white'>{card.id}</p>
                                <h5 className='text-xl font-black tracking-tight text-black dark:text-white'>
                                    {card.title}
                                </h5>
                                <p className='font-normal text-sm text-black dark:text-white'>{card.description}</p>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
            <Footers className="sticky bottom-0 z-50" />
        </div>
    );
};

export default Features;