const fetchDocument = async (documentId, accessToken) => {
  try {
    const response = await fetch(
      `https://docs.googleapis.com/v1/documents/${documentId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch document: ${response.statusText}`);
    }

    const document = await response.json();
    return document;
  } catch (error) {
    throw error;
  }
};

function extractDocId(link) {
  const regex = /\/document\/d\/([a-zA-Z0-9-_]+)/;
  const match = regex.exec(link);

  if (match) {
    return match[1];
  } else {
    return null;
  }
}

function extractDocIds(docLinks) {
  const docIds = [];
  const pattern = /\/document\/d\/([a-zA-Z0-9-_]+)/;

  for (const link of docLinks) {
    const match = link.match(pattern);
    if (match) {
      docIds.push(match[1]);
    }
  }

  return docIds;
}

function extractDocLinksFromJSON(jsonData) {
  const docLinks = [];
  const pattern =
    /https:\/\/docs\.google\.com\/document\/d\/([a-zA-Z0-9-_]+)(?:\?.*)?/g;

  function searchJson(data) {
    if (typeof data === "string") {
      const matches = data.matchAll(pattern);
      for (const match of matches) {
        docLinks.push(match[0]);
      }
    } else if (Array.isArray(data)) {
      data.forEach(searchJson);
    } else if (typeof data === "object") {
      Object.values(data).forEach(searchJson);
    }
  }

  searchJson(jsonData);
  return docLinks;
}

function extractDocIdsFromJSON(jsonData) {
  const docLinks = extractDocLinksFromJSON(jsonData);
  const docIDs = extractDocIds(docLinks);
  return docIDs;
}

export {
  fetchDocument,
  extractDocId,
  extractDocLinksFromJSON,
  extractDocIdsFromJSON,
};
