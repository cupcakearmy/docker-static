import { info, setOutput, error } from '@actions/core'
import semver from 'semver'

// Fetch the current versions from the download page
const URL = `https://nginx.org/en/download.html`
const html = await fetch(URL).then((r) => r.text())

// Find all the downloadable versions
const re = /"\/download\/nginx-(\d+\.){3}tar\.gz"/g
const matches = html.match(re)

if (!matches) {
  error(`No versions found at ${URL}`)
  process.exit(1)
}

// Clean up the matches to semver format
function clean(match: string): string {
  return match.replace(/"/g, '').replace('/download/nginx-', '').replace('.tar.gz', '')
}
const versions = matches.map(clean)

// Filter
// Get the two most up to date versions, mainline and stable
const filtered = versions.sort(semver.rcompare).slice(0, 2)

function convert(version: string, additional: string[] = []) {
  return {
    version,
    // https://github.com/docker/metadata-action#typeraw
    tags: [version, ...additional].map((t) => `type=raw,value=${t}`).join('\n'),
  }
}

// Export as github action matrix
// https://docs.github.com/en/actions/using-jobs/using-a-matrix-for-your-jobs#expanding-or-adding-matrix-configurations
const githubActionMatrix = {
  include: [convert(filtered[0], ['latest', 'mainline']), convert(filtered[1], ['stable'])],
}

const serialised = JSON.stringify(githubActionMatrix)
info(`Found ${versions.length} versions`)
info(`Exporting as github action matrix: ${serialised}`)
setOutput('matrix', serialised)
