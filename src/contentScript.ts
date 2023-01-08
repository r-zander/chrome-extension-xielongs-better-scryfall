import '../styles/decklist-content.scss';
import {ContentScriptFeature, ContentScriptModule} from "./core/ContentScriptModule";
import {DeckTags} from "./deckTags";
import {ViewType} from "./core/ViewType";
import {findViewType} from "./core/ViewTypeMatcher";
import {LayoutFixes} from "./layoutFixes";

let modules: ContentScriptModule[];
let features: { [key in ViewType]: ContentScriptFeature[] };
const debug = true;

function collectModules(): ContentScriptModule[] {
    return [
        new DeckTags(),
        new LayoutFixes(),
    ]
}

async function init() {
    modules = collectModules();

    features = {} as { [key in ViewType]: ContentScriptFeature[] };
    const viewTypes = (Object.keys(ViewType) as Array<keyof typeof ViewType>).map(viewTypeKey => ViewType[viewTypeKey]);
    viewTypes.forEach(viewType => {
        features[viewType] = [];
    });

    for (const module of modules) {
        const moduleFeatures = module.register();

        for (const viewType of viewTypes) {
            if (typeof moduleFeatures[viewType] === 'undefined') {
                continue;
            }

            if (Array.isArray(moduleFeatures[viewType])) {
                features[viewType] = features[viewType].concat(moduleFeatures[viewType]);
            } else {
                features[viewType].push(moduleFeatures[viewType] as ContentScriptFeature);
            }
        }
    }

    const viewType = findViewType();

    if (viewType === ViewType.UNKNOWN) {
        return;
    }

    for (const feature of features[viewType]) {
        if (debug) console.log(feature.constructor.name + '.init');
        await feature.init();
    }
}

// noinspection JSIgnoredPromiseFromCall
init();
