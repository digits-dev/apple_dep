import React, { useState, useEffect } from "react";

const Slider = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const slides = [
        <div
            key={1}
            className="bg-white h-[464.5px] w-[284px] flex items-center justify-center"
        >
            <div className="font-nunito-sans font-bold text-[24px]">
                welcome
            </div>
        </div>,
        <div
            key={2}
            className="bg-mobile-gradient h-[464.5px] w-[284px] flex items-center justify-center flex-col px-5 gap-y-4"
        >
            <div className="flex">
                <img
                    src="/images/login-page/btb-logo-white.png"
                    className="w-[63px] h-63px]"
                />
                <div className="h-[57px] w-[2px] bg-white ml-[9px] mr-[18px]"></div>
                <img
                    src="/images/login-page/digits-logo.png"
                    className="w-[48px] h-[57px]"
                />
            </div>
            <p className="text-white font-nunito-sans font-bold text-[20px] text-center">
                Device Enrollment Program
            </p>
        </div>,
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) =>
                prev === slides.length - 1 ? 0 : prev + 1
            );
        }, 5000);

        return () => clearInterval(interval);
    }, [slides.length]);

    return (
        <div className="relative w-full max-w-3xl mx-auto">
            <div className="w-full h-full overflow-hidden">
                <div
                    className="flex transition-transform duration-700 ease-in-out"
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                    {slides.map((slide, index) => (
                        <div key={index} className="w-full h-full">
                            {slide}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Slider;
