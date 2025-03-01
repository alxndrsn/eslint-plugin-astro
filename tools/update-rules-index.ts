import path from "path"
import { rules } from "./lib/load-rules"
import { formatAndSave } from "./lib/utils"

/**
 * Convert text to camelCase
 */
function camelCase(str: string) {
  return str.replace(/[-_](\w)/gu, (_, c) => (c ? c.toUpperCase() : ""))
}

/**
 * Map rule name to import statement
 */
function mapRuleNameToImport(name: string) {
  return `import ${camelCase(name)} from "./${name}"`
}

const currentFileName = path.basename(__filename)
const ruleNames = rules.map((rule) => rule.meta.docs.ruleName)
const content = `/*
 * IMPORTANT!
 * This file has been automatically generated by "${currentFileName}",
 * in order to update its content, update "${currentFileName}" and execute "npm run update"
 */
${ruleNames.map(mapRuleNameToImport).join("\n")}
import { buildA11yRules } from "../a11y"

export const originalRules = [
  ${ruleNames.map(camelCase).join(",")},
]
export const rules = [...originalRules, ...buildA11yRules()]
`

const filePath = path.resolve(__dirname, "../src/rules/index.ts")

// Update file.
void formatAndSave(filePath, content)
