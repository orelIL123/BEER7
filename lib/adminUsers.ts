import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { db } from './firebase';

export async function createAdminUser() {
  try {
    const adminData = {
      phoneNumber: '0523985505',
      name: 'Admin',
      email: 'admin@beersheva.app',
      role: 'admin',
      isAdmin: true,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      profilePicture: null,
      status: 'active',
      permissions: ['read', 'write', 'delete', 'manage_users', 'manage_content'],
      lastLogin: null,
    };

    // Add to users collection
    const usersRef = collection(db, 'users');
    const docRef = await addDoc(usersRef, adminData);
    
    console.log('✅ Admin user created:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    throw error;
  }
}

export async function getAllUsers() {
  try {
    const usersRef = collection(db, 'users');
    // You would use getDocs here in a real scenario
    console.log('✅ Users collection reference ready');
    return usersRef;
  } catch (error) {
    console.error('❌ Error getting users:', error);
    throw error;
  }
}
