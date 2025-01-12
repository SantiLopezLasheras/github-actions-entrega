const TelegramBot = require("node-telegram-bot-api");
const core = require("@actions/core");

const token = core.getInput("telegram_token");
const ChatID = core.getInput("telegram_id_user");

// resultados de los jobs
const resultadoLinter = core.getInput("resultado_linter");
const resultadoBadge = core.getInput("resultado_badge");
const resultadoCypress = core.getInput("resultado_cypress");
const resultadoDeploy = core.getInput("resultado_deploy");
console.log("Resultado Linter:", resultadoLinter);
console.log("Resultado Cypress:", resultadoCypress);
console.log("Resultado Badge:", resultadoBadge);
console.log("Resultado Deploy:", resultadoDeploy);

const bot = new TelegramBot(token, { polling: true });

try {
  const message = `
  S'ha realitzat un push en la branca main que ha provocat l'execució del workflow nom_repositori_workflow amb els següents resultats:\n
  - linter_job: ${resultadoLinter}\n
  - cypress_job: ${resultadoCypress}\n
  - add_badge_job: ${resultadoBadge}\n
  - deploy_job: ${resultadoDeploy}\n`;

  bot.sendMessage(ChatID, message);
  core.setOutput("msg", "Mensaje enviado correctamente");
} catch (e) {
  core.setFailed(e.message);
}
