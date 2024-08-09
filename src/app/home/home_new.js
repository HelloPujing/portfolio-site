'use client'
import 'tailwindcss/tailwind.css'
import React, {useState, useEffect} from 'react';
import {isMobile as detectMobile} from "@/utils/device";
import Image from 'next/image';


const SYS_PROMPT = "Full body, generating three views, namely front view, side view, and rear view, 3Drender, ocrender, clean background, borderless lines";
// const SYS_PROMPT = "Full body, generating three views, namely front view, side view, and rear view, 3Drender, ocrender, clean background, borderless lines, 4k, high-definition, super circuitous, best quality, super quality, --ar 16:9";
// const SYS_PROMPT = "全身，生成前视、侧视和后视三种视图，3D渲染，oc渲染，干净的背景，无边界的线条，4k，高清，超迂回，最佳质量，超质量，16:9画幅";

const DEFAULT_IMG = 'https://placehold.co/500x400?text=AI+Generated+Image+Here';

function formatDate(timestamp) {
    let datetime = new Date(timestamp);
    var year = datetime.getFullYear(),
        month = ("0" + (datetime.getMonth() + 1)).slice(-2),
        date = ("0" + datetime.getDate()).slice(-2),
        hour = ("0" + datetime.getHours()).slice(-2),
        minute = ("0" + datetime.getMinutes()).slice(-2),
        second = ("0" + datetime.getSeconds()).slice(-2);
    // 拼接
    var result = hour + ":" + minute + " " + date + "/" + month + "/" + year;
    // 返回
    return result;
}

function Home() {
    const [isMobile, setIsMobile] = useState(false);

    const [text, setText] = useState('');
    const [style, setStyle] = useState('');
    const [size, setSize] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [histories, setHistories] = useState([]);

    const [selectedImage, setSelectedImage] = useState(null);
    const [showSelectedImage, setShowSelectedImage] = useState(false);


    useEffect(() => {
        // 这里的代码会在组件挂载后执行
        console.log('Component did mount');
        console.log(process.env.NEXT_PUBLIC_APP_ENV);
        console.log(process.env.NEXT_PUBLIC_API_HOST);

        setIsMobile(detectMobile());

        // 加载缓存
        const historyCache = localStorage.getItem('historyCache');
        console.log("加载缓存：" + historyCache);
        if (historyCache) {
            setHistories(JSON.parse(historyCache));
        }
    }, []);

    const openSelectedImage = (image) => {
        setSelectedImage(image);
        setShowSelectedImage(true);
    };

    const closeSelectedImage = () => {
        setShowSelectedImage(false);
    };

    const handleClick = async () => {
        setErrorMessage('');
        if (!text) return;

        setLoading(true);

        const newRequest = {
            prompt: text, // 简单地将用户 ID 设置为当前用户数量加一
            pics: 'waiting.gif',
            timestamp: new Date().getTime(),
            latest: true,
        };
        if (histories[0]) {
            histories[0].latest = false;
        }
        const newHistories = [newRequest, ...histories]
        setHistories(newHistories)

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/ai/image/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    prompt: `${text} + ${SYS_PROMPT}`,
                    ...size ? {size} : {},
                    ...style ? {style} : {}
                }),
            });
            if (!response.ok) {
                console.log(response)
                setErrorMessage(`网络错误请稍后再试（code: ${response.status}. ${response.statusText}）`)
            } else {
                const data = await response.json();
                newRequest.pics = data.image[0]?.url;
                setHistories(newHistories)

                // 缓存数据
                localStorage.setItem('historyCache', JSON.stringify(newHistories.slice(0, 10)));
            }
        } catch (error) {
            console.log(error)
            setErrorMessage(`网络错误请稍后再试（${error}）`)
        }

        setLoading(false);
    }

    return !isMobile ? (
            <div className="w-[1280px] h-[832px] flex justify-center items-center">
                <div className="mt-[5px] w-[350px] h-full">
                    <Image width="83" height="21" className="w-[83px] h-[21px] ml-[50px]" src="/logo.png" alt='' />
                    <div className="w-[220px] h-[30px] ml-[50px]">
                        <p className="text-[12px]">AI-based game character generator for game designers</p>
                    </div>
                </div>
                <div className="mt-[5px] ml-[10px] w-full h-full">
                    <div
                        className="flex flex-col justify-between border border-gray-300 bg-[#F2F2F2] w-full h-[167px] mt-[21px] p-[10px] rounded-[4px]">
                    <textarea
                        className="text-[16px] text-[#000000] p-[10px] bg-[#F2F2F2] h-full mb-[10px] focus:outline-none"
                        onChange={e => setText(e.target.value)}
                        onClick={e => e.target.select()}
                        placeholder="goblin with wings trying to fly from the ground, with swords in both hands and a bow on the back. modern style clothing like in cyberpunk"
                    />
                        <button
                            className={`bg-[#F81273] text-white text-[16px] italic w-[120px] h-[36px] rounded-full ${loading ? 'animate-pulse' : ''}`}
                            onClick={handleClick}
                            disabled={loading}
                        >
                            generate &gt;
                        </button>
                    </div>
                    <div className="border-t border-dashed border-[#C4C4C4] my-4"></div>
                    <div>
                        {histories.map((historiy) => (
                            <div key={historiy.timestamp} className="flex justify-between w-full h-[151px] mt-[21px]">
                                <div className="border border-gray-300 bg-[#F2F2F2] w-[220px] h-full rounded">
                                    <Image width="100" height="100" className="w-full h-full" onClick={() => openSelectedImage(historiy.pics)} src={historiy.pics} alt='' />
                                </div>
                                <div className="flex flex-col w-full h-full ml-[10px] rounded">
                                    <div className="flex w-full h-[14px]">
                                        {historiy.latest ?
                                            <div
                                                className="w-[25px] bg-[#F81273] text-[10px] pl-[2px] text-[#FFFFFF] rounded-full">
                                                new
                                            </div> : null}
                                        <div className="text-[#757575] text-[10px] w-full h-full ml-[5px]">
                                            <a>{formatDate(historiy.timestamp)}</a>
                                        </div>
                                    </div>

                                    <div className="text-[#000000] text-[14px] w-full h-full m-[5px]">
                                        <a>{historiy.prompt}</a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                {showSelectedImage && (
                    <div className='fixed inset-x-0 inset-y-0 bg-gray-600 bg-opacity-50' onClick={() => closeSelectedImage()}>
                        <div className='absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2' onblur={() => closeSelectedImage()}>
                            <Image width="100" height="100" className="w-full h-full" src={selectedImage} alt='' />
                            <button onClick={closeSelectedImage}>Close</button>
                        </div>
                    </div>
                )}
            </div>
        )
        :
        (
            <div className="flex flex-col w-full h-full p-[20rem]">
                <div className="w-[350rem] h-full">
                    <Image width="100" height="100" className="w-[124.5rem] h-[30.88rem] mb-[10rem]" src="/logo.png" alt='' />
                    <div className="w-[220rem] h-[30rem]">
                        <p className="text-[12rem]">AI-based game character generator for game designers</p>
                    </div>
                </div>
                <textarea
                    className="mt-[30rem] text-[16rem] text-[#000000] p-[10rem] border border-gray-300 bg-[#F2F2F2] h-[121rem] rounded-[4rem] focus:outline-none"
                    onChange={e => setText(e.target.value)}
                    placeholder="goblin with wings trying to fly from the ground, with swords in both hands and a bow on the back. modern style clothing like in cyberpunk"
                />
                <button
                    className={`mt-[15rem] bg-[#F81273] text-white text-[19rem] italic w-full h-[36rem] rounded-full ${loading ? 'animate-pulse' : ''}`}
                    onClick={handleClick}
                    disabled={loading}
                >
                    generate &gt;
                </button>
                <div className="mt-[15rem] border-t border-dashed border-[#C4C4C4] my-4"></div>

                {histories.map((historiy) => (
                    <div key={historiy.timestamp} className="flex flex-col w-full mt-[15rem]">
                        <div className="border border-gray-300 w-full h-[220rem] rounded-[5rem]">
                            <Image width="100" height="100" className="w-full h-full rounded-[5rem]" src={historiy.pics} alt='' />
                        </div>
                        <div className="flex flex-col w-full h-full rounded">
                            <div className="flex w-full h-[14rem] mt-[10rem]">
                                {historiy.latest ?
                                    <div
                                        className="w-[26rem] bg-[#F81273] text-[10rem] pl-[2rem] text-[#FFFFFF] rounded-full">
                                        new
                                    </div> : null}
                                <div className="text-[#757575] text-[10rem] w-full h-full ml-[5rem]">
                                    <a>{formatDate(historiy.timestamp)}</a>
                                </div>
                            </div>
                            <div className="text-[#000000] text-[14rem] w-full h-full mt-[10rem] mb-[15rem]">
                                <a>{historiy.prompt}</a>
                            </div>
                        </div>
                    </div>
                ))}

            </div>
        );
}

export default Home;
