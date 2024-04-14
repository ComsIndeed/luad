import { matchSorter } from "match-sorter";

function createQueryItemString(documentItem) {
  return `<ID>${documentItem?.id}</ID> ${documentItem?.head?.author || ""}${
    documentItem?.head?.author || ""
  }${documentItem?.head?.author || ""}${documentItem?.head?.author || ""}${
    documentItem?.head?.author || ""
  } ${documentItem?.head?.title || ""}${documentItem?.head?.title || ""}${
    documentItem?.head?.title || ""
  }${documentItem?.body || ""}`;
}

function documentListToQueryList(documentList) {
  return documentList.map((document) => {
    return createQueryItemString(document);
  });
}

function extractIdFromQueryItem(queryItem) {
  const regex = /<ID>(.*?)<\/ID>/;
  const match = queryItem.match(regex);
  return match ? match[1] : null;
}

export function sortByMatch(documentList, query) {
  const queryList = documentListToQueryList(documentList);

  const matchedQueries = matchSorter(queryList, query, {
    keepDiacritics: true,
  });

  const matchedDocumentIds = matchedQueries.map((matchedQueryItem) => {
    return extractIdFromQueryItem(matchedQueryItem);
  });

  const matchedDocuments = matchedDocumentIds.map((documentID) => {
    return documentList.find((documentItem) => {
      return documentID === documentItem.id;
    });
  });

  return matchedDocuments;
}
