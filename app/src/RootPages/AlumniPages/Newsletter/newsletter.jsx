import React, { useEffect, useState } from 'react';
import { Calendar } from 'lucide-react';
import BackButton from '../../../components/backbutton';
import { Cards } from './newsletterlanding';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const SkeletonCard = () => (
    <div className="flex flex-col h-[75vh] lg:w-[80%] md:w-[70%] rounded-2xl min-w-70 sm:border-gray-200 sm:border sm:shadow-md mt-5 sm:p-5 animate-pulse">
        <div className="w-full min-h-60 max-h-60 bg-gray-300 rounded-lg"></div>
        <div className="flex flex-col mt-4 flex-grow space-y-3">
            <div className="h-6 bg-gray-300 rounded w-3/4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            <div className="flex flex-wrap my-5 mt-5 space-x-2">
                <div className="h-6 bg-gray-300 rounded-full w-16"></div>
                <div className="h-6 bg-gray-300 rounded-full w-20"></div>
                <div className="h-6 bg-gray-300 rounded-full w-12"></div>
            </div>
            <div className="h-70 bg-gray-300 rounded"></div>
        </div>
    </div>
);

const SkeletonMoreLikeThis = () => (
    <div className="sm:my-3 animate-pulse">
        <div className="h-40 w-full bg-gray-300 rounded-lg"></div>
        <div className="mt-3 h-4 bg-gray-300 rounded w-3/4"></div>
        <div className="mt-2 h-4 bg-gray-300 rounded w-1/2"></div>
    </div>
);

const Newsletter = () => {
    const [newsletter, setNewsletter] = useState(null);
    const { newsletterid } = useParams();
    const URL = import.meta.env.VITE_BACKEND_URL;
    const [forYou, setForYou] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${URL}/api/newsletter/${newsletterid}`);
                const result = await response.json();
                setNewsletter(result);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        const fetchMoreLikeThis = async () => {
            try {
                const response = await axios.get(`${URL}/api/newsletter/more_like_this/${newsletterid}?skip=0&limit=100`);
                setForYou(response.data);
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    setForYou([]);
                } else {
                    console.error('Error fetching similar newsletters:', error);
                }
            }
        };

        fetchMoreLikeThis();
        fetchData();
    }, [newsletterid]);

    return (
        <div className="flex flex-col space-x-10 mx-10 my-10">
            <div className="lg:mx-20">
                <BackButton />
            </div>
            <div className="flex md:flex-row flex-col sm:space-x-5 justify-center lg:mx-20 xl:mx-20 xl:space-x-40">
            {newsletter ? (
                <div className="flex flex-col h-full lg:w-[80%] md:w-[70%] rounded-2xl min-w-70 sm:border-gray-200 sm:border sm:shadow-md mt-5 sm:p-5">
                    
                        <>
                            <div className="w-full min-h-60 max-h-60 bg-primary rounded-lg overflow-hidden">
                                <img src={newsletter.image} alt="" className="w-full h-full object-cover" />
                            </div>
                            <div className="flex flex-col mt-4 flex-grow">
                                <p className="text-2xl font-bold text-gray-800">{newsletter.title}</p>
                                <p className="text-sm text-gray-500 mt-5 flex items-center">
                                    <span className="mr-2">
                                        <Calendar className="w-5 h-5" />
                                    </span>
                                    {newsletter.date_posted}
                                </p>
                                <div className="flex flex-wrap my-5 mt-5">
                                    {newsletter.tags &&
                                        newsletter.tags.map((tag, index) => (
                                            <span
                                                key={index}
                                                className="bg-secondary text-primary text-xs font-satoshi-regular mr-2 mb-2 px-3 py-1 rounded-full"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                </div>
                                <p className="text-sm text-gray-600 min-h-50">{newsletter.content}</p>
                            </div>
                            {newsletter.links != null && (
                                <div className="flex flex-col-reverse w-full space-x-2 overflow-x-scroll h-20 overflow-y-auto mt-5">
                                    {newsletter.links.map((link, index) => (
                                        <a
                                            key={index}
                                            href={link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`py- text-sm rounded-full cursor-pointer text-primary font-satoshi-regular`}
                                        >
                                            {link}
                                        </a>
                                    ))}
                                    <label className="text-gray-400 font-satoshi-light text-md">Relevant links</label>
                                </div>
                            )}
                        </>
                    
                </div>)

                : (
                    <SkeletonCard />
                )}
                <div className="flex-col items-center justify-center md:w-[50%] xl:w-[30%] sm:mt-5 mt-10 md:h-[70vh]">
                    <label className="text-primary font-satoshi-bold text-3xl lg:mx-0 sm:mx-5">More like this</label>
                    <div className="mt-3 flex md:flex-col flex-row md:h-[70vh] overflow-y-auto md:space-x-0 space-x-5 py-3">
                        {forYou != null && forYou.length > 0 ? (
                            forYou.map((item) => (
                                <div key={item.newsletter_id} className="sm:my-3">
                                    <Cards
                                        key={item.newsletter_id}
                                        id={item.newsletter_id}
                                        title={item.title}
                                        date={item.date_posted}
                                        description={item.content}
                                        imageUrl={item.image}
                                        tags={item.tags}
                                        selectedTags={[]}
                                    />
                                </div>
                            ))
                        ) : forYou === null ? (
                            <>
                                <SkeletonMoreLikeThis />
                                <SkeletonMoreLikeThis />
                                <SkeletonMoreLikeThis />
                            </>
                        ) : (
                            <p className="text-gray-500">No similar newsletters found.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Newsletter;