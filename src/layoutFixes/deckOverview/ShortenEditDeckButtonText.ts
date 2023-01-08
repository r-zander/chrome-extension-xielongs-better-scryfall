import {ContentScriptFeature} from "../../core/ContentScriptModule";

export class ShortenEditDeckButtonText implements ContentScriptFeature {
    async init() {
        document.querySelectorAll('.control-panel-table td:last-of-type a.button-n[href$="/build"] > i')
            .forEach(link => {
                link.textContent = 'Edit';
            });
    }

}
