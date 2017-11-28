export class HttpClient {
  static baseUrl = 'http://localhost:4567/';
  static loginUrl = HttpClient.baseUrl + 'login';
  static customerUrl = HttpClient.baseUrl + 'customers';
  static physicalPartUrl = HttpClient.baseUrl + 'physical-parts';
  static physicalPrintUrl = HttpClient.baseUrl + 'physical-prints';
  static digitalPartUrl = HttpClient.baseUrl + 'digital-parts';
  static digitalPrintUrl = HttpClient.baseUrl + 'digital-prints';
}
