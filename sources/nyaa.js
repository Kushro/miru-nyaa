import AbstractSource from './abstract.js'
import { Nyaa } from '@ejnshtein/nyaasi'

export default new class NyaaSi extends AbstractSource {
  name = 'Nyaa'
  description = 'EXPERIMENTAL'
  /** @type {import('./types.js').Accuracy} */
  accuracy = 'High'

  /** @type {import('./types.js').SearchFunction} */
  async single ({ titles }) {
    if (!titles?.length) throw new Error('No titles provided')

    //const cleanedTitle = titles[0].replace(/^(.+?)(?:\s+(?:\d+|[Ss]\d+|[Ee]\d+))?$/, "$1");
    //console.log(`Original: ${title} -> Cleaned: ${cleanedTitle}`);

    let accumulattedResults = []
    
    for (const title of titles) {
      const search = await Nyaa.search({
        title: title,
        category: '0_0'
      })

      console.log(`Found ${result.torrents.length} torrents for ${title}`)
    }

    if (accumulattedResults.length === 0) return []
    

    let results = []

    for (const result of accumulattedResults) {
        console.log(`> Getting torrent data for result... ${result}`)

        const torrent = await Nyaa.getTorrentAnonymous(result.id)
        
        if (!torrent) {
            console.log(`> Torrent not found for result ${result}`)
            continue
        }

        console.log(`> Torrent found for result ${result}`)

        results.push({
            hash: torrent.info_hash,
            link: torrent.links.magnet,
            title: `[${torrent.submitter.name}] ${torrent.name}`,
            size: torrent.file_size,
            type: 'best',
            date: new Date(torrent.timestamp),
            seeders: torrent.stats.seeders,
            leechers: torrent.stats.leechers,
            downloads: torrent.stats.downloaded,
            verified: true
        })
    }

    return results.length > 0 ? results : []
  }

  batch = this.single
  movie = this.single
}()
