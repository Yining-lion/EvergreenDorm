const historyVisionData = {
    "修會的緣起": "XXXX年：........\n XXXX年：.........",
    "修會的願景": "XXXX年：........\n XXXX年：.........",
}

export default function HistoryVision() {

    return (
        <div className="bg-white shadow-[var(--shadow-black)] rounded-xs p-4 flex flex-col max-w-3xl mx-auto">
            {Object.entries(historyVisionData).map(([title, content], index) => (
                <div key={index}>
                    <h1 className="text-xl mb-2 text-primary-green">{title}</h1>
                    <hr className="border-t border-gray-400"></hr>
                    <p className="text-base py-5 whitespace-pre-line">{content}</p>
                </div>
            ))}
        </div>
    );
}