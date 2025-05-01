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

    const [query, setQuery] = useState('');

    const [loading, setLoading] = useState(false)
    const URL = import.meta.env.VITE_BACKEND_URL;

    const toggleTagSelection = (tagName) => {

        setSelectedTags((prevSelectedTags) =>
            prevSelectedTags.includes(tagName)
                ? prevSelectedTags.filter((tag) => tag !== tagName)
                : [...prevSelectedTags, tagName]
        );
    };

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

    const [filteredCards, setFilteredCards] = useState(null);

    const fetchFilteredCards = async () => {
        if (!card.length) return; // Wait for cards to be fetched first
        
        if (selectedTags.length > 0 || query.trim()!=="") {
            setLoading(true)
            try {
                const params = new URLSearchParams();
                if (query.trim() !== "") {
                    params.append("title", query.trim());
                }
                if (selectedTags.length) {
                    selectedTags.forEach((tag) => params.append("tags", tag));
                }
                
                params.append("limit", 8);
                
                const response = await axios.get(`${URL}/search-newsletters?${params.toString()}`);
                console.log("Hello  World", params.toString())
                setFilteredCards(response.data);
                console.log(selectedTags.length>0);
                
                setLoading(false)
            } catch (error) {
                console.error("Error fetching filtered newsletters:", error);
            }
        } else {
            console.log("I am here SDFOSDGLFJSDFKLJDSKLFJKLDSJKLFJSDKLJKLDSJFKLS")
            console.log(selectedTags)
            setFilteredCards(card);
            
        }
    };

    useEffect(() => {
        

        fetchFilteredCards();
    }, [selectedTags, card]);

    useEffect(() => {
        const fetchTags = async () => {
            try {
                const response = await axios.get(`${URL}/api/newsletter/tags`);
                initializeTags(response.data);
                console.log(response.data);
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
        <>
        <div className="flex flex-col w-full shadow-md pb-8 items-center rounded-b-[35px] bg-white mb-4">
  <div className="relative flex flex-col w-full max-w-[350px] sm:max-w-[600px] mt-6">
    <input
      type="text"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Search newsletters..."
      className="bg-gray-100 font-satoshi-medium text-lg w-full px-4 py-3 pr-14 rounded-2xl text-black border border-gray-300 focus:border-primary focus:outline-none focus:ring-0"
    />
    <button onClick={fetchFilteredCards}
    className="absolute right-0 top-0 h-full bg-primary text-white p-3 rounded-2xl hover:brightness-125 flex items-center justify-center w-12 cursor-pointer">
      <Search size={20} />
    </button>
  </div>
</div>
        <div className={`flex-1 overflow-y-hidden sm:mx-10 md:mx-15 lg:mx-20 mx-3`}>


            { (card.length>0 && tags!=null) ? 

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
                className={`grid flex-1 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 mt-8 overflow-y-auto ${loading? "animate-pulse":""}`}
                style={{ height: `calc(100vh - 18rem)` }} // Adjust height dynamically based on remaining space
            >
                {loading==false && filteredCards ? filteredCards.map((item) => (
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
                )):

                    <>
                    <SkeletonCards/>
                    <SkeletonCards/>
                    <SkeletonCards/>
                    <SkeletonCards/>

                    </>
                }
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
                
            </div>
                
            
            
            </div>
                
            }
            
        </div>
        </>
    );
};

export default NewsletterLanding;
