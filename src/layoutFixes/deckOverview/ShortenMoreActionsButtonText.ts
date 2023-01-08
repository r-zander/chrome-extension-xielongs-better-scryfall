import {ContentScriptFeature} from "../../core/ContentScriptModule";

export class ShortenMoreActionsButtonText implements ContentScriptFeature {
    async init() {
        document.querySelectorAll('.control-panel-table td:last-of-type .dropdown-menu > button > i')
            .forEach(link => {
                link.textContent = 'More';
            });
    }

}
