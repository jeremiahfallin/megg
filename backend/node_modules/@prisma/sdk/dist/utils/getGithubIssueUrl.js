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
  getGithubIssueUrl: () => getGithubIssueUrl,
  wouldYouLikeToCreateANewIssue: () => wouldYouLikeToCreateANewIssue
});
var import_get_platform = __toModule(require("@prisma/get-platform"));
var import_new_github_issue_url = __toModule(require("new-github-issue-url"));
var import_open = __toModule(require("open"));
var import_prompts = __toModule(require("prompts"));
var import_strip_ansi = __toModule(require("strip-ansi"));
var import_ts_pattern = __toModule(require("ts-pattern"));
var __defProp2 = Object.defineProperty;
var __name2 = /* @__PURE__ */ __name((target, value) => __defProp2(target, "name", { value, configurable: true }), "__name");
function getGithubIssueUrl({
  title,
  user = "prisma",
  repo = "prisma",
  template = "bug_report.md",
  body
}) {
  return (0, import_new_github_issue_url.default)({
    user,
    repo,
    template,
    title,
    body
  });
}
__name(getGithubIssueUrl, "getGithubIssueUrl");
__name2(getGithubIssueUrl, "getGithubIssueUrl");
async function wouldYouLikeToCreateANewIssue(options) {
  var _a;
  const shouldCreateNewIssue = await (0, import_ts_pattern.match)(options.prompt).with(true, async () => {
    const createNewIssueResponse = await (0, import_prompts.default)({
      type: "select",
      name: "value",
      message: "Would you like to create a GitHub issue?",
      initial: 0,
      choices: [
        {
          title: "Yes",
          value: true,
          description: `Create a new GitHub issue`
        },
        {
          title: "No",
          value: false,
          description: `Don't create a new GitHub issue`
        }
      ]
    });
    return Boolean(createNewIssueResponse.value);
  }).otherwise(() => Promise.resolve(true));
  if (shouldCreateNewIssue) {
    const platform = await (0, import_get_platform.getPlatform)();
    const url = getGithubIssueUrl({
      title: (_a = options.title) != null ? _a : "",
      body: issueTemplate(platform, options)
    });
    await (0, import_open.default)(url);
  }
}
__name(wouldYouLikeToCreateANewIssue, "wouldYouLikeToCreateANewIssue");
__name2(wouldYouLikeToCreateANewIssue, "wouldYouLikeToCreateANewIssue");
const issueTemplate = /* @__PURE__ */ __name2((platform, options) => {
  return (0, import_strip_ansi.default)(`
Hi Prisma Team! Prisma Migrate just crashed. ${options.reportId ? `This is the report:
  Report Id: ${options.reportId}` : ""}

## Command

\`${options.command}\`

## Versions
      
| Name        | Version            |
|-------------|--------------------|
| Platform    | ${platform.padEnd(19)}| 
| Node        | ${process.version.padEnd(19)}| 
| Prisma CLI  | ${options.cliVersion.padEnd(19)}| 
| Engine      | ${options.engineVersion.padEnd(19)}| 

## Error
\`\`\`
${options.error}
\`\`\`

`);
}, "issueTemplate");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getGithubIssueUrl,
  wouldYouLikeToCreateANewIssue
});
