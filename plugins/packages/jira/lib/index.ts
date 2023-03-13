import { QueryError, QueryResult, QueryService, ConnectionTestResult } from '@tooljet-plugins/common';
import { SourceOptions, QueryOptions } from './types';
import * as JiraApi from 'jira-client';
import { assignIssue, createIssue, deleteIssue, findIssue, updateIssue } from './operations';
const JSON5 = require('json5');

export default class Jira implements QueryService {
  async run(sourceOptions: SourceOptions, queryOptions: QueryOptions, dataSourceId: string): Promise<QueryResult> {
    const client = await this.getConnection(sourceOptions);
    const operation = queryOptions.operation;
    const body = this.returnObject(queryOptions.body);
    let result = {};

    try {
      switch (operation) {
        case 'find_issue':
          result = await findIssue(client, queryOptions.issueId);
          break;
        case 'assign_issue':
          result = await assignIssue(client, queryOptions.issueId, queryOptions.assigneeName);
          break;
        case 'create_issue':
          result = await createIssue(client, body);
          break;
        case 'update_issue':
          result = await updateIssue(client, queryOptions.issueId, body);
          break;
        case 'delete_issue':
          result = await deleteIssue(client, queryOptions.issueId);
          break;
      }
    } catch (error) {
      throw new QueryError('Query could not be completed', error.message, {});
    }

    return {
      status: 'ok',
      data: result,
    };
  }

  private returnObject(data: any) {
    if (!data) {
      return {};
    }
    return typeof data === 'string' ? JSON5.parse(data) : data;
  }

  async getConnection(sourceOptions: SourceOptions, _options?: object): Promise<JiraApi> {
    const { host, username, password } = sourceOptions;
    return new JiraApi({
      protocol: 'https',
      host,
      username,
      password,
      apiVersion: '2',
      strictSSL: true,
    });
  }

  async testConnection(sourceOptions: SourceOptions): Promise<ConnectionTestResult> {
    const databaseClient = await this.getConnection(sourceOptions);

    if (!databaseClient) {
      throw new Error('Invalid credentials');
    }

    await databaseClient.getServerInfo();

    return {
      status: 'ok',
    };
  }
}
