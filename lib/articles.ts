import type { ArticleSubmission, NewsArticle } from '@/constants/Types';
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
  type DocumentData,
} from 'firebase/firestore';
import { db } from './firebase';

const SUBMISSIONS_COLLECTION = 'article_submissions';

function submissionFromDoc(id: string, data: DocumentData): ArticleSubmission {
  return {
    id,
    title: data.title ?? '',
    summary: data.summary ?? '',
    content: data.content ?? '',
    image: data.image ?? '',
    category: data.category ?? 'news',
    submittedByUid: data.submittedByUid,
    submittedByPhone: data.submittedByPhone,
    authorName: data.authorName,
    submittedAt: data.submittedAt ?? '',
    status: data.status ?? 'pending',
    reviewedAt: data.reviewedAt,
    businessId: data.businessId,
  };
}

export async function submitArticle(
  payload: Omit<ArticleSubmission, 'id' | 'submittedAt' | 'status'> & { submittedByPhone?: string }
): Promise<string> {
  const ref = await addDoc(collection(db, SUBMISSIONS_COLLECTION), {
    ...payload,
    submittedByPhone: payload.submittedByPhone ?? payload.submittedByUid ?? '',
    submittedAt: new Date().toISOString(),
    status: 'pending',
  });
  return ref.id;
}

export async function getPendingSubmissions(): Promise<ArticleSubmission[]> {
  // No orderBy to avoid composite index requirement on empty collections
  const q = query(
    collection(db, SUBMISSIONS_COLLECTION),
    where('status', '==', 'pending'),
  );
  const snap = await getDocs(q);
  const items = snap.docs.map((d) => submissionFromDoc(d.id, d.data()));
  // Sort in JS to avoid Firestore index requirement
  items.sort((a, b) => (b.submittedAt ?? '').localeCompare(a.submittedAt ?? ''));
  return items;
}

export async function approveSubmission(submissionId: string): Promise<void> {
  const ref = doc(db, SUBMISSIONS_COLLECTION, submissionId);
  await updateDoc(ref, {
    status: 'approved',
    reviewedAt: new Date().toISOString(),
  });
}

export async function rejectSubmission(submissionId: string): Promise<void> {
  const ref = doc(db, SUBMISSIONS_COLLECTION, submissionId);
  await updateDoc(ref, {
    status: 'rejected',
    reviewedAt: new Date().toISOString(),
  });
}

export async function getApprovedArticles(): Promise<NewsArticle[]> {
  const q = query(
    collection(db, SUBMISSIONS_COLLECTION),
    where('status', '==', 'approved'),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const s = submissionFromDoc(d.id, d.data());
    return {
      id: `submission-${s.id}`,
      title: s.title,
      summary: s.summary,
      content: s.content,
      image: s.image,
      date: s.reviewedAt ?? s.submittedAt,
      category: s.category,
      businessId: s.businessId,
    };
  });
}

export async function addArticleAsAdmin(
  adminPhone: string,
  payload: {
    title: string;
    summary: string;
    content: string;
    image: string;
    category: NewsArticle['category'];
    businessId?: string;
  }
): Promise<string> {
  const now = new Date().toISOString();
  const ref = await addDoc(collection(db, SUBMISSIONS_COLLECTION), {
    ...payload,
    submittedByPhone: adminPhone,
    submittedAt: now,
    status: 'approved',
    reviewedAt: now,
  });
  return ref.id;
}
