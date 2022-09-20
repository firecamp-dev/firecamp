import { ERestBodyTypes, EKeyValueTableRowType, IKeyValueTable, IRestBody } from '@firecamp/types'
import { _array, _misc, _string, _table } from '@firecamp/utils'
import FormData from 'form-data'
import fs from 'fs'
import qs from 'qs'
import { isNode } from 'browser-or-node'

export default async (body: IRestBody, activeBodyType: ERestBodyTypes): Promise<any> => {

    const payload: any = body[activeBodyType]?.value

    if (!payload) return

    switch (activeBodyType) {

        case ERestBodyTypes.NoBody: return;
        case ERestBodyTypes.Binary: return payload;
        case ERestBodyTypes.Json: return payload;
        case ERestBodyTypes.Text: return payload;
        case ERestBodyTypes.Xml: return payload;

        // prepare form data
        case ERestBodyTypes.FormData:

            let form: FormData = new FormData()

            if (_array.isEmpty(payload)) return {}

            // Prepare multipart/form-data using form-data lib in node environment 
            if (isNode) {
                const FormData = (await import('form-data')).default
                form = new FormData()
            }

            // append entries into form
            payload.forEach((item: IKeyValueTable) => {
                if (
                    item?.type === EKeyValueTableRowType.File
                    && !_string.isEmpty(item.value || '')
                ) {
                    // read the file using its path
                    form.append(item.key, fs.createReadStream(item.value || ''))
                } else form.append(item.key, item.value)
            })

            return form;
        
            // encode data using the qs library
        case ERestBodyTypes.UrlEncoded: return qs.stringify(_table.toObject(payload));

        case ERestBodyTypes.GraphQL: 
            return JSON.stringify({
                query: payload || '',
                variables: body[activeBodyType]?.variables || `{}`
            });

        default: return
    }
}