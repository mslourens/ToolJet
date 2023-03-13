import JiraApi from 'jira-client';

export async function findIssue(client: JiraApi, issueId: string): Promise<JiraApi.JsonResponse> {
  return await client.findIssue(issueId);
}

export async function assignIssue(
  client: JiraApi,
  issueId: string,
  assigneeName: string
): Promise<JiraApi.JsonResponse> {
  return await client.updateAssignee(issueId, assigneeName);
}

export async function createIssue(client: JiraApi, issue: JiraApi.IssueObject): Promise<JiraApi.JsonResponse> {
  return await client.addNewIssue(issue);
}

export async function updateIssue(
  client: JiraApi,
  issueId: string,
  issueUpdate: JiraApi.IssueObject,
  query?: JiraApi.Query
): Promise<JiraApi.JsonResponse> {
  return await client.updateIssue(issueId, issueUpdate, query);
}

export async function deleteIssue(client: JiraApi, issueId: string): Promise<JiraApi.JsonResponse> {
  return await client.deleteIssue(issueId);
}
