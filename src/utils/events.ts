import EventEmitter3 from "eventemitter3";

let instance: EventEmitter | null = null;

export class EventEmitter extends EventEmitter3 {
    constructor() {
        super();
    }

    static getInstance() {
        if (instance == null) {
            instance = new EventEmitter();
        }
        return instance;
    }
}

export enum GameEvents {
    getProfile = "getProfile",
    profileLoaded = "profileLoaded",
    waveCountUpdated = "waveCountUpdated",
    creditsUpdated = "creditsUpdated",
    adjustCredits = "adjustCredits",
    levelUpShip = "levelUpShip",
    shipLeveled = "shipLeveled",
    getRandomEquipment = "getRandomEquipment",
    loadNewEquipment = "loadNewEquipment",
    levelUpEquipment = "levelUpEquipment",
    equipItem = "equipItem",
    refreshProfile = "refreshProfile",
}

export enum SceneEvents {
    gameLoaded = "gameLoaded",
    startWave = "startWave",
    endWave = "endWave",
    waveCompleted = "waveCompleted",
    waveInitializing = "waveInitializing",
    vanguardStarted = "vanguardStarted",
    vanguardEnded = "vanguardEnded",
    vanguardComplete = "vanguardComplete",
}
