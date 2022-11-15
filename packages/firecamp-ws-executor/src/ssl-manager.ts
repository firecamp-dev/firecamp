//@ts-nocheck

export default (certificates, requestURL) => {
  let certificatePath;

  if (Array.isArray(certificates) && certificates.length > 0) {
    for (const certificate of certificates) {
      if (
        !certificate.meta.disable &&
        certificate.meta.host &&
        requestURL.includes(certificate.meta.host)
      ) {
        certificatePath = certificate.meta.file_path;

        break;
      }
    }
  }

  console.log(certificatePath);

  return certificatePath;
};
