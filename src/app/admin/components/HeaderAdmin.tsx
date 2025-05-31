export default function HeaderAdmin() {

    return (
        <header className="w-full sticky top-0 h-[70px] border-b-1 border-admin-gray bg-white z-1 flex justify-between items-center">
            <div className="w-[90%] lg:w-[98%] m-auto flex justify-between items-center">
                <p className="text-primary-green text-2xl">長青宿舍後台管理</p>
                <div className="flex items-center">
                    <img src="/icons/member/Headshot.svg" className="size-10 mr-2" />
                    <p>管理員，您好！</p>
                </div>

            </div>
        </header>
    )
}