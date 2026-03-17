(async () => {
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const normalize = (value) => String(value || '').replace(/\s+/g, ' ').trim();

  const extractVideoId = (value) => {
    const text = String(value || '');
    const match =
      text.match(/\/video\/([A-Za-z0-9_-]{11})\//) ||
      text.match(/[?&]v=([A-Za-z0-9_-]{11})/) ||
      text.match(/youtu\.be\/([A-Za-z0-9_-]{11})/);
    return match?.[1] || '';
  };

  const inferVisibility = (text) => {
    const normalized = normalize(text).toLowerCase();
    if (/일부 공개|일부공개|unlisted/.test(normalized)) return 'unlisted';
    if (/비공개|private/.test(normalized)) return 'private';
    if (/공개|public/.test(normalized)) return 'public';
    return '';
  };

  let previousCount = -1;
  let stablePasses = 0;

  while (stablePasses < 3) {
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
    await sleep(1200);
    const count = document.querySelectorAll('ytcp-video-row').length;
    if (count === previousCount) {
      stablePasses += 1;
    } else {
      stablePasses = 0;
      previousCount = count;
    }
  }

  const rows = [...document.querySelectorAll('ytcp-video-row')].map((row, index) => {
    const text = normalize(row.textContent);
    const anchors = [...row.querySelectorAll('a')].map((anchor) => ({
      href: anchor.href || '',
      text: normalize(anchor.textContent),
      id: anchor.id || '',
    }));
    const titleAnchor =
      row.querySelector('a#video-title') ||
      row.querySelector('#video-title-link') ||
      anchors.find((anchor) => /\/video\/[A-Za-z0-9_-]{11}\//.test(anchor.href) && anchor.text);
    const thumbnail = row.querySelector('img')?.src || '';
    const hrefWithId = anchors.find((anchor) => extractVideoId(anchor.href));
    const textWithId = anchors.find((anchor) => extractVideoId(anchor.text));
    const videoId = extractVideoId(hrefWithId?.href) || extractVideoId(textWithId?.text);

    return {
      index,
      title: normalize(titleAnchor?.textContent || titleAnchor?.text || ''),
      text,
      visibility: inferVisibility(text),
      thumbnail,
      videoId,
      watchUrl: videoId ? `https://www.youtube.com/watch?v=${videoId}` : '',
      anchors,
    };
  });

  const payload = {
    exportedAt: new Date().toISOString(),
    url: location.href,
    title: document.title,
    count: rows.length,
    unlistedCount: rows.filter((row) => row.visibility === 'unlisted').length,
    rows,
  };

  const json = JSON.stringify(payload, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'studio-videos.json';
  link.click();
  URL.revokeObjectURL(url);

  try {
    await navigator.clipboard.writeText(json);
    console.log('studio-videos.json downloaded and copied to clipboard.');
  } catch {
    console.log('studio-videos.json downloaded.');
  }

  console.log(payload);
})();
