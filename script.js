const API_KEY = 'AIzaSyA_ZvMbI32k0M6VPnANIstUB8NB5U5NeuE';

// 20 ID YouTube Liga Kotak
const CHANNEL_IDS = [
  "UC_LmPTES5ZHlGzrHc7qKrvw",
  "UCcEKG5IfAy98Bsq22BRdd3w",
  "UCa6pwWBxWGN_sbu-cRzmVhQ",
  "UC1a64wDM2U2tmBjOXDLzG2A",
  "UCJMB-wFtgg1mwXArhIXfqJQ",
  "UCAK5HqgxgQtUVpOt02QRV_A",
  "UCiyqsxhovAvQs1DD1BitQYg",
  "UCmmbpRQXA3yXPIV-QgqsqRQ",
  "UCb39vdyInPuc243ZpifXGqw",
  "UC-As-g5ue_RLEyY-0e0hrUA",
  "UCmDTLdNQpib09JQ9CD-hOrQ",
  "UCuQo6rIIDojEY7EvgqMLiBg",
  "UCoq7i8ssXnZFovexOuU_NPg",
  "UCX_2YmQT4S32O1FDdJL69yA",
  "UC5Y8SHg5AvmTTbmi31QxNbg",
  "UCq23UW0XOcVqfUuwbzUXK8Q",
  "UCN7OXKo3aTWdYb6oeMmGu8A",
  "UCRqE6DjYrBpztJ9h56nF8Wg",
  "UCjaPagXdq6U2Irmjs0acTFQ",
  "UC6O0ufi6I8hdtxbAO0bIKSQ"
];

async function fetchLiveYouTubeData() {
  const idsString = CHANNEL_IDS.join(',');
  const url = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${idsString}&key=${API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!data.items) {
      console.error("Gagal menarik data dari YouTube API");
      return;
    }

    // Tukar format data dari API ke format Liga Kotak
    const formattedChannels = data.items.map((item, index) => ({
      i: index,
      id: item.id,
      name: item.snippet.title,
      handle: item.snippet.customUrl || `@${item.snippet.title.replace(/\s+/g, '').toLowerCase()}`,
      avatar: item.snippet.thumbnails.default?.url || null,
      description: item.snippet.description || "",
      country: item.snippet.country || "MY",
      subs: parseInt(item.statistics.subscriberCount || 0),
      views: parseInt(item.statistics.viewCount || 0),
      videos: parseInt(item.statistics.videoCount || 0),
      g: {
        subs: { 7: 0, 14: 0, 28: 0, 180: 0 },
        views: { 7: 0, 14: 0, 28: 0, 180: 0 }
      }
    }));

    // Simpan data live ke dalam sistem
    if (window.DATA) {
      window.DATA = formattedChannels;
      formattedChannels.forEach(c => { window.BYID[c.id] = c; });
      if (typeof rerender === 'function') rerender();
    }
  } catch (error) {
    console.error("Ralat sambungan API:", error);
  }
}

// Jalankan auto-fetch sebaik sahaja laman web dibuka
document.addEventListener('DOMContentLoaded', fetchLiveYouTubeData);
