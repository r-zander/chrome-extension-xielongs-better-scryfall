import {ContentScriptModule, FeaturePerView} from "../core/ContentScriptModule";
import {ViewType} from "../core/ViewType";
import {ShortenEditDeckButtonText} from "./deckOverview/ShortenEditDeckButtonText";
import {ShortenMoreActionsButtonText} from "./deckOverview/ShortenMoreActionsButtonText";
import {HideOwnerColumn} from "./deckOverview/HideOwnerColumn";

export class LayoutFixes implements ContentScriptModule {
    register(): FeaturePerView {
        return {
            [ViewType.DECKS_OVERVIEW]: [
                new ShortenEditDeckButtonText(),
                new ShortenMoreActionsButtonText(),
                new HideOwnerColumn(),
            ]
        };
    }

}
