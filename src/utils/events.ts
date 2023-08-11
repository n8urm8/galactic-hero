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
    gameLoaded = "gameLoaded",
    getProfile = "getProfile",
    profileLoaded = "profileLoaded",
    waveCompleted = "waveCompleted",
    startWave = "startWave",
    endWave = "endWave",
    waveInitializing = "waveInitializing",
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
