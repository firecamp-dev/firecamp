//@ts-ignore  // TODO: install graphql as devDep type package
import { GraphQLSchema } from 'graphql';
export interface ICMGQueryEditor {
  /**
   * Editor query string
   */
  query: string;

  /**
   * Graphql client schema
   */
  clientSchema?: GraphQLSchema;

  /**
   * Run graphql query
   */
  onRunQuery?: () => void;

  /**
   * Update editor query
   */
  onChangeQuery: (query: string) => void;
}
