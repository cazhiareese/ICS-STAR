import React from 'react';
import starImage from "../../assets/star.png"; // Make sure the path is correct

function StarConstellationLoading({ size = 100 }) {
    const stars = [
        { cx: 10, cy: 50 },
        { cx: 30, cy: 50 },
        { cx: 50, cy: 50 },
        { cx: 70, cy: 50 },
        { cx: 90, cy: 50 },
    ];

    const starSize = 16; // Bigger size than before

    return (
        <div role="status" style={{ width: size, height: size }}>
            <svg
                viewBox="0 0 100 100"
                xmlns="http://www.w3.org/2000/svg"
                width={size}
                height={size}
            >
                {stars.map((star, index) => (
                    <image
                        key={index}
                        href={starImage}
                        x={star.cx - starSize / 2}
                        y={star.cy - starSize / 2}
                        width={starSize}
                        height={starSize}
                        className="animate-star"
                        style={{
                            animationDelay: `${index * 0.5}s`,
                        }}
                    />
                ))}
            </svg>
            <span className="sr-only">Loading...</span>

            <style>{`
                .animate-star {
                    opacity: 0;
                    animation: appear 2.5s infinite;
                }

                @keyframes appear {
                    0% { opacity: 0; }
                    10% { opacity: 1; }
                    30% { opacity: 1; }
                    40% { opacity: 0; }
                    100% { opacity: 0; }
                }
            `}</style>
        </div>
    );
}

export default StarConstellationLoading;
