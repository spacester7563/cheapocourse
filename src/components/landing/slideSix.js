import React from 'react';
import { usePWAInstall } from 'react-use-pwa-install'

const SlideSix = () => {
    const install = usePWAInstall()
    return (
        <div className='dark:bg-black px-6 pb-16 pt-10'>
            {install &&
                <div className="flex flex-col max-md:items-center justify-between border border-black bg-white py-10 px-16 dark:border-white dark:bg-black md:flex-row">
                    <div className="mb-4 md:mb-0 md:mr-4 max-md:text-center">
                        <h2 className="mb-2 text-4xl max-md:text-2xl font-black dark:text-white">Desktop App</h2>
                        <p className="md:mr-48 items-center font-normal max-md:text-xs text-black dark:text-white">
                            Create personalized courses, interact with an AI teacher, access content offline{'\n'}and test your knowledge with AI-generated quizzes all in one desktop app.
                        </p>
                    </div>
                    <div className="flex flex-shrink-0 items-center">
                        <p onClick={install}
                            className="mr-2 inline-flex items-center justify-center bg-black text-white px-3 py-2 font-medium dark:bg-white dark:text-black"
                        >
                            Download
                        </p>
                    </div>
                </div>
            }
        </div>
    );
};

export default SlideSix;
