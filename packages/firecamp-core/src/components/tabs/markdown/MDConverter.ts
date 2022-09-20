// @ts-nocheck

import myMarked from 'marked';

export default class MDConvertor {
  static _toHTML = (markdown) => {
    if (!markdown) return;

    let html;
    myMarked.setOptions({
      renderer: new myMarked.Renderer(),
      pedantic: false,
      gfm: true,
      tables: true,
      breaks: false,
      sanitize: false,
      smartLists: true,
      smartypants: false,
      xhtml: false,
    });
    html = myMarked(markdown);

    return Promise.resolve(html);
  };
}
