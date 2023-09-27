import {
  EOAuth2Types,
  IOAuth2ClientCredentials,
  IOAuth2Code,
  IOAuth2Implicit,
  IOAuth2Password,
} from './oauth2'

export interface IOAuth2UiState {
  activeGrantType: EOAuth2Types
  grantTypes: {
    [EOAuth2Types.Code]: IOAuth2Code;
    [EOAuth2Types.Implicit]: IOAuth2Implicit;
    [EOAuth2Types.Password]: IOAuth2Password;
    [EOAuth2Types.ClientCredentials]: IOAuth2ClientCredentials
  }
}
