export enum EEditorLanguage {
    Json = 'json',
    Xml = 'xml',
    Text = 'text',
    /** fc-text with support {{ }} syntax formatting for variable support*/
    FcText = 'fc-text',
    Html = 'html',
    GraphQl = 'graphql',
    GraphQlDev = 'graphqlDev', // TODO: check graphqlDev required or not
    HeaderKey = 'header-key',
    HeaderValue = 'header-value',

    JavaScript = 'javascript',
    TypeScript = 'typescript'
}

export enum EEditorTheme {
    Dark = 'editor-dark',
    Lite = 'editor-lite'
}