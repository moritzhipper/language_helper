import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { lastValueFrom, Observable, take } from 'rxjs'
import { BankExport, BankShareResponse } from '../types_and_schemas/types'

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly _client = inject(HttpClient)

  async shareBank(bankExport: BankExport, ttlMinutes: number) {
    const response = this._client.post<BankShareResponse>('/share', {
      bankExport,
      ttlMinutes
    })

    return this._toPromise(response)
  }

  private _toPromise<T>(obs: Observable<T>): Promise<T> {
    return lastValueFrom(obs.pipe(take(1)))
  }
}
