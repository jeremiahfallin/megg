var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};
__export(exports, {
  handlePanic: () => handlePanic
});
var import_chalk = __toModule(require("chalk"));
var import_prompts = __toModule(require("prompts"));
var import_sendPanic = __toModule(require("../sendPanic"));
var import_getGithubIssueUrl = __toModule(require("./getGithubIssueUrl"));
var import_isCi = __toModule(require("./isCi"));
var import_link = __toModule(require("./link"));
var __defProp2 = Object.defineProperty;
var __name2 = /* @__PURE__ */ __name((target, value) => __defProp2(target, "name", { value, configurable: true }), "__name");
async function handlePanic(error, cliVersion, engineVersion, command) {
  var _a;
  if ((0, import_isCi.isCi)() && Boolean((_a = import_prompts.default._injected) == null ? void 0 : _a.length) === false) {
    throw error;
  }
  await panicDialog(error, cliVersion, engineVersion, command);
}
__name(handlePanic, "handlePanic");
__name2(handlePanic, "handlePanic");
async function panicDialog(error, cliVersion, engineVersion, command) {
  const errorMessage = error.message.split("\n").slice(0, Math.max(20, process.stdout.rows)).join("\n");
  console.log(`${import_chalk.default.red("Oops, an unexpected error occured!")}
${import_chalk.default.red(errorMessage)}

${import_chalk.default.bold("Please help us improve Prisma by submitting an error report.")}
${import_chalk.default.bold("Error reports never contain personal or other sensitive information.")}
${import_chalk.default.dim(`Learn more: ${(0, import_link.link)("https://pris.ly/d/telemetry")}`)}
`);
  const { value: shouldSubmitReport } = await (0, import_prompts.default)({
    type: "select",
    name: "value",
    message: "Submit error report",
    initial: 0,
    choices: [
      {
        title: "Yes",
        value: true,
        description: `Send error report once`
      },
      {
        title: "No",
        value: false,
        description: `Don't send error report`
      }
    ]
  });
  if (shouldSubmitReport) {
    try {
      console.log("Submitting...");
      const reportId = await (0, import_sendPanic.sendPanic)(error, cliVersion, engineVersion);
      console.log(`
${import_chalk.default.bold(`We successfully received the error report id: ${reportId}`)}`);
      console.log(`
${import_chalk.default.bold("Thanks a lot for your help! \u{1F64F}")}`);
    } catch (error2) {
      const reportFailedMessage = `${import_chalk.default.bold.red("Oops. We could not send the error report.")}`;
      console.log(reportFailedMessage);
    }
  }
  await (0, import_getGithubIssueUrl.wouldYouLikeToCreateANewIssue)({
    prompt: !shouldSubmitReport,
    error,
    cliVersion,
    engineVersion,
    command
  });
}
__name(panicDialog, "panicDialog");
__name2(panicDialog, "panicDialog");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handlePanic
});
