import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
export interface IsoMessage {
  id: number;
  mti: string;
  pan: string;
  processingCode: string;
  montant: number;
  transactionTime: string;
  transactionDate: string;
  rrn: string;
  responseCode: string;
  terminalId: string;
  devise: string;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  pageable: any;
  totalElements: number;
  totalPages: number;
  number: number;  // current page
  size: number;
  first: boolean;
  last: boolean;
}
@Injectable({
  providedIn: 'root'
})
export class UploadServiceService {

  private baseUrl = 'http://localhost:8080/api/v1/messages';

  //Méthode pour envoyé le header avec authentification basic
  private getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': 'Basic ' + btoa('admin:admin@2025')
    });
  }
  constructor(private http: HttpClient) {}
  //Service pour obtenir les messages paginés
  getMessages(page: number, size: number): Observable<{ data: PaginatedResponse<IsoMessage>, message: string, statusCode: number }> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<{ data: PaginatedResponse<IsoMessage>, message: string, statusCode: number }>(
      this.baseUrl,
      {
        headers:this.getAuthHeaders(),
        params,
        withCredentials: true
      }
    );
  }

  //Service pour enregistrer un message par l'upload de fichier xml
  uploadFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<any>(`${this.baseUrl}/upload`, formData, {
      headers:this.getAuthHeaders(),
      withCredentials: true,
    });
  }

  //Service pour obtenir le détail du message par son id
  getMessageById(id: number) {
    return this.http.get<any>(`${this.baseUrl}/${id}`, {
      headers:this.getAuthHeaders(),
      withCredentials: true
    });
  }

  //Service de suppression de message par son id
  deleteMessage(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, {
      headers:this.getAuthHeaders(),
      withCredentials: true
    });
  }
}
