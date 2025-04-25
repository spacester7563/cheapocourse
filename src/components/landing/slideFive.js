import React from 'react';
import { Avatar, Blockquote, Rating } from 'flowbite-react';
import { review, from, photoURL, profession} from '../../constants';
import { useTranslation } from 'react-i18next';

const SlideFive = () => {
    const { t } = useTranslation();
    return (
     <div className='dark:bg-black'>
           <figure className="max-w-screen-md mx-auto py-16 flex flex-col items-center dark:bg-black">
            <div className="mb-4 flex items-center">
                <Rating size="md">
                    <Rating.Star color='black' className='dark:fill-white' />
                    <Rating.Star color='black' className='dark:fill-white' />
                    <Rating.Star color='black' className='dark:fill-white' />
                    <Rating.Star color='black' className='dark:fill-white' />
                    <Rating.Star color='black' className='dark:fill-white'  />
                </Rating>
            </div>
            <Blockquote>
                <p className="text-1xl max-md:text-lg max-md:px-2 font-bold text-black dark:text-white text-center">
                  {t(review)}
                </p>
            </Blockquote>
            <figcaption className="mt-6 flex items-center space-x-3">
                <Avatar rounded size="xs" img={photoURL} alt={t("profile picture")} />
                <div className="flex items-center divide-x-2 divide-black dark:divide-white">
                    <cite className="pr-3 font-bold text-black dark:text-white">{t(from)}</cite>
                    <cite className="pl-3 text-sm font-normal text-black dark:text-white">{t(profession)}</cite>
                </div>
            </figcaption>
        </figure>
     </div>
    );
};

export default SlideFive;