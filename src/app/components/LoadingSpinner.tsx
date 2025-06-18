export default function LoadingSpinner() {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <img src="/images/catLoading.gif" className="size-25"></img>
            <p className="mt-4 text-gray-600 text-lg">載入中...</p>
        </div>
    )
}      