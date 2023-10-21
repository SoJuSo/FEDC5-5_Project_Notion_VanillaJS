import EditContent from "./EditContent.js";
import EditInfo from "./EditInfo.js";
import EditTitle from "./EditTitle.js";

export default function Editor({ target, state, onEditing }) {
  const editorElement = document.createElement("div");
  editorElement.setAttribute("class", "pageViewer_editor");
  target.appendChild(editorElement);

  this.state = state;

  this.setState = (newState) => {
    this.state = newState;
    const { title, createdAt, updatedAt, content } = this.state;

    editTitlte.setState(title);
    editInfo.setState({ createdAt, updatedAt });
    editContent.setState(content);
  };

  const editTitlte = new EditTitle({
    target: editorElement,
    state: "",
  });

  const editInfo = new EditInfo({
    target: editorElement,
    state: {
      createdAt: "",
      updatedAt: "",
    },
  });

  const editContent = new EditContent({
    target: editorElement,
    state: "",
  });

  /* Event */

  editorElement.addEventListener("keyup", () => {
    const titleValue =
      editorElement.querySelector("[data-name=title]").value ?? "";
    const contentValue =
      editorElement.querySelector("[data-name=content]").innerText ?? "";

    const focus = document.getSelection().focusOffset;

    const newState = {
      id: this.state.id,
      title: titleValue,
      content: contentValue,
      createdAt: this.state.createdAt,
      updatedAt: this.state.updatedAt,
    };
    onEditing(newState);
  });

  this.getElement = () => {
    return editorElement;
  };
}
