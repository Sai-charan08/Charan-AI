import mongoose, { Schema, Document, Model } from 'mongoose';

// --- USER SCHEMA ---
export interface IUserDocument extends Document {
  userId: string;
  email?: string;
  displayName?: string;
  photoURL?: string;
  lastLoginAt: number;
  createdAt: number;
  settings?: Record<string, any>;
}

const UserSchema = new Schema<IUserDocument>(
  {
    userId: { type: String, required: true, unique: true, index: true },
    email: { type: String, default: '' },
    displayName: { type: String, default: '' },
    photoURL: { type: String, default: '' },
    lastLoginAt: { type: Number, default: () => Date.now() },
    createdAt: { type: Number, default: () => Date.now() },
    settings: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

// --- CHAT SESSION SCHEMA ---
export interface IChatSessionDocument extends Document {
  userId: string;
  id: string; // session ID
  title: string;
  messages: Array<any>;
  createdAt: number;
  updatedAt: number;
}

const ChatSessionSchema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    id: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true, default: 'New Conversation' },
    messages: { type: [Schema.Types.Mixed], default: [] },
    createdAt: { type: Number, default: () => Date.now() },
    updatedAt: { type: Number, default: () => Date.now() },
  },
  { timestamps: true }
);


export const UserModel: Model<IUserDocument> =
  mongoose.models.User || mongoose.model<IUserDocument>('User', UserSchema);

export const ChatSessionModel: Model<IChatSessionDocument> =
  mongoose.models.ChatSession || mongoose.model<IChatSessionDocument>('ChatSession', ChatSessionSchema);
