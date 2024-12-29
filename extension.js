import moment from "moment-timezone";
import { franc, francAll } from 'franc-min';
import { kukemcI18nExtensionId, kukemcI18nIcon, supportedTranslateCodes } from "./assets";

export default class KukeMCI18n {
    constructor(runtime) {
        this.runtime = runtime;
        this.lastRequestTimestamp = 0;

        /*
        获取 ScratchVM
        该段代码来源于 lpp 项目，并遵循 MIT 开源协议。
        */

        function hijack(fn) {
            const _orig = Function.prototype.apply;
            Function.prototype.apply = function (thisArg) {
                return thisArg;
            };
            const result = fn();
            Function.prototype.apply = _orig;
            return result;
        }
        let virtualMachine = null;

        if (this.runtime._events['QUESTION'] instanceof Array) {
            for (const value of this.runtime._events['QUESTION']) {
                const v = hijack(value);
                if (v?.props?.vm) {
                    virtualMachine = v?.props?.vm;
                    break;
                }
            }
        } else if (this.runtime._events['QUESTION']) {
            virtualMachine = hijack(this.runtime._events['QUESTION'])?.props?.vm;
        }
        if (!virtualMachine)
            throw new Error('I18n cannot get Virtual Machine instance.');
        this.vm = virtualMachine;
        /** default config */

        this._initialedI18n = {
            locales: {
                [this.language]: {
                    key: "value",
                },
            },
        };
        this.i18n = {
           ...this._initialedI18n.locales[this.language],
        };

        this.supportedConvertibleUnits = [
            ["中文", "Chinese", "cn"],
            ["国际", "International", "intl"],
        ];

        this._formatMessage = runtime.getFormatMessage({
            "zh-cn": {
                "kukeMCI18n.div.1": "🌍 初始化语言",
                "kukeMCI18n.div.2": "💬 文本处理",
                "kukeMCI18n.div.3": "🎭 语言环境设置",
                "kukeMCI18n.div.4": "🔭 文本翻译",
                "kukeMCI18n.div.5": "⚠️ 以下积木仅在编辑器生效 ⚠️",
                "kukeMCI18n.div.6": "🪄 单位转换",
                "kukeMCI18n.div.7": "✨ I18n 示例",
                "kukeMCI18n.block.initI18nForJSON": "从JSON [JSON] 初始化翻译",
                "kukeMCI18n.block.initI18nForFile": "从文件 [FILE] 初始化翻译",
                "kukeMCI18n.block.setLanguage": "设置语言为 [LANG]",
                "kukeMCI18n.block.getExtraData": "额外数据 [KEY]",
                "kukeMCI18n.block.replaceText": "格式化 [TEXT] 数据源 [DATA]",
                "kukeMCI18n.block.getLanguageForI18n": "当前 i18n 语言",
                "kukeMCI18n.block.getLanguageForBrowser": "浏览器当前语言",
                "kukeMCI18n.block.getSupportedLanguages": "支持的全部语言",
                "kukeMCI18n.block.checkLanguageSupport": "是否支持 [LANG]？",
                "kukeMCI18n.block.recognitionLanguageName": "[TEXT] 的语言",
                "kukeMCI18n.block.recognitionLanguageNameAll": "[TEXT] 的所有可能的语言",
                "kukeMCI18n.block.translateText":
                    "☁️ 将 [TEXT] 从 [LANG1] 翻译为 [LANG2]",
                "kukeMCI18n.block.translateTextWithClipboard":
                    "☁️ 将 [TEXT] 从 [LANG1] 翻译为 [LANG2] 并复制到剪贴板",
                "kukeMCI18n.button.printSupportedLanguages": "☁️ 打印支持的语言列表",
                "kukeMCI18n.tip.rateLimit": "请求过于频繁！请等待数秒再试。",
                "kukeMCI18n.tip.allSupportedLanguages": "共支持 [NUM] 个语言",
                "kukeMCI18n.block.convertUnit": "数学单位换算 [NUM] 转换为 [UNIT] 单位",
                "kukeMCI18n.block.getTimestamp": "本地时间戳",
                "kukeMCI18n.block.getTimeZone": "本地时区",
                "kukeMCI18n.block.offsetTimeZone":
                    "将时间 [TIME] 从 [ZONE1] 转换为 [ZONE2]",
                "kukeMCI18n.block.formatTimestamp": "将时间 [TIME] 按 [FORMAT] 格式化",
                "kukeMCI18n.block.example": "i18n 示例",
            },
            en: {
                "kukeMCI18n.div.1": "🌍 Language Initialization",
                "kukeMCI18n.div.2": "💬 Text Processing",
                "kukeMCI18n.div.3": "🎭 Language Environment",
                "kukeMCI18n.div.4": "🔭 Text Translation",
                "kukeMCI18n.div.5":
                    "⚠️ The following blocks are only available in editor ⚠️",
                "kukeMCI18n.div.6": "🪄 Unit conversion",
                "kukeMCI18n.div.7": "✨ I18n Example",
                "kukeMCI18n.block.initI18nForJSON": "initialize translations from JSON [JSON]",
                "kukeMCI18n.block.initI18nForFile": "initialize translations from file [FILE]",
                "kukeMCI18n.block.setLanguage": "set language to [LANG]",
                "kukeMCI18n.block.getExtraData": "extra data by [KEY]",
                "kukeMCI18n.block.replaceText": "format [TEXT] data from [DATA]",
                "kukeMCI18n.block.getLanguageForI18n": "current language",
                "kukeMCI18n.block.getLanguageForBrowser": "current browser language",
                "kukeMCI18n.block.getSupportedLanguages": "all supported languages",
                "kukeMCI18n.block.checkLanguageSupport": "is [LANG] supported?",
                "kukeMCI18n.block.recognitionLanguageName": "language of [TEXT]",
                "kukeMCI18n.block.recognitionLanguageNameAll": "all possible languages of [TEXT]",
                "kukeMCI18n.block.translateText":
                    "☁️ translate [TEXT] from [LANG1] into [LANG2]",
                "kukeMCI18n.block.translateTextWithClipboard":
                    "☁️ translate [TEXT] from [LANG1] into [LANG2] then copy to clipboard",
                "kukeMCI18n.button.printSupportedLanguages":
                    "☁️ print the list of supported languages",
                "kukeMCI18n.tip.rateLimit": "Rate limit exceeded! Try again in a few seconds.",
                "kukeMCI18n.tip.allSupportedLanguages":
                    "Supports [NUM] languages in total",
                "kukeMCI18n.block.convertUnit":
                    "(Mathematical Unit Conversion) convert [NUM] to [UNIT] unit",
                "kukeMCI18n.block.getTimestamp": "local Timestamp",
                "kukeMCI18n.block.getTimeZone": "local Time Zone",
                "kukeMCI18n.block.offsetTimeZone":
                    "convert time [TIME] from [ZONE1] to [ZONE2]",
                "kukeMCI18n.block.formatTimestamp": "format time [TIME] as [FORMAT]",
                "kukeMCI18n.block.example": "i18n example",
            },
        });
    }

    get initialedI18n() {
        return this._initialedI18n;
    }

    set initialedI18n(data) {
        if (typeof data === "object") {
            this._initialedI18n = data;
        }

        try {
            const _tmp = JSON.parse(String(data));
            if ("locales" in _tmp) this._initialedI18n = _tmp;
            else
                console.error(
                    `[kukeMCI18n] set i18n failed: `,
                    "i18n must has locales"
                );
        } catch (e) {
            console.error(`[kukeMCI18n] set i18n failed: `, e);
        }
    }

    /**
     * 翻译
     * @param {string} id
     * @return {string}
     */
    formatMessage(id) {
        return this._formatMessage({
            id,
            default: id,
            description: id,
        });
    }

    getInfo() {
        this.language = this.vm.getLocale();
        if (this.language === "zh-cn") {
            this.language = "zh-CN";
        }
        const initI18nForJSON = {
            opcode: "initI18nForJSON",
            blockType: Scratch.BlockType.COMMAND,
            text: this.formatMessage("kukeMCI18n.block.initI18nForJSON"),
            arguments: {
                JSON: {
                    type: Scratch.ArgumentType.STRING,
                    defaultValue: "{}",
                },
            },
        };
        const initI18nForFile = {
            opcode: "initI18nForFile",
            blockType: Scratch.BlockType.COMMAND,
            text: this.formatMessage("kukeMCI18n.block.initI18nForFile"),
            arguments: {
                FILE: {
                    type: Scratch.ArgumentType.STRING,
                    menu: "FILE_LIST",
                },
            },
        };
        const getI18n = {
            opcode: "getI18n",
            blockType: Scratch.BlockType.REPORTER,
            text: "i18n [KEY]",
            arguments: {
                KEY: {
                    type: Scratch.ArgumentType.STRING,
                    defaultValue: "welcome",
                },
            },
        };
        const getExtraData = {
            opcode: "getExtraData",
            blockType: Scratch.BlockType.REPORTER,
            text: this.formatMessage("kukeMCI18n.block.getExtraData"),
            arguments: {
                KEY: {
                    type: Scratch.ArgumentType.STRING,
                    defaultValue: "version",
                },
            },
        };
        const setLanguage = {
            opcode: "setLanguage",
            blockType: Scratch.BlockType.COMMAND,
            text: this.formatMessage("kukeMCI18n.block.setLanguage"),
            arguments: {
                LANG: {
                    type: Scratch.ArgumentType.STRING,
                    defaultValue: "zh-CN",
                },
            },
        };
        const getLanguageForI18n = {
            opcode: "getLanguageForI18n",
            blockType: Scratch.BlockType.REPORTER,
            text: this.formatMessage("kukeMCI18n.block.getLanguageForI18n"),
            arguments: {},
        };
        const getSupportedLanguages = {
            opcode: "getSupportedLanguages",
            blockType: Scratch.BlockType.REPORTER,
            disableMonitor: true,
            text: this.formatMessage("kukeMCI18n.block.getSupportedLanguages"),
            arguments: {},
        };
        const checkLanguageSupport = {
            opcode: "checkLanguageSupport",
            blockType: Scratch.BlockType.BOOLEAN,
            text: this.formatMessage("kukeMCI18n.block.checkLanguageSupport"),
            arguments: {
                LANG: {
                    type: Scratch.ArgumentType.STRING,
                    defaultValue: "zh-CN",
                },
            },
        };
        const printSupportedLanguages = {
            blockType: Scratch.BlockType.BUTTON,
            text: this.formatMessage("kukeMCI18n.button.printSupportedLanguages"),
            onClick: () => {
                this.runtime.logSystem.show();
                this.runtime.logSystem.info("");
                supportedTranslateCodes
                   .map((t) => `| ${t[0]} | ${t[1]} | ${t[2]} |`)
                   .forEach((v) => {
                        this.runtime.logSystem.info(v);
                    });
                this.runtime.logSystem.info(
                    this.formatMessage("kukeMCI18n.tip.allSupportedLanguages").replace(
                        "[NUM]",
                        supportedTranslateCodes.length
                    )
                );
            },
        };
        const translateText = {
            opcode: "translateText",
            blockType: Scratch.BlockType.REPORTER,
            text: this.formatMessage("kukeMCI18n.block.translateText"),
            arguments: {
                TEXT: {
                    type: Scratch.ArgumentType.STRING,
                    defaultValue: "Hello World!",
                },
                LANG1: {
                    type: Scratch.ArgumentType.STRING,
                    menu: "TRANSLATE_LIST",
                    defaultValue: "en",
                },
                LANG2: {
                    type: Scratch.ArgumentType.STRING,
                    menu: "TRANSLATE_LIST",
                    defaultValue: "zh",
                },
            },
        };

        const translateTextWithClipboard = {
            opcode: "translateTextWithClipboard",
            blockType: Scratch.BlockType.COMMAND,
            text: this.formatMessage("kukeMCI18n.block.translateTextWithClipboard"),
            arguments: {
                TEXT: {
                    type: Scratch.ArgumentType.STRING,
                    defaultValue: "Hello World!",
                },
                LANG1: {
                    type: Scratch.ArgumentType.STRING,
                    menu: "TRANSLATE_LIST",
                    defaultValue: "en",
                },
                LANG2: {
                    type: Scratch.ArgumentType.STRING,
                    menu: "TRANSLATE_LIST",
                    defaultValue: "zh",
                },
            },
        };

        const convertUnit = {
            opcode: "convertUnit",
            blockType: Scratch.BlockType.REPORTER,
            text: this.formatMessage("kukeMCI18n.block.convertUnit"),
            arguments: {
                NUM: {
                    type: Scratch.ArgumentType.NUMBER,
                    defaultValue: 150000,
                },
                UNIT: {
                    type: Scratch.ArgumentType.STRING,
                    menu: "UNIT_LIST",
                    defaultValue: "cn",
                },
            },
        };

        const getTimestamp = {
            opcode: "getTimestamp",
            blockType: Scratch.BlockType.REPORTER,
            text: this.formatMessage("kukeMCI18n.block.getTimestamp"),
            arguments: {},
        };

        const getTimeZone = {
            opcode: "getTimeZone",
            blockType: Scratch.BlockType.REPORTER,
            text: this.formatMessage("kukeMCI18n.block.getTimeZone"),
            arguments: {},
        };

        const offsetTimeZone = {
            opcode: "offsetTimeZone",
            blockType: Scratch.BlockType.REPORTER,
            text: this.formatMessage("kukeMCI18n.block.offsetTimeZone"),
            arguments: {
                TIME: {
                    type: Scratch.ArgumentType.NUMBER,
                    defaultValue: "1609459200",
                },
                ZONE1: {
                    type: Scratch.ArgumentType.STRING,
                    defaultValue: "Asia/Shanghai",
                },
                ZONE2: {
                    type: Scratch.ArgumentType.STRING,
                    defaultValue: "America/New_York",
                },
            },
        };

        const formatTimestamp = {
            opcode: "formatTimestamp",
            blockType: Scratch.BlockType.REPORTER,
            text: this.formatMessage("kukeMCI18n.block.formatTimestamp"),
            arguments: {
                TIME: {
                    type: Scratch.ArgumentType.NUMBER,
                    defaultValue: 1609459200,
                },
                FORMAT: {
                    type: Scratch.ArgumentType.STRING,
                    defaultValue: "YYYY-MM-DD HH:mm:ss",
                },
            },
        };

        const replaceText = {
            opcode: "replaceText",
            blockType: Scratch.BlockType.REPORTER,
            text: this.formatMessage("kukeMCI18n.block.replaceText"),
            arguments: {
                TEXT: {
                    type: Scratch.ArgumentType.STRING,
                    defaultValue:
                        "Hello, {name}! You are {age} years old.",
                },
