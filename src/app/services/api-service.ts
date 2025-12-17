import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { lastValueFrom, Observable, take } from 'rxjs'
import { BankShare, BankShareResponse } from '../types_and_schemas/types'

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly BASE_URL = '/api'

  private readonly _client = inject(HttpClient)

  async shareBank(bankExport: Omit<BankShare, 'expires'>, ttlMinutes: number) {
    const response = this._client.post<BankShareResponse>(
      `${this.BASE_URL}/share`,
      {
        bankExport,
        ttlMinutes
      }
    )

    return this._toPromise(response)
  }

  async getCommunityBanks(): Promise<BankShare[]> {
    const response = this._client.get<BankShare[]>(
      `${this.BASE_URL}/community-banks`
    )
    return this._toPromise(response)
  }

  private _toPromise<T>(obs: Observable<T>): Promise<T> {
    return lastValueFrom(obs.pipe(take(1)))
  }
}
