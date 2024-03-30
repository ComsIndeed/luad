import React, { useEffect, useState } from "react";
import {
  fetchFromFirestore,
  removeDocFromFirestore,
} from "../../Library/firestore";
import {
  createSrcSet,
  useDocumentInterface,
} from "../../Library/firestoreHooks";
import handleImportFromDocs from "../../Library/googleDocsLibrary";
import { db, storage } from "../../Library/firebase";
import { useGoogleAuthState } from "../../Library/googleOauth";
import { Content } from "../../Configuration/config";

export default function ContentManagement() {
  const [firestoreCollection, setFirestoreCollection] = useState([]);
  const CMS = useDocumentInterface(db, storage);

  useEffect(() => {
    fetchFromFirestore("/documents", undefined, true).then(
      (returnedCollection) => {
        setFirestoreCollection(returnedCollection);
      }
    );
  }, []);

  return (
    <>
      <div className="ContentManagement">
        <h1>Content Management</h1>
        <CreateView CMS={CMS} />
        <DocumentListView
          CMS={CMS}
          firestoreCollection={firestoreCollection}
          setFirestoreCollection={setFirestoreCollection}
        />
      </div>
    </>
  );
}

function CreateView({ CMS }) {
  const GoogleOauth = useGoogleAuthState(
    "https://www.googleapis.com/auth/documents.readonly"
  );

  return (
    <>
      <div className="CreateView">
        <h2>Create new post</h2>

        <ImportFromDocs GoogleOauth={GoogleOauth} CMS={CMS} />

        <label>Title</label>
        <input
          type="text"
          name="title"
          value={CMS.objectEntry?.title || ""}
          id="TitleInput"
          onChange={CMS.handleInputChange}
        />
        <label>Author</label>
        <input
          type="text"
          name="author"
          value={CMS.objectEntry?.author || ""}
          id="AuthorInput"
          onChange={CMS.handleInputChange}
        />
        <label>Body</label>
        <textarea
          name="body"
          id="TitleInput"
          onChange={CMS.handleInputChange}
          value={CMS.objectEntry?.body || ""}
        />

        <CategorySelection CMS={CMS} />

        <input
          type="file"
          name="headerImage"
          id="FileInput"
          onChange={CMS.handleFileInputChange}
        />

        <button onClick={CMS.handlePushEntry}>Add to drafts</button>

        <br />
        <br />
        <br />
      </div>
    </>
  );
}

function CategorySelection({ CMS }) {
  const [selectedCategories, setSelectedCategories] = useState([]);

  const handleCategorySelection = (e) => {
    if (e.target.checked) {
      if (!selectedCategories.includes(e.target.name)) {
        setSelectedCategories((prev) => {
          return [...prev, e.target.name];
        });
      }
    } else if (!e.target.checked) {
      setSelectedCategories((prev) => {
        return prev.filter((item) => item != e.target.name);
      });
    }
  };

  useEffect(() => {
    CMS.setObjectEntryCategory(selectedCategories);
  }, [selectedCategories]);

  return (
    <>
      <form>
        <p>Categories</p> <br />
        {Content.categories.map((categoryItem) => {
          return (
            <React.Fragment key={categoryItem}>
              <input
                type="checkbox"
                name={categoryItem}
                id={categoryItem + "Selection"}
                onChange={handleCategorySelection}
              />
              <label htmlFor={categoryItem}>
                {categoryItem[0].toUpperCase() + categoryItem.slice(1)}
              </label>{" "}
              <br />
            </React.Fragment>
          );
        })}
      </form>
    </>
  );
}

function ImportFromDocs({ GoogleOauth, CMS }) {
  const [docLink, setDocLink] = useState("");

  return (
    <>
      <div className="GoogleDocsImport sectionDivider">
        <h3>Google Docs Import</h3>
        <br />
        <p>
          Signed in as:{" "}
          {GoogleOauth?.userInfo
            ? GoogleOauth?.userInfo?.name
            : "Not signed in :("}
          {!GoogleOauth?.userInfo && (
            <>
              <br />
              <button
                onClick={() => {
                  GoogleOauth.login();
                }}
              >
                Authorize Google Docs Access
              </button>
            </>
          )}
        </p>
        {GoogleOauth?.userInfo && (
          <>
            <br />
            <button
              onClick={() => {
                GoogleOauth.logout();
              }}
            >
              Logout
            </button>
            <br />
            <input
              type="text"
              name="DocLinkInput"
              id="docLinkInput"
              placeholder="Google Doc link"
              value={docLink}
              onChange={(e) => {
                setDocLink(e.target.value);
              }}
            />
            <button
              onClick={() => {
                handleImportFromDocs(
                  docLink,
                  GoogleOauth?.loginResponse?.access_token,
                  CMS.pushImportedDocumentEntry
                );
                setDocLink("");
              }}
            >
              Import document
            </button>
          </>
        )}
      </div>
    </>
  );
}

function DocumentListView({
  CMS,
  firestoreCollection,
  setFirestoreCollection,
}) {
  const [list, setList] = useState("firestore");

  return (
    <>
      <div className="DocumentListView">
        <div className="buttonsTab">
          <button
            onClick={() => {
              setList("firestore");
            }}
            className="tab"
          >
            Firestore
          </button>
          <button
            onClick={() => {
              setList("drafts");
            }}
            className="tab"
          >
            Drafts
          </button>
        </div>
        {list === "firestore" && (
          <FirestoreList
            firestoreCollection={firestoreCollection}
            CMS={CMS}
            setFirestoreCollection={setFirestoreCollection}
          />
        )}
        {list === "drafts" && <DraftList CMS={CMS} />}
      </div>
    </>
  );
}

function FirestoreList({ firestoreCollection, CMS, setFirestoreCollection }) {
  return (
    <>
      <div className="FirestoreList">
        <h2>Firestore Database: {firestoreCollection.length} </h2>
        {firestoreCollection.map((firestoreDocument, index) => {
          return (
            <FirestoreListItem
              firestoreDocument={firestoreDocument}
              key={firestoreDocument?.id}
              index={index}
              CMS={CMS}
              setFirestoreCollection={setFirestoreCollection}
            />
          );
        })}
      </div>
    </>
  );
}

function FirestoreListItem({
  firestoreDocument,
  index,
  CMS,
  setFirestoreCollection,
}) {
  const [showEditPanel, setShowEditPanel] = useState(false);
  const [changes, setChanges] = useState({
    categories: [...firestoreDocument?.head?.meta?.category],
  });
  const [srcSet, setSrcSet] = useState(null);
  const [isReady, setIsReady] = useState(true);

  const handleEditInputChange = (e) => {
    setChanges((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.value,
      };
    });
  };

  const handleEditFileInputChange = (e) => {
    if (e.target.files[0]) {
      setIsReady(false);
      createSrcSet(e, undefined, "blob").then((returned) => {
        setSrcSet(returned);
        setIsReady(true);
      });
    }
  };

  // const [x, setX] = useState(0);
  // useEffect(() => {
  //   if (x > 0) {
  //     console.log(changes);
  //   }
  //   setX((prev) => prev + 1);
  // }, [changes]);

  useEffect(() => {
    if (srcSet) {
      setChanges((prev) => {
        return {
          ...prev,
          headerImage: srcSet,
        };
      });
    }
  }, [srcSet]);

  const handleCheckboxChange = (e) => {
    if (!changes?.categories.length > 0) {
      setChanges((prev) => {
        return {
          ...prev,
          categories: [],
        };
      });
    }

    // TODO: Initialvalue of category list must have the initially listed categories before updating changes

    if (e.target.checked) {
      if (!changes?.categories.includes(e.target.name)) {
        setChanges((prev) => {
          return {
            ...prev,
            categories: [...prev?.categories, e.target.name],
          };
        });
      }
    }
    if (!e.target.checked) {
      setChanges((prev) => {
        return {
          ...prev,
          categories: prev?.categories.filter((item) => item != e.target.name),
        };
      });
    }
  };

  return (
    <>
      <div className="FirestoreListItem">
        <div className="info">
          <h3>{index + 1}</h3>
          <p>{firestoreDocument?.head?.title}</p>
          <p>{firestoreDocument?.head?.author}</p>
        </div>
        <div className="buttons">
          <button onClick={() => [setShowEditPanel(!showEditPanel)]}>
            Edit document
          </button>
          <button
            onClick={() => {
              removeDocFromFirestore(
                firestoreDocument.id,
                setFirestoreCollection,
                true,
                "/documents"
              );
            }}
          >
            Delete document
          </button>
        </div>
        {showEditPanel && (
          <div className="editPanel">
            <h3>Editing: {firestoreDocument?.head?.title}.. </h3> <br />
            <input
              type="text"
              placeholder="Title"
              name="title"
              onChange={handleEditInputChange}
              defaultValue={firestoreDocument?.head?.title}
            />{" "}
            <br />
            <label>Header Image: </label>{" "}
            <input
              type="file"
              name="headerImage"
              id="headerImageFileInput"
              onChange={handleEditFileInputChange}
            />
            <input
              type="text"
              placeholder="Author"
              name="author"
              onChange={handleEditInputChange}
              defaultValue={firestoreDocument?.head?.author}
            />{" "}
            <br />
            <textarea
              type="text"
              placeholder="Body"
              name="body"
              onChange={handleEditInputChange}
              defaultValue={firestoreDocument?.body}
            />{" "}
            {Content.categories.map((categoryItem) => {
              return (
                <React.Fragment key={categoryItem}>
                  <input
                    type="checkbox"
                    name={categoryItem}
                    id={categoryItem + "Selection"}
                    defaultChecked={firestoreDocument?.head?.meta?.category?.includes(
                      categoryItem
                    )}
                    onChange={handleCheckboxChange}
                  />
                  <label htmlFor={categoryItem}>
                    {categoryItem[0].toUpperCase() + categoryItem.slice(1)}
                  </label>{" "}
                  <br />
                </React.Fragment>
              );
            })}
            <br />
            <button
              onClick={() => {
                CMS.updateFirestoreDocument(firestoreDocument?.id, changes);
                setShowEditPanel(false);
              }}
              disabled={!isReady}
            >
              Update document
            </button>{" "}
            <button
              onClick={() => {
                console.log(changes);
              }}
            >
              Log changes
            </button>{" "}
            <button
              onClick={() => {
                alert(
                  "Cancelling edits is yet to be available. Pakiremind nalang po ako kung nakalimutan ko po na ayusin haha"
                );
                setShowEditPanel(false);
              }}
            >
              Discard changes
            </button>
          </div>
        )}
      </div>
    </>
  );
}

function DraftList({ CMS }) {
  return (
    <>
      <div className="DraftList">
        <h2> DRAFT LIST: {CMS.objectEntryList?.length} </h2>
        {CMS.objectEntryList.length === 0 && "Looking empty in here.."}
        {CMS.objectEntryList.length > 0 &&
          CMS.objectEntryList?.map((objectEntryItem, index) => (
            <DraftListItem
              objectEntryItem={objectEntryItem}
              CMS={CMS}
              key={objectEntryItem.entryID}
              index={index}
            />
          ))}
      </div>
      <button onClick={() => console.log(CMS.objectEntryList)}>Log</button>
      <button
        onClick={() => {
          CMS.uploadEntries();
        }}
      >
        Save and upload changes
      </button>
      <button onClick={CMS.handleDiscardAllEntries}>Discard changes</button>
    </>
  );
}

function DraftListItem({ objectEntryItem, CMS, index }) {
  const [showEditPanel, setShowEditPanel] = useState(false);
  const [changes, setChanges] = useState({});

  useEffect(() => {
    console.log(changes);
  }, [changes]);

  const handleEditInputChange = (e) => {
    setChanges((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.value,
      };
    });
  };

  const handleEditFileInputChange = (e) => {
    createSrcSet(e, undefined, "blob").then((returnedSrcSet) => {
      setChanges((prev) => {
        return {
          ...prev,
          headerImage: returnedSrcSet,
        };
      });
    });
  };

  return (
    <div className="DraftEntryItem">
      <div className="info">
        <h3>{index + 1}</h3>
        <div className="text">
          <p>{objectEntryItem.title}</p> <br />
          <p>{objectEntryItem.author || "Author wasnt provided"}</p>
        </div>
      </div>
      <div className="buttons">
        <button onClick={() => CMS.removeDraftByUuid(objectEntryItem.entryID)}>
          Discard draft
        </button>
        <button onClick={() => console.log(objectEntryItem)}>Log draft</button>
        <button onClick={() => setShowEditPanel(!showEditPanel)}>
          Edit draft
        </button>
      </div>
      {showEditPanel && (
        <div className="editPanel">
          <input
            type="text"
            defaultValue={objectEntryItem.title}
            placeholder="Title"
            name="title"
            onChange={handleEditInputChange}
          />{" "}
          <br />
          <label>Header Image: </label>
          <input type="file" onChange={handleEditFileInputChange} /> <br />
          <input
            type="text"
            defaultValue={objectEntryItem.author}
            placeholder="Author"
            name="author"
            onChange={handleEditInputChange}
          />{" "}
          <br />
          <textarea
            defaultValue={objectEntryItem.body}
            placeholder="Body"
            name="body"
            onChange={handleEditInputChange}
          />
          <div className="editButtons">
            <button
              onClick={() => {
                console.log("TEST: ", CMS.getEntryByID(objectEntryItem.id));
                CMS.editEntry(objectEntryItem.entryID, changes);
              }}
            >
              Save changes
            </button>
            <button>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
