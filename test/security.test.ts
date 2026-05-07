import { existsSync, readdirSync, readFileSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"

const CLIENT_BUILD_DIR = join(process.cwd(), "build", "client", "assets")

const SECRET_PATTERNS: Array<{ name: string; pattern: RegExp }> = [
  { name: "EMAIL_USER env var literal", pattern: /process\.env\.EMAIL_USER/ },
  { name: "EMAIL_PASS env var literal", pattern: /process\.env\.EMAIL_PASS/ },
  { name: "EMAIL_RECIPIENT env var literal", pattern: /process\.env\.EMAIL_RECIPIENT/ },
  { name: "EMAIL_BCC env var literal", pattern: /process\.env\.EMAIL_BCC/ },
  { name: "raw nodemailer import in client bundle", pattern: /from"nodemailer"|require\("nodemailer"\)/ },
  { name: "dotenv module in client bundle", pattern: /from"dotenv\/?config?"|require\("dotenv\/?config?"\)/ },
  { name: "AWS access key signature", pattern: /AKIA[0-9A-Z]{16}/ },
  { name: "Google API key signature", pattern: /AIza[0-9A-Za-z\-_]{35}/ },
  { name: "GitHub PAT signature", pattern: /ghp_[A-Za-z0-9]{36}/ },
]

const BUILD_AVAILABLE = existsSync(CLIENT_BUILD_DIR)

describe.runIf(BUILD_AVAILABLE)("client bundle does not leak secrets", () => {
  const files = readdirSync(CLIENT_BUILD_DIR).filter((f) => f.endsWith(".js"))

  it("at least one client asset bundle exists", () => {
    expect(files.length).toBeGreaterThan(0)
  })

  for (const { name, pattern } of SECRET_PATTERNS) {
    it(`no asset matches: ${name}`, () => {
      const offenders = files.filter((f) => {
        const content = readFileSync(join(CLIENT_BUILD_DIR, f), "utf-8")
        return pattern.test(content)
      })
      expect(offenders).toEqual([])
    })
  }

  it("no asset references the .env file path literally", () => {
    const offenders = files.filter((f) => {
      const content = readFileSync(join(CLIENT_BUILD_DIR, f), "utf-8")
      return /\/\.env(?!\.example)\b/.test(content)
    })
    expect(offenders).toEqual([])
  })
})

describe.skipIf(BUILD_AVAILABLE)("client bundle scan (skipped: no build)", () => {
  it.skip("run `npm run build` first to enable bundle security tests", () => {})
})
