export default function LoadingSpinner() {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <div className="size-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600 text-lg">載入中...</p>
        </div>
    )
}      
