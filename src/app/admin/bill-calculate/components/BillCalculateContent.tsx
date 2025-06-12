"use client";

import CaculateAndMessages from "./CaculateAndMessages";
import CaculateExcelExportButton from "./CaculateExcelExportButton";
import PublicBathsElec from "./PublicBathsElec";
import RoomsElec from "./RoomsElec";

export default function BillCalculateContent() {

    return (
        <div>
            <div className="mb-10">
                <PublicBathsElec />
                <RoomsElec />
                <CaculateAndMessages />
            </div>
            <div>
                <CaculateExcelExportButton />
            </div>
        </div>
    );
}
