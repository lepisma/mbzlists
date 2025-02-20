async function checkImage(url) {
  try {
    const response = await fetch(url, { method: "HEAD" });
    return response.ok;
  } catch (error) {
    return false;
  }
}

export async function getCoverArt(releaseId: string) {
  const url = `https://coverartarchive.org/release/${releaseId}/front-250`;
  const isValid = await checkImage(url);
  if (isValid) {
    return url;
  };
}
