const headers = [
  {
    name: 'A-IM',
    description: 'Acceptable instance-manipulations for the request.[10]',
    example: 'A-IM: feed',
    status: 'Permanent',
    standard: 'RFC 3229',
  },
  {
    name: 'Accept',
    description:
      'Media type(s) that is/are acceptable for the response. See Content negotiation.',
    example: 'Accept: text/html',
    status: 'Permanent',
    standard: 'RFC 2616, 7231',
  },
  {
    name: 'Accept-Charset',
    description: 'Character sets that are acceptable.',
    example: 'Accept-Charset: utf-8',
    status: 'Permanent',
    standard: 'RFC 2616',
  },
  {
    name: 'Accept-Datetime',
    description: 'Acceptable version in time.',
    example: 'Accept-Datetime: Thu, 31 May 2007 20:35:00 GMT',
    status: 'Provisional',
    standard: 'RFC 7089',
  },
  {
    name: 'Accept-Encoding',
    description: 'List of acceptable encodings. See HTTP compression.',
    example: 'Accept-Encoding: gzip, deflate',
    status: 'Permanent',
    standard: 'RFC 2616, 7231',
  },
  {
    name: 'Accept-Language',
    description:
      'List of acceptable human languages for response. See Content negotiation.',
    example: 'Accept-Language: en-US',
    status: 'Permanent',
    standard: 'RFC 2616, 7231',
  },
  {
    name: 'Access-Control-Request-Method,\nAccess-Control-Request-Headers[11]',
    description:
      'Initiates a request for cross-origin resource sharing with Origin (below).',
    example: 'Access-Control-Request-Method: GET',
    status: 'Permanent: standard',
    standard: '',
  },
  {
    name: 'Authorization',
    description: 'Authentication credentials for HTTP authentication.',
    example: 'Authorization: Basic QWxhZGRpbjpvcGVuIHNlc2FtZQ==',
    status: 'Permanent',
    standard: '',
  },
  {
    name: 'Cache-Control',
    description:
      'Used to specify directives that must be obeyed by all caching mechanisms along the request-response chain.',
    example: 'Cache-Control: no-cache',
    status: 'Permanent',
    standard: '',
  },
  {
    name: 'Connection',
    description:
      'Control options for the current connection and list of hop-by-hop request fields.[12] Must not be used with HTTP/2.[13]',
    example: 'Connection: keep-alive Connection: Upgrade',
    status: 'Permanent',
    standard: '',
  },
  {
    name: 'Content-Encoding',
    description: 'The type of encoding used on the data. See HTTP compression.',
    example: 'Content-Encoding: gzip',
    status: 'Permanent',
    standard: '',
  },
  {
    name: 'Content-Length',
    description: 'The length of the request body in octets (8-bit bytes).',
    example: 'Content-Length: 348',
    status: 'Permanent',
    standard: '',
  },
  {
    name: 'Content-MD5',
    description:
      'A Base64-encoded binary MD5 sum of the content of the request body.',
    example: 'Content-MD5: Q2hlY2sgSW50ZWdyaXR5IQ==',
    status: 'Obsolete[14]',
    standard: '',
  },
  {
    name: 'Content-Type',
    description:
      'The Media type of the body of the request (used with POST and PUT requests).',
    example: 'Content-Type: application/x-www-form-urlencoded',
    status: 'Permanent',
    standard: '',
  },
  {
    name: 'Cookie',
    description:
      'An HTTP cookie previously sent by the server with Set-Cookie (below).',
    example: 'Cookie: $Version=1; Skin=new;',
    status: 'Permanent: standard',
    standard: '',
  },
  {
    name: 'Date',
    description:
      'The date and time at which the message was originated (in "HTTP-date" format as defined by RFC 7231 Date/Time Formats).',
    example: 'Date: Tue, 15 Nov 1994 08:12:31 GMT',
    status: 'Permanent',
    standard: '',
  },
  {
    name: 'Expect',
    description:
      'Indicates that particular server behaviors are required by the client.',
    example: 'Expect: 100-continue',
    status: 'Permanent',
    standard: '',
  },
  {
    name: 'Forwarded',
    description:
      'Disclose original information of a client connecting to a web server through an HTTP proxy.[15]',
    example:
      'Forwarded: for=192.0.2.60;proto=http;by=203.0.113.43 Forwarded: for=192.0.2.43, for=198.51.100.17',
    status: 'Permanent',
    standard: '',
  },
  {
    name: 'From',
    description: 'The email address of the user making the request.',
    example: 'From: user@example.com',
    status: 'Permanent',
    standard: '',
  },
  {
    name: 'Host',
    description:
      'The domain name of the server (for virtual hosting), and the TCP port number on which the server is listening. The port number may be omitted if the port is the standard port for the service requested. Mandatory since HTTP/1.1.[16] If the request is generated directly in HTTP/2, it should not be used.[17]',
    example: 'Host: en.wikipedia.org:8080 Host: en.wikipedia.org',
    status: 'Permanent',
    standard: '',
  },
  {
    name: 'HTTP2-Settings',
    description:
      'A request that upgrades from HTTP/1.1 to HTTP/2 MUST include exactly one HTTP2-Setting header field. The HTTP2-Settings header field is a connection-specific header field that includes parameters that govern the HTTP/2 connection, provided in anticipation of the server accepting the request to upgrade.[18][19]',
    example: 'HTTP2-Settings: token64',
    status: 'Permanent: standard',
    standard: '',
  },
  {
    name: 'If-Match',
    description:
      'Only perform the action if the client supplied entity matches the same entity on the server. This is mainly for methods like PUT to only update a resource if it has not been modified since the user last updated it.',
    example: 'If-Match: "737060cd8c284d8af7ad3082f209582d"',
    status: 'Permanent',
    standard: '',
  },
  {
    name: 'If-Modified-Since',
    description:
      'Allows a 304 Not Modified to be returned if content is unchanged.',
    example: 'If-Modified-Since: Sat, 29 Oct 1994 19:43:31 GMT',
    status: 'Permanent',
    standard: '',
  },
  {
    name: 'If-None-Match',
    description:
      'Allows a 304 Not Modified to be returned if content is unchanged, see HTTP ETag.',
    example: 'If-None-Match: "737060cd8c284d8af7ad3082f209582d"',
    status: 'Permanent',
    standard: '',
  },
  {
    name: 'If-Range',
    description:
      'If the entity is unchanged, send me the part(s) that I am missing; otherwise, send me the entire new entity.',
    example: 'If-Range: "737060cd8c284d8af7ad3082f209582d"',
    status: 'Permanent',
    standard: '',
  },
  {
    name: 'If-Unmodified-Since',
    description:
      'Only send the response if the entity has not been modified since a specific time.',
    example: 'If-Unmodified-Since: Sat, 29 Oct 1994 19:43:31 GMT',
    status: 'Permanent',
    standard: '',
  },
  {
    name: 'Max-Forwards',
    description:
      'Limit the number of times the message can be forwarded through proxies or gateways.',
    example: 'Max-Forwards: 10',
    status: 'Permanent',
    standard: '',
  },
  {
    name: 'Origin[11]',
    description:
      'Initiates a request for cross-origin resource sharing (asks server for Access-Control-* response fields).',
    example: 'Origin: http://www.example-social-network.com',
    status: 'Permanent: standard',
    standard: '',
  },
  {
    name: 'Pragma',
    description:
      'Implementation-specific fields that may have various effects anywhere along the request-response chain.',
    example: 'Pragma: no-cache',
    status: 'Permanent',
    standard: '',
  },
  {
    name: 'Proxy-Authorization',
    description: 'Authorization credentials for connecting to a proxy.',
    example: 'Proxy-Authorization: Basic QWxhZGRpbjpvcGVuIHNlc2FtZQ==',
    status: 'Permanent',
    standard: '',
  },
  {
    name: 'Range',
    description:
      'Request only part of an entity.  Bytes are numbered from 0.  See Byte serving.',
    example: 'Range: bytes=500-999',
    status: 'Permanent',
    standard: '',
  },
  {
    name: 'Referer [sic]',
    description:
      'This is the address of the previous web page from which a link to the currently requested page was followed. (The word "referrer" has been misspelled in the RFC as well as in most implementations to the point that it has become standard usage and is considered correct terminology)',
    example: 'Referer: http://en.wikipedia.org/wiki/Main_Page',
    status: 'Permanent',
    standard: '',
  },
  {
    name: 'TE',
    description:
      'The transfer encodings the user agent is willing to accept: the same values as for the response header field Transfer-Encoding can be used, plus the "trailers" value (related to the "chunked" transfer method) to notify the server it expects to receive additional fields in the trailer after the last, zero-sized, chunk. Only trailers is supported in HTTP/2.[13]',
    example: 'TE: trailers, deflate',
    status: 'Permanent',
    standard: '',
  },
  {
    name: 'Trailer',
    description:
      'The Trailer general field value indicates that the given set of header fields is present in the trailer of a message encoded with chunked transfer coding.',
    example: 'Trailer: Max-Forwards',
    status: 'Permanent',
    standard: '',
  },
  {
    name: 'Transfer-Encoding',
    description:
      'The form of encoding used to safely transfer the entity to the user. Currently defined methods are: chunked, compress, deflate, gzip, identity. Must not be used with HTTP/2.[13]',
    example: 'Transfer-Encoding: chunked',
    status: 'Permanent',
    standard: '',
  },
  {
    name: 'User-Agent',
    description: 'The user agent string of the user agent.',
    example:
      'User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:12.0) Gecko/20100101 Firefox/12.0',
    status: 'Permanent',
    standard: '',
  },
  {
    name: 'Upgrade',
    description:
      'Ask the server to upgrade to another protocol. Must not be used in HTTP/2.[13]',
    example: 'Upgrade: h2c, HTTPS/1.3, IRC/6.9, RTA/x11, websocket',
    status: 'Permanent',
    standard: '',
  },
  {
    name: 'Via',
    description:
      'Informs the server of proxies through which the request was sent.',
    example: 'Via: 1.0 fred, 1.1 example.com (Apache/1.1)',
    status: 'Permanent',
    standard: '',
  },
  {
    name: 'Warning',
    description:
      'A general warning about possible problems with the entity body.',
    example: 'Warning: 199 Miscellaneous warning',
    status: 'Permanent',
    standard: '',
  },
];

const contentTypes = [
  {
    name: 'application/json',
    description: 'application/json',
  },
  {
    name: 'application/xml',
    description: 'application/xml',
  },
  {
    name: 'application/x-www-form-urlencoded',
    description: 'application/x-www-form-urlencoded',
  },
  {
    name: 'multipart/form-data',
    description: 'multipart/form-data',
  },
  {
    name: 'multipart/byteranges',
    description: 'multipart/byteranges',
  },
  {
    name: 'application/octet-stream',
    description: 'application/octet-stream',
  },
  {
    name: 'text/plain',
    description: 'text/plain',
  },
  {
    name: 'application/javascript',
    description: 'application/javascript',
  },
  {
    name: 'application/pdf',
    description: 'application/pdf',
  },
  {
    name: 'text/html',
    description: 'text/html',
  },
  {
    name: 'image/png',
    description: 'image/png',
  },
  {
    name: 'image/jpeg',
    description: 'image/jpeg',
  },
  {
    name: 'image/gif',
    description: 'image/gif',
  },
  {
    name: 'image/webp',
    description: 'image/webp',
  },
  {
    name: 'text/css',
    description: 'text/css',
  },
  {
    name: 'application/x-pkcs12',
    description: 'application/x-pkcs12',
  },
  {
    name: 'application/xhtml+xml',
    description: 'application/xhtml+xml',
  },
  {
    name: 'application/andrew-inset',
    description: 'application/andrew-inset',
  },
  {
    name: 'application/applixware',
    description: 'application/applixware',
  },
  {
    name: 'application/atom+xml',
    description: 'application/atom+xml',
  },
  {
    name: 'application/atomcat+xml',
    description: 'application/atomcat+xml',
  },
  {
    name: 'application/atomsvc+xml',
    description: 'application/atomsvc+xml',
  },
  {
    name: 'application/bdoc',
    description: 'application/bdoc',
  },
  {
    name: 'application/cu-seeme',
    description: 'application/cu-seeme',
  },
  {
    name: 'application/davmount+xml',
    description: 'application/davmount+xml',
  },
  {
    name: 'application/docbook+xml',
    description: 'application/docbook+xml',
  },
  {
    name: 'application/dssc+xml',
    description: 'application/dssc+xml',
  },
  {
    name: 'application/ecmascript',
    description: 'application/ecmascript',
  },
  {
    name: 'application/epub+zip',
    description: 'application/epub+zip',
  },
  {
    name: 'application/exi',
    description: 'application/exi',
  },
  {
    name: 'application/font-tdpfr',
    description: 'application/font-tdpfr',
  },
  {
    name: 'application/font-woff',
    description: 'application/font-woff',
  },
  {
    name: 'application/font-woff2',
    description: 'application/font-woff2',
  },
  {
    name: 'application/geo+json',
    description: 'application/geo+json',
  },
  {
    name: 'application/graphql',
    description: 'application/graphql',
  },
  {
    name: 'application/java-serialized-object',
    description: 'application/java-serialized-object',
  },
  {
    name: 'application/json5',
    description: 'application/json5',
  },
  {
    name: 'application/jsonml+json',
    description: 'application/jsonml+json',
  },
  {
    name: 'application/ld+json',
    description: 'application/ld+json',
  },
  {
    name: 'application/lost+xml',
    description: 'application/lost+xml',
  },
  {
    name: 'application/manifest+json',
    description: 'application/manifest+json',
  },
  {
    name: 'application/mp4',
    description: 'application/mp4',
  },
  {
    name: 'application/msword',
    description: 'application/msword',
  },
  {
    name: 'application/mxf',
    description: 'application/mxf',
  },
  {
    name: 'application/oda',
    description: 'application/oda',
  },
  {
    name: 'application/ogg',
    description: 'application/ogg',
  },
  {
    name: 'application/pgp-encrypted',
    description: 'application/pgp-encrypted',
  },
  {
    name: 'application/pgp-signature',
    description: 'application/pgp-signature',
  },
  {
    name: 'application/pics-rules',
    description: 'application/pics-rules',
  },
  {
    name: 'application/pkcs10',
    description: 'application/pkcs10',
  },
  {
    name: 'application/pkcs7-mime',
    description: 'application/pkcs7-mime',
  },
  {
    name: 'application/pkcs7-signature',
    description: 'application/pkcs7-signature',
  },
  {
    name: 'application/pkcs8',
    description: 'application/pkcs8',
  },
  {
    name: 'application/postscript',
    description: 'application/postscript',
  },
  {
    name: 'application/pskc+xml',
    description: 'application/pskc+xml',
  },
  {
    name: 'application/resource-lists+xml',
    description: 'application/resource-lists+xml',
  },
  {
    name: 'application/resource-lists-diff+xml',
    description: 'application/resource-lists-diff+xml',
  },
  {
    name: 'application/rls-services+xml',
    description: 'application/rls-services+xml',
  },
  {
    name: 'application/rsd+xml',
    description: 'application/rsd+xml',
  },
  {
    name: 'application/rss+xml',
    description: 'application/rss+xml',
  },
  {
    name: 'application/rtf',
    description: 'application/rtf',
  },
  {
    name: 'application/sdp',
    description: 'application/sdp',
  },
  {
    name: 'application/shf+xml',
    description: 'application/shf+xml',
  },
  {
    name: 'application/timestamped-data',
    description: 'application/timestamped-data',
  },
  {
    name: 'application/vnd.android.package-archive',
    description: 'application/vnd.android.package-archive',
  },
  {
    name: 'application/vnd.api+json',
    description: 'application/vnd.api+json',
  },
  {
    name: 'application/vnd.apple.installer+xml',
    description: 'application/vnd.apple.installer+xml',
  },
  {
    name: 'application/vnd.apple.mpegurl',
    description: 'application/vnd.apple.mpegurl',
  },
  {
    name: 'application/vnd.apple.pkpass',
    description: 'application/vnd.apple.pkpass',
  },
  {
    name: 'application/vnd.bmi',
    description: 'application/vnd.bmi',
  },
  {
    name: 'application/vnd.curl.car',
    description: 'application/vnd.curl.car',
  },
  {
    name: 'application/vnd.curl.pcurl',
    description: 'application/vnd.curl.pcurl',
  },
  {
    name: 'application/vnd.dna',
    description: 'application/vnd.dna',
  },
  {
    name: 'application/vnd.google-apps.document',
    description: 'application/vnd.google-apps.document',
  },
  {
    name: 'application/vnd.google-apps.presentation',
    description: 'application/vnd.google-apps.presentation',
  },
  {
    name: 'application/vnd.google-apps.spreadsheet',
    description: 'application/vnd.google-apps.spreadsheet',
  },
  {
    name: 'application/vnd.hal+xml',
    description: 'application/vnd.hal+xml',
  },
  {
    name: 'application/vnd.handheld-entertainment+xml',
    description: 'application/vnd.handheld-entertainment+xml',
  },
  {
    name: 'application/vnd.macports.portpkg',
    description: 'application/vnd.macports.portpkg',
  },
  {
    name: 'application/vnd.unity',
    description: 'application/vnd.unity',
  },
  {
    name: 'application/vnd.zul',
    description: 'application/vnd.zul',
  },
  {
    name: 'application/widget',
    description: 'application/widget',
  },
  {
    name: 'application/wsdl+xml',
    description: 'application/wsdl+xml',
  },
  {
    name: 'application/x-7z-compressed',
    description: 'application/x-7z-compressed',
  },
  {
    name: 'application/x-ace-compressed',
    description: 'application/x-ace-compressed',
  },
  {
    name: 'application/x-bittorrent',
    description: 'application/x-bittorrent',
  },
  {
    name: 'application/x-bzip',
    description: 'application/x-bzip',
  },
  {
    name: 'application/x-bzip2',
    description: 'application/x-bzip2',
  },
  {
    name: 'application/x-cfs-compressed',
    description: 'application/x-cfs-compressed',
  },
  {
    name: 'application/x-chrome-extension',
    description: 'application/x-chrome-extension',
  },
  {
    name: 'application/x-cocoa',
    description: 'application/x-cocoa',
  },
  {
    name: 'application/x-envoy',
    description: 'application/x-envoy',
  },
  {
    name: 'application/x-eva',
    description: 'application/x-eva',
  },
  {
    name: 'font/opentype',
    description: 'font/opentype',
  },
  {
    name: 'application/x-gca-compressed',
    description: 'application/x-gca-compressed',
  },
  {
    name: 'application/x-gtar',
    description: 'application/x-gtar',
  },
  {
    name: 'application/x-hdf',
    description: 'application/x-hdf',
  },
  {
    name: 'application/x-httpd-php',
    description: 'application/x-httpd-php',
  },
  {
    name: 'application/x-install-instructions',
    description: 'application/x-install-instructions',
  },
  {
    name: 'application/x-latex',
    description: 'application/x-latex',
  },
  {
    name: 'application/x-lua-bytecode',
    description: 'application/x-lua-bytecode',
  },
  {
    name: 'application/x-lzh-compressed',
    description: 'application/x-lzh-compressed',
  },
  {
    name: 'application/x-ms-application',
    description: 'application/x-ms-application',
  },
  {
    name: 'application/x-ms-shortcut',
    description: 'application/x-ms-shortcut',
  },
  {
    name: 'application/x-ndjson',
    description: 'application/x-ndjson',
  },
  {
    name: 'application/x-perl',
    description: 'application/x-perl',
  },
  {
    name: 'application/x-pkcs7-certificates',
    description: 'application/x-pkcs7-certificates',
  },
  {
    name: 'application/x-pkcs7-certreqresp',
    description: 'application/x-pkcs7-certreqresp',
  },
  {
    name: 'application/x-rar-compressed',
    description: 'application/x-rar-compressed',
  },
  {
    name: 'application/x-sh',
    description: 'application/x-sh',
  },
  {
    name: 'application/x-sql',
    description: 'application/x-sql',
  },
  {
    name: 'application/x-subrip',
    description: 'application/x-subrip',
  },
  {
    name: 'application/x-t3vm-image',
    description: 'application/x-t3vm-image',
  },
  {
    name: 'application/x-tads',
    description: 'application/x-tads',
  },
  {
    name: 'application/x-tar',
    description: 'application/x-tar',
  },
  {
    name: 'application/x-tcl',
    description: 'application/x-tcl',
  },
  {
    name: 'application/x-tex',
    description: 'application/x-tex',
  },
  {
    name: 'application/x-x509-ca-cert',
    description: 'application/x-x509-ca-cert',
  },
  {
    name: 'application/xop+xml',
    description: 'application/xop+xml',
  },
  {
    name: 'application/xslt+xml',
    description: 'application/xslt+xml',
  },
  {
    name: 'application/zip',
    description: 'application/zip',
  },
  {
    name: 'audio/3gpp',
    description: 'audio/3gpp',
  },
  {
    name: 'audio/adpcm',
    description: 'audio/adpcm',
  },
  {
    name: 'audio/basic',
    description: 'audio/basic',
  },
  {
    name: 'audio/midi',
    description: 'audio/midi',
  },
  {
    name: 'audio/mpeg',
    description: 'audio/mpeg',
  },
  {
    name: 'audio/mp4',
    description: 'audio/mp4',
  },
  {
    name: 'audio/ogg',
    description: 'audio/ogg',
  },
  {
    name: 'audio/silk',
    description: 'audio/silk',
  },
  {
    name: 'audio/wave',
    description: 'audio/wave',
  },
  {
    name: 'audio/webm',
    description: 'audio/webm',
  },
  {
    name: 'audio/x-aac',
    description: 'audio/x-aac',
  },
  {
    name: 'audio/x-aiff',
    description: 'audio/x-aiff',
  },
  {
    name: 'audio/x-caf',
    description: 'audio/x-caf',
  },
  {
    name: 'audio/x-flac',
    description: 'audio/x-flac',
  },
  {
    name: 'audio/xm',
    description: 'audio/xm',
  },
  {
    name: 'image/bmp',
    description: 'image/bmp',
  },
  {
    name: 'image/cgm',
    description: 'image/cgm',
  },
  {
    name: 'image/sgi',
    description: 'image/sgi',
  },
  {
    name: 'image/svg+xml',
    description: 'image/svg+xml',
  },
  {
    name: 'image/tiff',
    description: 'image/tiff',
  },
  {
    name: 'image/x-3ds',
    description: 'image/x-3ds',
  },
  {
    name: 'image/x-freehand',
    description: 'image/x-freehand',
  },
  {
    name: 'image/x-icon',
    description: 'image/x-icon',
  },
  {
    name: 'image/x-jng',
    description: 'image/x-jng',
  },
  {
    name: 'image/x-mrsid-image',
    description: 'image/x-mrsid-image',
  },
  {
    name: 'image/x-pcx',
    description: 'image/x-pcx',
  },
  {
    name: 'image/x-pict',
    description: 'image/x-pict',
  },
  {
    name: 'image/x-rgb',
    description: 'image/x-rgb',
  },
  {
    name: 'image/x-tga',
    description: 'image/x-tga',
  },
  {
    name: 'message/rfc822',
    description: 'message/rfc822',
  },
  {
    name: 'text/cache-manifest',
    description: 'text/cache-manifest',
  },
  {
    name: 'text/calendar',
    description: 'text/calendar',
  },
  {
    name: 'text/coffeescript',
    description: 'text/coffeescript',
  },
  {
    name: 'text/csv',
    description: 'text/csv',
  },
  {
    name: 'text/hjson',
    description: 'text/hjson',
  },
  {
    name: 'text/jade',
    description: 'text/jade',
  },
  {
    name: 'text/jsx',
    description: 'text/jsx',
  },
  {
    name: 'text/less',
    description: 'text/less',
  },
  {
    name: 'text/mathml',
    description: 'text/mathml',
  },
  {
    name: 'text/n3',
    description: 'text/n3',
  },
  {
    name: 'text/richtext',
    description: 'text/richtext',
  },
  {
    name: 'text/sgml',
    description: 'text/sgml',
  },
  {
    name: 'text/slim',
    description: 'text/slim',
  },
  {
    name: 'text/stylus',
    description: 'text/stylus',
  },
  {
    name: 'text/tab-separated-values',
    description: 'text/tab-separated-values',
  },
  {
    name: 'text/uri-list',
    description: 'text/uri-list',
  },
  {
    name: 'text/vcard',
    description: 'text/vcard',
  },
  {
    name: 'text/vnd.curl',
    description: 'text/vnd.curl',
  },
  {
    name: 'text/vnd.fly',
    description: 'text/vnd.fly',
  },
  {
    name: 'text/vtt',
    description: 'text/vtt',
  },
  {
    name: 'text/x-asm',
    description: 'text/x-asm',
  },
  {
    name: 'text/x-c',
    description: 'text/x-c',
  },
  {
    name: 'text/x-component',
    description: 'text/x-component',
  },
  {
    name: 'text/x-fortran',
    description: 'text/x-fortran',
  },
  {
    name: 'text/x-handlebars-template',
    description: 'text/x-handlebars-template',
  },
  {
    name: 'text/x-java-source',
    description: 'text/x-java-source',
  },
  {
    name: 'text/x-lua',
    description: 'text/x-lua',
  },
  {
    name: 'text/x-markdown',
    description: 'text/x-markdown',
  },
  {
    name: 'text/x-nfo',
    description: 'text/x-nfo',
  },
  {
    name: 'text/x-opml',
    description: 'text/x-opml',
  },
  {
    name: 'text/x-pascal',
    description: 'text/x-pascal',
  },
  {
    name: 'text/x-processing',
    description: 'text/x-processing',
  },
  {
    name: 'text/x-sass',
    description: 'text/x-sass',
  },
  {
    name: 'text/x-scss',
    description: 'text/x-scss',
  },
  {
    name: 'text/x-vcalendar',
    description: 'text/x-vcalendar',
  },
  {
    name: 'text/xml',
    description: 'text/xml',
  },
  {
    name: 'text/yaml',
    description: 'text/yaml',
  },
  {
    name: 'video/3gpp',
    description: 'video/3gpp',
  },
  {
    name: 'video/3gpp2',
    description: 'video/3gpp2',
  },
  {
    name: 'video/h261',
    description: 'video/h261',
  },
  {
    name: 'video/h263',
    description: 'video/h263',
  },
  {
    name: 'video/h264',
    description: 'video/h264',
  },
  {
    name: 'video/jpeg',
    description: 'video/jpeg',
  },
  {
    name: 'video/jpm',
    description: 'video/jpm',
  },
  {
    name: 'video/mj2',
    description: 'video/mj2',
  },
  {
    name: 'video/mp2t',
    description: 'video/mp2t',
  },
  {
    name: 'video/mp4',
    description: 'video/mp4',
  },
  {
    name: 'video/mpeg',
    description: 'video/mpeg',
  },
  {
    name: 'video/ogg',
    description: 'video/ogg',
  },
  {
    name: 'video/quicktime',
    description: 'video/quicktime',
  },
  {
    name: 'video/webm',
    description: 'video/webm',
  },
  {
    name: 'video/x-f4v',
    description: 'video/x-f4v',
  },
  {
    name: 'video/x-fli',
    description: 'video/x-fli',
  },
  {
    name: 'video/x-flv',
    description: 'video/x-flv',
  },
  {
    name: 'video/x-m4v',
    description: 'video/x-m4v',
  },
];

const charsets = [
  'utf-8',
  'us-ascii',
  '950',
  'ASMO-708',
  'CP1026',
  'CP870',
  'DOS-720',
  'DOS-862',
  'EUC-CN',
  'IBM437',
  'Johab',
  'Windows-1252',
  'X-EBCDIC-Spain',
  'big5',
  'cp866',
  'csISO2022JP',
  'ebcdic-cp-us',
  'euc-kr',
  'gb2312',
  'hz-gb-2312',
  'ibm737',
  'ibm775',
  'ibm850',
  'ibm852',
  'ibm857',
  'ibm861',
  'ibm869',
  'iso-2022-jp',
  'iso-2022-jp',
  'iso-2022-kr',
  'iso-8859-1',
  'iso-8859-15',
  'iso-8859-2',
  'iso-8859-3',
  'iso-8859-4',
  'iso-8859-5',
  'iso-8859-6',
  'iso-8859-7',
  'iso-8859-8',
  'iso-8859-8-i',
  'iso-8859-9',
  'koi8-r',
  'koi8-u',
  'ks_c_5601-1987',
  'macintosh',
  'shift_jis',
  'unicode',
  'unicodeFFFE',
  'utf-7',
  'windows-1250',
  'windows-1251',
  'windows-1253',
  'windows-1254',
  'windows-1255',
  'windows-1256',
  'windows-1257',
  'windows-1258',
  'windows-874',
  'x-Chinese-CNS',
  'x-Chinese-Eten',
  'x-EBCDIC-Arabic',
  'x-EBCDIC-CyrillicRussian',
  'x-EBCDIC-CyrillicSerbianBulgarian',
  'x-EBCDIC-DenmarkNorway',
  'x-EBCDIC-FinlandSweden',
  'x-EBCDIC-Germany',
  'x-EBCDIC-Greek',
  'x-EBCDIC-GreekModern',
  'x-EBCDIC-Hebrew',
  'x-EBCDIC-Icelandic',
  'x-EBCDIC-Italy',
  'x-EBCDIC-JapaneseAndJapaneseLatin',
  'x-EBCDIC-JapaneseAndKana',
  'x-EBCDIC-JapaneseAndUSCanada',
  'x-EBCDIC-JapaneseKatakana',
  'x-EBCDIC-KoreanAndKoreanExtended',
  'x-EBCDIC-KoreanExtended',
  'x-EBCDIC-SimplifiedChinese',
  'x-EBCDIC-Thai',
  'x-EBCDIC-TraditionalChinese',
  'x-EBCDIC-Turkish',
  'x-EBCDIC-UK',
  'x-Europa',
  'x-IA5',
  'x-IA5-German',
  'x-IA5-Norwegian',
  'x-IA5-Swedish',
  'x-ebcdic-cp-us-euro',
  'x-ebcdic-denmarknorway-euro',
  'x-ebcdic-finlandsweden-euro',
  'x-ebcdic-finlandsweden-euro',
  'x-ebcdic-france-euro',
  'x-ebcdic-germany-euro',
  'x-ebcdic-icelandic-euro',
  'x-ebcdic-international-euro',
  'x-ebcdic-italy-euro',
  'x-ebcdic-spain-euro',
  'x-ebcdic-uk-euro',
  'x-euc-jp',
  'x-iscii-as',
  'x-iscii-be',
  'x-iscii-de',
  'x-iscii-gu',
  'x-iscii-ka',
  'x-iscii-ma',
  'x-iscii-or',
  'x-iscii-pa',
  'x-iscii-ta',
  'x-iscii-te',
  'x-mac-arabic',
  'x-mac-ce',
  'x-mac-chinesesimp',
  'x-mac-cyrillic',
  'x-mac-greek',
  'x-mac-hebrew',
  'x-mac-icelandic',
  'x-mac-japanese',
  'x-mac-korean',
  'x-mac-turkish',
];

const encodings = ['gzip', 'compress', 'deflate', 'br', 'identity', '*'];

export { headers, contentTypes, charsets, encodings };
