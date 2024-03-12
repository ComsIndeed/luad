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

function parseDocument(documentObject) {
  // Extract the content from the documentObject
  let parsedDocument = documentObject.body.content;

  // Initialize variables for header, body, and rawBigText
  let header = "";
  let body = "";
  let rawBigText = "";

  // Iterate through each item in the parsedDocument
  parsedDocument.forEach((item) => {
    // Check if the item has a "paragraph" property
    if (item.hasOwnProperty("paragraph")) {
      // Map each textRun from paragraph elements and push to rawBigText
      item.paragraph.elements.forEach((arrayItem) => {
        if (arrayItem.hasOwnProperty("textRun")) {
          rawBigText += arrayItem.textRun.content + " ";
        }
      });
    }
  });

  // Find the index of the first newline character
  const firstNewlineIndex = rawBigText.indexOf("\n");

  // Extract the header from the raw big text
  if (firstNewlineIndex !== -1) {
    header = rawBigText.substring(0, firstNewlineIndex);
    // Extract the body from the raw big text (excluding the header)
    body = rawBigText.substring(firstNewlineIndex + 1);
  } else {
    // If there's no newline character, the entire big text is considered as the header
    header = rawBigText;
  }

  // Return an object with header, body, and rawBigText properties
  return { header, body, rawBigText };
}

export {
  fetchDocument,
  extractDocId,
  extractDocLinksFromJSON,
  extractDocIdsFromJSON,
};
