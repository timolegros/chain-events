"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Processor = void 0;
/**
 * Processes Marlin events.
 */
const interfaces_1 = require("../../interfaces");
const logging_1 = __importDefault(require("../../logging"));
const type_parser_1 = require("./filters/type_parser");
const enricher_1 = require("./filters/enricher");
class Processor extends interfaces_1.IEventProcessor {
    /**
     * Parse events out of an ethereum block and standardizes their format
     * for processing.
     * @param event
     * @returns an array of processed events
     */
    process(event) {
        return __awaiter(this, void 0, void 0, function* () {
            const kind = type_parser_1.ParseType(event.event);
            if (!kind)
                return [];
            try {
                const cwEvent = yield enricher_1.Enrich(this._api, event.blockNumber, kind, event);
                return [cwEvent];
            }
            catch (e) {
                logging_1.default.error(`Failed to enrich event: ${e.message}`);
                return [];
            }
        });
    }
}
exports.Processor = Processor;
//# sourceMappingURL=processor.js.map