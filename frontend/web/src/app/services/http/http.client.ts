export class HttpClient {
  static baseUrl = 'http://localhost:4567/';
  static loginUrl = HttpClient.baseUrl + 'login';
  static customerUrl = HttpClient.baseUrl + 'customers';
  static physicalPrintUrl = HttpClient.baseUrl + 'physical-prints';
  static digitalPartUrl = HttpClient.baseUrl + 'digital-part'; // TODO: This should be digital-parts not digital-part.
}
