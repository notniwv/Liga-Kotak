(function() {
  var API_KEY = 'AIzaSyA_ZvMbI32k0M6VPnANIstUB8NB5U5NeuE';

  // Pintas fungsi asal website bila ia cuba baca data.json
  var originalFetch = window.fetch;
  window.fetch = function(url, options) {
    if (typeof url === 'string' && url.indexOf('data.json') > -1) {
      
      // Ambil senarai ID dari fail data.json secara automatik
      return originalFetch(url, options)
        .then(function(res) { return res.json(); })
        .then(function(jsonData) {
          var ids = (jsonData.channels || []).map(function(c) { return c.id; });
          if (!ids.length) throw new Error("Tiada ID");

          var ytUrl = 'https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=' + ids.join(',') + '&key=' + API_KEY;
          
          return originalFetch(ytUrl);
        })
        .then(function(res) { return res.json(); })
        .then(function(ytData) {
          if (!ytData.items) throw new Error("API Gagal");

          var channels = ytData.items.map(function(item, index) {
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
              g: {
                subs: { 7: 0, 14: 0, 28: 0, 180: 0 },
                views: { 7: 0, 14: 0, 28: 0, 180: 0 }
              },
              series: null
            };
          });

          return {
            ok: true,
            json: function() {
              return Promise.resolve({
                updated: new Date().toISOString(),
                channels: channels
              });
            }
          };
        })
        .catch(function(err) {
          console.warn("Gagal tarik YouTube API, guna data asal:", err);
          return originalFetch(url, options);
        });
    }
    return originalFetch(url, options);
  };
})();
