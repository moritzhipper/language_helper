import { Injectable } from '@angular/core'
import { config } from '../../config'
import { BankBase } from '../types_and_schemas/types'
import {
  parseFileImportString,
  verifiyImportedFileValidity
} from '../utils/import-export-utils'

export type Downloadable = {
  blobUrl: string
  fileName: string
}

@Injectable({
  providedIn: 'root'
})
export class BlobService {
  private _blobUrl = ''

  // use service for this to handle revoking last blob for better memory management
  createDownloadableFromLearnables(name: string, bank: BankBase): Downloadable {
    URL.revokeObjectURL(this._blobUrl)

    const jsonString = JSON.stringify(bank)

    // use application/octet-stream to force download as *.suffix and not as *.suffix.json in browsers
    const blob = new Blob([jsonString], { type: 'application/octet-stream' })
    const blobUrl = URL.createObjectURL(blob)

    const fileName = `${config.fileExportName} - ${name} - ${new Date().toDateString()}.${config.fileExportSuffix}`

    this._blobUrl = blobUrl

    return {
      blobUrl,
      fileName
    }
  }

  async readFile(file: File): Promise<BankBase> {
    // Verify file validity first
    verifiyImportedFileValidity(file)

    return new Promise((resolve, reject) => {
      const fileReader = new FileReader()

      fileReader.onload = (e: ProgressEvent<FileReader>) => {
        try {
          const content = e.target?.result as string
          const imported = parseFileImportString(content)
          if (imported.learnables.length === 0)
            throw new Error('File contains no learnables')

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
