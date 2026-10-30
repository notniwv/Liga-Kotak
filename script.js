(function() {
  var API_KEY = 'AIzaSyA_ZvMbI32k0M6VPnANIstUB8NB5U5NeuE';
  var CHANNEL_IDS = [
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

  window.addEventListener('DOMContentLoaded', function() {
    var url = 'https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=' + CHANNEL_IDS.join(',') + '&key=' + API_KEY;
    
    fetch(url)
      .then(function(res) { return res.json(); })
      .then(function(data) {
        if (!data.items) return;
        var channels = data.items.map(function(item, index) {
          return {
            i: index,
            id: item.id,
            name: item.snippet.title,
            handle: item.snippet.customUrl || ('@' + item.snippet.title.replace(/\s+/g, '').toLowerCase()),
            avatar: item.snippet.thumbnails.default ? item.snippet.thumbnails.default.url : null,
            description: item.snippet.description || "",
            country: item.snippet.country || "MY",
            subs: parseInt(item.statistics.subscriberCount || 0),
            views: parseInt(item.statistics.viewCount || 0),
            videos: parseInt(item.statistics.videoCount || 0),
            g: { subs: { 7: 0, 14: 0, 28: 0, 180: 0 }, views: { 7: 0, 14: 0, 28: 0, 180: 0 } },
            series: null
          };
        });

        // Paksa masukkan data ke sistem website
        window.DATA = channels;
        window.BYID = {};
        channels.forEach(function(c) { window.BYID[c.id] = c; });
        
        if (typeof rerender === 'function') {
          rerender();
        } else if (typeof init === 'function') {
          init();
        } else {
          location.reload();
        }
      })
      .catch(function(err) {
        console.error("Ralat API:", err);
      });
  });
})();
