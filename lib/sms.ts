import { getFunctions, httpsCallable } from 'firebase/functions';
import { app } from './firebase';

const functions = getFunctions(app, 'us-central1');

/**
 * Send OTP code via SMS to the given phone number
 * @param phone - Phone number (will be normalized)
 * @returns Promise with success status
 */
export async function sendOtp(phone: string): Promise<{ success: boolean; message: string }> {
  const sendOtpFunction = httpsCallable<{ phone: string }, { success: boolean; message: string }>(
    functions,
    'sendOtp'
  );
  
  const result = await sendOtpFunction({ phone });
  return result.data;
}

/**
 * Verify OTP code for the given phone number
 * @param phone - Phone number (will be normalized)
 * @param code - 6-digit OTP code
 * @returns Promise with success status and phone number
 */
export async function verifyOtp(
  phone: string,
  code: string
): Promise<{ success: boolean; message: string; phone: string }> {
  const verifyOtpFunction = httpsCallable<
    { phone: string; code: string },
    { success: boolean; message: string; phone: string }
  >(functions, 'verifyOtp');
  
  const result = await verifyOtpFunction({ phone, code });
  return result.data;
}
