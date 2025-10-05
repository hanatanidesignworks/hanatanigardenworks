export default function FirstView(){
 return(
    <div className="w-full h-[100px] flex justify-center">
        <div className="relative w-full md:w-[768px] h-full bg-[url('../public/prauning__w768__h100.jpg')] bg-cover bg-center">
            <div className="absolute inset-0 bg-black/30 z-10"></div>
            <div className="absolute z-20">
                <h1 className="text-xl text-white pl-2 pt-4">
                    庭師とWEB制作の二刀流で迷走中。<br />失敗しても前を向く起業ブログ！
                </h1>
            </div>
        </div>
    </div>
 )   
}