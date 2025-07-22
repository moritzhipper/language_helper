import { Injectable } from '@angular/core'
import { ExportedCollection } from '../types_and_schemas/types'

type Downloadable = {
  blobUrl: string
  fileName: string
}

@Injectable({
  providedIn: 'root'
})
export class ImportExportService {
  private _blobUrl = ''

  // use service for this to handle revoking last blob for better memory management
  createDownloadableFromLearnables(
    collections: ExportedCollection[],
    fileName: string
  ): Downloadable {
    URL.revokeObjectURL(this._blobUrl)

    const jsonString = JSON.stringify(collections)
    const blob = new Blob([jsonString], { type: 'application/json' })
    const blobUrl = URL.createObjectURL(blob)

    const name = `Language Helper Cards - ${fileName} - ${new Date().toDateString()}.vocab`

    this._blobUrl = blobUrl

    return {
      blobUrl,
      fileName: name
    }
  }
}
