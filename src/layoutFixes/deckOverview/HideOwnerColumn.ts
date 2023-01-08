import {ContentScriptFeature} from "../../core/ContentScriptModule";

export class HideOwnerColumn implements ContentScriptFeature {
    async init() {
        document.querySelectorAll('.control-panel-table tr > *:nth-child(3)')
            .forEach(cell => {
                cell.remove()
            });
    }

}
