"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const Alexa = __importStar(require("ask-sdk"));
const ask_sdk_1 = require("ask-sdk");
const isIntent_1 = require("./isIntent");
const CancelOrStopIntentHandler = {
    canHandle: isIntent_1.isIntent("AMAZON.CancelIntent", "AMAZON.StopIntent"),
    handle(handlerInput) {
        return handlerInput.responseBuilder
            .speak("Goodbye!")
            .withShouldEndSession(true)
            .getResponse();
    },
};

const YesIntent = {
    canHandle: isIntent_1.isIntent("AMAZON.YesIntent", "AMAZON.StopIntent"),
    handle(handlerInput) {
        return handlerInput.responseBuilder
            .speak("Yes!")
            .withShouldEndSession(true)
            .getResponse();
    },
};

const HelpIntentHandler = {
    canHandle: isIntent_1.isIntent("AMAZON.HelpIntent"),
    handle(handlerInput) {
        return handlerInput.responseBuilder
            .speak("Try saying hello!")
            .getResponse();
    },
};
const RollDiceIntentHandler = {
    canHandle(handlerInput) {
        return (Alexa.getRequestType(handlerInput.requestEnvelope) === "LaunchRequest" ||
            isIntent_1.isIntent("RollDiceIntentHandler")(handlerInput));
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder
            .speak("Roll dice!")
            .withShouldEndSession(true)
            .getResponse();
    },
};
const ContinueGameHandler = {
    canHandle(handlerInput) {
        return (Alexa.getRequestType(handlerInput.requestEnvelope) === "LaunchRequest" ||
            isIntent_1.isIntent("ContinueGameHandler")(handlerInput));
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder
            .speak("Roll dice!")
            .withShouldEndSession(true)
            .getResponse();
    },
};
function ErrorHandler(handlerInput, error) {
    return handlerInput.responseBuilder
        .speak(` <amazon:emotion name="excited" intensity="high">
          Abort mission, repeating, abort mission!
        </amazon:emotion>
        <sub alias=",">${ask_sdk_1.escapeXmlCharacters(error.message)}</sub>`)
        .withShouldEndSession(true)
        .getResponse();
}
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(CancelOrStopIntentHandler, HelpIntentHandler, RollDiceIntentHandler,YesIntent,ContinueGameHandler)
    .addErrorHandler(() => true, ErrorHandler)
    .lambda();
//# sourceMappingURL=index.js.map