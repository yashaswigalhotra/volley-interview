import * as Alexa from "ask-sdk";
import { escapeXmlCharacters } from "ask-sdk";
import { isIntent } from "./isIntent";

const LaunchRequestHandler: Alexa.RequestHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "LaunchRequest"
    );
  },
  handle(handlerInput) {
    const speakOutput = "Welcome to Roll Dice Game. Lets play (Say roll dice)";

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse();
  },
};

let score = 0;
let k = 0;
let speechText = "";
const RollDiceIntentHandler: Alexa.RequestHandler = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === "IntentRequest" &&
      handlerInput.requestEnvelope.request.intent.name === "RollDiceIntent"
    );
  },
  handle(handlerInput) {
    const roll = Math.floor(Math.random() * 6) + 1;
    k = k + 1;
    if (roll === 1) {
      score = 0;
      speechText = `Oops you rolled 1 in your ${k}th roll. Your final score is now 0. Do you want to roll again?`;
    } else {
      score += roll;
      speechText = `You have rolled ${k} times. Your final score is ${score}. Do you want to roll again?`;
    }
    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt("Do you want to roll again?")
      .getResponse();
  },
};

const ContinueGameHandler: Alexa.RequestHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return (
      request.type === "IntentRequest" &&
      (request.intent.name === "AMAZON.YesIntent" ||
        request.intent.name === "AMAZON.NoIntent")
    );
  },
  handle(handlerInput) {
    if (
      handlerInput.requestEnvelope.request.intent.name === "AMAZON.YesIntent"
    ) {
      return handlerInput.responseBuilder
        .addDelegateDirective({ name: "RollDiceIntentHandler" })
        .getResponse();
    } else {
      return handlerInput.responseBuilder
        .speak(
          `You have rolled ${k} times. Your final score is ${score}. Thanks for playing !`
        )
        .getResponse();
    }
  },
};

const AskUserNameIntentHandler: Alexa.RequestHandler = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === "IntentRequest" &&
      handlerInput.requestEnvelope.request.intent.name === "AskUserNameIntent"
    );
  },
  handle(handlerInput) {
    let speechOutput = `What's your name?`;
    return handlerInput.responseBuilder
      .speak(speechOutput)
      .reprompt("Will add your name and score to the leaderboard")
      .getResponse();
  },
};

const CancelAndStopIntentHandler: Alexa.RequestHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
      (Alexa.getIntentName(handlerInput.requestEnvelope) ===
        "AMAZON.CancelIntent" ||
        Alexa.getIntentName(handlerInput.requestEnvelope) ===
          "AMAZON.StopIntent")
    );
  },
  handle(handlerInput) {
    const speakOutput = "Goodbye!";

    return handlerInput.responseBuilder.speak(speakOutput).getResponse();
  },
};

const FallbackIntentHandler: Alexa.RequestHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
      Alexa.getIntentName(handlerInput.requestEnvelope) ===
        "AMAZON.FallbackIntent"
    );
  },
  handle(handlerInput) {
    const speakOutput = "Sorry, I don't know about that. Please try again.";

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse();
  },
};

const HelpIntentHandler: Alexa.RequestHandler = {
  canHandle: isIntent("AMAZON.HelpIntent"),
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak("Try saying hello!")
      .getResponse();
  },
};

function ErrorHandler(handlerInput: Alexa.HandlerInput, error: Error) {
  return handlerInput.responseBuilder
    .speak(
      ` <amazon:emotion name="excited" intensity="high">
          Abort mission, repeating, abort mission!
        </amazon:emotion>
        <sub alias=",">${escapeXmlCharacters(error.message)}</sub>`
    )
    .withShouldEndSession(true)
    .getResponse();
}

export const handler = Alexa.SkillBuilders.custom()
  .addRequestHandlers(
    CancelAndStopIntentHandler,
    LaunchRequestHandler,
    RollDiceIntentHandler,
    ContinueGameHandler,
    AskUserNameIntentHandler,
    HelpIntentHandler,
    FallbackIntentHandler,
    HelpIntentHandler
  )
  .addErrorHandler(() => true, ErrorHandler)
  .lambda();
