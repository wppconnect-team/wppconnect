/*
 * This file is part of WPPConnect.
 *
 * WPPConnect is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * WPPConnect is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with WPPConnect.  If not, see <https://www.gnu.org/licenses/>.
 */

/** A serializable reply to a community announcement. */
export interface CommunityComment {
  id: string;
  parentMsgId: string;
  chatId: string;
  author?: string;
  authorName?: string;
  fromMe?: boolean;
  body?: string;
  timestamp: number;
  type: 'comment' | 'revoked' | 'ciphertext';
  ack?: number;
  read?: boolean;
  protocolMessageId?: string;
}

export interface CommentEvent {
  action: 'add' | 'update' | 'remove';
  comment: CommunityComment;
}

/** Allows a clear capability error when using an older WA-JS package. */
export interface CommentApi {
  getComments?: (messageId: string) => Promise<CommunityComment[]>;
  sendCommentMessage?: (
    messageId: string,
    text: string
  ) => Promise<{
    messageSendResult: string;
    t?: number;
    count?: number | null;
  }>;
}
