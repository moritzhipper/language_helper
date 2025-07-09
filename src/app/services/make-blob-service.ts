import { Injectable } from '@angular/core'
import { Learnable } from '../types_and_schemas/types'

type Downloadable = {
  blobUrl: string
  fileName: string
}

@Injectable({
  providedIn: 'root'
})
export class MakeBlobService {
  private _blobUrl = ''
  private _fileName = ''

  // use service for this to handle revoking last blob for better memory management
  createDownloadableFromLearnables(learnables: Learnable[]): Downloadable {
    URL.revokeObjectURL(this._blobUrl)

    const json = JSON.stringify(learnables)
    const blob = new Blob([json], { type: 'application/json' })
    const blobUrl = URL.createObjectURL(blob)
    const fileName = `Language Helper Cards - ${new Date().toDateString()}.json`

    this._blobUrl = blobUrl
    this._fileName = fileName

    return {
      blobUrl,
      fileName
    }
  }
}
