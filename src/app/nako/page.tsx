'use client'
import 'tailwindcss/tailwind.css'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { isMobile as detectMobile } from '@/utils/device';
import { data } from '@/utils/data';
import Image from 'next/image'
import '../../api/axiosInterceptors.js';

function Naco() {
    const [isPending, setIsPending] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        setIsMobile(detectMobile());
        setIsPending(false);
    }, []);

    const [list, setList] = useState([]);
    useEffect(() => {
        axios.post(process.env.NEXT_PUBLIC_API_HOST + '/instruction/list')
            .then(data => setList(data as any))
            .catch(error => console.error('Error:', error));
    }, []);

    if (isPending) return null;

    return isMobile ? <MobileComponent list={list} /> : <WebComponent list={list} />;
}

const LineBlock = ({ coverOssUrl, name, subName, pdfOssUrl }: { coverOssUrl: string, name: string, subName: string, pdfOssUrl: string }) => {
    const [isSpinning, setIsSpinning] = useState(false);
    const onDownload = () => {
        const a = document.createElement('a');
        a.href = pdfOssUrl;
        a.download = 'file.pdf';
        a.click();
        setIsSpinning(true);
        setTimeout(() => setIsSpinning(false), 2000);
    }
    const disabled = isSpinning || !pdfOssUrl;

    return (
        <div className='mb-48 flex flex-row flex-nowrap'>
            <Image width={120} height={160} className="flex-none w-120 h-160 bg-slate-100 rounded-[1rem]" src={coverOssUrl || ''} alt="图片" />
            <div className='ml-16 flex-1 relative'>
                <div className='w-[57rem] text-[5rem] text-[#3D3D3D] text-nowrap '>
                    <p className='overflow-hidden overflow-ellipsis font-bold'>{name}</p>
                    <p className='text-wrap'>{subName}</p>
                </div>
                <button
                    className={`absolute flex justify-center items-center w-88 h-52 bg-[#0073ff] bottom-0 right-0 rounded-[2rem] text-white hover:opacity-80 hover:cursor-pointer ${isSpinning ? 'animate-pulse' : ''} ${disabled ? 'opacity-80' : ''}`}
                    disabled={disabled}
                    onClick={onDownload}
                >
                    <Image width={6} height={6} className='size-[6rem] hover:opacity-90 hover:cursor-pointer ' src="https://global-resource.oss-cn-hangzhou.aliyuncs.com/nakomake/icon/icon_download.png" alt="" />
                </button>
            </div>
        </div >
    )
}

const MobileComponent = ({ list }: { list: { coverOssUrl: string, name: string, subName: string, pdfOssUrl: string }[] }) => {
    return (
        <div className='h-dvh'>
            <head className="fixed top-0 left-0 right-0 z-10 h-96 bg-white flex items-center justify-center shadow-lg">
                {/* logo固定大小了，不会变化，如果改成非px得，不知道为啥要138/46才是正常尺寸，而不是36，有时间需排查 */}
                <Image width={138} height={36} className="w-[138px] h-[36px]" src="https://global-resource.oss-cn-hangzhou.aliyuncs.com/nakomake/logo/nakomake.png" alt="图片" />
            </head>
            <div className='mt-96 w-228 p-32' >
                {list.map((item, index) => <LineBlock key={index} coverOssUrl={item.coverOssUrl} name={item.name} subName={item.subName} pdfOssUrl={item.pdfOssUrl} />)}
            </div>
            <p className='w-auto pb-32 text-center text-[#A4A4A4] text-[3rem] italic '>Children Don&apos;t Grow Up</p>
        </div>
    );
}


// ***********************************************************************************************

const GridBlock = ({ coverOssUrl, name, subName, pdfOssUrl }: { coverOssUrl: string, name: string, subName: string, pdfOssUrl: string }) => {
    const [isSpinning, setIsSpinning] = useState(false);
    const onDownload = () => {
        const a = document.createElement('a');
        a.href = pdfOssUrl;
        // a.download = 'file.pdf';
        a.click();
        setIsSpinning(true);
        setTimeout(() => setIsSpinning(false), 2000);
    }
    const disabled = isSpinning || !pdfOssUrl;
    return (
        <div className='w-[366px] flex flex-row flex-nowrap'>
            <Image width={120} height={160} className="flex-none w-[120px] h-[160px] bg-slate-100 rounded-[4px]" src={coverOssUrl || ''} alt="图片" />
            <div className='ml-[18px] flex-1 relative'>
                <div className='w-[228px] text-[20px] text-[#3D3D3D] text-nowrap '>
                    <p className='overflow-hidden overflow-ellipsis font-bold'>{name}</p>
                    <p className='text-wrap'>{subName}</p>
                </div>
                <button
                    className={`absolute w-[160px] h-[52px] bg-[#0073ff] bottom-0 right-0 rounded-[10px] font-bold text-white text-[18px] hover:opacity-80 hover:cursor-pointer ${isSpinning ? ' animate-pulse' : ''} ${disabled ? 'opacity-80' : ''}`}
                    disabled={disabled}
                    onClick={onDownload}
                >
                    <span className={`block ${isSpinning ? 'animate-pulse' : ''}`}>Download</span>
                </button>
            </div>
        </div >
    )
}

/* 三个链接图，微博等 */
const Icon = ({ img: img, link }: { img: string, link: string }) =>
    <Image width={32} height={32} className='relative bottom-0 size-[32px] hover:opacity-90 hover:cursor-pointer hover:bottom-[2px] transition-all duration-300'
        src={img} alt=""
        onClick={() => window.open(link)}
    />;
const WebComponent = ({ list }: { list: { coverOssUrl: string, name: string, subName: string, pdfOssUrl: string }[] }) => {
    return (
        <div className='fix top-0 bottom-0 left-0 right-0 h-dvh overflow-hidden'>
            <aside className="absolute top-0 bottom-0 left-0 flex flex-col justify-between items-center  w-[276px] h-full flex-none shadow-lg p-[48px]">
                <Image className="w-[180px] h-[47px]" width="180" height="47" src="https://global-resource.oss-cn-hangzhou.aliyuncs.com/nakomake/logo/nakomake.png" alt="图片" />
                <div className='flex flex-col justify-center items-center'>
                    <div className='flex w-[144px] justify-between'>
                        <Icon
                            img="https://global-resource.oss-cn-hangzhou.aliyuncs.com/nakomake/icon/icon_instagram.png"
                            link="https://www.instagram.com/nakomake?igsh=NGVrcjY4Y2Z5N2Vx&utm_source=qr"
                        />
                        <Icon
                            img='https://global-resource.oss-cn-hangzhou.aliyuncs.com/nakomake/icon/icon_bilibili.png'
                            link='https://space.bilibili.com/3057054?spm_id_from=333.337.search-card.all.click'
                        />
                        <Icon
                            img='https://global-resource.oss-cn-hangzhou.aliyuncs.com/nakomake/icon/icon_weibo.png'
                            link='https://weibo.com/u/1633695287'
                        />
                    </div>
                    <p className='mt-[12px] text-center font-bold text-[#3D3D3D] text-[16px] '>@ NakoMake</p>
                </div>
            </aside>
            <div className='ml-[276px] h-full overflow-x-scroll'>
                <div className='my-[120px] mx-[90px] min-w-[800px] grid grid-cols-2 gap-[48px]' >
                    {list.map((item, index) => <GridBlock key={index} coverOssUrl={item.coverOssUrl} name={item.name} subName={item.subName} pdfOssUrl={item.pdfOssUrl} />)}
                </div>
                <p className='my-[12px] text-center text-[#A4A4A4] text-[18px] italic '>Children Don&apos;t Grow Up</p>
            </div>
        </div>
    );
}

export default Naco;
