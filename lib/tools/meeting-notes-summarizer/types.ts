export interface SummarizeNotesRequest {
  notes: string;
}

export interface MeetingSummaryResult {
  summary: string;
  decisions: string[];
  actionItems: string[];
}

export interface SummarizeNotesSuccessResponse {
  success: true;
  result: MeetingSummaryResult;
}

export interface SummarizeNotesErrorResponse {
  success: false;
  error: string;
}

export type SummarizeNotesResponse = SummarizeNotesSuccessResponse | SummarizeNotesErrorResponse;
