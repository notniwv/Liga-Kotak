const fs = require('fs');

const API_KEY = process.env.YOUTUBE_API_KEY;
const CHANNEL_IDS = [
  "UC_LmPTES5ZHlGzrHc7qKrvw", "UCcEKG5IfAy98Bsq22BRdd3w", "UCa6pwWBxWGN_sbu-cRzmVhQ", 
  "UC1a64wDM2U2tmBjOXDLzG2A", "UCJMB-wFtgg1mwXArhIXfqJQ", "UCAK5HqgxgQtUVpOt02QRV_A", 
  "UCiyqsxhovAvQs1DD1BitQYg", "UCmmbpRQXA3yXPIV-QgqsqRQ", "UCb39vdyInPuc243ZpifXGqw", 
  "UC-As-g5ue_RLEyY-0e0hrUA", "UCmDTLdNQpib09JQ9CD-hOrQ", "UCuQo6rIIDojEY7EvgqMLiBg", 
  "UCoq7i8ssXnZFovexOuU_NPg", "UCX_2YmQT4S32O1FDdJL69yA", "UC5Y8SHg5AvmTTbmi31QxNbg", 
  "UCq23UW0XOcVqfUuwbzUXK8Q", "UCN7OXKo3aTWdYb6oeMmGu8A", "UCRqE6DjYrBpztJ9h56nF8Wg", 
  "UCjaPagXdq6U2Irmjs0acTFQ", "UC6O0ufi6I8hdtxbAO0bIKSQ"
];

async function run() {
  try {
    const url = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${CHANNEL_IDS.join(',')}&key=${API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();

    if (!data.items) {
      console.error("Gagal mengambil data dari YouTube API");
      process.exit(1);
    }

    let existingData = { channels: [] };
    if (fs.existsSync('data.json')) {
      try {
        existingData = JSON.parse(fs.readFileSync('data.json', 'utf8'));
      } catch (e) {
        console.warn("Gagal membaca data.json lama, bina baru.");
      }
    }

    const channels = data.items.map(item => {
      const id = item.id;
      const subs = parseInt(item.statistics.subscriberCount || 0);
      const views = parseInt(item.statistics.viewCount || 0);

      let oldCh = (existingData.channels || []).find(c => c.id === id) || {};
      let seriesSubs = oldCh.series && Array.isArray(oldCh.series.subs) ? oldCh.series.subs : [];
      let seriesViews = oldCh.series && Array.isArray(oldCh.series.views) ? oldCh.series.views : [];

      // Catat data harian baru
      seriesSubs.push(subs);
      seriesViews.push(views);

      // Kekalkan rekod sehingga 180 hari (6 bulan)
      seriesSubs = seriesSubs.slice(-180);
      seriesViews = seriesViews.slice(-180);

      return {
        id: id,
        name: item.snippet.title,
        handle: item.snippet.customUrl || ('@' + item.snippet.title.replace(/\s+/g, '').toLowerCase()),
        avatar: item.snippet.thumbnails.default ? item.snippet.thumbnails.default.url : null,
        description: item.snippet.description || "",
        country: item.snippet.country || "MY",
        subs: subs,
        views: views,
        videos: parseInt(item.statistics.videoCount || 0),
        series: {
          subs: seriesSubs,
          views: seriesViews
        }
      };
    });

    const output = {
      updated: new Date().toISOString(),
      channels: channels
    };

    fs.writeFileSync('data.json', JSON.stringify(output, null, 2));
    console.log("data.json berjaya dikemas kini!");
  } catch (err) {
    console.error("Ralat:", err);
    process.exit(1);
  }
}

run();
