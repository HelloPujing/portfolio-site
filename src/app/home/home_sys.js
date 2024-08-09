'use client'
import 'tailwindcss/tailwind.css'
import { useState, useEffect } from 'react';
import Image from 'next/image';

const SYS_PROMPT = "Full body, generating three views, namely front view, side view, and rear view, 3Drender, ocrender, clean background";
// const SYS_PROMPT = "Full body, generating three views, namely front view, side view, and rear view, 3Drender, ocrender, clean background, borderless lines, 4k, high-definition, super circuitous, best quality, super quality, --ar 16:9";
// const SYS_PROMPT = "全身，生成前视、侧视和后视三种视图，3D渲染，oc渲染，干净的背景，无边界的线条，4k，高清，超迂回，最佳质量，超质量，16:9画幅";

const DEFAULT_IMG = 'https://placehold.co/500x400?text=AI+Generated+Image+Here';

function Home() {
    const [text, setText] = useState('');
    const [sys, setSys] = useState(SYS_PROMPT);
    const [style, setStyle] = useState('');
    const [size, setSize] = useState('');
    const [img, setImg] = useState(DEFAULT_IMG);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');



    useEffect(() => {
        // 这里的代码会在组件挂载后执行
        console.log('Component did mount');
        console.log(process.env.NEXT_PUBLIC_APP_ENV);
        console.log(process.env.NEXT_PUBLIC_API_HOST);
    }, []);

    const handleClick = async () => {
        setErrorMessage('');
        if (!text) return;

        setImg(DEFAULT_IMG);
        setLoading(true);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/ai/image/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    prompt: `${text}, ${sys}`,
                    ...size ? { size } : {},
                    ...style ? { style } : {}
                }),
            });
            if (!response.ok) {
                console.log(response)
                setErrorMessage(`网络错误请稍后再试（code: ${response.status}. ${response.statusText}）`)
            } else {
                const data = await response.json();
                setImg(data.image[0]?.url);
            }
        } catch (error) {
            console.log(error)
            setErrorMessage(`网络错误请稍后再试（${error}）`)
        }

        setLoading(false);
    }

    return (
        <div className="w-full h-full flex flex-col  justify-center items-center">

            <h1 className="text-3xl font-bold text-center my-5">
                AI 3 views generator
            </h1>
            <p className="text-center text-gray-500">环境：{process.env.NEXT_PUBLIC_APP_ENV}</p>
            <textarea
                className="border border-gray-300 p-2 w-96 h-32 mb-5 resize-none"
                placeholder="输入角色描述词，例如：一名铁匠，壮实，穿麻布衣服，草鞋，微笑憨厚，手举铁锤，暗黑游戏风格" value={text}
                onChange={e => setText(e.target.value)}
                onClick={e => e.target.select()}
            />
            <textarea
                className="border border-gray-300 p-2 w-96 h-32 mb-5 resize-none"
                placeholder="系统提示词" value={sys}
                onChange={e => setSys(e.target.value)}
            />
            <label className="w-96 h-10 mt-2 mb-1">
                <a className="text-left m-3">风格:</a>
                <select
                    className="border border-gray-300 w-30"
                    onChange={e => setStyle(e.target.value)}
                >
                    <option value=""></option>
                    <option value="vivid">vivid</option>
                    <option value="natural">natural</option>
                </select>
                <a className="text-left m-3">尺寸:</a>
                <select
                    className="border border-gray-300 w-33"
                    onChange={e => setSize(e.target.value)}
                >
                    <option value=""></option>
                    <option value="1024x1024">1024x1024</option>
                    <option value="1792x1024">1792x1024</option>
                    <option value="1024x1792">1024x1792</option>
                </select>
            </label>
            <Image width={100} height={100} className="w-full sm:w-1/2 h-1/2 object-cover" src={img} alt=""></Image>
            <div style={{ color: 'red' }}>{errorMessage}</div>
            <button
                className={`w-32 p-2 bg-blue-600 text-white rounded m-2 hover:bg-blue-500 ${loading ? 'animate-pulse' : ''}`}
                onClick={handleClick}
                disabled={loading}
            >
                {loading ? 'Loading...' : 'Submit'}
            </button>
        </div >
    );
}

export default Home;
