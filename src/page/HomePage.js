import DocumentDetail from '../components/template/DocumentDetail.js';
import NotionSideBar from '../components/template/NotionSideBar.js';
import { request } from '../services/api.js';
import { initRouter } from '../utils/router.js';
import styleInJS from '../style/tagStyles.js';

/*
 * HomePage
 * - NotionSideBar
 * - DocumentDetail
 * */

export default function HomePage({ $target }) {
  const $homePage = document.createElement('div');
  styleInJS({ $target: $homePage, styleTagName: 'HomePage' });
  $target.appendChild($homePage);

  this.state = [];

  const notionSideBar = new NotionSideBar({ $target: $homePage, initialState: [] });
  const documentDetail = new DocumentDetail({
    $target: $homePage,
    documentState: { id: null, title: '첫 화면', content: '내용을 채워주세요', documentPath: [] },
  });

  this.setState = nextState => {
    this.state = nextState;
    this.route();
  };

  this.init = async () => {
    const resqonseData = await request('/documents');
    this.setState(resqonseData);
    this.route();
  };

  this.init();

  const findDocumentDataById = id => {
    const documentPath = [];

    const findDocument = (documents, id) => {
      for (const document of documents) {
        if (document.id === id) {
          documentPath.push({ title: document.title, id: document.id });
          documentPath.push();
          return true;
        }
        if (document.documents.length > 0) {
          documentPath.push({ title: document.title, id: document.id });
          if (findDocument(document.documents, id)) return true;
          documentPath.pop();
        }
      }
    };
    findDocument(this.state, id);

    return documentPath;
  };

  this.route = async () => {
    // $homePage.innerHTML = '';

    const { pathname } = window.location;

    const newDocuments = await request(`/documents`);
    if (pathname === '/') {
      // home 보여주기
      notionSideBar.setState(newDocuments);
      documentDetail.setState(null);
    } else if (pathname.indexOf('/documents/') === 0) {
      const [, , postId] = pathname.split('/');
      const documentContent = request(`/documents/${postId}`);
      const documentPathData = findDocumentDataById(Number(postId));

      // sidebar 업데이트
      notionSideBar.setState(newDocuments);

      // document 보여주기
      const { content } = await documentContent;

      const nextState = {
        id: postId,
        title: documentPathData.at(-1)?.title || '첫 화면',
        content: content || '내용을 채워주세요',
        documentPath: documentPathData,
      };

      documentDetail.setState(nextState);
    }
  };

  initRouter(this.route);

  window.addEventListener('popstate', e => {
    this.route();
  });
}
