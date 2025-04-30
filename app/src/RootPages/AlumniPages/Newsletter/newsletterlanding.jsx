import { useEffect, useState } from "react";
import { Search, Calendar } from "lucide-react";
import star from "../../../assets/star.png";
import "../../../index.css";
import { select } from "framer-motion/client";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export const Cards = ({ id, title, date, description, imageUrl, tags, onTagClick, selectedTags }) => {
    const navigate = useNavigate();

    // const formatDate = (utcDate) => {
    //     const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true };
    //     return new Date(utcDate).toLocaleString('en-US', options);
    // };
const User = localStorage.getItem("token");
let tokentype = "guest";
let userid = true;


if (User) {
  try {
    const decoded = jwtDecode(User);
    tokentype = decoded.role;
    userid = decoded.sub;
    console.log("Decoded token:", decoded);
    console.log("User ID:", userid);
    console.log("Token type:", tokentype);
  } catch (error) {
    console.error("Invalid token:", error);
  }
} else {
  console.log("No token found, defaulting to guest.");
}

    return (
        <div className="w-full h-110 rounded-2xl m-auto max-w-100 min-w-70 relative  border-gray-300 border shadow-md p-5">
            <div className=" "
            onClick={() => navigate(`/${tokentype}/newsletter/${id}`)}
        >
                <div className="flex flex-col h-full ">
                    <div className="w-full h-45 bg-primary rounded-lg overflow-hidden">
                        <img src={imageUrl} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex flex-col mt-4 flex-grow">
                        <p className="text-2xl font-bold text-gray-800 line-clamp-2">{title}</p>
                        <p className="text-sm text-gray-500 mt-1 flex items-center ">
                            <span className="mr-2"><Calendar className="w-5 h-5" /></span>
                            {date}
                        </p>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-3">{description}</p>
                    </div>
                    
                </div>
            </div>
            <div className="flex flex-row sm:mt-4 space-x-2 overflow-x-scroll absolute bottom-2 left-5 right-5 py-3">
                        {tags.map((tag, index) => (
                            <span
                                key={index}
                                onClick={() => onTagClick(tag)}
                                className={`sm:px-4 px-2 sm:py-1 py-0.5 border rounded-2xl cursor-pointer transition font-satoshi-main-regular whitespace-nowrap font-satoshi-light sm:text-md text-sm ${
                                    selectedTags.includes(tag.name)
                                        ? "bg-primary text-white"
                                        : "bg-white border-primary text-primary hover:bg-primary hover:text-white"
                                }`}
                            >
                                {tag}
                            </span>
                        ))}
            </div>
        </div>
        
    );
};

export const SkeletonCards = () => {
    return (
        <div className="w-full h-110 rounded-2xl m-auto max-w-100 min-w-70 border-gray-200 border shadow-md p-5">
            <div className="flex flex-col h-full">
                <div className="w-full h-45 bg-gray-300 rounded-lg overflow-hidden"></div>
                <div className="flex flex-col mt-4 flex-grow">
                    <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                </div>
                <div className="flex flex-row mt-4 space-x-2 overflow-x-scroll">
                    <div className="h-8 w-20 bg-gray-300 rounded-full"></div>
                    <div className="h-8 w-24 bg-gray-300 rounded-full"></div>
                    <div className="h-8 w-16 bg-gray-300 rounded-full"></div>
                </div>
            </div>
        </div>
    );
};




const NewsletterLanding = () => {
    const [card, setCard] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);

    const URL = import.meta.env.VITE_BACKEND_URL;

    const toggleTagSelection = (tagName) => {
        setSelectedTags((prevSelectedTags) =>
            prevSelectedTags.includes(tagName)
                ? prevSelectedTags.filter((tag) => tag !== tagName)
                : [...prevSelectedTags, tagName]
        );
    };
    const mockCards = [
        {
            id: 1,
            title: "Lorem Ipsum Lorem Ipsum Lorem Lorem...",
            date: "2025-02-24T09:00:00Z",
            description: "Medium priority is given to this feature. This serves as a communication channel integrated into the website to keep its users updated about event...",
            imageUrl: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
            tags: ["Technology", "Science"]
        },
        {
            id: 2,
            title: "Exploring the Future of AI and Robotics",
            date: "2025-03-10T14:00:00Z",
            description: "An in-depth look at how AI and robotics are shaping the future of industries and everyday life...",
            imageUrl: "https://images.unsplash.com/photo-1581091870622-1c6d5f3f2c4f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
            tags: ["Technology", "Education"]
        },
        {
            id: 3,
            title: "Health and Wellness in the Modern Era",
            date: "2025-04-05T11:00:00Z",
            description: "Discover the latest trends and tips for maintaining a healthy lifestyle in today's fast-paced world...",
            imageUrl: "https://images.unsplash.com/photo-1556228724-4b1aa6a36b51?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
            tags: ["Health", "Lifestyle"]
        },
        {
            id: 4,
            title: "The Rise of Sustainable Business Practices",
            date: "2025-05-15T16:00:00Z",
            description: "How businesses are adopting sustainable practices to protect the environment and ensure long-term growth...",
            imageUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
            tags: ["Business", "Environment"]
        },
        {
            id: 5,
            title: "Top Travel Destinations for 2025",
            date: "2025-06-20T09:00:00Z",
            description: "Explore the most popular travel destinations for the year and plan your next adventure Explore the most popular travel destinations for the year and plan your next adventure...",
            imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
            tags: ["Travel", "Lifestyle"]
        },
        {
            id: 6,
            title: "Breakthroughs in Medical Science",
            date: "2025-07-08T13:00:00Z",
            description: "A look at the latest breakthroughs in medical science and their impact on healthcare...",
            imageUrl: "https://images.unsplash.com/photo-1580281657521-6bfc0b4d0f4b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
            tags: ["Health", "Science"]
        },
        {
            id: 7,
            title: "The Evolution of Entertainment Technology",
            date: "2025-08-12T18:00:00Z",
            description: "From streaming services to virtual reality, explore how technology is transforming entertainment...",
            imageUrl: "https://images.unsplash.com/photo-1513351105277-d4edcf4cf8f2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
            tags: ["Entertainment", "Technology"]
        },
        {
            id: 8,
            title: "The Role of Education in a Digital World",
            date: "2025-09-30T10:00:00Z",
            description: "How digital tools and platforms are reshaping the way we learn and teach...",
            imageUrl: "https://images.unsplash.com/photo-1584697964154-3c1b5f3c6c9f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
            tags: ["Education", "Technology"]
        }
        
    ];

    // useEffect(() => {
    //     setCard(mockCards);
    // }, []);

    const mockTag = [
        { id: 1, name: "Technology" },
        { id: 2, name: "Health" },
        { id: 3, name: "Education" },
        { id: 4, name: "Business" },
        { id: 5, name: "Entertainment" },
        { id: 6, name: "Sports" },
        { id: 7, name: "Science" },
        { id: 8, name: "Travel" },
        { id: 9, name: "Lifestyle" },
        { id: 10, name: "Environment" }
    ];

    const [tags, setTags] = useState(null);



    const initializeTags = (tagData) => {
        setTags(
            tagData.map((tag, index) => ({
                id: index + 1,
                name: tag
            }))
        );
    };

    const filteredCards = selectedTags.length
    ? card.filter((item) =>
          item.tags.some((tag) => selectedTags.includes(tag))
      )
    : card;

    useEffect(() => {
        const fetchTags = async () => {
            try {
                const response = await axios.get(`${URL}/api/newsletter/tags`);
                initializeTags(response.data);
                console.log(response.data)
            } catch (error) {
                console.error("Error fetching tags:", error);
            }
        };

        const fetchNewsletters = async () => {
            try {
                const response = await axios.get(`${URL}/api/newsletter/all`);
                setCard(response.data);
                console.log(response.data);
            } catch (error) {
                console.error("Error fetching newsletters:", error);
            }
        };

        fetchNewsletters();

        fetchTags();
    }, []);
    
    return (
        <div className={`flex-1 overflow-y-hidden sm:mx-10 md:mx-15 lg:mx-20 mx-3`}>
            <div className="flex w-full h-20 border border-gray-300 shadow-lg items-center justify-center rounded-b-2xl">
                <div className="flex flex-row w-3/5 relative">
                    <input
                        type="text"
                        placeholder="Search newsletters..."
                        className="w-full sm:h-14 h-10 px-4 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="flex items-center justify-center absolute sm:w-20 w-10 bg-primary sm:h-14 h-10 rounded-3xl right-0">
                        <Search className="sm:w-7 sm:h-7 h-5 w-5 text-white mr" />
                    </div>
                </div>
            </div>
            { card.length>0 && tags!=null? 

            (<><div className={`h-7 flex flex-row items-center justify-start mt-7`}>
                <div className="flex overflow-x-auto space-x-4 py-4">
                    {tags.map((tag) => (
                        <div
                            key={tag.id}
                            onClick={() => toggleTagSelection(tag.name)}
                            className={`px-4 py-1 border rounded-2xl cursor-pointer transition font-satoshi-main-regular whitespace-nowrap ${
                                selectedTags.includes(tag.name)
                                    ? "bg-primary text-white"
                                    : "bg-white border-primary text-primary hover:bg-primary hover:text-white"
                            }`}
                        >
                            {tag.name}
                        </div>
                    ))}
                </div>
            </div>
            <div
                className="grid flex-1 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 mt-8 overflow-y-auto"
                style={{ height: `calc(100vh - 18rem)` }} // Adjust height dynamically based on remaining space
            >
                {filteredCards.map((item) => (
                    <Cards
                        key={item.newsletter_id}
                        id={item.newsletter_id}
                        title={item.title}
                        date={item.date_posted}
                        description={item.content}
                        imageUrl={item.image}
                        tags={item.tags}
                        onTagClick={toggleTagSelection}
                        selectedTags={selectedTags}
                    />
                ))}
            </div></>) : <div className="animate-pulse">
            
            <div className={`h-7 flex flex-row items-center justify-start mt-7`}>
                <div className="flex overflow-x-auto space-x-4 py-4">
                    <div className={`px-4 py-4 w-30 border border-gray-300 bg-gray-300 rounded-2xl cursor-pointer transition font-satoshi-main-regular`}></div>
                    <div className={`px-4 py-4 w-40 border border-gray-300 bg-gray-300 rounded-2xl cursor-pointer transition font-satoshi-main-regular`}></div>
                    <div className={`px-4 py-4 w-50 border border-gray-300 bg-gray-300 rounded-2xl cursor-pointer transition font-satoshi-main-regular`}></div>
                    <div className={`px-4 py-4 w-30 border border-gray-300 bg-gray-300 rounded-2xl cursor-pointer transition font-satoshi-main-regular`}></div>
                    <div className={`px-4 py-4 w-40 border border-gray-300 bg-gray-300 rounded-2xl cursor-pointer transition font-satoshi-main-regular`}></div>
                    <div className={`px-4 py-4 w-40 border border-gray-300 bg-gray-300 rounded-2xl cursor-pointer transition font-satoshi-main-regular`}></div>
                </div>
            </div>
            <div
                className="grid flex-1 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 mt-8 overflow-y-auto"
                style={{ height: `calc(100vh - 20rem)` }} // Adjust height dynamically based on remaining space
            >
                <SkeletonCards/>
                <SkeletonCards/>
                <SkeletonCards/>
                <SkeletonCards/>
                <SkeletonCards/>
                <SkeletonCards/>
                
            </div>
                
            
            
            </div>
                
            }
            
        </div>
    );
};

export default NewsletterLanding;
