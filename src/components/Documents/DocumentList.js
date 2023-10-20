import { push } from "../../utils/router.js";

export default function DocumentList({ $target, initialState, onClick, onDelete }) {
  const $documentList = document.createElement("div");

  $documentList.className = "document-list";
  $target.appendChild($documentList);

  this.state = initialState;

  this.setState = (nextState) => {
    this.state = {
      ...this.state,
      ...nextState,
    };
    this.render();
  };

  this.setDepth = (documentList, hide = false) => {
    const depth = `
      <ul class=${hide ? "hidden" : ""}>
        ${documentList
          .map((doc) => {
            return `<li class="item" data-id=${doc.id}> 
            <span name="item-content"> ${doc.title} </span> 
            <button name="addBtn" > + </button> 
            <button name="deleteBtn"> - </button>
          </li>
              ${doc.documents && doc.documents.length > 0 ? this.setDepth(doc.documents, !this.state.selectedDocument.has(`${doc.id}`)) : ""}
            `;
          })
          .join("")}
      </ul>
    `;
    return depth;
  };

  this.render = () => {
    $documentList.innerHTML = "";
    if (this.state.document.length > 0) {
      $documentList.innerHTML = this.setDepth(this.state.document) + `<button name="addButton" id="newPage"> 새 페이지 생성 </button>`;
    } else {
      $documentList.innerHTML = `
        <button name="addButton" id="newPage"> 새 페이지 생성 </button>
      `;
    }
  };

  $documentList.addEventListener("click", (e) => {
    const { target } = e;
    const Untitle = "제목 없음";
    const $li = target.closest("li");
    const id = $li?.dataset.id;

    if (target.tagName === "BUTTON") {
      if (target.name === "addButton") {
        this.setState({ selectedDocument: this.state.selectedDocument.add(id) });
        onClick({ parent: id || null, title: Untitle });
      } else if (target.name === "deleteButton") onDelete({ id });
    } else if (target.getAttribute("name") === "item-content") {
      const selectedDocument = this.state.selectedDocument;

      if (selectedDocument.has(id)) selectedDocument.delete(id);
      else selectedDocument.add(id);

      this.setState({ selectedDocument });
      push(`/documents/${id}`);
    }
  });
}
