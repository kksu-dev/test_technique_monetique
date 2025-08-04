import {Component, ViewChild} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {DatePipe, DecimalPipe, NgForOf, NgIf} from '@angular/common';
import Swal from 'sweetalert2';
import {IsoMessage, UploadServiceService} from '../../services/upload-service.service';

@Component({
  selector: 'app-upload-view',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    DecimalPipe,
    DatePipe
  ],
  templateUrl: './upload-view.component.html',
  styleUrls: ['./upload-view.component.css']
})
export class UploadViewComponent {
  selectedFile: File | null = null;
  fileContent: string = '';
  parsedFields: { id: number; label: string; value: string }[] = [];
  message = '';
  statusCode: number | null = null;
  response: any = null;
  messages: IsoMessage[] = [];
  page = 0;
  size = 10;
  totalPages = 0;
  totalElements = 0;
  loading = false;
  error: string | null = null;
  isoFieldsMap: Record<number, string> = {
    0: 'MTI (Message Type Identifier)',
    2: 'PAN (Primary Account Number)',
    3: 'Processing Code',
    4: 'Montant (Amount)',
    12: 'Transaction Time',
    13: 'Transaction Date',
    37: 'RRN (Retrieval Reference Number)',
    39: 'Response Code',
    41: 'Terminal ID',
    49: 'Devise (Currency Code)'
  };
  currencyMap: { [key: string]: string } = {
    '950': 'XOF',
    '952': 'XAF',
    '840': 'USD',
    '978': 'EUR',
    '826': 'GBP',
    '969': 'MUR'
  };

  constructor(private http: HttpClient, private uploadService:UploadServiceService) {}
  ngOnInit() {
    this.loadMessages();
  }

  //Fonction pour Matcher le code de la devise et son libelle
  getCurrencyLabel(code: string | number): string {
    return this.currencyMap[code.toString()] || 'Devise inconnue';
  }

  //Recuperer tous les messages ISO dans ma BD
  loadMessages() {
    this.loading = true;
    this.error = null;

    this.uploadService.getMessages(this.page, this.size).subscribe({
      next: (res: any) => {
        this.messages = res.data.content.map((msg: any) => {
          return msg
        });
        this.totalPages = res.data.totalPages;
        this.totalElements = res.data.totalElements;
        this.loading = false;
      },
      error: (err:any) => {
        this.error = 'Erreur lors du chargement des messages';
        this.loading = false;
      }
    });
  }

  //Fonction pour gérer la pagination arriére
  prevPage() {
    if (this.page > 0) {
      this.page--;
      this.loadMessages();
    }
  }

  //Fonction pour gérer la pagination avant
  nextPage() {
    if (this.page < this.totalPages - 1) {
      this.page++;
      this.loadMessages();
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      console.warn('Aucun fichier sélectionné');
      return;
    }

    this.selectedFile = input.files[0];
    //Appel de la fonction pour lire le contenu du fichier et l'afficher sur ma page
    const reader = new FileReader();
    reader.onload = () => {
      this.fileContent = reader.result as string;
      this.parseIso8583Xml(this.fileContent);
    };
    reader.readAsText(this.selectedFile);
    console.log('Fichier sélectionné :', this.selectedFile);
  }

  //fonction pour parse mon fichier xml et l'afficher sur ma page
  parseIso8583Xml(xmlString: string) {
    this.parsedFields = [];

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, 'application/xml');

    const fields = xmlDoc.getElementsByTagName('field');

    for (let i = 0; i < fields.length; i++) {
      const el = fields[i];
      const id = parseInt(el.getAttribute('id') || '-1', 10);
      const value = el.getAttribute('value') || '';

      if (id === -1) continue;

      this.parsedFields.push({
        id,
        label: this.isoFieldsMap[id] || 'Champ inconnu',
        value
      });
    }
  }

  //Fonction pour uploader le fichier et l'enrregistrer dans la BD
  onUpload(): void {
    if (!this.selectedFile) return;

    this.uploadService.uploadFile(this.selectedFile).subscribe({
      next: (res: { message: string; statusCode: number | null; data: any; }) => {
        this.message = res.message;
        this.statusCode = res.statusCode;
        this.response = res.data;
        this.selectedFile = null;

        this.loadMessages(); // recharger la liste
        Swal.fire({
          icon: 'success',
          title: 'Fichier envoyé',
          text: 'Le fichier a été traité avec succès.',
          showConfirmButton: true,
          position: 'center',
        });
      },
      error: (err: { status: number | null; }) => {
        this.message = 'Erreur lors de l\'envoi';
        this.statusCode = err.status;
        Swal.fire({
          icon: 'error',
          title: 'Erreur d\'envoi ❌',
          text: 'Le serveur a retourné une erreur.',
        });
      }
    });
  }

  //Fonction pour afficher le detail d'un message ISO par son ID
  showDetails(msg: any) {
    this.uploadService.getMessageById(msg.id).subscribe({
      next: (res: { data: any; }) => {
        const m = res.data || res;

        Swal.fire({
          title: `Détail du message #${m.id}`,
          html: `
    <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 14px;">
      <tbody>
        <tr style="background-color: #f0f4f8;">
          <td style="padding: 8px 0 8px 0; font-weight: bold; width: 180px; text-align: left; white-space: nowrap;">🆔 MTI</td>
          <td style="padding: 8px 0 8px 0; text-align: left;">${m.mti}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0 8px 0; font-weight: bold; width: 180px; text-align: left; white-space: nowrap;">💳 PAN</td>
          <td style="padding: 8px 0 8px 0; text-align: left;">${m.pan}</td>
        </tr>
        <tr style="background-color: #f0f4f8;">
          <td style="padding: 8px 0 8px 0; font-weight: bold; width: 180px; text-align: left; white-space: nowrap;">💰 Montant</td>
          <td style="padding: 8px 0 8px 0; text-align: left;">${m.montant} ${m.devise}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0 8px 0; font-weight: bold; width: 180px; text-align: left; white-space: nowrap;">🌍 Devise</td>
          <td style="padding: 8px 0 8px 0; text-align: left;">${m.devise}</td>
        </tr>
        <tr style="background-color: #f0f4f8;">
          <td style="padding: 8px 0 8px 0; font-weight: bold; width: 180px; text-align: left; white-space: nowrap;">📅 Date</td>
          <td style="padding: 8px 0 8px 0; text-align: left;">${m.transactionDate}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0 8px 0; font-weight: bold; width: 180px; text-align: left; white-space: nowrap;">⏰ Heure</td>
          <td style="padding: 8px 0 8px 0; text-align: left;">${m.transactionTime}</td>
        </tr>
        <tr style="background-color: #f0f4f8;">
          <td style="padding: 8px 0 8px 0; font-weight: bold; width: 180px; text-align: left; white-space: nowrap;">✔️ Code Réponse</td>
          <td style="padding: 8px 0 8px 0; text-align: left;">${m.responseCode}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0 8px 0; font-weight: bold; width: 180px; text-align: left; white-space: nowrap;">🖥 Terminal</td>
          <td style="padding: 8px 0 8px 0; text-align: left;">${m.terminalId}</td>
        </tr>
        <tr style="background-color: #f0f4f8;">
          <td style="padding: 8px 0 8px 0; font-weight: bold; width: 180px; text-align: left; white-space: nowrap;">🔎 RRN</td>
          <td style="padding: 8px 0 8px 0; text-align: left;">${m.rrn}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0 8px 0; font-weight: bold; width: 180px; text-align: left; white-space: nowrap;">⚙️ Code Traitement</td>
          <td style="padding: 8px 0 8px 0; text-align: left;">${m.processingCode}</td>
        </tr>
      </tbody>
    </table>
  `,
          confirmButtonText: 'Fermer',
          width: 650,
          customClass: {
            popup: 'text-start',
            confirmButton: 'btn btn-primary',
          },
          buttonsStyling: false,
          background: '#ffffff',
          showCloseButton: true,
          closeButtonAriaLabel: 'Fermer la fenêtre',
        });


      },
      error: (err: any) => {
        console.error('Erreur API :', err);
        Swal.fire({
          icon: 'error',
          title: 'Erreur ❌',
          text: 'Impossible de récupérer les détails du message.'
        });
      }
    });
  }

  //Fonction pour supprimer un message ISO par son ID
  deleteMessage(id: number) {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Cette action supprimera définitivement le message.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, supprimer !',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.uploadService.deleteMessage(id).subscribe({
          next: () => {
            this.messages = this.messages.filter(msg => msg.id !== id);
            Swal.fire(
              'Supprimé !',
              'Le message a été supprimé avec succès.',
              'success'
            );
          },
          error: () => {
            Swal.fire(
              'Erreur !',
              'Impossible de supprimer le message.',
              'error'
            );
          }
        });
      }
    });
  }


}

