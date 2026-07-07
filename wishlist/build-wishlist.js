const fs = require("fs")
const path = require("path")

const STEAM_ID = "76561198803983178"
const CC = "es"
const LANGUAGE = "spanish"
const OUTPUT_FILE = path.join(__dirname, "wishlist-db.js")
const WISHLIST_API = "https://api.steampowered.com/IWishlistService/GetWishlist/v1/"
const DETAILS_API = "https://store.steampowered.com/api/appdetails"
const REQUEST_DELAY_MS = 1500

async function fetchWithRetry(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; WishlistBuilder/1.0)" },
    })
    if (res.ok) return res
    if (res.status === 429) {
      const wait = Math.pow(2, i) * 2000
      console.log(`Rate limited, waiting ${wait}ms...`)
      await new Promise(r => setTimeout(r, wait))
      continue
    }
    throw new Error(`HTTP ${res.status}: ${res.statusText}`)
  }
  throw new Error("Max retries exceeded")
}

async function getWishlistAppIds() {
  console.log("Fetching wishlist...")
  const url = `${WISHLIST_API}?steamid=${STEAM_ID}`
  const res = await fetchWithRetry(url)
  const data = await res.json()

  const items = data?.response?.items
  if (!items || items.length === 0) {
    console.log("Wishlist is empty or private. Using empty list.")
    return []
  }

  console.log(`Found ${items.length} items in wishlist`)
  return items.map(i => ({ appid: i.appid, priority: i.priority, date_added: i.date_added }))
}

async function getAppDetailsSequential(appIds) {
  const results = {}

  for (let i = 0; i < appIds.length; i++) {
    const item = appIds[i]
    console.log(`Fetching details for ${item.appid} (${i + 1}/${appIds.length})...`)

    const url = `${DETAILS_API}?appids=${item.appid}&cc=${CC}&l=${LANGUAGE}`
    const res = await fetchWithRetry(url)
    const data = await res.json()

    const entry = data[String(item.appid)]
    if (!entry || !entry.success || !entry.data) {
      console.log(`  Skipping app ${item.appid}: no data`)
      continue
    }
    const appData = entry.data
    results[item.appid] = {
      ...item,
      name: appData.name,
      type: appData.type,
      header_image: appData.header_image,
      short_description: appData.short_description,
      is_free: appData.is_free || false,
      price_overview: appData.price_overview || null,
      categories: (appData.categories || []).map(c => ({ id: c.id, description: c.description })),
      genres: (appData.genres || []).map(g => ({ id: g.id, description: g.description })),
      release_date: appData.release_date || null,
      developers: appData.developers || [],
      publishers: appData.publishers || [],
      platforms: appData.platforms || {},
    }

    if (i < appIds.length - 1) {
      await new Promise(r => setTimeout(r, REQUEST_DELAY_MS))
    }
  }

  return results
}

function formatPrice(priceOverview, isFree) {
  if (isFree) return { final: "Gratuito", original: null, discount: 0 }
  if (!priceOverview) return { final: "Próximamente", original: null, discount: 0 }

  return {
    final: priceOverview.final_formatted,
    original: priceOverview.discount_percent > 0 ? priceOverview.initial_formatted : null,
    discount: priceOverview.discount_percent || 0,
  }
}

function buildGamesArray(appIds, detailsMap) {
  const games = []

  for (const item of appIds) {
    const detail = detailsMap[item.appid]
    if (!detail) continue

    const price = formatPrice(detail.price_overview, detail.is_free)

    games.push({
      appId: item.appid,
      priority: item.priority,
      dateAdded: item.date_added,
      name: detail.name,
      type: detail.type || "game",
      headerImage: detail.header_image,
      description: detail.short_description || "",
      price: price.final,
      originalPrice: price.original,
      discount: price.discount,
      isFree: detail.is_free,
      categories: detail.categories,
      genres: detail.genres,
      releaseDate: detail.release_date?.date || null,
      comingSoon: detail.release_date?.coming_soon || false,
      developers: detail.developers,
      platforms: detail.platforms,
    })
  }

  return games
}

async function main() {
  try {
    const appIds = await getWishlistAppIds()

    let games = []
    if (appIds.length > 0) {
      const detailsMap = await getAppDetailsSequential(appIds)
      games = buildGamesArray(appIds, detailsMap)
      console.log(`Successfully processed ${games.length}/${appIds.length} games`)
    } else {
      console.log("No games to process")
    }

    const now = new Date().toISOString()
    const output = `const wishlistGames = ${JSON.stringify(games, null, 2)}\n\nconst wishlistLastUpdate = "${now}"\n`

    fs.writeFileSync(OUTPUT_FILE, output, "utf-8")
    console.log(`Written ${OUTPUT_FILE} with ${games.length} games`)
  } catch (err) {
    console.error("Error:", err.message)
    process.exit(1)
  }
}

main()
