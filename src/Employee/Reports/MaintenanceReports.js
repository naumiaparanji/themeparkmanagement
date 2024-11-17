import {MaintenanceDataBox} from "../Maintenance/MaintenanceEdit";
import {RandomBGImg} from "../../Auth/AuthComponents";

export function MaintenanceReportsView(props) {
    return (
        <div className="container">
            <RandomBGImg/>
            <MaintenanceDataBox
                title={props.title || "Maintenance Report"}
                apiPath={props.apiPath || "/maintenance/data"}
                isReport={true}
            />
        </div>
    );
}
