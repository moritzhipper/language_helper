import { Injectable } from '@angular/core'
import { config } from '../../config'
import { StoreExport } from '../types_and_schemas/types'
import {
  parseFileImportString,
  verifiyImportedFileValidity
} from '../utils/import-export-utils'

type Downloadable = {
  blobUrl: string
  fileName: string
}

@Injectable({
  providedIn: 'root'
})
export class BlobService {
  private _blobUrl = ''
  config = config

  // use service for this to handle revoking last blob for better memory management
  createDownloadableFromLearnables(
    storeExport: StoreExport,
    fileName: string
  ): Downloadable {
    URL.revokeObjectURL(this._blobUrl)

    const jsonString = JSON.stringify(storeExport)

    // use application/octet-stream to force download as *.suffix and not as *.suffix.json in browsers
    const blob = new Blob([jsonString], { type: 'application/octet-stream' })
    const blobUrl = URL.createObjectURL(blob)

    const name = `${this.config.fileExportName} - ${fileName} - ${new Date().toDateString()}.${this.config.fileExportSuffix}`

    this._blobUrl = blobUrl

    return {
      blobUrl,
      fileName: name
    }
  }

  async readFile(file: File): Promise<StoreExport> {
    // Verify file validity first
    verifiyImportedFileValidity(file)

    return new Promise((resolve, reject) => {
      const fileReader = new FileReader()

      fileReader.onload = (e: ProgressEvent<FileReader>) => {
        try {
          const content = e.target?.result as string
          const imported = parseFileImportString(content)
          resolve(imported)
        } catch (error) {
          reject(error)
        }
      }

      fileReader.onerror = () => {
        reject(new Error('Failed to read file'))
      }

      fileReader.readAsText(file)
    })
  }
}
