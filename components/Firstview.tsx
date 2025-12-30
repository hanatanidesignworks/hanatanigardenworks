export default function FirstView(){
 return(
    <div className="w-full h-[100px] flex justify-center">
        <div className="relative w-full md:w-[768px] h-full bg-[url('../public/prauning__w768__h100.jpg')] bg-cover bg-center">
            <div className="absolute inset-0 bg-black/30 z-10"></div>
            <div className="absolute z-20">
                <h1 className="text-xl text-white pl-2 pt-4" style={{fontFamily: "Hachi Maru Pop"}}>
                    庭師、<br />仕事を取りに行く。
                </h1>
            </div>
        </div>
    </div>
 )   
}