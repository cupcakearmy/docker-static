import { info, setOutput } from '@actions/core'
import semver from 'semver'

// Fetch the current versions from the download page
const URL = `https://nginx.org/en/download.html`
const html = await fetch(URL).then((r) => r.text())

// Find all the downloadable versions
const re = /"\/download\/nginx-(\d+\.){3}tar\.gz"/g
const matches = html.match(re)

// Clean up the matches to semver format
const clean = (match) => match.replace(/"/g, '').replace('/download/nginx-', '').replace('.tar.gz', '')
const versions = matches.map(clean)

// Filter
// Get the two most up to date versions, mainline and stable
const filtered = versions.sort(semver.rcompare).slice(0, 2)

// Map the docker tags to the versions
// const tagsMap = Object.fromEntries(filtered.map((v) => [v, v]))

// Add the mainline, stable and latests tags
// tagsMap['latest'] = versions[0]
// tagsMap['mainline'] = versions[0]
// tagsMap['stable'] = versions[1]

// Export as github action matrix
// https://docs.github.com/en/actions/using-jobs/using-a-matrix-for-your-jobs#expanding-or-adding-matrix-configurations
const githubActionMatrix = {
  include: [
    { version: filtered[0], tags: ['latest', 'mainline', filtered[0]] },
    { version: filtered[1], tags: ['stable', filtered[1]] },
  ],
}

const serialised = JSON.stringify(githubActionMatrix)
info(`Found ${versions.length} versions`)
info(`Exporting as github action matrix: ${serialised}`)
setOutput('matrix', serialised)
