import Image from "next/image";

const pxToRem = (px) => {
    return px / 16 + 'rem';
}

const NavBar = () => {
    return (
        <div className="h-24 flex items-center justify-center shadow-lg">
            <Image width={36} height={9} className="w-36 h-9" src="https://web-bq-resource.oss-cn-hangzhou.aliyuncs.com/images-nako/nakomake.png" alt="图片" />
        </div>
    );
}

export default NavBar;