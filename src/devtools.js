const { prisma } = require('./generated/prisma-client')

async function main() {
  // Create a new release
  const newRelease = await prisma.createRelease({ 
  })
  console.log(`Created new Release: ${newRelease.operationId} (ID: ${newRelease.id})`)

  // Read all links from the database and print them to the console
  const allReleasess = await prisma.releases()
  console.log(allReleases)
}

main().catch(e => console.error(e))
 
