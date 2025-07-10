// @ts-nocheck
import path from "node:path"
import type { Config } from "tailwindcss"
import type { Plugin } from "vite"

interface InjectTailwindCSSOptions {
  entry: string
  sources?: string[]
  plugins?: string[]
}

export const injectTailwindCSS = (
  options: InjectTailwindCSSOptions
): Plugin => {
  return {
    name: "medusa:inject-tailwindcss",
    config: () => ({
      // Disabled to prevent Windows path issues with Tailwind content patterns
      // This was causing warnings about patterns matching node_modules
    }),
  }
}

function createTailwindConfig(
  entry: string,
  sources: string[] = [],
  plugins: string[] = []
) {
  // Convert Windows paths to POSIX to avoid problematic backslashes
  const normalizePath = (p: string) => p.replace(/\\/g, '/');
  
  const root = normalizePath(path.join(entry, "**/*.{js,ts,jsx,tsx}"))
  const html = normalizePath(path.join(entry, "index.html"))

  let dashboard = ""

  try {
    dashboard = normalizePath(path.join(
      path.dirname(require.resolve("@medusajs/dashboard")),
      "**/*.{js,ts,jsx,tsx}"
    ))
  } catch (_e) {
    // ignore
  }

  let ui: string = ""

  try {
    ui = normalizePath(path.join(
      path.dirname(require.resolve("@medusajs/ui")),
      "**/*.{js,ts,jsx,tsx}"
    ))
  } catch (_e) {
    // ignore
  }

  const sourceExtensions = sources.map((s) =>
    normalizePath(path.join(s, "**/*.{js,ts,jsx,tsx}"))
  )
  const pluginExtensions: string[] = []

  for (const plugin of plugins) {
    try {
      const pluginPath = normalizePath(path.join(
        path.dirname(require.resolve(plugin)),
        "**/*.{js,ts,jsx,tsx}"
      ))

      pluginExtensions.push(pluginPath)
    } catch (_e) {
      // ignore
    }
  }

  // Filter out potentially problematic patterns
  const filteredContent = [
    html,
    root,
    dashboard,
    ui,
    ...sourceExtensions,
    ...pluginExtensions,
  ].filter(pattern => {
    // Exclude patterns that might match node_modules
    return pattern && !pattern.includes('src\\**\\*.js') && !pattern.includes('src/**/*.js');
  });

  const config: Config = {
    presets: [require("@medusajs/ui-preset")],
    content: filteredContent,
    darkMode: "class",
  }

  return config
}


